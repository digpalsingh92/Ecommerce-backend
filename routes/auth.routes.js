import express from "express";
import { login, logout, register, verifyEmail } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/verify-email/:token', verifyEmail);
router.get('/me', authMiddleware ,(req, res) => {
    res.json(req.user);
});
// router.post('/login', login);

export default router;