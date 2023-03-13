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
const authService = require('../api/auth/auth.service');
const logger = require('../services/logger.service');
// const config = require('../config')
const tweetService = require('../api/tweet/tweet.service');
function requireAuth(req, res, next) {
    // if (config.isGuestMode && !req?.cookies?.loginToken) {
    //   req.loggedinUser = { _id: '', fullname: 'Guest' }
    //   return next()
    // }
    var _a;
    if (!((_a = req === null || req === void 0 ? void 0 : req.cookies) === null || _a === void 0 ? void 0 : _a.loginToken))
        return res.status(401).send('Not Authenticated');
    const loggedinUser = authService.validateToken(req.cookies.loginToken);
    if (!loggedinUser)
        return res.status(401).send('Not Authenticated');
    req.loggedinUser = loggedinUser;
    next();
}
function requireAdmin(req, res, next) {
    var _a;
    if (!((_a = req === null || req === void 0 ? void 0 : req.cookies) === null || _a === void 0 ? void 0 : _a.loginToken))
        return res.status(401).send('Not Authenticated');
    const loggedinUser = authService.validateToken(req.cookies.loginToken);
    if (!loggedinUser.isAdmin) {
        logger.warn(loggedinUser.fullname + 'attempted to perform admin action');
        res.status(403).end('Not Authorized');
        return;
    }
    next();
}
function requireOwnership(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (!((_a = req === null || req === void 0 ? void 0 : req.cookies) === null || _a === void 0 ? void 0 : _a.loginToken))
            return res.status(401).send('Not Authenticated');
        const loggedinUser = authService.validateToken(req.cookies.loginToken);
        if (!loggedinUser)
            return res.status(401).send('Not Authenticated');
        const tweet = yield tweetService.getById(req.params.id);
        const createdBy = tweet.createdBy;
        if (loggedinUser._id !== createdBy && !tweet.isRetweet) {
            logger.warn(loggedinUser.fullname + ' ' + 'attempted to delete not owned tweet');
            res.status(403).end('Not Authorized');
            return;
        }
        next();
    });
}
module.exports = {
    requireAuth,
    requireAdmin,
    requireOwnership
};
