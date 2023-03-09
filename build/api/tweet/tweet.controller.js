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
const tweetService = require('./tweet.service');
const logger = require('../../services/logger.service');
function getTweets(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const tweets = yield tweetService.query();
            res.send(tweets);
        }
        catch (err) {
            logger.error('Failed to get tweets ' + err);
            res.status(500).send({ err: 'Failed to get tweets' });
        }
    });
}
function getTweet(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const tweetId = req.params.id;
            const tweet = yield tweetService.getById(tweetId);
            res.send(tweet);
        }
        catch (err) {
            logger.error('Failed to get tweet ' + err);
            res.status(500).send({ err: 'Failed to get tweet' });
        }
    });
}
function addTweet(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const tweetToAdd = req.body;
            const addedTweet = yield tweetService.addTweet(tweetToAdd);
            res.send(addedTweet);
        }
        catch (err) {
            logger.error('Failed to add tweet ' + err);
            res.status(500).send({ err: 'Failed to add tweet' });
        }
    });
}
function updateTweet(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const tweetToUpdate = req.body;
            const updatedTweet = yield tweetService.updateTweet(tweetToUpdate);
            res.send(updatedTweet);
        }
        catch (err) {
            logger.error('Failed to update tweet ' + err);
            res.status(500).send({ err: 'Failed to update tweet' });
        }
    });
}
function deleteTweet(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const tweetId = req.params.id;
            yield tweetService.remove(tweetId);
            res.send({ msg: 'Deleted successfully' });
        }
        catch (err) {
            logger.error('Failed to delete tweet ' + err);
            res.status(500).send({ err: 'Failed to delete tweet' });
        }
    });
}
function retweet(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const newRetweet = req.body;
            const retweet = yield tweetService.retweet(newRetweet);
            res.send(retweet);
        }
        catch (err) {
            logger.error('Failed to update tweet ' + err);
            res.status(500).send({ err: 'Failed to update tweet' });
        }
    });
}
function getHashtags(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const hashtags = yield tweetService.queryHashtags();
            res.send(hashtags);
        }
        catch (err) {
            logger.error('Failed to get tweets ' + err);
            res.status(500).send({ err: 'Failed to get tweets' });
        }
    });
}
function updateHashtags(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const hashtags = req.body;
            const updatedHashtags = yield tweetService.updateHashtags(hashtags);
            res.send(updatedHashtags);
        }
        catch (err) {
            logger.error('Failed to update hashtags ' + err);
            res.status(500).send({ err: 'Failed to update hashtags' });
        }
    });
}
module.exports = {
    getTweets,
    getTweet,
    addTweet,
    updateTweet,
    deleteTweet,
    retweet,
    getHashtags,
    updateHashtags,
};
