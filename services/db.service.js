const MongoClient = require('mongodb').MongoClient

const config = require('../config')
import * as dotenv from "dotenv"

module.exports = {
    getCollection
}

var dbConn = null

async function getCollection(collectionName) {
    try {    
        dotenv.config()
        console.log(`process.env.DB_CONN_STRING:`, process.env.DB_CONN_STRING)
        console.log(`process.env.DB_NAME:`, process.env.DB_NAME)
        const db = await _connectToDatabase()    
        const collection = await db.collection(collectionName)
        return collection
    } catch (err) {
        logger.error('Failed to get Mongo collection', err)
        throw err
    }
}

async function _connectToDatabase() {
    if (dbConn) return dbConn
    try {
        const client = await MongoClient.connect(config.dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
        const db = client.db(config.dbName)
        dbConn = db
        return db
    } catch (err) {
        logger.error('Cannot Connect to DB', err)
        throw err
    }
}




