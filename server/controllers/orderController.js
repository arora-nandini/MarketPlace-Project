import Order from "../models/Order.js";
import Project from "../models/Project.js";
import AppError from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/* ------------------------------------------
   1️⃣ CREATE ORDER (before payment)
------------------------------------------ */
export const createOrder = asyncHandler(async (req, res, next) => {
  const { projectId, shippingAddress } = req.body;

  const project = await Project.findById(projectId);
  if (!project) return next(new AppError("Project not found", 404));

  const order = await Order.create({
    buyer: req.user.id,
    seller: project.seller,
    project: projectId,
    amount: project.price,
    orderType: project.type,
    shippingAddress: project.type === "physical" ? shippingAddress : null,
    status: "pending",
  });

  res.json({
    status: "success",
    order,
  });
});

/* ------------------------------------------
   2️⃣ CONFIRM ORDER (after payment gateway)
------------------------------------------ */
export const confirmPayment = asyncHandler(async (req, res, next) => {
  const { orderId, paymentId } = req.body;

  const order = await Order.findById(orderId);
  if (!order) return next(new AppError("Order not found", 404));

  order.status = "paid";
  order.paymentId = paymentId;

  // Digital products → unlock file
  if (order.orderType === "digital") {
    const project = await Project.findById(order.project);
    order.downloadUrl = project.codeFile?.url || null;
  }

  await order.save();

  res.json({
    status: "success",
    message: "Order confirmed",
    order,
  });
});

/* ------------------------------------------
   3️⃣ BUYER ORDER LIST
------------------------------------------ */
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ buyer: req.user.id })
    .populate("project", "title price")
    .populate("seller", "name");

  res.json({
    status: "success",
    orders,
  });
});

/* ------------------------------------------
   4️⃣ SELLER ORDER LIST (Dashboard)
------------------------------------------ */
export const getSellerOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ seller: req.user.id })
    .populate("project", "title price")
    .populate("buyer", "name email");

  res.json({
    status: "success",
    orders,
  });
});
