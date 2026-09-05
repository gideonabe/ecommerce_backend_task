import { Router } from "express";
import authenticate from "../../middleware/auth.middleware.js";
import authorize from "../../middleware/authorize.middleware.js";
import validate, { validateParams, validateQuery } from "../../middleware/validate.middleware.js";
import { create, getOne, list, remove, update } from "./product.controller.js";
import {
  createProductSchema,
  productIdSchema,
  productQuerySchema,
  updateProductSchema,
} from "./product.validation.js";

const router = Router();

router.get("/", validateQuery(productQuerySchema), list);
router.get("/:id", validateParams(productIdSchema), getOne);
router.post("/", authenticate, authorize("ADMIN"), validate(createProductSchema), create);
router.patch(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  validateParams(productIdSchema),
  validate(updateProductSchema),
  update
);
router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  validateParams(productIdSchema),
  remove
);

export default router;
