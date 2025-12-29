import cloudinary from "../config/cloudinary.js";

export const deleteFromCloudinary = async (publicId, resource = "image") => {
  if (!publicId) return;

  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resource });
  } catch (err) {
    console.error("❌ Cloudinary Delete Error:", err);
  }
};

