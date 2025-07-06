const express = require('express');
const router = express.Router();
const {addProfile, getProfile, updateProfile,getProfileByUserId} = require('../controller/profile')
const {profileFiles} = require('../middleware/userProfile')
const authMiddleware = require('../middleware/userAuth')

router.post('/addProfile',authMiddleware,profileFiles,addProfile)
router.get('/getProfile/:userId',getProfile)
router.put('/updateProfile',authMiddleware,profileFiles,updateProfile)


module.exports = router;