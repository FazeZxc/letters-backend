import express from 'express'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import nodemailer from 'nodemailer'
import { EMAIL_NODEMAILER, JWT_SECRET, PASSWORD_NODEMAILER } from '../app.js'

//REGISTER
export const registerUser = async (req, res) => {
    const { firstName, lastName, userName, email, password } = req.body
    try {
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
        const user = await User.create({
            firstName: firstName,
            lastName: lastName,
            userName: userName,
            email: email,
            password: hash,
            createdAt: new Date(),
            updatedAt: new Date(),
        })
        console.log('User registered', user.userName)
        res.status(201).json(user)
    } catch (error) {
        console.log(error)
        res.status(501).json({ error: 'Error while registration' })
    }
}

//AUTOLOGIN
export const autoUserLogin = async (req, res) => {
    const { token } = req.body
    console.log(token)
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' })
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        const userId = decoded.userId

        const user = await User.findById(userId)

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' })
        }
        res.status(200).json({ user, token })
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized' })
    }
}

//LOGIN
export const userLogin = async (req, res) => {
    const { userName, password } = req.body
    try {
        const user = await User.findOne({ userName: userName })

        if (!user) {
            return res
                .status(401)
                .json({ error: 'Invalid username or password' })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res
                .status(401)
                .json({ error: 'Invalid username or password' })
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
            expiresIn: '1h',
        })

        res.status(200).json({ user, token })
    } catch (error) {
        console.log(error)
        res.status(501).json({ error: 'Error while login' })
    }
}

//FORGOT PASSWORD

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: '',
        pass: '',
    },
})

export const forgotPassword = async (req, res) => {
    const { email } = req.body
    try {
        const user = await User.findOne({ email: email })

        if (!user) {
            return res
                .status(400)
                .json({ error: 'User with this email does not exist' })
        }

        const resetToken = uuidv4()

        const tokenExpiration = new Date()
        tokenExpiration.setHours(tokenExpiration.getHours() + 1)

        user.resetToken = resetToken
        user.resetTokenExpiration = tokenExpiration
        await user.save()
        const mailOptions = {
            from: 'randomuploader.en@gmail.com',
            to: email,
            subject: 'Password Reset Request',
            html: `<p>You have requested a password reset. Click <a href="http://localhost:3000/auth/reset-password?token=${resetToken}">here</a> to reset your password.</p>`,
        }

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error)
                return res
                    .status(500)
                    .json({ error: 'Error while sending reset email' })
            }
            console.log('Reset email sent:', info.response)
            res.status(200).json({ message: 'Reset email sent successfully' })
        })
    } catch (error) {
        console.log(error)
        res.status(501).json({ error: 'Error while recovering your account' })
    }
}
//RESET PASSWORD
export const resetPassword = async (req, res) => {
    const { resetToken, newPassword } = req.body
    try {
        const user = await User.findOne({
            resetToken: resetToken,
            resetTokenExpiration: { $gt: Date.now() },
        })

        if (!user) {
            return res
                .status(400)
                .json({ error: 'Invalid or expired reset token' })
        }

        const hash = await bcrypt.hash(newPassword, 10)

        user.password = hash
        user.resetToken = undefined
        user.resetTokenExpiration = undefined
        await user.save()

        res.status(200).json({ message: 'Password reset successfully' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Couldn't reset password" })
    }
}
