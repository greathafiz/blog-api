import mongoose from "mongoose";

const BlogCommentSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  body: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  article: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Article",
  },
});

export default mongoose.model("Comment", BlogCommentSchema);
