const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "AptitudeProfile", required: true },
  caption: String,
  image: String,
  category : String,
}, { timestamps: true });
const AptitudePost = mongoose.model("AptitudePost", postSchema);
module.exports = AptitudePost;