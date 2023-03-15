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
const logger = require('../../services/logger.service');
const dbService = require('../../services/database.service');
// External Dependencies
const ObjectId = require('mongodb').ObjectId;
function query() {
    return __awaiter(this, void 0, void 0, function* () {
        logger.debug(`user.service - getting users`);
        try {
            const userCollection = yield dbService.getCollection('user');
            let users = yield userCollection.find().toArray();
            users = users.map((user) => {
                delete user.password;
                user.createdAt = new ObjectId(user._id).getTimestamp();
                return user;
            });
            return users;
        }
        catch (err) {
            logger.error('Cannot find users ', err);
            throw err;
        }
    });
}
function getByUsername(username) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userCollection = yield dbService.getCollection('user');
            const user = yield userCollection.findOne({ username });
            return user;
        }
        catch (err) {
            logger.error(`Cannot find user by username: ${username}`, err);
            throw err;
        }
    });
}
function getById(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        logger.debug(`user.service - getting user by Id: ${userId}`);
        try {
            const userCollection = yield dbService.getCollection('user');
            const user = yield userCollection.findOne({ _id: ObjectId(userId) });
            delete user.password;
            user.createdAt = new ObjectId(user._id).getTimestamp();
            return user;
        }
        catch (err) {
            logger.error(`Cannot find user by id: ${userId}`, err);
            throw err;
        }
    });
}
function remove(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        logger.debug(`user.service - removing user: ${userId}`);
        try {
            const userCollection = yield dbService.getCollection('user');
            yield userCollection.deleteOne({ _id: ObjectId(userId) });
        }
        catch (err) {
            logger.error(`Cannot remove user: ${userId}`, err);
            throw err;
        }
    });
}
function update(user) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            logger.debug(`user.service - updating user: ${user._id}`);
            // peek only updatable properties
            const userToSave = {
                _id: new ObjectId(user._id),
                firstName: user.firstName,
                lastName: user.lastName,
                profileImg: user.profileImg,
                coverImg: user.coverImg,
                follows: user.follows,
                followers: user.followers
            };
            const userCollection = yield dbService.getCollection('user');
            yield userCollection.updateOne({ _id: userToSave._id }, { $set: userToSave });
            return user;
        }
        catch (err) {
            logger.error(`Cannot update user: ${user._id}`, err);
            throw err;
        }
    });
}
function add(userCredentials) {
    return __awaiter(this, void 0, void 0, function* () {
        logger.debug(`user.service - adding user: ${userCredentials.username}`);
        try {
            const newUser = _getEmptyUser();
            const userToAdd = Object.assign(Object.assign({}, newUser), { username: userCredentials.username, password: userCredentials.password, firstName: userCredentials.firstName, lastName: userCredentials.lastName });
            const usersCollection = yield dbService.getCollection('user');
            yield usersCollection.insertOne(userToAdd);
            return userToAdd;
        }
        catch (err) {
            logger.error(`Cannot add user: ${userCredentials.username}`, err);
            throw err;
        }
    });
}
function _getEmptyUser() {
    return {
        password: '',
        username: '',
        firstName: '',
        lastName: '',
        about: '',
        profileImg: '',
        coverImg: '',
        follows: [
            "6411fbf8f91c439d905a9190",
            "6411fbf8f91c439d905a9190",
            "64120085f91c439d905a9196"
        ],
        followers: [],
        savedTweets: [],
        isGuest: false
    };
}
module.exports = {
    query,
    getByUsername,
    getById,
    remove,
    update,
    add,
};
