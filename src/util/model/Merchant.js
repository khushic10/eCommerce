import mongoose from "mongoose";

const merchantSchema = new mongoose.Schema({
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
});

export const Merchant =
	mongoose.models.Merchant || mongoose.model("Merchant", merchantSchema);
