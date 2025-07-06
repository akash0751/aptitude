const AptitudeNotification = require("../models/notification");
const AptitudePrivateReply = require("../models/privateReply");

const sendReply = async (req, res) => {
  try {
    const { text, toUserId } = req.body;
    const { postId } = req.params;
    const reply = await AptitudePrivateReply.create({
      postId,
      from: req.user.userId,
      to: toUserId,
      text
    });
    await AptitudeNotification.create({
      user: toUserId,
      message: `You received a private reply on your post.`
    });
    res.status(201).json(reply);
  } catch (error) {
    res.status(500).json({ error: "Failed to send private reply." });
  }
};

const getInbox = async (req, res) => {
  try {
    const replies = await AptitudePrivateReply.find({ to: req.user.userId })
      .populate("from", "name")
      .populate("postId", "caption");
    res.status(200).json(replies);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch inbox." });
  }
};

module.exports = { sendReply, getInbox };