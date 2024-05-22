import { connectToDatabase } from "@/util/db";
import { Merchant } from "@/util/model/Merchant";
import bcryptjs from "bcryptjs";

export default async function handler(req, res) {
	if (req.method === "POST") {
		try {
			await connectToDatabase();

			const { password, email, fullName } = req.body;

			if (!email || !password) {
				return res.status(400).json({
					error: "fullName,email and password are required",
				});
			}

			// Check if username or email already exists
			const existingUser = await Merchant.findOne({
				$or: [{ email }],
			});
			if (existingUser) {
				return res.status(400).json({ error: "Email already exists" });
			}

			// Hash the password
			const hashedPassword = await bcryptjs.hash(password, 10);

			// Create a new user
			const newMerchant = new Merchant({
				email,
				password: hashedPassword,
				fullName: fullName,
			});

			await newMerchant.save();

			return res
				.status(201)
				.json({ message: "Merchant registered successfully" });
		} catch (error) {
			console.error("Error registering user:", error);
			return res.status(500).json({ error: "Internal server error" });
		}
	} else {
		return res.status(405).json({ error: "Method not allowed" });
	}
}
