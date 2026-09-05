import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { env, isProduction } from "./config/env.js";

import errorMiddleware from "./middleware/error.middleware.js";
import routes from "./routes/index.js";

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: env.corsOrigin }));
app.use(compression());
app.use(morgan(isProduction ? "combined" : "dev"));
app.use(cookieParser());
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", routes);

// Health check route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "DEON E-Commerce API is running 🚀",
  });
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorMiddleware);

export default app;