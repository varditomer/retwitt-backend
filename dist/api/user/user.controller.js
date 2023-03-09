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
const userService = require('./user.service');
const logger = require('../../services/logger.service');
function getUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield userService.query();
            res.send(users);
        }
        catch (err) {
            logger.error('Failed to get users ' + err);
            res.status(500).send({ err: 'Failed to get users' });
        }
    });
}
function getUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.params.id;
            const user = yield userService.getById(userId);
            res.send(user);
        }
        catch (err) {
            logger.error('Failed to get user ' + err);
            res.status(500).send({ err: 'Failed to get user' });
        }
    });
}
function deleteUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.params.id;
            yield userService.remove(userId);
            logger.info('User removed: ', userId);
            res.send({ msg: 'Deleted successfully' });
        }
        catch (err) {
            logger.error('Failed to delete user ' + err);
            res.status(500).send({ err: 'Failed to delete user' });
        }
    });
}
function updateUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = req.body;
            const savedUser = yield userService.update(user);
            logger.info('User updated: ', user._id);
            res.send(savedUser);
        }
        catch (err) {
            logger.error('Failed to update user ' + err);
            res.status(500).send({ err: 'Failed to update user' });
        }
    });
}
module.exports = {
    getUsers,
    getUser,
    deleteUser,
    updateUser,
};
