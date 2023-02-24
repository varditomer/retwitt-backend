const express = require('express')
const { requireAuth, requireOwnership } = require('../../middlewares/requireAuth.middleware')
const {getTweets, getTweet, addTweet, updateTweet, deleteTweet} = require('./tweet.controller')

const router = express.Router()

router.get('/', getTweets)
router.get('/:id', getTweet)
router.post('/', requireAuth, addTweet)
router.put('/:id', requireAuth, updateTweet)
router.delete('/:id', requireAuth, requireOwnership, deleteTweet)

module.exports = router

// fixing `Cannot redeclare block-scoped variable 'express'` --> adding export {}
export { }