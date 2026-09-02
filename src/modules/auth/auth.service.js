import bcrypt from "bcrypt";
import prisma from "../../config/prisma.js";
import AppError from "../../errors/AppError.js";

// Business logic here

export const registerUser = async (userData) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: userData.email,
    },
  });

  if (existingUser) {
    throw new AppError("Email is already registered.", 409);
  }

  const hashedPassword = await bcrypt.hash(userData.password, 12);

  const user = await prisma.user.create({
    data: {
      fullName: userData.fullName,
      email: userData.email,
      password: hashedPassword,
      role: userData.role,
    },
  });

  return user;
};