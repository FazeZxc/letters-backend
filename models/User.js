import mongoose from 'mongoose'
import { z } from 'zod'

const { Schema } = mongoose

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    resetToken: {
        type: String,
        required: false,
    },
    resetTokenExpiration: {
        type: Date,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
        required: true,
    },
})

const userZodSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    userName: z.string(),
    email: z.string().email(),
    password: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
})

userSchema.pre('save', async function (next) {
    try {
        const user = this
        userZodSchema.parse(user)
        next()
    } catch (error) {
        next(error)
    }
})

const User = mongoose.model('User', userSchema)
export default User
