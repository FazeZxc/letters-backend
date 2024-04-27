import Channel from '../models/Channel.js'
import Message from '../models/Message.js'

export const getChannels = async (req, res) => {
    const { userName } = req.body
    console.log(userName);
    try {
        const channels = await Channel.find({})
        const filteredChannels = channels.filter((channel) => {
            console.log(channel.users);
            return channel.users.some((user) => user.userName === userName)
        })

        console.log(filteredChannels)

        res.status(200).json(filteredChannels)
    } catch (error) {
        return res.status(500).json({ error: 'Error fetching channels' })
    }
}

export const getMessagesFromChannel = async (req, res) => {
    const { channelId } = req.params
    console.log(channelId)
    const { users } = req.body
    console.log(users)
    const channel = await Channel.findOne({ channelId: channelId })
    try {
        console.log(channel)
        if (channel == null) {
            const newChannel = await Channel.create({
                channelId: channelId,
                users: users,
                createdAt: new Date(),
            })
            console.log(newChannel)
            res.status(200).json(newChannel)
        } else {
            const messagesInTheChannel = await Message.find({
                channelId: channelId,
            })
            res.status(200).json({
                users: channel.users,
                createdAt: channel.createdAt,
                messages: messagesInTheChannel,
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Error while fetching messages.' })
    }
}
