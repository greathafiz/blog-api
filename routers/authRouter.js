import express from "express";
import verifyUser from "../middleware/verifyUser.js";
import { register, login, logout } from "../controllers/authController.js";
const router = express();

router.post("/auth/signup", register);
router.post("/auth/login", login);
router.get("/auth/logout", verifyUser, logout);

export { router as authRouter };
