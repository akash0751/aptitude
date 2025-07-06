const express = require('express');
const router = express.Router();
const {addPost, getPost, getPostById, getsPost, updatePost, deletePost} = require('../controller/post')
const {uploadFiles} = require('../middleware/ImageAuth')
const authMiddleware = require('../middleware/userAuth')
const multer = require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // adjust path as needed
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

router.post('/addPost',authMiddleware,uploadFiles,addPost)
router.get('/getPost',getPost)
router.get('/getPostById/:userId',authMiddleware,getPostById)
router.get('/getPosts/:userId',authMiddleware,getsPost)
router.put('/updatePost/:postId',authMiddleware,upload.single('image'),updatePost)
router.delete('/deletePost/:postId',authMiddleware,deletePost)

module.exports = router;