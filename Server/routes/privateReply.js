const express = require('express');
const router = express.Router();
const {sendReply, getInbox} = require('../controller/privateReply')
const authMiddleware = require('../middleware/userAuth')

router.post('/:postId',authMiddleware,sendReply)
router.get('/:postId',authMiddleware,getInbox)

module.exports = router;