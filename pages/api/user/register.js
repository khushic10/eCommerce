import { connectToDatabase } from "@/util/db";
import { User } from "@/util/model/User";
import { Cart } from "@/util/model/Cart";
import { Shipping } from "@/util/model/Shipping";
import bcryptjs from "bcryptjs";

export default async function handler(req, res) {
	if (req.method === "POST") {
		try {
			await connectToDatabase();

			const { username, password, email, phone } = req.body;

			if (!username || !email || !password || !phone) {
				return res.status(400).json({
					error: "Username,email,phone and password are required",
				});
			}

			// Check if username or email already exists
			const existingUser = await User.findOne({
				$or: [{ username }, { email }],
			});
			if (existingUser) {
				return res
					.status(400)
					.json({ error: "Username or Email already exists" });
			}

			// Hash the password
			const hashedPassword = await bcryptjs.hash(password, 10);

			// Create a new user
			const newUser = new User({
				username,
				email,
				password: hashedPassword,
				phone,
			});

			await newUser.save();
			const newCart = new Cart({
				_id: newUser._id,
				user: newUser._id,
				items: [],
			});
			await newCart.save();
			const newShipping = new Shipping({
				user: newUser._id,
				name: username,
				email: email,
				phone: phone,
				province: "Bagmati",
				city: "Kathmandu",
				area: "Newroad",
				street: "Sundhara",
			});
			await newShipping.save();

			return res.status(201).json({ message: "User registered successfully" });
		} catch (error) {
			console.error("Error registering user:", error);
			return res.status(500).json({ error: "Internal server error" });
		}
	} else {
		return res.status(405).json({ error: "Method not allowed" });
	}
}
