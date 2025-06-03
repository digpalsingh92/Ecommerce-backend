import express from "express";
import { createProduct, getAllProducts, getProductById } from "../controllers/product.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/rolesMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, authorizeRoles("admin", "seller"), createProduct);
router.get("/", getAllProducts);
router.get("/:id", getProductById)

export default router;
