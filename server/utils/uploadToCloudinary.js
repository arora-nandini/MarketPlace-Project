import cloudinary from "../config/cloudinary.js"

export const uploadBuffer = (buffer, mimetype) => {
  return new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.unsigned_upload_stream(
      "marketplace_unsigned",
      { resource_type: "auto" },
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );

    upload.end(buffer);
  });
};
