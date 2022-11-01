import * as jwt from 'jsonwebtoken';
import Express from 'express';
import {MyToken} from '../types/MyToken';
import MyTokenUser from '../types/MyTokenUser';


export function createJWT(payload: Object): string {
    const token = jwt.sign(payload, process.env.JWT_SECRET || '');
    return token;
}

export function isTokenValid(token: string): MyToken { return jwt.verify(token, process.env.JWT_SECRET || '') as MyToken }

export function attachCookiesToResponse(res: Express.Response, user: MyTokenUser, refreshToken: String) {

    console.log('user payload is ', user)

    let accessTokenJWT: string = createJWT({user: user});
    let refreshTokenJWT = createJWT({user: user, refreshToken: refreshToken});

    const oneDay = 1000 * 60 * 60 * 24;
    const oneMonth = oneDay * 30;

    res.cookie('accessToken', accessTokenJWT, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        signed: true,
        expires: new Date(Date.now() + 3000)
    });

    res.cookie('refreshToken', refreshTokenJWT, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        signed: true,
        expires: new Date(Date.now() + oneMonth)
    });


}
