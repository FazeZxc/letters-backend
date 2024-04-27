import express from 'express'
import mongoose, { mongo } from 'mongoose'
import cors from 'cors'
import authRouter from './routes/authRoutes.js'
import { createServer } from 'http'
import { Server } from 'socket.io'
import dotenv from 'dotenv'
import channelRouter from './routes/channelRoutes.js'
import Message from './models/Message.js'
import { userRouter } from './routes/userRoutes.js'
dotenv.config()

if (process.env.NODE_ENV === 'production') {
    dotenv.config({ path: './env/production.env' })
} else if (process.env.NODE_ENV === 'test') {
    dotenv.config({ path: './env/test.env' })
} else {
    dotenv.config({ path: './env/development.env' })
}

const PORT = process.env.PORT
export const BACKEND_URL = process.env.BACKEND_URL
export const FRONTEND_URL = process.env.FRONTEND_URL
export const DB_URI = process.env.DB_URI_DEV
export const JWT_SECRET = process.env.JWT_SECRET

export const EMAIL_NODEMAILER = process.env.EMAIL_NODEMAILER
export const PASSWORD_NODEMAILER = process.env.PASSWORD_NODEMAILER
const app = express()
const http = createServer(app)

// EXPRESS MIDDLEWARES
app.use(express.json())
app.use(
    cors({
        origin: FRONTEND_URL,
    })
)

app.use('/auth', authRouter)
app.use('/channel', channelRouter)
app.use('/user', userRouter)
// SOCKET
let users = []

export const io = new Server(http, {
    cors: { origin: FRONTEND_URL },
})

io.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`)
    socket.on('message', (data) => {
        io.emit('messageResponse', data)
        console.log(data);
        console.log(socket.handshake.query);
        Message.create({
            author: socket.handshake.query.userName,
            sentAt: new Date(),
            channelId: socket.handshake.query.channelId,
            message: data.text,
        })
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
    console.log('Server started at: ' + BACKEND_URL)
})
