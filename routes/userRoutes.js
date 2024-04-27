import express from 'express'
import { getUser } from '../controllers/userController.js'

export const userRouter = express.Router()

userRouter.post('/', getUser)
