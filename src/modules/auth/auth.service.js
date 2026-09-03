import bcrypt from "bcrypt";
import prisma from "../../config/prisma.js";
import AppError from "../../errors/AppError.js";
import { generateToken } from "../../utils/jwt.js";

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
      role: "CUSTOMER",
    },
  });

  const token = generateToken({
    userId: user.id,
    role: user.role,
  });

  return { user, token };
};


export const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new AppError("Invalid email or password.", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password.", 401);
  }

  const token = generateToken({
    userId: user.id,
    role: user.role,
  });

  return { user, token };
};

// we used the same error message to avoid revealing whether an email address exists in the system