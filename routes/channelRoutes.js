import express from 'express'
import {
    getChannels,
    getMessagesFromChannel,
} from '../controllers/channelController.js'

const channelRouter = express.Router()
channelRouter.post('/', getChannels)
channelRouter.post('/:channelId', getMessagesFromChannel)

export default channelRouter
