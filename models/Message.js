import mongoose from 'mongoose'
import { messageZodSchema } from '../utils/validation.js'

const { Schema } = mongoose

const messageSchema = new Schema({
    message: {
        type: String,
        required: true,
    },
    sentAt: {
        type: Date,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    channelId: {
        type: String,
        required: true,
    },
})

messageSchema.pre('save', async function (next) {
    try {
        const message = this
        messageZodSchema.parse(message)
        next()
    } catch (error) {
        next(error)
    }
})

const Message = mongoose.model('Message', messageSchema)
export default Message
