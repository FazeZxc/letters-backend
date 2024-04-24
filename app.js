import express from 'express'
import mongoose, { mongo } from 'mongoose'
import cors from 'cors'
import authRouter from './routes/authRoutes.js'
import dotenv from 'dotenv'
dotenv.config()

if (process.env.NODE_ENV === 'production') {
    dotenv.config({ path: './env/production.env' })
} else if (process.env.NODE_ENV === 'test') {
    dotenv.config({ path: './env/test.env' })
} else {
    dotenv.config({ path: './env/development.env' })
}

const PORT = process.env.PORT
export const DB_URI = process.env.DB_URI_DEV
export const JWT_SECRET = process.env.JWT_SECRET

export const EMAIL_NODEMAILER = process.env.EMAIL_NODEMAILER
export const PASSWORD_NODEMAILER = process.env.PASSWORD_NODEMAILER
const app = express()
app.use(express.json())
app.use(cors())

app.use('/auth', authRouter)

app.get('/helloworld', (req, res) => {
    res.send('<h1>Hello World</h1>')
})

await mongoose
    .connect(DB_URI)
    .then(() => {
        console.log('Db connection established')
    })
    .catch((error) => {
        console.log(error)
    })

app.listen(PORT, () => {
    console.log('Server started at http://localhost:' + PORT)
})
