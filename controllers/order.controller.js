import path from "path";
import fs from "fs";
import cartModel from "../models/cart.model.js";
import orderModel from "../models/order.model.js";
import { sendOrderConfirmationEmail } from "../nodemailer/orderEmail.js";
import { generateInvoicePDF } from "../utils/invoiceGenerator.js";

export async function orderCheckout(req, res) {
  const userId = req.user._id;

  try {
    const cart = await cartModel
      .findOne({ user: userId })
      .populate("items.product");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let totalAmount = 0;
    cart.items.forEach((item) => {
      totalAmount += item.product.price * item.quantity;
    }); // Calculate total amount

    const newOrder = await orderModel.create({
      user: userId,
      items: cart.items,
      totalAmount: totalAmount,
      status: "processing",
    });

    const populatedOrder = await orderModel
      .findById(newOrder._id)
      .populate("user", "fullName email")
      .populate("items.product");

    await sendOrderConfirmationEmail(populatedOrder);
    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      orderId: newOrder._id,
      order: newOrder,
    });
  } catch (error) {
    console.error("Error during order checkout:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export const downloadInvoice = async (req, res) => {
  const orderId = req.params.orderId;
  const userId = req.user._id;


  try {
    const order = await orderModel
      .findById(orderId)
      .populate("items.product")
      .populate("user", "fullName email");

    if (!order) return res.status(404).json({ message: "Order not found" });

    // if (
    //   order.user._id.toString() !== userId.toString() &&
    //   req.user.role !== "admin"
    // ) {
    //   return res
    //     .status(403)
    //     .json({ message: "Not authorized to download invoice" });
    // }

    const invoicePath = path.join("invoices", `invoice_${order._id}.pdf`);

    if (!fs.existsSync("invoices")) {
      fs.mkdirSync("invoices");
    }

    generateInvoicePDF(order, invoicePath);

    setTimeout(() => {
      res.download(invoicePath, `invoice_${order._id}.pdf`, (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ message: "Error sending invoice" });
        }
      });
    }, 1000);
  } catch (error) {
    console.error("Error downloading invoice:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};