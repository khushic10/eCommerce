import { connectToDatabase } from "@/util/db";
import { Product } from "@/util/model/Product";

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
}
