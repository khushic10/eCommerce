import { connectToDatabase } from "@/util/db";
import { Product } from "@/util/model/Product";
import jwt from "jsonwebtoken";

async function verifyToken(authorizationHeader, res) {
	if (!authorizationHeader) {
		res.status(403).json({ error: "Authorization header missing" });
		throw new Error("Authorization header missing");
	}

	const token = authorizationHeader.replace("Bearer ", "").trim();
	if (!token) {
		res.status(403).json({ error: "Token is null or empty" });
		throw new Error("Token is null or empty");
	}
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		if (decoded.role !== "merchant") {
			res.status(403).json({ error: "Unauthorized access" });
			throw new Error("Unauthorized access");
		} else {
			return decoded.merchantId;
		}
	} catch (error) {
		res.status(403).json({ error: "Invalid Token" });
		throw new Error("Invalid Token");
	}
}

export default async function handler(req, res) {
	if (req.method === "GET") {
		try {
			await connectToDatabase();
			const merchantId = await verifyToken(req.headers.authorization, res);
			const products = await Product.find({ merchantId: merchantId });
			res.status(200).json(products);
		} catch (error) {
			console.error("Error fetching products:", error);
			res.status(500).json({ error: "Internal server error" });
		}
	} else if (req.method === "DELETE") {
		try {
			await connectToDatabase();
			const merchantId = await verifyToken(req.headers.authorization, res);
			const { productId } = req.body;
			if (!productId) {
				res.status(400).json({ error: "Product ID is required" });
				return;
			}
			const product = await Product.findOne({
				_id: productId,
				merchantId: merchantId,
			});
			if (!product) {
				res.status(404).json({ error: "Product not found" });
				return;
			}

			await Product.deleteOne({ _id: productId });
			const updatedProducts = await Product.find({ merchantId: merchantId });

			res.status(200).json({
				message: "Product deleted successfully",
				products: updatedProducts,
			});
		} catch (error) {
			console.error("Error deleting product:", error.message);
			res.status(500).json({ error: "Internal server error" });
		}
	} else {
		res.setHeader("Allow", ["GET"]);
		res.status(405).json({ message: `Method ${req.method} not allowed` });
	}
}
