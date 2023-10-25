import express from "express";
import verifyUser from "../middleware/verifyUser.js";
import {postComment, getComments} from '../controllers/commentController.js'
const router = express();

router.get("/posts/:id/comments", verifyUser, getComments);
router.post("/posts/:id/comment", verifyUser, postComment);

export { router as commentRouter };
