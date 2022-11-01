import express, {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import * as crypto from 'crypto'

import {CustomError, BadRequestError, UnauthenticatedError, UnauthorizedError} from '../error'
import User, {IUser} from '../models/User';
import Token from '../models/Token';
import {createTokenUser} from '../util/createTokenUser';
import {attachCookiesToResponse} from '../util/jwt';

import {sendVerificationEmail, sendResetPasswordEmail} from '../email/sendgridConfig';
import {createHash} from '../util/createHash';


export async function register(req: Request, res: Response) {

    const {email, name, password} = req.body;


    if (!email || !name || !password) {

        throw new BadRequestError('Please provide all credentials');
    }

    const emailAlreadyExists = await User.findOne({email});

    if (emailAlreadyExists) {
        throw new BadRequestError('Email already exists');
    }

    // first registered user is an admin
    const isFirstAccount = (await User.countDocuments({})) === 0;
    const role = isFirstAccount ? 'admin' : 'user';

    // generate verification token
    const verificationToken = crypto.randomBytes(40).toString('hex');


    const user = await User.create({
        name,
        email,
        password,
        role,
        verificationToken
    });

    // get frontend url
    const origin = req.get('origin')
    await sendVerificationEmail(email, verificationToken, origin || '')


    res.status(StatusCodes.CREATED).json({msg: 'Success! Please check your email to verify account'});
}

export async function login(req: Request, res: Response) {

    const {email, password} = req.body;

    if (!email || !password) {
        throw new BadRequestError('Please provide email and password');
    }
    var user: IUser |null = await User.findOne({email});
    console.log('USER IN LOGIN IS', user)

    if (! user) {
        throw new UnauthenticatedError('Invalid Credentials');
    }
    const isPasswordCorrect = await user.comparePassword(password);

    if (! isPasswordCorrect) {
        throw new UnauthenticatedError('Invalid Credentials');
    }

    if (! user.isVerified) {
        throw new UnauthenticatedError('Email not verified.')
    }

    const tokenUser = createTokenUser(user._id, user.name, user.role)

    let refreshToken = new String("")

    const existingToken = await Token.findOne({user: user._id});

    if (existingToken) {
        const {isValid} = existingToken;
        if (!isValid) {
            throw new UnauthenticatedError('Invalid Credentials');
        }
        refreshToken = existingToken.refreshToken;
        attachCookiesToResponse(res, tokenUser, refreshToken);
        res.status(StatusCodes.OK).json({user: tokenUser});
        return;
    }

    refreshToken = crypto.randomBytes(40).toString('hex');
    const userAgent = 'default';
    const ip = req.ip;
    const userToken = {
        refreshToken,
        ip,
        userAgent,
        user: user._id
    };

    await Token.create(userToken);

    attachCookiesToResponse(res, tokenUser, refreshToken);

    res.status(StatusCodes.OK).json({user: tokenUser});
}

export async function logout(req: Request, res: Response) {

    const userId = req.tokenUser ?. user.id

    await Token.findOneAndDelete({user: userId})

    // delete cookies
    res.cookie('accessToken', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now())
    })
    res.cookie('refreshToken', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now())
    })
    res.status(StatusCodes.OK).json({msg: 'user logged out'})

}

export async function verifyEmail(req: Request, res: Response) {

    const {verificationToken, email} = req.body;
    const user: IUser |null = await User.findOne({email});

    if (! user) {
        throw new UnauthenticatedError('Verification Failed');
    }

    if (user.verificationToken !== verificationToken) {
        throw new UnauthenticatedError('Verification Failed');
    }

    // make changes
    user.isVerified = true;
    user.verified = Date.now()
    user.verificationToken


    await user.save();


    res.status(StatusCodes.OK).json({msg: 'Email Verified'});
}

export async function forgotPassword(req: Request, res: Response) {


    const {email} = req.body

    if (!email) {
        throw new BadRequestError('Please provide valid email')
    }

    const user = await User.findOne({email})


    // return message regardless
    if (! user) {
        res.status(StatusCodes.OK).json({msg: 'Please check your email for reset password link'});
        return;
    }

    // user exists
    const passwordToken = crypto.randomBytes(70).toString('hex')

    const origin = req.get('origin') || 'localhost:5000'

    await sendResetPasswordEmail(user.name.toString(), email, passwordToken, origin);


    const tenMinutes = 1000 * 60 * 10
    const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes)

    // token will be valid for 10 min
    user.passwordToken = createHash(passwordToken)
    user.passwordTokenExpirationDate = passwordTokenExpirationDate

    await user.save()
    res.status(StatusCodes.OK).json({msg: 'Please check your email for reset password link'});

}

export async function resetPassword(req: Request, res: Response) {

    const {token, email, password} = req.body;

    if (!token || !email || !password) {
        throw new BadRequestError('Please provide all required values (token, email and password).')
    }

    const user = await User.findOne({email})

    if (! user) {
        res.status(StatusCodes.OK).json({msg: 'Password reset'});
        return;
    }
    // same error if expiration date is null
    if (user.passwordTokenExpirationDate === null || ! user.passwordTokenExpirationDate) {
        res.status(StatusCodes.BAD_REQUEST).json({msg: 'Something went wrong'});
        return;
    }


    const currentDate = new Date()

    if (user.passwordToken === createHash(token) && user.passwordTokenExpirationDate > currentDate) {

        user.password = password
        user.passwordToken = null
        user.passwordTokenExpirationDate = null

        await user.save()

    }


    res.status(StatusCodes.OK).json({msg: 'Password reset'});

}
