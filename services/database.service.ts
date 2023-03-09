// External Dependencies
import * as mongoDB from "mongodb"
import * as dotenv from "dotenv"
const logger = require('../services/logger.service')


// Global Variables
export const collections: { users?: mongoDB.Collection } = {}

// Initialize Connection
let dbConn: any = null

async function getCollection(collectionName: string) {
    try {
        const db = await _connectToDatabase()
        const collection: mongoDB.Collection = await db.collection(collectionName)
        return collection
    } catch (err) {
        logger.error('Failed to get Mongo collection', err)
        throw err
    }
}

async function _connectToDatabase() {
    if (dbConn) return dbConn
    dotenv.config()
    try {
        let client: mongoDB.MongoClient
        if (process.env.NODE_ENV === 'production') client = new mongoDB.MongoClient(process.env.DB_CONN_STRING_PROD!)
        else client = new mongoDB.MongoClient(process.env.DB_CONN_STRING!)
        await client.connect()
        const db: mongoDB.Db = client.db(process.env.DB_NAME)
        dbConn = db
        return db
    } catch (err) {
        logger.error('Cannot Connect to DB', err)
        throw err
    }
}

module.exports = {
    getCollection
}