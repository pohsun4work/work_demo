/*
 * manage commonly used import
 */

import express from 'express'

export const createRouter = () => express.Router()
export { knexConnection as db } from '@/db/config.js'
export { jwtVerify } from '@/middleware/jwt.js'
export { bodyChecker } from '@/middleware/bodyChecker.js'
