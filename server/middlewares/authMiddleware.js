import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";

const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer "))
    return next(new AppError("Not authorized", 401));

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // FIX: Store user in object, not just the id string
    req.user = { id: decoded.id };

    next();
  } catch (err) {
    next(new AppError("Invalid or expired token", 403));
  }
};

export default authMiddleware;
