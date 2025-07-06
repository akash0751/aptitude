const AptitudeComment = require('../models/Comment');
const AptitudeNotification = require('../models/notification');


const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { postId } = req.params;
    const comment = await AptitudeComment.create({
      postId,
      commenter: req.user.userId,
      text
    });
    await AptitudeNotification.create({
      user: req.body.postOwnerId,
      message: `Someone commented on your post.`
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: "Failed to add comment." });
  }
};

const getComments = async (req, res) => {
  try {
    const comments = await AptitudeComment.find({ postId: req.params.postId })
      .populate("commenter", "name");
    res.status(200).json(comments); // ✅ plain array
  } catch (error) {
    console.error("❌ Comment Fetch Error:", error);
    res.status(500).json({ error: "Failed to fetch comments." });
  }
};


module.exports = {addComment, getComments};