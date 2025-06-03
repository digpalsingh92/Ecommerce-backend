import jwt from 'jsonwebtoken'
import userModel from '../models/user.model.js'

export const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({message: "No token provided"})
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded.id).select("-password");

        if(!user) {
            return res.status(401).json({message: "User Not Found"})
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({message: "Invalid or Expired Token"})
    }

}