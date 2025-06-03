import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/rolesMiddleware";

const router = express.Router();

router.post('/create-post', authMiddleware, authorizeRoles("admin", "seller"), createProductController)