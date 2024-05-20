import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import 'dotenv/config'
//----- router區 -----
import demo from './src/router/demo.js'
//----- router區 -----

const app = express()
app.use(helmet()) //防網頁資安漏洞
app.use(cors())
app.use(cookieParser())
app.use(express.json())

app.use('/demo', demo)

app.listen(process.env.PORT, () => console.log(`server is started at port ${process.env.PORT}`))
