import express from "express";
import verifyUser from "../middleware/verifyUser.js";
import { register, login, logout } from "../controllers/authController.js";
const router = express();

router.post("/signup", register);
router.post("/login", login);
router.get("/logout", verifyUser, logout);

export { router as authRouter };
