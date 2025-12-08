import express from "express";
import { register, login, forgotPassword, resetPassword, testRoute } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/test", testRoute);

export default router;
