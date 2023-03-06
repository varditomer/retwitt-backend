const express = require('express')
const { requireAuth, requireOwnership } = require('../../middlewares/requireAuth.middleware')
const { getTweets, getTweet, addTweet, updateTweet, deleteTweet, retweet, getHashtags, updateHashtags } = require('./tweet.controller')

const router = express.Router()

router.get('/', getTweets)
router.get('/hashtag', getHashtags)
router.get('/:id', getTweet)
router.post('/', requireAuth, addTweet)
router.post('/retweet', requireAuth, retweet)
router.put('/hashtag', requireAuth, updateHashtags)
router.put('/:id', requireAuth, updateTweet)
router.delete('/:id', requireAuth, requireOwnership, deleteTweet)

module.exports = router

// fixing `Cannot redeclare block-scoped variable 'express'` --> adding export {}
export { }