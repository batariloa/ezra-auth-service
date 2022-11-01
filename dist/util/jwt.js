"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachCookiesToResponse = exports.isTokenValid = exports.createJWT = void 0;
const jwt = __importStar(require("jsonwebtoken"));
function createJWT(payload) {
    const token = jwt.sign({ user: payload }, process.env.JWT_SECRET || '');
    return token;
}
exports.createJWT = createJWT;
function isTokenValid(token) { return jwt.verify(token, process.env.JWT_SECRET || ''); }
exports.isTokenValid = isTokenValid;
function attachCookiesToResponse(res, user, refreshToken) {
    console.log('user payload is ', user);
    let accessTokenJWT = createJWT({ user: user });
    let refreshTokenJWT = createJWT({ user: user, refreshToken: refreshToken });
    const oneDay = 1000 * 60 * 60 * 24;
    const oneMonth = oneDay * 30;
    res.cookie('accessToken', accessTokenJWT, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        signed: true,
        expires: new Date(Date.now() + 3000),
    });
    res.cookie('refreshToken', refreshTokenJWT, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        signed: true,
        expires: new Date(Date.now() + oneMonth),
    });
}
exports.attachCookiesToResponse = attachCookiesToResponse;
