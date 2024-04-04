import { connectToDatabase } from "@/util/db";
import { Product } from "@/util/model/Product";
import multer from "multer";
import fs from "fs";
import path from "path";

const upload = multer({ dest: "public/images/" });

export const config = {
	api: {
		bodyParser: false,
	},
};

export default async function handler(req, res) {
	if (req.method === "GET") {
		try {
			await connectToDatabase();
			const products = await Product.find({});
			res.status(200).json(products);
		} catch (error) {
			console.error("Error fetching products:", error);
			res.status(500).json({ error: "Internal server error" });
		}
	} else {
		res.setHeader("Allow", ["GET"]);
		res.status(405).json({ message: `Method ${req.method} not allowed` });
	}
	if (req.method === "POST") {
		try {
			await connectToDatabase();

			upload.single("image")(req, res, async function (err) {
				if (err) {
					console.error("Error uploading file:", err);
					return res.status(500).json({ error: "Internal server error" });
				}

				const { name, price, details } = req.body;
				const image = req.file.path; // Path to the uploaded image

				const product = new Product({ name, price, details, image });
				await product.save();

				res
					.status(201)
					.json({ success: true, message: "Product created successfully" });
			});
		} catch (error) {
			console.error("Error creating product:", error);
			res.status(500).json({ success: false, error: "Internal server error" });
		}
	} else {
		res.status(405).json({ error: "Method not allowed" });
	}
}
