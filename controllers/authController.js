import { login as loginUser } from "../services/authService.js";
import sendResponse from "../utils/sendResponse.js";

export async function login(req, res) {
  const { accessToken, refreshToken, user } = await loginUser(
    req.body.username,
    req.body.password
  );

  return sendResponse(
    res,
    200,
    "Login successful",
    { accessToken, refreshToken, tokenType: "Bearer", user }
  );
}
