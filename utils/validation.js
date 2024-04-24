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
