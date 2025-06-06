import productModel from "../models/product.model.js";
import cartModel from "../models/cart.model.js"

export const addCart = async (req, res) => {
    const userId = req.user._id;
    const {productId, quantity} = req.body;

    try {
        const product = await productModel.findById(productId);
        if(!product){
            return res.status(404).json({message: "Product not Found"})
        }
        const cart = await cartModel.findById({user: userId});

        if (!cart) {
            cart = new cartModel({
                user : userId,
                items :[{product: productId, quantity}]
            });
        }else {
            const existingItem = cart.items.find((item) => item.product.toString() === productId );

            if (existingItem) {
                existingItem.quantity += quantity; 
            }else {
                cart.items.push({product: productId, quantity})
            }
        }

        await cart.save()
        res.status(200).json({success: true, messgae: "Items added to Cart successfully", cart})
    } catch (error) {
        res.status(500).json({ message: "Failed to add to cart", error: error.message });
    }
}