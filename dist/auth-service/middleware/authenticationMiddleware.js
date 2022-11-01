"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = void 0;
const error_1 = require("../error");
const jwt_1 = require("../util/jwt");
const Token_1 = __importDefault(require("../models/Token"));
function authenticateUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { refreshToken, accessToken } = req.signedCookies;
        try {
            if (accessToken) {
                const payload = (0, jwt_1.isTokenValid)(accessToken);
                console.log("PAYLOAD IS ", payload);
                req.tokenUser = payload;
                return next();
            }
            const payload = (0, jwt_1.isTokenValid)(refreshToken);
            console.log('payload refresh', payload);
            const existingToken = yield Token_1.default.findOne({
                user: payload.user.id,
                refreshToken: payload.refreshToken
            });
            console.log('existing token?', existingToken);
            if (!existingToken || !(existingToken === null || existingToken === void 0 ? void 0 : existingToken.isValid)) {
                throw new error_1.UnauthenticatedError('Authentication invalid  2');
            }
            (0, jwt_1.attachCookiesToResponse)(res, payload.user, existingToken.refreshToken);
            req.tokenUser = payload;
            next();
        }
        catch (error) {
            console.log('error ', error);
            throw new error_1.UnauthenticatedError('Invalid authentication');
        }
    });
}
exports.authenticateUser = authenticateUser;
