"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { AsyncLocalStorage } = require('async_hooks');
const asyncLocalStorage = new AsyncLocalStorage();
// The AsyncLocalStorage singleton
module.exports = asyncLocalStorage;
