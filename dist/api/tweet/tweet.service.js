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
// External Dependencies
const logger = require('../../services/logger.service');
const dbService = require('../../services/database.service');
const ObjectId = require('mongodb').ObjectId;
function query() {
    return __awaiter(this, void 0, void 0, function* () {
        logger.debug(`tweet.service - getting tweets`);
        try {
            const tweetCollection = yield dbService.getCollection('tweet');
            let tweets = yield tweetCollection.find().sort({ _id: -1 }).toArray();
            tweets = tweets.map((tweet) => {
                tweet.createdAt = new ObjectId(tweet._id).getTimestamp();
                return tweet;
            });
            return tweets;
        }
        catch (err) {
            logger.error(`Cannot find tweets `, err);
            throw err;
        }
    });
}
function getById(tweetId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const tweetCollection = yield dbService.getCollection('tweet');
            tweetId = new ObjectId(tweetId);
            const tweet = yield tweetCollection.findOne({ _id: tweetId });
            tweet.createdAt = new ObjectId(tweet._id).getTimestamp();
            return tweet;
        }
        catch (err) {
            logger.error(`Cannot find user by id: ${tweetId}`, err);
            throw err;
        }
    });
}
function addTweet(tweetToAdd) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const tweetCollection = yield dbService.getCollection('tweet');
            const mongoRes = yield tweetCollection.insertOne(tweetToAdd);
            tweetToAdd._id = mongoRes.insertedId.toString();
            tweetToAdd.createdAt = new ObjectId(tweetToAdd._id).getTimestamp();
            return tweetToAdd;
        }
        catch (err) {
            logger.error(`Cannot add tweet: ${tweetToAdd._id}`, err);
            throw err;
        }
    });
}
function updateTweet(tweetToUpdate) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // peek only updatable properties
            const tweetToSave = {
                _id: new ObjectId(tweetToUpdate._id),
                replies: tweetToUpdate.replies,
                retweetedBy: tweetToUpdate.retweetedBy,
                savedBy: tweetToUpdate.savedBy,
                likes: tweetToUpdate.likes
            };
            const tweetCollection = yield dbService.getCollection('tweet');
            yield tweetCollection.updateOne({ _id: tweetToSave._id }, { $set: tweetToSave });
            return tweetToUpdate;
        }
        catch (err) {
            logger.error(`Cannot update tweet: ${tweetToUpdate._id}`, err);
            throw err;
        }
    });
}
function remove(tweetId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const tweetCollection = yield dbService.getCollection('tweet');
            tweetId = new ObjectId(tweetId);
            yield tweetCollection.deleteOne({ _id: (tweetId) });
        }
        catch (err) {
            logger.error(`Cannot remove tweet: ${tweetId}`, err);
            throw err;
        }
    });
}
function retweet(newRetweet) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const tweetCollection = yield dbService.getCollection('tweet');
            const mongoRes = yield tweetCollection.insertOne(newRetweet);
            newRetweet._id = mongoRes.insertedId.toString();
            newRetweet.createdAt = new ObjectId(newRetweet._id).getTimestamp();
            const addedRetweet = JSON.parse(JSON.stringify(newRetweet));
            return addedRetweet;
        }
        catch (err) {
            logger.error(`Cannot retweet tweet: ${newRetweet.retweetedTweetId}`, err);
            throw err;
        }
    });
}
function queryHashtags() {
    return __awaiter(this, void 0, void 0, function* () {
        logger.debug(`tweet.service - getting hashtags`);
        try {
            const hashtagCollection = yield dbService.getCollection('hashtag');
            const hashtagsDocuments = yield hashtagCollection.find().toArray();
            let hashtagsToReturn;
            if (hashtagsDocuments.length) {
                hashtagsToReturn = {
                    _id: hashtagsDocuments[0]._id,
                    hashtags: hashtagsDocuments[0].hashtags,
                };
            }
            else {
                const newHashtags = {
                    hashtags: []
                };
                yield hashtagCollection.insertOne(newHashtags);
                const newHashtagsDocuments = yield hashtagCollection.find().toArray();
                hashtagsToReturn = {
                    _id: newHashtagsDocuments[0]._id,
                    hashtags: newHashtagsDocuments[0].hashtags,
                };
            }
            return hashtagsToReturn;
        }
        catch (err) {
            logger.error(`Cannot find hashtags `, err);
            throw err;
        }
    });
}
function updateHashtags(hashtags) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // peek only updatable properties
            const hashtagsToSave = {
                _id: new ObjectId(hashtags._id),
                hashtags: hashtags.hashtags
            };
            const hashtagCollection = yield dbService.getCollection('hashtag');
            yield hashtagCollection.updateOne({ _id: hashtagsToSave._id }, { $set: hashtagsToSave });
            return hashtagsToSave;
        }
        catch (err) {
            logger.error(`Cannot update hashtags: ${hashtags._id}`, err);
            throw err;
        }
    });
}
module.exports = {
    query,
    getById,
    addTweet,
    updateTweet,
    remove,
    retweet,
    queryHashtags,
    updateHashtags,
};
