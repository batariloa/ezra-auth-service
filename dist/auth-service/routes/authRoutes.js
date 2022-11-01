"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRouter = void 0;
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authRouter = (0, express_1.Router)();
authRouter.post('/login', authController_1.login);
authRouter.post('/register', authController_1.register);
exports.AuthRouter = authRouter;
