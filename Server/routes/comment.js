const express = require('express');
const router = express.Router();
const {addComment, getComments} = require('../controller/comment');
const authMiddleware = require('../middleware/userAuth');

router.post('/:postId',authMiddleware, addComment)
router.get('/:postId', getComments);

module.exports = router;