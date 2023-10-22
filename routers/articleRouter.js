import express from "express";
import verifyUser from "../middleware/verifyUser.js";
import {
  createArticle,
  getAllArticles,
  getSingleArticle,
  updateArticle,
  deleteArticle,
  publishArticle,
  unpublishArticle,
  getAllArticlesPrivate,
} from "../controllers/articleController.js";

const router = express();

router.route("/posts").get(getAllArticles);
router.post("/posts", verifyUser, createArticle);

router.patch("/posts/publish/:id", verifyUser, publishArticle);
router.patch("/posts/unpublish/:id", verifyUser, unpublishArticle);

router.get("/users/posts", verifyUser, getAllArticlesPrivate);
router
  .route("/posts/:id")
  .get(getSingleArticle)
  .patch(verifyUser, updateArticle)
  .delete(verifyUser, deleteArticle);

export { router as articleRouter };
