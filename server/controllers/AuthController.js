import User from "../models/User.js";
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// REGISTER
export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return next(new AppError("Email already exists", 400));

  const user = await User.create({ name, email, password });

  res.status(201).json({
    status: "success",
    message: "User registered",
    user,
  });
});

// LOGIN
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) return next(new AppError("User not found", 404));

  const valid = await user.comparePassword(password);
  if (!valid) return next(new AppError("Invalid password", 400));

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  // 🔥 REMOVE PASSWORD BEFORE SENDING RESPONSE
  user.password = undefined;

  res.json({
    status: "success",
    token,
    user,
  });
});
