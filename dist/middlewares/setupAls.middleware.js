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
const asyncLocalStorage = require('../services/als.service');
function setupAsyncLocalStorage(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const storage = {};
        asyncLocalStorage.run(storage, () => {
            if (!req.cookies)
                return next();
            const loggedinUser = authService.validateToken(req.cookies.loginToken);
            if (loggedinUser) {
                const alsStore = asyncLocalStorage.getStore();
                alsStore.loggedinUser = loggedinUser;
            }
            next();
        });
    });
}
module.exports = setupAsyncLocalStorage;
