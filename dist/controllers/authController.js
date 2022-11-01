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
exports.login = exports.register = void 0;
const http_status_codes_1 = require("http-status-codes");
const crypto = __importStar(require("crypto"));
const error_1 = require("../error");
const User_1 = __importDefault(require("../models/User"));
const Token_1 = __importDefault(require("../models/Token"));
const createTokenUser_1 = require("../util/createTokenUser");
const jwt_1 = require("../util/jwt");
function register(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, name, password } = req.body;
        const emailAlreadyExists = yield User_1.default.findOne({ email });
        if (emailAlreadyExists) {
            throw new error_1.BadRequestError('Email already exists');
        }
        // first registered user is an admin
        const isFirstAccount = (yield User_1.default.countDocuments({})) === 0;
        const role = isFirstAccount ? 'admin' : 'user';
        //generate verification token
        const verificationToken = crypto.randomBytes(40).toString('hex');
        const user = yield User_1.default.create({
            name,
            email,
            password,
            role,
            verificationToken,
        });
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            msg: 'Success! Please check your email to verify account',
        });
    });
}
exports.register = register;
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new error_1.BadRequestError('Please provide email and password');
        }
        var user = yield User_1.default.findOne({ email });
        console.log('USER IN LOGIN IS', user);
        if (!user) {
            throw new error_1.UnauthenticatedError('Invalid Credentials');
        }
        const isPasswordCorrect = yield user.comparePassword(password);
        if (!isPasswordCorrect) {
            throw new error_1.UnauthenticatedError('Invalid Credentials');
        }
        console.log('informacije koje saljemo su', user._id, user.name, user.role);
        const tokenUser = (0, createTokenUser_1.createTokenUser)(user._id, user.name, user.role);
        let refreshToken = new String("");
        const existingToken = yield Token_1.default.findOne({ user: user._id });
        if (existingToken) {
            const { isValid } = existingToken;
            if (!isValid) {
                throw new error_1.UnauthenticatedError('Invalid Credentials');
            }
            refreshToken = existingToken.refreshToken;
            (0, jwt_1.attachCookiesToResponse)(res, tokenUser, refreshToken);
            res.status(http_status_codes_1.StatusCodes.OK).json({ user: tokenUser });
            return;
        }
        refreshToken = crypto.randomBytes(40).toString('hex');
        const userAgent = req.headers['user-agent'];
        const ip = req.ip;
        const userToken = { refreshToken, ip, userAgent, user: user._id };
        yield Token_1.default.create(userToken);
        (0, jwt_1.attachCookiesToResponse)(res, tokenUser, refreshToken);
        res.status(http_status_codes_1.StatusCodes.OK).json({ user: tokenUser });
    });
}
exports.login = login;
