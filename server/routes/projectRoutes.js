import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";
import { createProject, getProjects, getProject, deleteProject,updateProject,getMyProjects } from "../controllers/projectController.js";

const router = Router();

// GET routes
router.get("/", getProjects);
router.get("/:id", getProject);
router.get("/my/projects", authMiddleware, getMyProjects);

// CREATE PROJECT (multipart/form-data)
router.post(
  "/",
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "codeFile", maxCount: 1 },
    { name: "docFile", maxCount: 1 },
    { name: "videoFile", maxCount: 1 },
  ]),
  authMiddleware,
  createProject
);
router.put(
  "/:id",
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "codeFile", maxCount: 1 },
    { name: "docFile", maxCount: 1 },
    { name: "videoFile", maxCount: 1 },
  ]),
  authMiddleware,
  updateProject
)

// DELETE PROJECT
router.delete("/:id", authMiddleware, deleteProject);

export default router;
