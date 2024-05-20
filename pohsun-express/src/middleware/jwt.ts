import type { Request, Response, NextFunction } from 'express'
import { decodeJWT } from '@/helper/jwt.js'

const SECUREKEY = process.env.SECUREKEY!

/**
 * middleware，用於檢查jwt
 * - 是否存在
 * - 是否有效
 */
export const jwtVerify = (req: Request, res: Response, next: NextFunction) => {
  const jwtObject = decodeJWT(req.cookies.userJWT, SECUREKEY)

  if ('name' in jwtObject && 'message' in jwtObject) return res.status(401).send(jwtObject)

  const userInfo = {
    account: jwtObject.account
  }

  res.locals.userInfo = userInfo
  next()
}
