import {
    CustomError,
    BadRequestError, 
    UnauthenticatedError,
    UnauthorizedError,
 } from '../error'
 import  { Request, Response, NextFunction,  ErrorRequestHandler} from 'express';
 import { StatusCodes } from 'http-status-codes';

 export const errorHandlerMiddleware: ErrorRequestHandler = (err:any, req:Request, res: Response, next:NextFunction) =>{

    console.log(err)

    //set default errorr

    let customError:CustomError = new CustomError('Something went wrong, try again later.')
    if(err.statusCode)
    customError.statusCode = err.statusCode
    if(err.message)
    customError.message = err.message

    if(err.name==='ValidationError'){
        customError.message = Object.values(err.error)
        .map((item:any) => item.message)
        .join(',');

        customError.statusCode =  403;
       
        
    }

    return res.status(customError.statusCode).json({msg: customError.message})

 }

