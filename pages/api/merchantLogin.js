import { connectToDatabase } from "@/util/db";
import { Merchant } from "@/util/model/Merchant";
import bcryptjs from "bcryptjs";
import { sign } from "jsonwebtoken";

export default async function handler(req, res) {
	if (req.method === "POST") {
		try {
			await connectToDatabase();

			const { email, password } = req.body;

			// Find the user by email
			const merchant = await Merchant.findOne({ email });

			// If user not found or password doesn't match, return error
			if (!merchant || !(await bcryptjs.compare(password, merchant.password))) {
				return res.status(401).json({ error: "Invalid email or password" });
			}

			// User authenticated successfully
			const token = sign(
				{
					merchantId: merchant._id,
					email: merchant.email,
					role: "merchant",
				},
				process.env.JWT_SECRET,
				{
					expiresIn: "100y", // Adjust token expiration as needed
				}
			);
			return res.status(200).json({
				token: token,
				merchantId: merchant._id,
				merchantEmail: merchant.email,
				role: "merchant",
				message: "Login successful",
			});
		} catch (error) {
			console.error("Error logging in:", error);
			return res.status(500).json({ error: "Internal server error" });
		}
	} else {
		return res.status(405).json({ error: "Method not allowed" });
	}
}
