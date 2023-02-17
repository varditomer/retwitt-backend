import { User } from "../../Interfaces/user.interface"
const ObjectId = require('mongodb').ObjectId

const logger = require('../../services/logger.service')
const dbService = require('../../services/db.service')


async function query() {
    try {
        let users = await dbService.getCollection('user')
        users = users.map((user: User) => {
            delete user.password
            user.createdAt = new ObjectId(user._id).getTimestamp()
            return user
        })
        return users

    } catch (err) {
        if (err instanceof Error) {
            logger.error('Cannot find users ', err)
        }
        console.log('Unexpected error', err)
        throw err
    }
}


async function getByUsername(username: string) {
    try {
        console.log(`getting user by username:`, username)
        const userCollection = await dbService.getCollection('user')
        const user: User = await userCollection.findOne({ username })
        console.log(`user:`, user)
        return user
    } catch (err) {
        logger.error(`Cannot find user by username: ${username}`, err)
        throw err
    }
}

async function getById(userId: string) {
    try {
        const userCollection = await dbService.getCollection('user')
        const user: User = await userCollection.findOne({ _id: ObjectId(userId) })
        delete user.password
        return user
    } catch (err) {
        if (err instanceof Error) {
            logger.error(`Cannot find user by userId: ${userId}`, err)
        }
        console.log('Unexpected error', err)
        throw err
    }
}

async function remove(userId: string) {
    try {
        const userCollection = await dbService.getCollection('user')
        await userCollection.deleteOne({ _id: ObjectId(userId) })
    } catch (err) {
        if (err instanceof Error) {
            logger.error(`Cannot remove user: ${userId}`, err)
        }
        console.log('Unexpected error', err)
        throw err
    }
}
async function update(user: User) {
    try {
        const userToSave = {
            _id: ObjectId(user._id)
        }
        const userCollection = await dbService.getCollection('user')
        await userCollection.updateOne({ _id: userToSave._id }, { $set: userToSave })
        return userToSave
    } catch (err) {
        if (err instanceof Error) {
            logger.error(`Cannot update user: ${user._id}`, err)
        }
        console.log('Unexpected error', err)
        throw err
    }
}

async function add(user: User) {
    try {
        console.log(`add-userService:`,)
        const userToSave = {
            _id: ObjectId(user._id)
        }
        const usersCollection = await dbService.getCollection('user')
        console.log(`ready to insert:`,)
        // await usersCollection.insertOne(user)
        return userToSave
    } catch (err) {
        if (err instanceof Error) {
            logger.error(`Cannot update user: ${user._id}`, err)
        }
        console.log('Unexpected error', err)
        throw err
    }
}

module.exports = {
    query,
    getByUsername,
    getById,
    remove,
    update,
    add
}