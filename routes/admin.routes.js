import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { validateUserRole } from "../validators/userRoleValidator.js";
import {getAllOrders} from "../controllers/admin.controller.js";
// import { authorizeRoles } from "../middlewares/rolesMiddleware.js";

const router = express.Router();

// router.post('/create-post', authMiddleware, authorizeRoles("admin", "seller"), createProductController)
router.get('/orders', authMiddleware, validateUserRole('admin'), getAllOrders);

export default router;