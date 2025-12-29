import { Router } from "express";
import upload from "../middlewares/uploadMiddleware.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { checkPlagiarism } from "../controllers/plagiarismController.js";

const router = Router();

router.post(
  "/",
  authMiddleware,
  upload.single("zipFile"),
  checkPlagiarism
);

export default router;
