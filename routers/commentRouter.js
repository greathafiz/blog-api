import express from "express";
import {postComment, getComments} from '../controllers/commentController.js'
const router = express();

router.get("/posts/:id/comments", getComments);
router.post("/posts/:id/comment", postComment);

export { router as commentRouter };
