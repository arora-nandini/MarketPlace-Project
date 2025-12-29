import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  createOrder,
  confirmPayment,
  getMyOrders,
  getSellerOrders,
} from "../controllers/orderController.js";

const router = Router();

router.post("/", authMiddleware, createOrder);
router.post("/confirm", authMiddleware, confirmPayment);



router.get("/my-orders", authMiddleware, getMyOrders);
router.get("/seller-orders", authMiddleware, getSellerOrders);

export default router;
