"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTokenUser = void 0;
const MyTokenUser_1 = __importDefault(require("../../types/MyTokenUser"));
function createTokenUser(id, name, role) {
    return new MyTokenUser_1.default(id, name, role);
    //{id:user._id, name:user.name, role:user.role}   
}
exports.createTokenUser = createTokenUser;
