import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  createPaymentOrder,
  verifyPayment,
} from "../controllers/paymentController.js";

const router = Router();

router.post("/create-order", authMiddleware, createPaymentOrder);
router.post("/verify", authMiddleware, verifyPayment);

export default router;
