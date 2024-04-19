import { connectToDatabase } from "@/util/db";
import { Cart } from "@/util/model/Cart";
import jwt from "jsonwebtoken";

async function verifyToken(authorizationHeader, res) {
	if (!authorizationHeader) {
		res.status(403).json({ error: "Authorization header missing" });
	}
	const token = authorizationHeader.replace("Bearer ", "").trim();
	if (!token) {
		res.status(403).json({ error: "Token is null or empty" });
	}
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		console.log(decoded);
		if (decoded.role !== "user") {
			res.status(403).json({ error: "Unauthorized access" });
		} else {
			return decoded.userId;
		}
	} catch (error) {
		res.status(403).json({ error: "Invalid Token" });
	}
}

export default async function handler(req, res) {
	try {
		await connectToDatabase();

		const userId = await verifyToken(req.headers.authorization, res);

		if (req.method === "GET") {
			const cart = await Cart.findOne({ user: userId }).populate(
				"items.product"
			);
			if (!cart) {
				return res.status(404).json({ error: "Cart not found" });
			}
			let NoOfItems = 0;
			let TotalCost = 0;
			cart.items.forEach((item) => {
				NoOfItems += item.quantity;
				TotalCost += item.quantity * item.product.price;
			});
			return res.status(200).json({ cart, NoOfItems, TotalCost });
		} else if (req.method === "POST") {
			const { productId, quantity } = req.body;

			if (!productId || !quantity) {
				return res
					.status(400)
					.json({ error: "productId and quantity are required" });
			}

			let cart = await Cart.findOne({ user: userId });
			if (!cart) {
				return res.status(404).json({ error: "Cart not found" });
			}

			const existingItemIndex = cart.items.findIndex(
				(item) => item.product._id.toString() === productId
			);
			if (existingItemIndex !== -1) {
				cart.items[existingItemIndex].quantity += quantity;
			} else {
				cart.items.push({ product: productId, quantity });
			}
			await cart.save();

			return res
				.status(201)
				.json({ message: "Item added to cart successfully" });
		} else if (req.method === "DELETE") {
			const { productId } = req.body;

			if (!productId) {
				return res.status(400).json({ error: "productId is required" });
			}

			const cart = await Cart.findOne({ user: userId });
			if (!cart) {
				return res.status(404).json({ error: "Cart not found" });
			}

			const itemIndex = cart.items.findIndex(
				(item) => item.product._id.toString() === productId
			);
			if (itemIndex === -1) {
				return res.status(404).json({ error: "Item not found in cart" });
			}
			cart.items.splice(itemIndex, 1);
			await cart.save();
			let NoOfItems = 0;
			let TotalCost = 0;
			cart.items.forEach((item) => {
				NoOfItems += item.quantity;
				TotalCost += item.quantity * item.product.price;
			});

			return res.status(200).json({ cart, NoOfItems, TotalCost });
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
