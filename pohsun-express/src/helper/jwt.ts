import jwt, { type JwtPayload } from 'jsonwebtoken'

/**
 * 產生jwt
 * @param { object } payload payload物件
 * @param { string } securekey 密鑰
 * @returns { string } jwt字串
 */
function encodeJWT(payload: object, securekey: string): string
/**
 * 產生jwt
 * @param { string } iss issuer(發行者)
 * @param { string } sub subject(接收者)
 * @param { string } securekey 密鑰
 * @returns { string } jwt字串
 */
function encodeJWT(iss: string, sub: string, securekey: string): string
/**
 * 產生jwt
 * @param { string } iss issuer(發行者)
 * @param { string } sub subject(接收者)
 * @param { number } exp expired(過期時間，unix時間戳記)
 * @param { string } securekey 密鑰
 * @returns { string } jwt字串
 */
function encodeJWT(iss: string, sub: string, exp: number, securekey: string): string
/**
 * 產生jwt
 * @param { string } iss issuer(發行者)
 * @param { string } sub subject(接收者)
 * @param { number } exp expired(過期時間，unix時間戳記)
 * @param { object } payload payload物件
 * @param { string } securekey 密鑰
 * @returns { string } jwt字串
 */
function encodeJWT(
  iss: string,
  sub: string,
  exp: number,
  payload: object,
  securekey: string
): string

function encodeJWT(
  arg1: object | string,
  arg2: string,
  arg3?: number | string,
  arg4?: object | string,
  arg5?: string
): string {
  if (typeof arg1 === 'object') return jwt.sign(arg1, arg2)

  let tmp: JwtPayload = { iss: arg1, sub: arg2 }
  if (typeof arg3 === 'string') return jwt.sign(tmp, arg3)

  tmp = { ...tmp, exp: arg3 }
  if (typeof arg4 === 'string') return jwt.sign(tmp, arg4)

  tmp = { ...tmp, ...arg4 }
  return jwt.sign(tmp, arg5!)
}

/**
 * 解析jwt
 * @param { string } authorization jwt字串
 * @param { string } securekey 密鑰
 * @returns { JwtPayload | JwtError } jwt.payload 或 錯誤訊息
 */
const decodeJWT = (authorization: string, securekey: string): JwtPayload | JwtError => {
  let result: JwtPayload | JwtError = { name: 'JsonWebTokenError', message: 'jwt verify error' }

  jwt.verify(authorization, securekey, (err, decoded) => {
    result = err ? { name: err.name, message: err.message } : (decoded as JwtPayload)
  })

  return result
}

export { encodeJWT, decodeJWT }

interface JwtError {
  name: string
  message: string
}
