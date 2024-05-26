import { connectToDatabase } from "@/util/db";
import { Category } from "@/util/model/Category";
import jwt from "jsonwebtoken";

async function verifyToken(authorizationHeader, res) {
	if (!authorizationHeader) {
		res.status(403).json({ error: "Authorization header missing" });
		return null;
	}
	const token = authorizationHeader.replace("Bearer ", "").trim();
	if (!token) {
		res.status(403).json({ error: "Token is null or empty" });
		return null;
	}
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		if (decoded.role !== "merchant") {
			res.status(403).json({ error: "Unauthorized access" });
			return null;
		} else {
			return decoded.merchantId;
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

		if (!userId) {
			return; // Exit if verification fails
		}

		if (req.method === "GET") {
			const categories = await Category.find();
			return res.status(200).json(categories);
		} else if (req.method === "POST") {
			const { categoryName } = req.body;

			if (!categoryName) {
				return res.status(400).json({ error: "categoryName is required" });
			}

			const newCategory = new Category({
				categoryName,
			});
			await newCategory.save();

			return res.status(201).json({
				message: "New category added successfully",
				category: newCategory,
			});
		} else if (req.method === "DELETE") {
			const { categoryId } = req.body;

			if (!categoryId) {
				return res.status(400).json({ error: "categoryId is required" });
			}

			const category = await Category.findOne({ _id: categoryId });
			if (!category) {
				return res.status(404).json({ error: "Category not found" });
			}

			await Category.deleteOne({ _id: categoryId });
			const updatedCategory = await Category.find();

			res.status(200).json({
				message: "category deleted successfully",
				category: updatedCategory,
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
