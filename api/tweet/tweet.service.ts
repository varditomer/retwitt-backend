import { Tweet } from "../../Interfaces/tweet.interface"

// External Dependencies
const logger = require('../../services/logger.service')
const dbService = require('../../services/database.service')
const ObjectId = require('mongodb').ObjectId

async function query() {
    try {
        const tweetCollection = await dbService.getCollection('tweet')
        let tweets: Tweet[] = await tweetCollection.find().toArray()
        tweets = tweets.map((tweet: Tweet) => {
            tweet.createdAt = new ObjectId(tweet._id).getTimestamp()
            return tweet
        })
        return tweets
    } catch (err) {
        logger.error(`Cannot find tweets `, err)
        throw err
    }
}

async function getById(tweetId: string) {
    try {
        const tweetCollection = await dbService.getCollection('tweet')
        const tweet: Tweet = await tweetCollection.findOne({ _id: ObjectId(tweetId) })
        tweet.createdAt = new ObjectId(tweet._id).getTimestamp()
        return tweet
    } catch (err) {
        logger.error(`Cannot find user by id: ${tweetId}`, err)
        throw err
    }

}

async function addTweet(tweetToAdd: Tweet) {
    try {
        const tweetCollection = await dbService.getCollection('tweet')
        const savedTweet: Tweet = await tweetCollection.insertOne(tweetToAdd)
        savedTweet.createdAt = new ObjectId(savedTweet._id).getTimestamp()
        return savedTweet
    } catch (err) {
        logger.error(`Cannot add tweet: ${tweetToAdd._id}`, err)
        throw err
    }

}

async function updateTweet(tweetToUpdate: Tweet) {
    try {
        // peek only updatable properties
        const tweetToSave = {
            _id: ObjectId(tweetToUpdate._id), // needed for the returned obj
            replies: tweetToUpdate.replies,
            reTweetedBy: tweetToUpdate.reTweetedBy,
            savedBy: tweetToUpdate.savedBy,
            likes: tweetToUpdate.likes
        }
        const tweetCollection = await dbService.getCollection('tweet')
        await tweetCollection.updateOne({ _id: tweetToSave._id }, { $set: tweetToSave })
        return tweetToSave
    } catch (err) {
        logger.error(`Cannot update tweet: ${tweetToUpdate._id}`, err)
        throw err
    }

}

async function remove(tweetId: string) {
    try {
        const tweetCollection = await dbService.getCollection('tweet')
        await tweetCollection.deleteOne({ _id: ObjectId(tweetId) })
    } catch (err) {
        logger.error(`Cannot remove tweet: ${tweetId}`, err)
        throw err
    }
}

module.exports = {
    query,
    getById,
    addTweet,
    updateTweet,
    remove
}
