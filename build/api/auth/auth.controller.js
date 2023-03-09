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
Object.defineProperty(exports, "__esModule", { value: true });
const authService = require('./auth.service');
const logger = require('../../services/logger.service');
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, password } = req.body;
        try {
            const user = yield authService.login(username, password);
            const loginToken = authService.getLoginToken(user);
            logger.info('User login: ', user);
            res.cookie('loginToken', loginToken, { sameSite: 'none', secure: true });
            res.json(user);
        }
        catch (err) {
            logger.error('Failed to Login ' + err);
            res.status(401).send({ err: 'Failed to Login' });
        }
    });
}
function signup(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const credentials = req.body;
            const account = yield authService.signup(credentials);
            logger.debug(`auth.route - new account created: ` + JSON.stringify(account));
            const user = yield authService.login(credentials.username, credentials.password);
            logger.info('User signup: ', user);
            const loginToken = authService.getLoginToken(user);
            res.cookie('loginToken', loginToken, { sameSite: 'none', secure: true });
            res.json(user);
        }
        catch (err) {
            logger.error('Failed to Signup ' + err);
            res.status(500).send({ err: 'Failed to Signup' });
        }
    });
}
function logout(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            res.clearCookie('loginToken');
            res.send({ msg: 'Logged out successfully' });
        }
        catch (err) {
            logger.error('Failed to Logout ' + err);
            res.status(500).send({ err: 'Failed to Logout' });
        }
    });
}
module.exports = {
    login,
    signup,
    logout
};
