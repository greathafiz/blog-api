import Article from "../models/Article.js";
import Comment from "../models/Comment.js";
import { StatusCodes } from "http-status-codes";

const postComment = async (req, res) => {
  const articleId = req.params.id;
  const comment = new Comment({
    createdBy: req.user.userId,
    body: req.body.body,
    article: articleId,
  });
  await comment.save();

  const articleRelated = await Article.findById(articleId);
  articleRelated.comments.push(comment._id);
  await articleRelated.save();

  res.status(StatusCodes.OK).json({ status: "success", comment });
};

// get the comments for a particular article
const getComments = async (req, res) => {
  const articleId = req.params.id;
    const comments = await Comment.find({article: articleId})

    res.status(StatusCodes.OK).json({status: "success", comments, total: comments.length})
};

export { postComment, getComments };
