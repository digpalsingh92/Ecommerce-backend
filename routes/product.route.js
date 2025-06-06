import express from "express";
import { createProduct, deleteProductById, getAllProducts, getProductById, updateProductById } from "../controllers/product.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/rolesMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, authorizeRoles("admin", "seller"), createProduct);
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.put("/:id", authMiddleware, authorizeRoles("admin", "seller"), updateProductById);
router.delete("/:id", authMiddleware, authorizeRoles("admin", "seller"), deleteProductById);

export default router;
