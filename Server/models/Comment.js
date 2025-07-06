const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "AptitudePost", required: true },
  commenter: { type: mongoose.Schema.Types.ObjectId, ref: "AptitudeUser", required: true },
  text: { type: String, required: true },
}, { timestamps: true });
const AptitudeComment = mongoose.model("AptitudeComment", commentSchema);
module.exports = AptitudeComment;