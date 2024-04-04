import { connectToDatabase } from "@/util/db";
import multer from "multer";
import { Product } from "@/util/model/Product";
import path from "path";
import sharp from "sharp";

const upload = multer({ dest: "public/images/" });

export const config = {
	api: {
		bodyParser: false,
	},
};

export default async function handler(req, res) {
	if (req.method === "POST") {
		try {
			await connectToDatabase();

			upload.single("image")(req, res, async function (err) {
				if (err) {
					console.error("Error uploading file:", err);
					return res.status(500).json({ error: "Internal server error" });
				}

				const { name, price, details } = req.body;
				const imagePath = req.file.path;
				const outputImagePath = path.join(
					"public/images",
					`${req.file.filename.replace(/\.\w+$/, "")}.jpg`
				);

				// Convert the uploaded image to JPG format
				await sharp(imagePath).toFormat("jpg").toFile(outputImagePath);

				const image = `http://localhost:3000/images/${path.basename(
					outputImagePath
				)}`;

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
