import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    orderType: {
      type: String,
      enum: ["digital", "physical"],
      required: true,
    },

    // For digital delivery
    downloadUrl: {
      type: String,
      default: null,
    },

    // For physical delivery
    shippingAddress: {
      type: String,
      default: null,
    },

    trackingId: {
      type: String,
      default: null,
    },

    // Razorpay/Stripe payment ID
    paymentId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
