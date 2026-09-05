import { Router } from "express";
import authenticate from "../../middleware/auth.middleware.js";
import authorize from "../../middleware/authorize.middleware.js";
import validate, { validateParams } from "../../middleware/validate.middleware.js";
import { cancel, create, getOne, list, pay, updateStatus } from "./order.controller.js";
import { createOrderSchema, orderIdSchema, orderStatusSchema } from "./order.validation.js";

const router = Router();
router.use(authenticate);

router.get("/", list);
router.post("/", validate(createOrderSchema), create);
router.get("/:id", validateParams(orderIdSchema), getOne);
router.post("/:id/pay", validateParams(orderIdSchema), pay);
router.post("/:id/cancel", validateParams(orderIdSchema), cancel);
router.patch(
  "/:id/status",
  authorize("ADMIN"),
  validateParams(orderIdSchema),
  validate(orderStatusSchema),
  updateStatus
);

export default router;
