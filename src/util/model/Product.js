import mongoose from "mongoose";

const productModel = new mongoose.Schema({
	name: { type: String, required: true, unique: true },
	price: { type: Number, required: true },
	details: { type: String, required: true },
	image: { type: String, required: true },
});

export const Product =
	mongoose.models.Product || mongoose.model("Product", productModel);
