import app from "./app.js";
import prisma from "./config/prisma.js";
import { env } from "./config/env.js";

const startServer = async () => {
  try {
    await prisma.$connect();

    console.log("Database connected successfully");

    const server = app.listen(env.port, () => {
      console.log(`Server running on http://localhost:${env.port}`);
    });

    const shutdown = async (signal) => {
      console.log(`${signal} received. Shutting down gracefully.`);
      server.close(async () => {
        await prisma.$disconnect();
        process.exit(0);
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch(error) {
    console.error("Database connection failed", error);
    process.exit(1);
  }
};

startServer();