import Article from "../models/Article.js";
import User from "../models/User.js";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../errors/index.js";
import { StatusCodes } from "http-status-codes";

const createArticle = async (req, res) => {
  const { firstName, lastName } = await User.findOne({ _id: req.user.userId });

  const { title, body, tags } = req.body;

  const isTitle = await Article.findOne({
    title: title,
    "author.id": req.user.userId,
  });

  if (isTitle) {
    throw new BadRequestError(
      `One of your articles already has this title. Please choose another title`
    );
  }

  const newBlogArticle = new Article({
    title,
    body,
    tags,
    author: {
      id: req.user.userId,
      name: `${firstName} ${lastName}`,
    },
  });
  await newBlogArticle.save();
  res.status(StatusCodes.CREATED).json({
    status: "success",
    message: `Your article has been created. Click "Publish" to get it live.`,
    newBlogArticle,
  });
};

const publishArticle = async (req, res) => {
  const { id: articleId } = req.params;
  const article = await Article.findOneAndUpdate(
    { _id: articleId, "author.id": req.user.userId },
    { state: "published" },
    {
      runValidators: true,
      new: true,
    }
  );

  if (!article) {
    throw new NotFoundError(`Sorry. Article with id: ${articleId} not found`);
  }

  res
    .status(StatusCodes.OK)
    .json({ status: "success", message: "Your article is live" });
};

const unpublishArticle = async (req, res) => {
  const { id: articleId } = req.params;
  const article = await Article.findOneAndUpdate(
    { _id: articleId, "author.id": req.user.userId },
    { state: "draft" },
    {
      runValidators: true,
      new: true,
    }
  );

  if (!article) {
    throw new NotFoundError(`Sorry. Article with id: ${articleId} not found`);
  }

  res
    .status(StatusCodes.OK)
    .json({ status: "success", message: "Your article is saved to draft" });
};

const getAllArticles = async (req, res) => {
  const articles = await Article.find({ state: "published" }).sort({
    createdAt: -1,
  });

  return res
    .status(StatusCodes.OK)
    .json({ status: "success", articles, total: articles.length });
};

const getAllArticlesPrivate = async (req, res) => {
  // filter by 'draft' || 'published' (as specified by the user)
  const {
    query: { state },
    user: { userId },
  } = req;

  if (state) {
    const articles = await Article.find({ state: state, "author.id": userId });
    return res
      .status(StatusCodes.OK)
      .json({ status: "success", articles, total: articles.length });
  } else {
    // else fetch the whole articles linked with the user
    const articles = await Article.find({ "author.id": userId });
    return res
      .status(StatusCodes.OK)
      .json({ status: "success", articles, total: articles.length });
  }
};

const getSingleArticle = async (req, res) => {
  const { id: articleId } = req.params;

  const article = await Article.findOne({ _id: articleId });

  if (!article) {
    throw new NotFoundError(`There's no article with id: ${articleId}`);
  }

  if (article.state === "draft") {
    return res.redirect("/api/v1/posts");
  }
  res.status(StatusCodes.OK).json({ status: "success", article });
};

const updateArticle = async (req, res) => {
  const {
    user: { userId },
    params: { id: articleId },
  } = req;

  const article = await Article.findOneAndUpdate(
    { _id: articleId, "author.id": userId },
    req.body,
    {
      runValidators: true,
      new: true,
    }
  );

  if (!article) {
    throw new NotFoundError(`There's no article with id: ${articleId}`);
  }
  res
    .status(StatusCodes.OK)
    .json({ status: "success", message: "Updated successfully", article });
};

const deleteArticle = async (req, res) => {
  const {
    user: { userId },
    params: { id: articleId },
  } = req;

  const article = await Article.findOneAndRemove({
    _id: articleId,
    "author.id": userId,
  });
  if (!article) {
    throw new NotFoundError(`There's no article with id: ${articleId}`);
  }
  res
    .status(StatusCodes.OK)
    .json({ status: "success", message: "Article successfully deleted" });
};

export {
  createArticle,
  publishArticle,
  unpublishArticle,
  getAllArticles,
  getAllArticlesPrivate,
  getSingleArticle,
  updateArticle,
  deleteArticle,
};
