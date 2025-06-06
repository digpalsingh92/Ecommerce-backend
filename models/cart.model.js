import mongoose from "mongoose";

const cartItemSchema = mongoose.Schema({
    product : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
        min: 1
    }
});

const cartSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        unique: true,
        required: true,
    },
    items: [cartItemSchema]
}, {TimeStamps: true})

export default mongoose.model("Cart", cartSchema);