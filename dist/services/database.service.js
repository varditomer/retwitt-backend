"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// Internal Dependencies
const logger = require('../services/logger.service');
// External Dependencies
const mongoDB = __importStar(require("mongodb"));
const dotenv = __importStar(require("dotenv"));
// Initialize Connection
let dbConn = null;
function getCollection(collectionName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const db = yield _connectToDatabase();
            const collection = yield db.collection(collectionName);
            return collection;
        }
        catch (err) {
            logger.error('Failed to get Mongo collection', err);
            throw err;
        }
    });
}
function _connectToDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        if (dbConn)
            return dbConn;
        dotenv.config();
        try {
            let client;
            if (process.env.NODE_ENV === 'production') {
                logger.info(`getting mongoDB for ${process.env.NODE_ENV}`);
                client = new mongoDB.MongoClient(process.env.DB_CONN_STRING_PROD);
            }
            else {
                logger.info(`getting mongoDB for ${process.env.NODE_ENV}`);
                client = new mongoDB.MongoClient(process.env.DB_CONN_STRING);
            }
            yield client.connect();
            const db = client.db(process.env.DB_NAME);
            dbConn = db;
            return db;
        }
        catch (err) {
            logger.error('Cannot Connect to DB', err);
            throw err;
        }
    });
}
module.exports = {
    getCollection
};
