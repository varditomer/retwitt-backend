"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger = require('../services/logger.service');
function log(request, response, next) {
    logger.info('Sample Logger Middleware');
    next();
}
// async function log(req, res, next) {
//   // logger.info('Sample Logger Middleware')
//   next()
// }
module.exports = {
    log
};
