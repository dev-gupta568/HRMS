import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { env } from "../config/env.js";
import Role from "../models/Role.js";
import User from "../models/User.js";

const roles = [
  { name: "ADMIN", permissions: ["*"] },
  { name: "HR", permissions: [] },
  { name: "MANAGER", permissions: [] },
  { name: "EMPLOYEE", permissions: [] },
];

const password = process.env.SEED_ADMIN_PASSWORD;
if (!password) {
  throw new Error("Missing required environment variable: SEED_ADMIN_PASSWORD");
}

try {
  await mongoose.connect(env.dbUri);

  for (const role of roles) {
    await Role.updateOne(
      { name: role.name },
      { $setOnInsert: role },
      { upsert: true }
    );
  }

  const adminRole = await Role.findOne({ name: "ADMIN" }).lean();
  const passwordHash = await bcrypt.hash(password, env.bcryptRounds);

  await User.updateOne(
    { employeeId: "EMP001" },
    {
      $setOnInsert: {
        employeeId: "EMP001",
        name: "Sample Admin",
        email: "admin@hrms.local",
        passwordHash,
        roleId: adminRole._id,
        status: "ACTIVE",
      },
    },
    { upsert: true }
  );

  console.log("Seed completed");
} finally {
  await mongoose.disconnect();
}
