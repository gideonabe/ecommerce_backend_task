import { Router } from "express";
import { getMe, login, register } from "./auth.controller.js";
import validate from '../../middleware/validate.middleware.js';
import { loginSchema, registerSchema } from "./auth.validation.js"
import authenticate from "../../middleware/auth.middleware.js";


const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", authenticate, getMe);

export default router;