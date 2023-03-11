// Internal Dependencies
const userService = require('../user/user.service')
const logger = require('../../services/logger.service')
import { User, UserCredentials } from "../../Interfaces/user.interface"

// External Dependencies
const Cryptr = require('cryptr')
const bcrypt = require('bcrypt')
const cryptr = new Cryptr(process.env.SECRET1 || 'Secret-Tomer-1234')

async function login(username: string, password: string) {
    logger.debug(`auth.service - login with username: ${username}`)

    const user = await userService.getByUsername(username)
    if (!user) return Promise.reject('Invalid username or password')
    const match = await bcrypt.compare(password, user.password)
    if (!match) return Promise.reject('Invalid username or password')
    delete user.password
    user.createdAt = user._id.getTimestamp()
    user._id = user._id.toString()
    return user
}

async function signup({ username, password, firstName, lastName }: UserCredentials) {
    const saltRounds = 10

    logger.debug(`auth.service - signup with username: ${username}, fullName: ${firstName} ${lastName}`)
    if (!username || !password || !firstName || !lastName) return Promise.reject('Missing required signup information')

    const userExist: User = await userService.getByUsername(username)
    if (userExist) return Promise.reject('Username already taken')

    const hash = await bcrypt.hash(password, saltRounds)
    return userService.add({ username, password: hash, firstName, lastName })
}

function getLoginToken(user: User) {
    const userInfo = { _id: user._id, firstName: user.firstName, lastName: user.lastName }
    return cryptr.encrypt(JSON.stringify(userInfo))
}

function validateToken(loginToken: any) {
    try {
        const json = cryptr.decrypt(loginToken)
        const loggedinUser = JSON.parse(json)
        return loggedinUser
    } catch (err) {
        console.log('Invalid login token')
    }
    return null
}

module.exports = {
    login,
    signup,
    getLoginToken,
    validateToken
}