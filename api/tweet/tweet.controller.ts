// Internal Dependencies
const tweetService = require('./tweet.service')
const logger = require('../../services/logger.service')
import { hashtags, Retweet, Tweet } from '../../Interfaces/tweet.interface'

// External Dependencies
import { Request, Response } from 'express'

async function getTweets(req: Request, res: Response) {
    try {
        const tweets: Tweet[] = await tweetService.query()
        res.send(tweets)
    } catch (err) {
        logger.error('Failed to get tweets ' + err)
        res.status(500).send({ err: 'Failed to get tweets' })
    }
}

async function getTweet(req: Request, res: Response) {
    try {
        const tweetId: string = req.params.id
        const tweet: Tweet = await tweetService.getById(tweetId)
        res.send(tweet)
    } catch (err) {
        logger.error('Failed to get tweet ' + err)
        res.status(500).send({ err: 'Failed to get tweet' })
    }
}

async function addTweet(req: Request, res: Response) {
    try {
        const tweetToAdd: Tweet = req.body
        const addedTweet: Tweet = await tweetService.addTweet(tweetToAdd)

        logger.info('Tweet added: ', addedTweet._id)

        res.send(addedTweet)
    } catch (err) {
        logger.error('Failed to add tweet ' + err)
        res.status(500).send({ err: 'Failed to add tweet' })
    }
}

async function updateTweet(req: Request, res: Response) {
    try {
        const tweetToUpdate: Tweet = req.body
        const updatedTweet: Tweet = await tweetService.updateTweet(tweetToUpdate)

        logger.info('Tweet updated: ', updatedTweet._id)

        res.send(updatedTweet)
    } catch (err) {
        logger.error('Failed to update tweet ' + err)
        res.status(500).send({ err: 'Failed to update tweet' })
    }
}

async function deleteTweet(req: Request, res: Response) {
    try {
        const tweetId: string = req.params.id
        await tweetService.remove(tweetId)

        logger.info('Tweet removed: ', tweetId)

        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        logger.error('Failed to delete tweet ' + err)
        res.status(500).send({ err: 'Failed to delete tweet' })
    }
}

async function retweet(req: Request, res: Response) {
    try {
        const newRetweet: Retweet = req.body
        const retweet: Retweet = await tweetService.retweet(newRetweet)

        logger.info('Retweet added: ', newRetweet._id)

        res.send(retweet)
    } catch (err) {
        logger.error('Failed to update tweet ' + err)
        res.status(500).send({ err: 'Failed to update tweet' })
    }
}

async function getHashtags(req: Request, res: Response) {
    try {
        const hashtags: hashtags = await tweetService.queryHashtags()
        res.send(hashtags)
    } catch (err) {
        logger.error('Failed to get tweets ' + err)
        res.status(500).send({ err: 'Failed to get tweets' })
    }
}

async function updateHashtags(req: Request, res: Response) {
    try {
        const hashtags: hashtags = req.body
        const updatedHashtags: hashtags = await tweetService.updateHashtags(hashtags)
        res.send(updatedHashtags)
    } catch (err) {
        logger.error('Failed to update hashtags ' + err)
        res.status(500).send({ err: 'Failed to update hashtags' })
    }
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
}
