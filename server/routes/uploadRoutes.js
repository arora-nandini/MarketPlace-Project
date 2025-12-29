import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";
import { uploadFile } from "../controllers/uploadController.js";

const router = Router();

router.post(
  "/",
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "codeFile", maxCount: 1 },
    { name: "docFile", maxCount: 1 },
    { name: "videoFile", maxCount: 1 },
  ]),
  authMiddleware,
  uploadFile
);

export default router;
