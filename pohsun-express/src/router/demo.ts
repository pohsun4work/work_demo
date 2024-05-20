import { createRouter, db, jwtVerify, bodyChecker } from '@/helper/import.js'
import { encodeJWT } from '@/helper/jwt.js'
import bcrypt from 'bcrypt'

const router = createRouter()

router.get('/', async (_, res) => {
  // knex範例
  // select account from user where name = '測試人員'
  await db('user')
    .where('name', '測試人員')
    .select('account')
    .then((result) => {
      res.status(200).send(result)
    })
    .catch(() => res.status(500).send())
})

//需要登入(有jwt)才能用的api要加上jwtVerify
router.get('/jwtdemo', jwtVerify, (_, res) => {
  //res.locals.userInfo可以拿到登入者資訊

  res.status(200).send(res.locals.userInfo)
})

// 登入, JWT使用實例
router.post('/login', bodyChecker({ account: 'string', password: 'string' }), async (req, res) => {
  const { account, password } = req.body

  const theUser = await db('user').where('account', account).first('password')
  const isVerified = await bcrypt.compare(password, theUser?.password ?? '')
  if (!isVerified) return res.status(401).end()

  const expired = Math.floor(
    new Date().setHours(new Date().getHours() + Number(process.env.EXPIRED!)) / 1000
  )
  const jwt = encodeJWT(
    { iss: process.env.ISSUER!, sub: process.env.SUBJECT!, exp: expired, account: account },
    process.env.SECUREKEY!
  )

  res.cookie('userJWT', jwt, { httpOnly: true, secure: true, sameSite: 'strict' })
  res.status(200).end()
})

export default router
