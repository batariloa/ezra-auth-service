import {UnauthenticatedError} from '../error'
import {Request, Response, NextFunction} from 'express';
import {attachCookiesToResponse, isTokenValid} from '../util/jwt';
import Token from '../models/Token';
import {MyToken} from '../types/MyToken';

require('express-async-errors')

export async function authenticateUser(req: Request, res: Response, next: NextFunction) {

    if(!req.signedCookies){
        throw new UnauthenticatedError('Invalid authentication')

    }

    const {refreshToken, accessToken} = req.signedCookies

    if(!refreshToken && !accessToken){
        throw new UnauthenticatedError('Invalid authentication')
    }
    console.log('Access point', accessToken)
    try {

        if (accessToken) {
            const payload: MyToken = isTokenValid(accessToken)
            req.tokenUser = payload
            return next()
        }

        // if acessToken doesn't exist
        const payload: MyToken = isTokenValid(refreshToken)

        const existingToken = await Token.findOne({user: payload.user.id, refreshToken: payload.refreshToken})

        if (! existingToken || ! existingToken ?. isValid) {
            throw new UnauthenticatedError('Invalid authentication')
        }

        attachCookiesToResponse(res, payload.user, existingToken.refreshToken,);

        req.tokenUser = payload;
        next();

    } catch (error) {
        console.log('error ', error)
        throw new UnauthenticatedError('Invalid authentication')
    }
}
