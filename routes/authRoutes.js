import express from 'express'

import {
    forgotPassword,
    registerUser,
    resetPassword,
    userLogin,
} from '../controllers/authController.js'

const authRouter = express.Router()

// sign up  route
authRouter.post('/register', registerUser)

// sign in route
authRouter.post('/login', userLogin)

// forgot password route
// authRouter.post('/forgot-password', forgotPassword)

// reset password route
// authRouter.post('/reset-password', resetPassword)

export default authRouter
