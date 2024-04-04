import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
	product: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Product",
		required: true,
	},
	quantity: { type: Number, default: 1 },
});

const cartSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
	items: [cartItemSchema],
	createdAt: { type: Date, default: Date.now },
});
export const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);
