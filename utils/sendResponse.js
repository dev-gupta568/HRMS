export default function sendResponse(
  res,
  statusCode,
  message,
  data = null,
  success = true
) {
  return res.status(statusCode).json({ success, message, data });
}
