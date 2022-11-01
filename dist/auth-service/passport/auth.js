"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
var GoogleStrategy = require('passport-google-oauth2').Strategy;
passport_1.default.use(new GoogleStrategy({
    clientID: '105335778076-jnooc7v9dqqo858ap8sgufdd4618745m.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: "http://localhost:4000/google/callback",
    passReqToCallback: true
}, function (request, accessToken, refreshToken, profile, done) {
    return done(null, profile);
}));
passport_1.default.serializeUser(function (user, done) {
    done(null, user);
});
passport_1.default.deserializeUser(function (user, done) {
    done(null, user);
});
