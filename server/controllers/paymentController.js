import crypto from "crypto";
import Order from "../models/Order.js";
import Project from "../models/Project.js";
import AppError from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { razorpay } from "../config/razorpay.js";
/* ------------------------------------------
   1️⃣ CREATE PAYMENT ORDER (Razorpay)
------------------------------------------ */
export const createPaymentOrder = asyncHandler(async (req, res, next) => {
  const { projectId, shippingAddress } = req.body;

  const project = await Project.findById(projectId);
  if (!project) return next(new AppError("Project not found", 404));

  // Step 1: Create local DB order
  const order = await Order.create({
    buyer: req.user.id,
    seller: project.seller,
    project: projectId,
    amount: project.price,
    orderType: project.type,
    shippingAddress: project.type === "physical" ? shippingAddress : null,
    status: "pending",
  });

  // Step 2: Create Razorpay order
  const razorpayOrder = await razorpay.orders.create({
    amount: project.price * 100, // INR → paise
    currency: "INR",
    receipt: order._id.toString(),
  });

  res.json({
    status: "success",
    orderId: order._id,
    razorpayOrder,
    keyId: process.env.RAZORPAY_KEY_ID,
  });
});

/* ------------------------------------------
   2️⃣ VERIFY PAYMENT SIGNATURE
------------------------------------------ */
export const verifyPayment = asyncHandler(async (req, res, next) => {
  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return next(new AppError("Payment verification failed", 400));
  }

  // Payment success → update DB
  const order = await Order.findById(orderId);
  order.status = "paid";
  order.paymentId = razorpay_payment_id;

  // unlock digital file
  if (order.orderType === "digital") {
    const project = await Project.findById(order.project);
    order.downloadUrl = project.codeFile?.url || null;
  }

  await order.save();

  res.json({
    status: "success",
    message: "Payment verified",
    order,
  });
});