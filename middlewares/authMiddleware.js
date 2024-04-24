import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../app'

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
export default verifyToken
