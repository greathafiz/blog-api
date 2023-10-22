import mongoose from "mongoose";

const ArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Provide a title for the blog post"],
      trim: true,
    },
    body: {
      type: String,
      required: [true, "No content"]
      // trim: true,
    },
    author: {
      type: Object,
      required: true,
    },
    read_count: {
      type: Number,
      default: 0,
    },
    state: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    tags: [
      {
        type: String,
        required: true,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Article", ArticleSchema);
