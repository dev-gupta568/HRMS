import { createHash, randomUUID } from "node:crypto";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

const settings = {
  access: {
    secret: env.jwtAccessSecret,
    expiresIn: env.accessTokenExpiry,
  },
  refresh: {
    secret: env.jwtRefreshSecret,
    expiresIn: env.refreshTokenExpiry,
  },
};

function getSettings(type) {
  if (!Object.hasOwn(settings, type)) {
    throw new TypeError("Token type must be access or refresh");
  }

  const tokenSettings = settings[type];
  return tokenSettings;
}

function signToken(payload, type) {
  const { secret, expiresIn } = getSettings(type);
  return jwt.sign(payload, secret, { expiresIn });
}

export function generateAccessToken({ userId, employeeId, role }) {
  return signToken({ userId, employeeId, role }, "access");
}

export function generateRefreshToken(payload) {
  return signToken({ ...payload, jti: randomUUID() }, "refresh");
}

export function verifyToken(token, type) {
  return jwt.verify(token, getSettings(type).secret);
}

export function hashRefreshToken(token) {
  return createHash("sha256").update(token).digest("hex");
}
