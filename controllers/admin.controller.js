import orderModel from '../models/order.model.js';

// export const createProductController = () => {
//     const {product_id, product_name, product}
// }

export const getAllOrders = async (req, res) => {
    try {
        const orders = await orderModel
        .find({})
        .populate("user", "fullName email")
        .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            message: "Orders fetched successfully",
            orders: orders,
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch orders", error: err.message });
    }
}