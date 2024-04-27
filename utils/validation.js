import { z } from 'zod'

export const userZodSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    userName: z.string(),
    email: z.string().email(),
    password: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
})

export const channelZodSchema = z.object({
    channelId: z.string(),
    users: z
        .object({
            userName: z.string(),
            firstName: z.string(),
            lastName: z.string(),
            createdAt: z.string().optional(),
        })
        .array(),
    createdAt: z.date(),
})

export const messageZodSchema = z.object({
    message: z.string(),
    sentAt: z.date(),
    author: z.string(),
})
