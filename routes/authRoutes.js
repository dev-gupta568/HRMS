import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { login } from "../controllers/authController.js";
import sendResponse from "../utils/sendResponse.js";
import validate from "../middleware/validate.js";
import { loginSchema } from "../validators/authValidator.js";

const router = Router();
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) =>
    sendResponse(res, 429, "Too many login attempts. Try again later.", null, false),
});

router.post("/login", loginLimiter, validate(loginSchema), login);

export default router;
