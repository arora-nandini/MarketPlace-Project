import dotenv from "dotenv";
dotenv.config();


import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import AppError from "./utils/AppError.js";
import globalErrorHandler from "./middlewares/errorMiddleware.js";
import projectRoutes from "./routes/projectRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import plagiarismRoutes from "./routes/plagiarismRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";


await connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true }))

// ROUTES
app.use("/api/auth", authRoutes);

app.use("/api/projects", projectRoutes);

app.use("/api/upload", uploadRoutes);

app.use("/api/plagiarism", plagiarismRoutes);
app.use("/api/orders", orderRoutes);

app.use("/api/payment", paymentRoutes);
// ❗ Express 5 — do NOT use "*" or "/*"
// This catches ALL unmatched routes safely
app.use((req, res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
});

// Global error handler
app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
