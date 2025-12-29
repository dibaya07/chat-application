import express from "express"
import {  allGrps, createGrp } from "../controllers/grpController.js";

const router = express.Router()

router.post('/create',createGrp)
router.get('/',allGrps)

export default router;