import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";
import AppError from "../errors/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

const authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Authentication required.", 401);
  }

  const token = authHeader.split(" ")[1];

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new AppError("Invalid or expired token.", 401);
  }

  const user = await prisma.user.findUnique({
    where: {
      id: decoded.userId,
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new AppError("User no longer exists.", 401);
  }

  req.user = user;

  next();
});

export default authenticate;
