import express from 'express'
import mongoose, { mongo } from 'mongoose'
import cors from 'cors'
import authRouter from './routes/authRoutes.js'
import { createServer } from 'http'
import { Server } from 'socket.io'
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
const http = createServer(app)

// EXPRESS MIDDLEWARES
app.use(express.json())
app.use(cors())
app.use('/auth', authRouter)

// SOCKET
let users = []

export const io = new Server(http, {
    cors: { origin: 'https://letters-frontend.vercel.app' },
})

io.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`)
    socket.on('message', (data) => {
        io.emit('messageResponse', data)
    })
    socket.on('newUser', (data) => {
        users.push(data)
        io.emit('newUserResponse', users)
    })
    socket.on('typing', (data) => socket.broadcast.emit('typingResponse', data))
    socket.on('disconnect', () => {
        console.log('🔥: A user disconnected')
        users = users.filter((user) => user.socketID !== socket.id)
        io.emit('newUserResponse', users)
        socket.disconnect()
    })
})
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

http.listen(PORT, () => {
    console.log('Server started')
})
