import mongoose from "mongoose";

const productModel = new mongoose.Schema({
	merchantId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Merchant",
		required: true,
	},
	merchantName: {
		type: String,
		ref: "Merchant",
		required: true,
	},
	name: { type: String, required: true },
	price: { type: Number, required: true },
	details: { type: String, required: true },
	image: { type: String, required: true },
	category: { type: String, required: true },
	artist: { type: String, required: true },
});

export const Product =
	mongoose.models.Product || mongoose.model("Product", productModel);
