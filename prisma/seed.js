import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const required = ["ADMIN_EMAIL", "ADMIN_PASSWORD", "ADMIN_FULL_NAME"];
const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  throw new Error(`Missing seed variables: ${missing.join(", ")}`);
}

if (process.env.ADMIN_PASSWORD.length < 8) {
  throw new Error("ADMIN_PASSWORD must be at least 8 characters long.");
}

const password = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);

await prisma.user.upsert({
  where: { email: process.env.ADMIN_EMAIL.trim().toLowerCase() },
  update: { fullName: process.env.ADMIN_FULL_NAME.trim(), password, role: "ADMIN" },
  create: {
    fullName: process.env.ADMIN_FULL_NAME.trim(),
    email: process.env.ADMIN_EMAIL.trim().toLowerCase(),
    password,
    role: "ADMIN",
  },
});

console.log("Administrator account seeded.");
await prisma.$disconnect();
