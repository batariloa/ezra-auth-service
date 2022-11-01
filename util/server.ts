import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import session from 'express-session'
import cookieParser, * as CookieParser from 'cookie-parser'
import { errorHandlerMiddleware } from '../middleware/errorHandlerMiddleware';
import cors, { CorsOptions } from "cors";

require('express-async-errors')
import { authenticateUser } from '../middleware/authenticationMiddleware';
import { AuthRouter } from '../routes/authRoutes';
dotenv.config();

export function createServer() {

    const app: Express = express();

    const allowedOrigins = ['http://localhost:4200'];

    const options: cors.CorsOptions = {
        allowedHeaders: [
            'Origin',
            'X-Requested-With',
            'Content-Type',
            'Accept',
            'X-Access-Token',
        ],
        credentials: true,
        methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
        origin: allowedOrigins,
        preflightContinue: true,

    };
    //use cors middleware
    app.use(cors(options))
    const morgan = require("morgan");

    app.use(morgan('dev'));
    app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
    app.use(express.json())
    app.use(cookieParser(process.env.JWT_SECRET))


    app.get('/', (req: Request, res: Response) => {
        res.send('Express + TypeScript Server');
    });


    app.use('/api', AuthRouter)
    app.use(errorHandlerMiddleware)

    app.get('/api/profile', authenticateUser, (req: Request, res: Response) => {
        console.log('what the flip')
        console.log('main cookies',req.headers.cookie)
        res.json(req.tokenUser?.user);
    });

    return app;
}