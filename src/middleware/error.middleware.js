import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  // Zod Validation Errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors: err.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  // Prisma Unique Constraint
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "A record with this value already exists.",
      });
    }
  }

  // Custom App Errors
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Unknown Errors
  return res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
};

export default errorMiddleware;
