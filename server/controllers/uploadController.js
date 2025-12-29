import AppError from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { processUploadedFiles } from "../utils/processFiles.js";

export const uploadFile = asyncHandler(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new AppError("No files uploaded", 400));
  }

  const uploaded = await processUploadedFiles(req.files);

  res.json({
    status: "success",
    files: uploaded,
  });
});
