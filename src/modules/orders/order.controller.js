import asyncHandler from "../../utils/asyncHandler.js";
import sendResponse from "../../utils/sendResponse.js";
import {
  cancelOrder,
  createOrder,
  getOrder,
  listOrders,
  payOrder,
  updateOrderStatus,
} from "./order.service.js";

export const create = asyncHandler(async (req, res) => {
  const order = await createOrder(req.user.id, req.validatedData.items);
  sendResponse(res, 201, "Order created successfully.", order);
});

export const list = asyncHandler(async (req, res) => {
  const orders = await listOrders({ userId: req.user.id, isAdmin: req.user.role === "ADMIN" });
  sendResponse(res, 200, "Orders retrieved successfully.", orders);
});

export const getOne = asyncHandler(async (req, res) => {
  const order = await getOrder({
    id: req.validatedParams.id,
    userId: req.user.id,
    isAdmin: req.user.role === "ADMIN",
  });
  sendResponse(res, 200, "Order retrieved successfully.", order);
});

export const pay = asyncHandler(async (req, res) => {
  const order = await payOrder(req.validatedParams.id, req.user.id);
  sendResponse(res, 200, "Payment simulated successfully.", order);
});

export const cancel = asyncHandler(async (req, res) => {
  const order = await cancelOrder({
    id: req.validatedParams.id,
    userId: req.user.id,
    isAdmin: req.user.role === "ADMIN",
  });
  sendResponse(res, 200, "Order cancelled successfully.", order);
});

export const updateStatus = asyncHandler(async (req, res) => {
  const order = await updateOrderStatus(req.validatedParams.id, req.validatedData.status);
  sendResponse(res, 200, "Order status updated successfully.", order);
});
