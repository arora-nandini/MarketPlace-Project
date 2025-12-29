import Project from "../models/Project.js";
import AppError from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { processUploadedFiles } from "../utils/processFiles.js";
import { deleteFromCloudinary } from "../utils/deleteFromCloudinary.js";

/* ----------------------------------------
   CREATE PROJECT
---------------------------------------- */
export const createProject = asyncHandler(async (req, res, next) => {
  const { title, description, price, techStack, type, kitStock, demoVideo } = req.body;

  if (!title || !description || !price) {
    return next(new AppError("Title, description and price are required", 400));
  }

  const techStackArray = techStack ? techStack.split(",") : [];

  const uploaded = await processUploadedFiles(req.files);

  const project = await Project.create({
    title,
    description,
    price,
    techStack: techStackArray,
    type: type || "digital",
    kitStock: type === "physical" ? kitStock : 0,

    images: uploaded.images,
    codeFile: uploaded.codeFile,
    docFile: uploaded.docFile,
    videoFile: uploaded.videoFile,

    demoVideo: demoVideo || null,
    seller: req.user.id,
  });

  res.status(201).json({ status: "success", project });
});

/* ----------------------------------------
   UPDATE PROJECT
---------------------------------------- */
export const updateProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);
  if (!project) return next(new AppError("Project not found", 404));

  // only seller can update
  if (project.seller.toString() !== req.user.id) {
    return next(new AppError("Not authorized", 403));
  }

  const { title, description, price, techStack, type, kitStock, demoVideo } = req.body;

  const uploaded = await processUploadedFiles(req.files);

  // Replace images
  if (uploaded.images.length > 0) {
    for (const img of project.images) {
      await deleteFromCloudinary(img.publicId, "image");
    }
    project.images = uploaded.images;
  }

  // Replace code file
  if (uploaded.codeFile) {
    if (project.codeFile?.publicId)
      await deleteFromCloudinary(project.codeFile.publicId, "raw");

    project.codeFile = uploaded.codeFile;
  }

  // Replace doc file
  if (uploaded.docFile) {
    if (project.docFile?.publicId)
      await deleteFromCloudinary(project.docFile.publicId, "raw");

    project.docFile = uploaded.docFile;
  }

  // Replace video file
  if (uploaded.videoFile) {
    if (project.videoFile?.publicId)
      await deleteFromCloudinary(project.videoFile.publicId, "video");

    project.videoFile = uploaded.videoFile;
  }

  // update fields
  project.title = title || project.title;
  project.description = description || project.description;
  project.price = price || project.price;
  project.techStack = techStack ? techStack.split(",") : project.techStack;
  project.type = type || project.type;
  project.kitStock = type === "physical" ? kitStock : project.kitStock;
  project.demoVideo = demoVideo || project.demoVideo;

  await project.save();

  res.json({ status: "success", project });
});

/* ----------------------------------------
   GET PROJECTS (with Pagination)
---------------------------------------- */
export const getProjects = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  const projects = await Project.find()
    .populate("seller", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Project.countDocuments();

  res.json({
    status: "success",
    page,
    totalPages: Math.ceil(total / limit),
    total,
    projects,
  });
});

/* ----------------------------------------
   GET MY PROJECTS (Seller Dashboard)
---------------------------------------- */
export const getMyProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ seller: req.user.id })
    .sort({ createdAt: -1 });

  res.json({
    status: "success",
    count: projects.length,
    projects,
  });
});

/* ----------------------------------------
   GET SINGLE PROJECT
---------------------------------------- */
export const getProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id)
    .populate("seller", "name email");

  if (!project) return next(new AppError("Project not found", 404));

  res.json({ status: "success", project });
});

/* ----------------------------------------
   DELETE PROJECT  + delete cloudinary files
---------------------------------------- */
export const deleteProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);
  if (!project) return next(new AppError("Project not found", 404));

  if (project.seller.toString() !== req.user.id) {
    return next(new AppError("Not authorized", 403));
  }

  // DELETE ALL CLOUDINARY FILES
  for (const img of project.images) {
    await deleteFromCloudinary(img.publicId, "image");
  }

  if (project.codeFile?.publicId)
    await deleteFromCloudinary(project.codeFile.publicId, "raw");

  if (project.docFile?.publicId)
    await deleteFromCloudinary(project.docFile.publicId, "raw");

  if (project.videoFile?.publicId)
    await deleteFromCloudinary(project.videoFile.publicId, "video");

  await project.deleteOne();

  res.json({ status: "success", message: "Project deleted" });
});
