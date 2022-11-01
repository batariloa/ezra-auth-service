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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const errorHandlerMiddleware_1 = require("./middleware/errorHandlerMiddleware");
require('express-async-errors');
const morgan = require("morgan");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(morgan('dev'));
app.use((0, express_session_1.default)({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport_1.default.initialize());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)(process.env.JWT_SECRET));
app.get('/', (req, res) => {
    res.send('Express + TypeScript Server');
});
const authRoutes_1 = require("./routes/authRoutes");
app.use('/auth', authRoutes_1.AuthRouter);
app.use(errorHandlerMiddleware_1.errorHandlerMiddleware);
const connect_1 = require("./db/connect");
//start application
const port = process.env.PORT || 5000;
app.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, connect_1.connectDB)(process.env.MONGO_URI || '');
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
}));
