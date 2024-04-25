import jwt from 'jsonwebtoken'
import { JWT_SECRET, io } from '../app'

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized' })
        }
        req.userId = decoded.userId
        next()
    })
}

io.use(function (socket, next) {
    if (socket.handshake.query && socket.handshake.query.token) {
        jwt.verify(
            socket.handshake.query.token,
            JWT_SECRET,
            function (err, decoded) {
                if (err) return next(new Error('Authentication error'))
                socket.decoded = decoded
                next()
            }
        )
    } else {
        next(new Error('Authentication error'))
    }
})

export default verifyToken
