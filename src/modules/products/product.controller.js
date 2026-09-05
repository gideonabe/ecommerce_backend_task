import asyncHandler from "../../utils/asyncHandler.js";
import sendResponse from "../../utils/sendResponse.js";
import {
  createProduct,
  deleteProduct,
  getProduct,
  listProducts,
  updateProduct,
} from "./product.service.js";

export const create = asyncHandler(async (req, res) => {
  const product = await createProduct(req.validatedData);
  sendResponse(res, 201, "Product created successfully.", product);
});

export const list = asyncHandler(async (req, res) => {
  const result = await listProducts(req.validatedQuery);
  sendResponse(res, 200, "Products retrieved successfully.", result);
});

export const getOne = asyncHandler(async (req, res) => {
  const product = await getProduct(req.validatedParams.id);
  sendResponse(res, 200, "Product retrieved successfully.", product);
});

export const update = asyncHandler(async (req, res) => {
  const product = await updateProduct(req.validatedParams.id, req.validatedData);
  sendResponse(res, 200, "Product updated successfully.", product);
});

export const remove = asyncHandler(async (req, res) => {
  await deleteProduct(req.validatedParams.id);
  sendResponse(res, 200, "Product deleted successfully.");
});
