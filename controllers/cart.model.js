import productModel from "../models/product.model.js";
import cartModel from "../models/cart.model.js";

export const addCart = async (req, res) => {
  const userId = req.user._id;
  const { items } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Items must be a non-empty array" });
  }

  try {
    let cart = await cartModel.findOne({ user: userId });

    if (!cart) {
      cart = new cartModel({ user: userId, items: [] });
    }

    for (const item of items) {
      const { productId, quantity } = item;

      if (!productId || !quantity || quantity <= 0) {
        return res.status(400).json({ message: "Each item must have a valid productId and quantity > 0" });
      }

      const product = await productModel.findById(productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found for ID: ${productId}` });
      }

      const existingItem = cart.items.find((cartItem) => cartItem.product.toString() === productId);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Items added to cart successfully",
      cart,
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ message: "Failed to add items to cart", error: error.message });
  }
};

export const getCart = async (req, res) => {
  const userId = req.user._id;

  try {
    const cart = await cartModel.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(200).json({ message: "No items Found in your cart :(", items: [] });
    }

    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch cart", error: error.message });
  }
};

export const deleteCart = async (req, res) => {
    const userId = req.user._id;
    const {  productId } = req.params;

    try {
       const cart = await cartModel.findOne({user : userId});

       if(!cart){
        return res.status(404).json({message: "Cart not Found"})
       }

       const updatedItems = cart.items.filter((item)=> item.product.toString() !== productId);

       if (updatedItems.length === cart.items.length) {
            return res.status(404).json({message: "Item not found in cart"});
       }
       cart.items = updatedItems;
       await cart.save();

       res.status(200).json({success: true, message: "Items removed", cart});
    } catch (error) {
        res.status(500).json({message: "Failed to remove item", error: error.message});
    }
}