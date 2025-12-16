import express from "express"
// import { signup } from "../controllers/userController";
import {allUsers, myData, signup, userLogin, userLogout} from '../controllers/userController.js'
import { verifyToken } from "../middleware/auth.js"

const router = express.Router()

router.get('/',verifyToken,allUsers)
router.get('/me',verifyToken,myData)
router.post('/signup',verifyToken,signup)
router.post('/login',userLogin);
router.post('/logout',userLogout)

export default router;