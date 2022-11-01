import { StatusCodes } from 'http-status-codes';
import { CustomError } from './CustomErrors';

export class UnauthorizedError extends CustomError {

    statusCode:StatusCodes;
    constructor(message:string){
        super(message)

        this.statusCode = StatusCodes.UNAUTHORIZED;
    }
}