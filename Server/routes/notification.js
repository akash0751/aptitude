const express = require('express');
const router = express.Router();
const {getNotifications, markAsRead } = require('../controller/notification');
const authMiddleware = require('../middleware/userAuth')

router.get('/', authMiddleware, getNotifications);
router.post('/mark', authMiddleware, markAsRead);

module.exports = router;