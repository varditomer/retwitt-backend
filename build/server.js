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
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const dotenv = __importStar(require("dotenv"));
const app = express();
const http = require('http').createServer(app);
// Express App Config
app.use(cookieParser());
app.use(express.json());
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'build')));
}
else {
    const corsOptions = {
        origin: ['http://127.0.0.1:5173', 'http://localhost:5173', 'http://localhost:8080', 'http://127.0.0.1:3000', 'http://localhost:3000'],
        credentials: true
    };
    app.use(cors(corsOptions));
}
const authRoutes = require('./api/auth/auth.routes');
const userRoutes = require('./api/user/user.routes');
const tweetRoutes = require('./api/tweet/tweet.routes');
// routes
const setupAsyncLocalStorage = require('./middlewares/setupAls.middleware');
app.all('*', setupAsyncLocalStorage);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/tweet', tweetRoutes);
// app.use('/api/car', (req: Request, res: Response) => {
//     res.send('Not implemented, get from misterBackend...')
// })
// setupSocketAPI(http)
// Make every server-side-route to match the index.html
// so when requesting http://localhost:3030/index.html/car/123 it will still respond with
// our SPA (single page app) (the index.html file) and allow vue/react-router to take it from there
app.get('/**', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
dotenv.config();
const logger = require('./services/logger.service');
const port = process.env.PORT;
http.listen(port, () => {
    logger.info('Server is running on port: ' + port);
});
