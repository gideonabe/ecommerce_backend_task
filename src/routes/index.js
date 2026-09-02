import { Router } from "express";
import authRoutes from '../modules/auth/auth.routes.js';

const router = Router();

router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is healthy",
  });
});

// endpoint -> POST /api/v1/auth/register
router.use("/auth", authRoutes);

export default router;
