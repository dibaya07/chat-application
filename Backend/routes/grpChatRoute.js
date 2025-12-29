import express from 'express'
import { allGrpMsg } from '../controllers/grpChatController.js'

const router = express.Router()

router.get('/',allGrpMsg)

export default router;