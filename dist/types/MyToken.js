"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyToken = void 0;
class MyToken {
    constructor(user, refreshToken) {
        this.user = user;
        this.refreshToken = refreshToken;
    }
}
exports.MyToken = MyToken;
