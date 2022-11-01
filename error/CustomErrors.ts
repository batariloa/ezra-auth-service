import StatusCodes from "http-status-codes"

export class CustomError extends Error {

    statusCode:number = 400
    constructor(message:string) {

        
        super(message)
    }
}

