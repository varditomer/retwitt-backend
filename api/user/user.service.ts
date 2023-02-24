import { User, UserCredentials } from "../../Interfaces/user.interface"
const ObjectId = require('mongodb').ObjectId

const logger = require('../../services/logger.service')
const dbService = require('../../services/database.service')

async function query() {
    logger.debug(`user.service - getting users`)
    try {
        const userCollection = await dbService.getCollection('user')
        let users: User[] = await userCollection.find().toArray()
        users = users.map((user: User) => {
            delete user.password
            user.createdAt = new ObjectId(user._id).getTimestamp()
            return user
        })
        return users
    } catch (err) {
        logger.error('Cannot find users ', err)
        throw err
    }
}

async function getByUsername(username: string) {
    try {
        const userCollection = await dbService.getCollection('user')
        const user: User = await userCollection.findOne({ username })
        return user
    } catch (err) {
        logger.error(`Cannot find user by username: ${username}`, err)
        throw err
    }
}

async function getById(userId: string) {
    logger.debug(`user.service - getting user by Id: ${userId}`)
    try {
        const userCollection = await dbService.getCollection('user')
        const user: User = await userCollection.findOne({ _id: ObjectId(userId) })
        delete user.password
        user.createdAt = new ObjectId(user._id).getTimestamp()
        return user
    } catch (err) {
        logger.error(`Cannot find user by id: ${userId}`, err)
        throw err
    }
}

async function remove(userId: string) {
    logger.debug(`user.service - removing user: ${userId}`)

    try {
        const userCollection = await dbService.getCollection('user')
        await userCollection.deleteOne({ _id: ObjectId(userId) })
    } catch (err) {
        logger.error(`Cannot remove user: ${userId}`, err)
        throw err
    }
}
async function update(user: User) {
    try {
        logger.debug(`user.service - updating user: ${user._id}`)
        // peek only updatable properties
        const userToSave = {
            _id: new ObjectId(user._id), // needed for the returned obj
            firstName: user.firstName,
            lastName: user.lastName,
            profileImg: user.profileImg,
            coverImg: user.coverImg,
            follows: user.follows
        }
        const userCollection = await dbService.getCollection('user')
        await userCollection.updateOne({ _id: userToSave._id }, { $set: userToSave })
        return userToSave
    } catch (err) {
        logger.error(`Cannot update user: ${user._id}`, err)
        throw err
    }
}

async function add(userCredentials: UserCredentials) {
    logger.debug(`user.service - adding user: ${userCredentials.username}`)
    try {
        const newUser = _getEmptyUser()
        const userToAdd = {
            ...newUser,
            username: userCredentials.username,
            password: userCredentials.password,
            firstName: userCredentials.firstName,
            lastName: userCredentials.lastName,
        }
        const usersCollection = await dbService.getCollection('user')
        await usersCollection.insertOne(userToAdd)
        return userToAdd
    } catch (err) {
        logger.error(`Cannot add user: ${userCredentials.username}`, err)
        throw err
    }
}

function _getEmptyUser(): User {
    return {
        password: '',
        username: '',
        firstName: '',
        lastName: '',
        about: '',
        profileImg: '',
        coverImg: '',
        follows: [],
        followers: [],
        savedTweets: [],
        isGuest: false
    }
}

module.exports = {
    query,
    getByUsername,
    getById,
    remove,
    update,
    add,
}