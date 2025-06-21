import express from "express";
import { addCart, deleteCart, getCart } from "../controllers/cart.model.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";


const router = express.Router();

router.post('/add', authMiddleware, addCart);
router.get('/getCart', authMiddleware, getCart);
router.delete('/delete/:productId', authMiddleware, deleteCart);

export default router;