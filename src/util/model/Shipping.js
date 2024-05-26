import mongoose from "mongoose";

const ShippingSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
	name: { type: String, required: true },
	email: { type: String, required: true },
	phone: { type: String, required: true },
	province: { type: String, required: true },
	city: { type: String, required: true },
	area: { type: String, required: true },
	street: { type: String, required: true },
	latitude: { type: String },
	longitude: { type: String },
});
export const Shipping =
	mongoose.models.Shipping || mongoose.model("Shipping", ShippingSchema);
