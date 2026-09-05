import { Router } from "express";
import { getMe, login, logout, register, updateMe } from "./auth.controller.js";
import validate from '../../middleware/validate.middleware.js';
import { loginSchema, registerSchema, updateProfileSchema } from "./auth.validation.js"
import authenticate from "../../middleware/auth.middleware.js";
import rateLimit from "express-rate-limit";


const router = Router();
const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 20,
	standardHeaders: "draft-8",
	legacyHeaders: false,
	message: {
		success: false,
		message: "Too many authentication attempts. Please try again later.",
	},
});

router.post("/register", authLimiter, validate(registerSchema), register);
router.post("/login", authLimiter, validate(loginSchema), login);
router.get("/me", authenticate, getMe);
router.patch("/me", authenticate, validate(updateProfileSchema), updateMe);
router.post("/logout", authenticate, logout);

export default router;