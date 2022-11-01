"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthenticatedError = void 0;
const http_status_codes_1 = require("http-status-codes");
const CustomErrors_1 = require("./CustomErrors");
class UnauthenticatedError extends CustomErrors_1.CustomError {
    constructor(message) {
        super(message);
        this.statusCode = http_status_codes_1.StatusCodes.UNAUTHORIZED;
    }
}
exports.UnauthenticatedError = UnauthenticatedError;
