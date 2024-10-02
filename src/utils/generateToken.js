import jwt from "jsonwebtoken";
import { ENV_CONGIG } from "../config/env.config.js";

export const genTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, ENV_CONGIG.JWT_SECRET, {
    expiresIn: "5d",
  });
  res.cookie("jwt-task", token, {
    maxAge: 5 * 24 * 60 * 60 * 1000, //5d in miliseconds
    httpOnly: true, // prevent XSS attacks cross-site scripting attacks, not accessible by js
    sameSite: "strict", // CSRF protection
    secure: ENV_CONGIG.NODE_ENV !== "development",
  });

  return token;
};
