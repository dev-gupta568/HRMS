import "dotenv/config";

const required = [
  "DB_URI",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
];

for (const name of required) {
  if (!process.env[name]) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
}

export const env = Object.freeze({
  port: Number(process.env.PORT || 3000),
  dbUri: process.env.DB_URI,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY || "15m",
  refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY || "7d",
  bcryptRounds: Number(process.env.BCRYPT_ROUNDS || 12),
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
});
