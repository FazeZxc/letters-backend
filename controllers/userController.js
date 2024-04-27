import User from '../models/User.js'

export const getUser = async (req, res) => {
    const { userName } = req.body
    try {
        const user = await User.findOne({ userName : userName })
        res.status(200).json(user)
    } catch (error) {
        console.log(error)
    }
}
