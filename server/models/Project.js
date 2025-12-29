import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  url: String,
  publicId: String,
});

const plagiarismSchema = new mongoose.Schema({
  score: Number, // 0–100
  matchedFiles: [
    {
      filename: String,
      similarity: Number,
    }
  ],
  checkedAt: Date
});

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Project description is required"],
    },

    price: {
      type: Number,
      required: true,
    },

    techStack: {
      type: [String],
      default: [],
    },

    type: {
      type: String,
      enum: ["digital", "physical"],
      default: "digital",
    },

    // ⭐ MULTIPLE IMAGE SUPPORT
    images: [fileSchema],

    // ⭐ CODE ZIP/RAR FILE
    codeFile: {
      type: fileSchema,
      default: null,
    },

    // ⭐ DOCUMENTATION PDF
    docFile: {
      type: fileSchema,
      default: null,
    },

    // ⭐ VIDEO (MP4 or Cloudinary)
    videoFile: {
      type: fileSchema,
      default: null,
    },

    // Optional: For YouTube demo
    demoVideo: {
      type: String,
      default: null,
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    kitStock: {
      type: Number,
      default: 0, // Only for physical projects
    },
    plagiarismReport: {
      type: plagiarismSchema,
      default: null,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
