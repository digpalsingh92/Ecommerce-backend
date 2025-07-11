import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {orderCheckout, downloadInvoice } from "../controllers/order.controller.js";


const router = express.Router();

router.post('/checkout', authMiddleware, orderCheckout);
router.get('/invoice/:orderId', authMiddleware, downloadInvoice);

export default router;