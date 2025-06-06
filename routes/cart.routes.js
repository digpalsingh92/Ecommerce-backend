import express from "express";
import { addCart } from "../controllers/cart.model.js";

const router = express.Router();

router.post('/add', addCart);
// router.post('/login', login);

export default router;