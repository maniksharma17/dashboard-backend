import express from 'express'
const router = express.Router()
import { getUser, getDashboard } from '../controllers/general.js'

router.get('/user/:id', getUser);
router.get('/dashboard', getDashboard);

export default router