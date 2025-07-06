const AptitudePost = require('../models/post')
const AptitudeUser = require('../models/user')
const AptitudeProfile = require('../models/profile')
const path = require('path');
const fs = require('fs');
const addPost = async (req, res) => {
  try {
    const { caption, category } = req.body;
    const image = req.file;

    // 🔍 Find profile instead of user
    const profile = await AptitudeProfile.findOne({ user: req.user.userId });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    const post = await AptitudePost.create({
      author: profile._id, // ✅ Store the profile ID
      caption,
      category,
      image: image?.filename, // 🖼️ Store filename (not whole file object)
    });

    res.status(201).json({ message: 'Post created successfully', post });
  } catch (err) {
    console.error('Post creation error:', err);
    res.status(500).json({ message: 'Error creating post', error: err.message });
  }
};



const getPost = async (req, res) => {
  try {
    const posts = await AptitudePost.find().populate({
      path: 'author',
      model: 'AptitudeProfile',
      select: 'name role image',
    });

    const safePosts = posts.map(post => ({
      ...post.toObject(),
      author: post.author || {
        name: "Unknown",
        role: "Member",
        image: "",
      },
    }));

    res.status(200).json({ post: safePosts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getsPost = async (req, res) =>{
    try{
        const post = await AptitudePost.find({author:req.params.userId})
        res.status(200).json({posts:post});
        }catch(err){
            res.status(500).json({message:err.message})
        }
}
const getPostById = async (req, res) =>{
    try{
        const id = req.params.userId
        const post = await AptitudePost.findById(id)
        res.status(200).json({post})
    }catch{
        res.status(500).json({message:"Error fetching post by id"})
    }
}

// In your backend controller (e.g., postController.js)
const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { caption, category } = req.body;

    const updated = await AptitudePost.findByIdAndUpdate(
      postId,
      { caption, category },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json({ message: 'Post updated successfully', post: updated });
  } catch (err) {
    console.error('Update Post Error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const deleted = await AptitudePost.findByIdAndDelete(postId);
    if (!deleted) return res.status(404).json({ message: "Post not found" });

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error deleting post" });
  }
};


module.exports = {addPost,getPost,getPostById,getsPost,deletePost,updatePost}