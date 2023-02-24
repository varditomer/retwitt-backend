const authService = require('./auth.service')
const logger = require('../../services/logger.service')
import { Request, Response } from 'express'
import { User, UserCredentials } from '../../Interfaces/user.interface'

async function login(req: Request, res: Response) {
    const { username, password }: { username: string, password: string } = req.body
    try {
        console.log(`username:`, username)
        console.log(`password:`, password)
        const user = await authService.login(username, password)
        const loginToken = authService.getLoginToken(user)
        logger.info('User login: ', user)
        res.cookie('loginToken', loginToken, { sameSite: 'none', secure: true })
        res.json(user)
    } catch (err) {
        logger.error('Failed to Login ' + err)
        res.status(401).send({ err: 'Failed to Login' })
    }
}

async function signup(req: Request, res: Response) {
    try {
        const credentials: UserCredentials = req.body
        console.log(`credentials:`, credentials)
        const account = await authService.signup(credentials)
        logger.debug(`auth.route - new account created: ` + JSON.stringify(account))

        const user: User = await authService.login(credentials.username, credentials.password)
        logger.info('User signup: ', user)

        const loginToken = authService.getLoginToken(user)

        res.cookie('loginToken', loginToken, { sameSite: 'none', secure: true })
        res.json(user)

    } catch (err) {
        logger.error('Failed to Signup ' + err)
        res.status(500).send({ err: 'Failed to Signup' })
    }
}

async function logout(req: Request, res: Response) {
    try {
        res.clearCookie('loginToken')
        res.send({ msg: 'Logged out successfully' })

    } catch (err) {
        logger.error('Failed to Logout ' + err)
        res.status(500).send({ err: 'Failed to Logout' })
    }
}

module.exports = {
    login,
    signup,
    logout
}