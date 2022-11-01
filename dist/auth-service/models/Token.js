"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const TokenSchema = new mongoose_1.default.Schema({
    refreshToken: {
        type: String,
        required: true
    },
    ip: {
        type: String,
        required: true
    },
    userAgent: {
        type: String,
        required: true
    },
    isValid: {
        type: Boolean, required: true,
        default: true
    },
    user: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });
const Token = mongoose_1.default.model("Token", TokenSchema);
exports.default = Token;
