import express from 'express'
import { editProfile, followOrunfollow, getprofile, getSuggestedUsers, login, logout, register } from '../controllers/user.controller.js'
import isAuthenticated from '../middlewares/authenticated.js'
import upload from '../middlewares/multer.js'
const router = express.Router()

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/logout').get(logout)
router.route('/:id/profile').get(isAuthenticated,getprofile)
router.route('/profile/edit').post(isAuthenticated,upload.single("profilePicture"),editProfile)
router.route('/suggested').get(isAuthenticated,getSuggestedUsers)
router.route('/followorunfollow/:id').post(isAuthenticated,followOrunfollow)
export default router





