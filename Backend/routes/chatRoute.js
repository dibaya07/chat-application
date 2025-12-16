import express from "express"
// import { postMessage } from "../controllers/chatController.js";
import { verifyToken } from "../middleware/auth.js";
import {allMessages} from "../controllers/chatController.js"

const router = express.Router();

// router.post('/:id',postMessage) 
router.get('/', verifyToken, allMessages)

export default router;