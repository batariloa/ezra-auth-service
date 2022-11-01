"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandlerMiddleware = void 0;
const error_1 = require("../error");
const errorHandlerMiddleware = (err, req, res, next) => {
    console.log(err);
    //set default errorr
    let customError = new error_1.CustomError('Something went wrong, try again later.');
    customError.statusCode = err.statusCode;
    if (err.name === 'ValidationError') {
        customError.message = Object.values(err.error)
            .map((item) => item.message)
            .join(',');
        customError.statusCode = 403;
    }
    return res.status(customError.statusCode).json({ msg: customError.message });
};
exports.errorHandlerMiddleware = errorHandlerMiddleware;
