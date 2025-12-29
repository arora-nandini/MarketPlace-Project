import dotenv from "dotenv";
dotenv.config();

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

console.log("Cloudinary config:", {
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret_present: !!process.env.CLOUD_API_SECRET
});
console.log("CLOUDINARY_URL (system env):", process.env.CLOUDINARY_URL);
console.log("Manual cloud_name:", process.env.CLOUD_NAME);
console.log("Manual api_key:", process.env.CLOUD_API_KEY);
console.log("Manual api_secret:", process.env.CLOUD_API_SECRET);
console.log("SDK CONFIG:", cloudinary.config());

export default cloudinary;
