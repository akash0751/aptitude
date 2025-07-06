const express = require('express')
const router = express.Router()
const {registerForm, otpVerify, login, forgotPassword, verifyOtp, resetPassword,refreshToken} = require('../controller/register')

router.post('/user',registerForm)
router.post('/verifyUser',otpVerify)
router.post('/login',login)
router.post('/forgotPassword',forgotPassword)
router.post('/verifyOtp',verifyOtp)
router.post('/resetPassword',resetPassword)
router.post('/refresh-token',refreshToken)

module.exports = router