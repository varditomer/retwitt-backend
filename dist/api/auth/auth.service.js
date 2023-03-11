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
// Internal Dependencies
const userService = require('../user/user.service');
const logger = require('../../services/logger.service');
// External Dependencies
const Cryptr = require('cryptr');
const bcrypt = require('bcrypt');
const cryptr = new Cryptr(process.env.SECRET1 || 'Secret-Tomer-1234');
function login(username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        logger.debug(`auth.service - login with username: ${username}`);
        const user = yield userService.getByUsername(username);
        if (!user)
            return Promise.reject('Invalid username or password');
        const match = yield bcrypt.compare(password, user.password);
        if (!match)
            return Promise.reject('Invalid username or password');
        delete user.password;
        user.createdAt = user._id.getTimestamp();
        user._id = user._id.toString();
        return user;
    });
}
function signup({ username, password, firstName, lastName }) {
    return __awaiter(this, void 0, void 0, function* () {
        const saltRounds = 10;
        logger.debug(`auth.service - signup with username: ${username}, fullName: ${firstName} ${lastName}`);
        if (!username || !password || !firstName || !lastName)
            return Promise.reject('Missing required signup information');
        const userExist = yield userService.getByUsername(username);
        if (userExist)
            return Promise.reject('Username already taken');
        const hash = yield bcrypt.hash(password, saltRounds);
        return userService.add({ username, password: hash, firstName, lastName });
    });
}
function getLoginToken(user) {
    const userInfo = { _id: user._id, firstName: user.firstName, lastName: user.lastName };
    return cryptr.encrypt(JSON.stringify(userInfo));
}
function validateToken(loginToken) {
    try {
        const json = cryptr.decrypt(loginToken);
        const loggedinUser = JSON.parse(json);
        return loggedinUser;
    }
    catch (err) {
        console.log('Invalid login token');
    }
    return null;
}
module.exports = {
    login,
    signup,
    getLoginToken,
    validateToken
};
