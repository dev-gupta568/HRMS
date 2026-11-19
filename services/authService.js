import bcrypt from "bcrypt";
import AppError from "../utils/AppError.js";
import {
  generateAccessToken,
  generateRefreshToken,
  hashRefreshToken,
  verifyToken,
} from "../utils/jwt.js";
import "../models/Role.js";
import RefreshToken from "../models/RefreshToken.js";
import User from "../models/User.js";

export async function login(username, password) {
  const user = await User.findOne({
    $or: [
      { email: username.toLowerCase() },
      { employeeId: username.toUpperCase() },
    ],
  })
    .select("+passwordHash")
    .populate("roleId", "name permissions");

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new AppError("Invalid username or password", 401);
  }

  if (user.status === "INACTIVE") {
    throw new AppError("Account is inactive", 403);
  }

  if (user.status === "BLOCKED") {
    throw new AppError("Account is blocked", 403);
  }

  const role = user.roleId.name;
  const userId = user._id.toString();
  const accessToken = generateAccessToken({
    userId,
    employeeId: user.employeeId,
    role,
  });
  const refreshToken = generateRefreshToken({ userId });
  const { exp } = verifyToken(refreshToken, "refresh");

  await RefreshToken.create({
    tokenHash: hashRefreshToken(refreshToken),
    userId: user._id,
    expiresAt: new Date(exp * 1000),
  });

  return {
    accessToken,
    refreshToken,
    user: {
      employeeId: user.employeeId,
      name: user.name,
      email: user.email,
      role,
      status: user.status,
      permissions: user.roleId.permissions,
    },
  };
}
