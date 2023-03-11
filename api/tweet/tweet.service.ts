// Internal Dependencies
import { hashtags, Retweet, Tweet } from "../../Interfaces/tweet.interface"

// External Dependencies
const logger = require('../../services/logger.service')
const dbService = require('../../services/database.service')
const ObjectId = require('mongodb').ObjectId

async function query() {
    logger.debug(`tweet.service - getting tweets`)
    try {
        const tweetCollection = await dbService.getCollection('tweet')

        let tweets: Tweet[] = await tweetCollection.find().sort({ _id: -1 }).toArray()
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

        tweetId = new ObjectId(tweetId)
        const tweet: Tweet = await tweetCollection.findOne({ _id: tweetId })

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
        const mongoRes: any = await tweetCollection.insertOne(tweetToAdd)

        tweetToAdd._id = mongoRes.insertedId.toString()
        tweetToAdd.createdAt = new ObjectId(tweetToAdd._id).getTimestamp()
        return tweetToAdd
    } catch (err) {
        logger.error(`Cannot add tweet: ${tweetToAdd._id}`, err)
        throw err
    }

}

async function updateTweet(tweetToUpdate: Tweet) {
    try {
        // peek only updatable properties
        const tweetToSave = {
            _id: new ObjectId(tweetToUpdate._id), // needed for the returned obj
            replies: tweetToUpdate.replies,
            retweetedBy: tweetToUpdate.retweetedBy,
            savedBy: tweetToUpdate.savedBy,
            likes: tweetToUpdate.likes
        }

        const tweetCollection = await dbService.getCollection('tweet')
        await tweetCollection.updateOne({ _id: tweetToSave._id }, { $set: tweetToSave })

        return tweetToUpdate
    } catch (err) {
        logger.error(`Cannot update tweet: ${tweetToUpdate._id}`, err)
        throw err
    }
}

async function remove(tweetId: string) {
    try {
        const tweetCollection = await dbService.getCollection('tweet')

        tweetId = new ObjectId(tweetId)
        await tweetCollection.deleteOne({ _id: (tweetId) })

    } catch (err) {
        logger.error(`Cannot remove tweet: ${tweetId}`, err)
        throw err
    }
}

async function retweet(newRetweet: Retweet) {
    try {
        const tweetCollection = await dbService.getCollection('tweet')
        const mongoRes: any = await tweetCollection.insertOne(newRetweet)

        newRetweet._id = mongoRes.insertedId.toString()
        newRetweet.createdAt = new ObjectId(newRetweet._id).getTimestamp()

        const addedRetweet = structuredClone(newRetweet)
        return addedRetweet
    } catch (err) {
        logger.error(`Cannot retweet tweet: ${newRetweet.retweetedTweetId}`, err)
        throw err
    }

}

async function queryHashtags() {
    logger.debug(`tweet.service - getting hashtags`)
    try {
        const hashtagCollection = await dbService.getCollection('hashtag')
        const hashtagsDocuments: [hashtags] = await hashtagCollection.find().toArray()

        let hashtagsToReturn: hashtags
        if (hashtagsDocuments.length) {
            hashtagsToReturn = {
                _id: hashtagsDocuments[0]._id,
                hashtags: hashtagsDocuments[0].hashtags,
            }
        } else {
            const newHashtags = {
                hashtags: []
            }
            await hashtagCollection.insertOne(newHashtags)
            const newHashtagsDocuments: [hashtags] = await hashtagCollection.find().toArray()

            hashtagsToReturn = {
                _id: newHashtagsDocuments[0]._id,
                hashtags: newHashtagsDocuments[0].hashtags,
            }
        }
        return hashtagsToReturn
    } catch (err) {
        logger.error(`Cannot find hashtags `, err)
        throw err
    }
}

async function updateHashtags(hashtags: hashtags) {
    try {
        // peek only updatable properties
        const hashtagsToSave = {
            _id: new ObjectId(hashtags._id), // needed for the returned obj
            hashtags: hashtags.hashtags
        }

        const hashtagCollection = await dbService.getCollection('hashtag')
        await hashtagCollection.updateOne({ _id: hashtagsToSave._id }, { $set: hashtagsToSave })

        return hashtagsToSave
    } catch (err) {
        logger.error(`Cannot update hashtags: ${hashtags._id}`, err)
        throw err
    }
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
}
