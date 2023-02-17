const userService = require('./user.service')
const logger = require('../../services/logger.service')
import { Request, Response } from 'express'
import { User } from '../../Interfaces/user.interface'

async function getUser(req: Request, res: Response) {
    try {
        const userId: string = req.params.id
        const user: User = await userService.getById(userId)
        res.send(user)
    } catch (err) {
        if (err instanceof Error) {
            logger.error('Failed to get user ' + err)
            res.status(500).send({ err: 'Failed to get user' })
        }
        console.log('Unexpected error', err);
    }
}

async function getUsers(req: Request, res: Response) {
    try {
        const users: User[] = await userService.query()
        res.send(users)
    } catch (err) {
        if (err instanceof Error) {
            logger.error('Failed to get users ' + err)
            res.status(500).send({ err: 'Failed to get users' })
        }
        console.log('Unexpected error', err);
    }
}

async function deleteUser(req: Request, res: Response) {
    try {
        const userId: string = req.params.id
        await userService.remove(userId)
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        if (err instanceof Error) {
            logger.error('Failed to delete user ' + err)
            res.status(500).send({ err: 'Failed to delete user' })
        }
        console.log('Unexpected error', err);
    }
}

async function updateUser(req: Request, res: Response) {
    try {
        const user: User = req.body
        const savedUser: User = await userService.update(user)
        res.send(savedUser)
    } catch (err) {
        if (err instanceof Error) {
            logger.error('Failed to update user ' + err)
            res.status(500).send({ err: 'Failed to update user' })
        }
        console.log('Unexpected error', err);
    }
}



module.exports = {
    getUser,
    getUsers,
    deleteUser,
    updateUser,
}
