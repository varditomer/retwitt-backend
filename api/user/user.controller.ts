// Internal Dependencies
const userService = require('./user.service')
const logger = require('../../services/logger.service')
import { User } from '../../Interfaces/user.interface'

// External Dependencies
import { Request, Response } from 'express'

async function getUsers(req: Request, res: Response) {
    try {
        const users: User[] = await userService.query()
        
        res.send(users)
    } catch (err) {
        logger.error('Failed to get users ' + err)
        res.status(500).send({ err: 'Failed to get users' })
    }
}

async function getUser(req: Request, res: Response) {
    try {
        const userId: string = req.params.id
        const user: User = await userService.getById(userId)

        res.send(user)
    } catch (err) {
        logger.error('Failed to get user ' + err)
        res.status(500).send({ err: 'Failed to get user' })
    }
}

async function deleteUser(req: Request, res: Response) {
    try {
        const userId: string = req.params.id
        await userService.remove(userId)

        logger.info('User removed: ', userId)

        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        logger.error('Failed to delete user ' + err)
        res.status(500).send({ err: 'Failed to delete user' })
    }
}

async function updateUser(req: Request, res: Response) {
    try {
        const user: User = req.body
        const savedUser: User = await userService.update(user)

        logger.info('User updated: ', user._id)

        res.send(savedUser)
    } catch (err) {
        logger.error('Failed to update user ' + err)
        res.status(500).send({ err: 'Failed to update user' })
    }
}

module.exports = {
    getUsers,
    getUser,
    deleteUser,
    updateUser,
}
