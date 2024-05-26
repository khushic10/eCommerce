import { connectToDatabase } from "../../../src/util/db";
import { Shipping } from "../../../src/util/model/Shipping";
import jwt from "jsonwebtoken";

async function verifyToken(authorizationHeader, res) {
	if (!authorizationHeader) {
		res.status(403).json({ error: "Authorization header is missing" });
		return null;
	}
	const token = authorizationHeader.replace("Bearer ", "").trim();
	if (!token) {
		res.status(403).json({ error: "Token is null" });
		return null;
	}
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		if (decoded.role === "user") {
			return decoded.userId;
		} else {
			res.status(403).json({ error: "Unauthorized Access" });
			return null;
		}
	} catch (error) {
		res.status(403).json({ error: "Invalid Token" });
		return null;
	}
}

export default async function handler(req, res) {
	try {
		await connectToDatabase();
		const userId = await verifyToken(req.headers.authorization, res);

		if (!userId) return; // If userId is null, an error response has already been sent
		if (req.method === "GET") {
			try {
				await connectToDatabase();
				const userId = await verifyToken(req.headers.authorization, res);
				const address = await Shipping.find({ user: userId });
				res.status(200).json(address);
			} catch (error) {
				console.error("Error fetching products:", error);
				res.status(500).json({ error: "Internal server error" });
			}
		} else if (req.method === "PUT") {
			const { name, phone, area, street, latitude, longitude } = req.body;

			const updatedShipping = await Shipping.findOneAndUpdate(
				{ user: userId },
				{ name, phone, area, street, latitude, longitude },
				{ new: true }
			);

			if (!updatedShipping) {
				return res.status(404).json({ error: "Shipping not found" });
			}

			return res.status(200).json({
				message: "Shipping info updated successfully!",
				updatedShipping,
			});
		} else {
			return res.status(405).json({ error: "Method not allowed" });
		}
	} catch (error) {
		console.error("Error:", error.message);
		if (error instanceof jwt.JsonWebTokenError) {
			return res.status(401).json({ error: "Invalid token" });
		}
		return res.status(500).json({ error: "Internal server error" });
	}
}
