import mongoose from 'mongoose'
import { channelZodSchema } from '../utils/validation.js'

const { Schema } = mongoose

const channelSchema = new Schema({
    channelId: {
        type: String,
        required: true,
    },
    users: [
        {
            userName: {
                type: String,
                required: true,
            },
            firstName: {
                type: String,
                required: true,
            },
            lastName: {
                type: String,
                required: true,
            },
            createdAt: {
                type: String,
                required: false,
            },
        },
    ],
    createdAt: {
        type: Date,
        required: true,
    },
})

channelSchema.pre('save', async function (next) {
    try {
        const channel = this
        channelZodSchema.parse(channel)
        next()
    } catch (error) {
        next(error)
    }
})

const Channel = mongoose.model('Channel', channelSchema)
export default Channel
