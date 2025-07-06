const mongoose = require("mongoose");
const privateReplySchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "AptitudePost", required: true },
  from: { type: mongoose.Schema.Types.ObjectId, ref: "AptitudeUser", required: true },
  to: { type: mongoose.Schema.Types.ObjectId, ref: "AptitudeUser", required: true },
  text: { type: String, required: true },
}, { timestamps: true });
const AptitudePrivateReply = mongoose.model("AptitudePrivateReply", privateReplySchema);
module.exports = AptitudePrivateReply;