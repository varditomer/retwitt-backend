const logger = require('../services/logger.service')
import { Request, Response } from 'express'

function log(request: Request, response: Response, next: Function) {
  logger.info('Sample Logger Middleware')
  next()
}

// async function log(req, res, next) {
//   // logger.info('Sample Logger Middleware')
//   next()
// }

module.exports = {
  log
}
