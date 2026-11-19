import AppError from "../utils/AppError.js";
import sendResponse from "../utils/sendResponse.js";

export default function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const isAppError = err instanceof AppError;
  const statusCode = isAppError ? err.statusCode : 500;
  const message =
    isAppError || process.env.NODE_ENV !== "production"
      ? err.message
      : "Internal server error";

  return sendResponse(res, statusCode, message, null, false);
}
