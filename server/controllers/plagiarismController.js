import axios from "axios";
import FormData from "form-data";
import AppError from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { PY_SERVICE_URL } from "../config/microservice.js";

export const checkPlagiarism = asyncHandler(async (req, res, next) => {
  // 1️⃣ Require ZIP file
  if (!req.file) return next(new AppError("No ZIP file uploaded", 400));

  // 2️⃣ Prepare form
  const form = new FormData();
  form.append("file", req.file.buffer, "project.zip");

  try {
    // 3️⃣ Call Python microservice
    const { data } = await axios.post(
      `${PY_SERVICE_URL}/check`,
      form,
      {
    headers: {
      ...form.getHeaders(),
    },
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
  }
    );

    // 4️⃣ Return microservice result
    res.json({
      status: "success",
      result: data,
    });

  } catch (err) {
    console.error("FULL ERROR:", err);
  console.error("RESPONSE DATA:", err.response?.data);
  throw err;
    // console.error("🔥 Microservice error:", err.response?.data || err);
    // return next(new AppError("Plagiarism microservice failed", 500));
  }
});
