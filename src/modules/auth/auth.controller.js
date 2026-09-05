import asyncHandler from "../../utils/asyncHandler.js";
import sendResponse from "../../utils/sendResponse.js";
import { loginUser, registerUser, updateProfile } from "./auth.service.js";

export const register = asyncHandler(async (req, res) => {
  const { user, token } = await registerUser(req.validatedData);

  sendResponse(res, 201, "User registered successfully.", {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    token,
  });
});


export const login = asyncHandler(async (req, res) => {
  const { user, token } = await loginUser(req.validatedData);

  // res.status(200).json({
  //   success: true,
  //   message: "Login successful.",
  //   data: {
  //     user: {
  //       id: user.id,
  //       fullName: user.fullName,
  //       email: user.email,
  //       role: user.role,
  //     },
  //     token,
  //   },
  // });

  sendResponse(res, 200, "Login successful.", {
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
    token,
  });
});


export const getMe = asyncHandler(async (req, res) => {

  sendResponse(res, 200, "User profile retrieved successfully.", req.user);
});

export const updateMe = asyncHandler(async (req, res) => {
  const user = await updateProfile(req.user.id, req.validatedData);
  sendResponse(res, 200, "User profile updated successfully.", user);
});

export const logout = asyncHandler(async (req, res) => {
  sendResponse(res, 200, "Logout successful. Discard the access token on the client.");
});
