import { Router } from "express";
import authRoutes from '../modules/auth/auth.routes.js';
import productRoutes from "../modules/products/product.routes.js";
import orderRoutes from "../modules/orders/order.routes.js";

const router = Router();

router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is healthy",
  });
});

// endpoint -> POST /api/v1/auth/register
router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/orders", orderRoutes);

export default router;
