// Import necessary modules
import { connectToDatabase } from "@/util/db";
import multer from "multer";
import { Product } from "@/util/model/Product";
import path from "path";
import sharp from "sharp";
import jwt from "jsonwebtoken"; // Import jwt module

// Set up multer for file upload
const upload = multer({ dest: "public/images/" });

// Define API configuration
export const config = {
	api: {
		bodyParser: false,
	},
};

// Function to verify JWT token
async function verifyToken(authorizationHeader) {
	if (!authorizationHeader) {
		throw new Error("Authorization header missing");
	}
	const token = authorizationHeader.replace("Bearer ", "").trim();
	if (!token) {
		throw new Error("Token is null or empty");
	}
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		return decoded.userId;
	} catch (error) {
		throw new Error("Invalid token");
	}
}

// Define the API route handler
export default async function handler(req, res) {
	if (req.method === "POST") {
		try {
			// Establish database connection
			await connectToDatabase();

			// Verify JWT token
			const userId = await verifyToken(req.headers.authorization);

			// Handle file upload
			upload.single("image")(req, res, async function (err) {
				if (err) {
					console.error("Error uploading file:", err);
					return res.status(500).json({ error: err.message });
				}

				// Extract product data and image path
				const { name, price, details } = req.body;
				const imagePath = req.file.path;
				const outputImagePath = path.join(
					"public/images",
					`${req.file.filename.replace(/\.\w+$/, "")}.jpg`
				);

				// Convert uploaded image to JPG format
				await sharp(imagePath).toFormat("jpg").toFile(outputImagePath);

				// Construct image URL
				const image = `http://localhost:3000/images/${path.basename(
					outputImagePath
				)}`;

				// Create new Product instance and save to database
				const product = new Product({ name, price, details, image, userId });
				await product.save();

				// Return success response
				res.status(201).json({
					success: true,
					message: "Product created successfully",
					product,
				});
			});
		} catch (error) {
			console.error("Error creating product:", error);
			res.status(500).json({ success: false, error: error.message });
		}
	} else {
		res.status(405).json({ error: "Method not allowed" });
	}
}
