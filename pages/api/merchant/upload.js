import { connectToDatabase } from "@/util/db";
import multer from "multer";
import { Product } from "@/util/model/Product";
import { Merchant } from "@/util/model/Merchant";
import path from "path";
import sharp from "sharp";
import jwt from "jsonwebtoken";
import fs from "fs";

// Set up multer for file upload
const upload = multer({ dest: "public/images/" });

// Define API configuration
export const config = {
	api: {
		bodyParser: false,
	},
};

// Function to verify JWT token
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

// Function to handle image processing
async function processImage(imagePath, filename) {
	const outputImagePath = path.join("public/images", `${filename}.jpg`);
	await sharp(imagePath).toFormat("jpg").toFile(outputImagePath);
	return outputImagePath;
}

// Promisify the multer upload
const uploadFile = (req, res) => {
	return new Promise((resolve, reject) => {
		upload.single("image")(req, res, (err) => {
			if (err) {
				return reject(err);
			}
			resolve(req.file);
		});
	});
};

// Define the API route handler
export default async function handler(req, res) {
	if (req.method === "POST") {
		try {
			// Establish database connection
			await connectToDatabase();

			const merchantId = await verifyToken(req.headers.authorization, res);
			const merchant = await Merchant.findById(merchantId);
			if (!merchant) {
				return res.status(404).json({ error: "Merchant not found" });
			}
			const merchantName = merchant.fullName;

			// Handle file upload
			const file = await uploadFile(req, res);

			// Check if the file is uploaded
			if (!file) {
				return res.status(400).json({ error: "Image file is required" });
			}

			// Extract product data and image path
			const { name, price, details, category, artist } = req.body;
			if (!name || !price || !details || !category) {
				return res.status(400).json({ error: "All fields are required" });
			}

			// Check for duplicate product name
			const existingProduct = await Product.findOne({ name });
			if (existingProduct) {
				return res
					.status(409)
					.json({ error: "Product with this name already exists" });
			}

			const imagePath = file.path;
			const outputImagePath = await processImage(
				imagePath,
				file.filename.replace(/\.\w+$/, "")
			);

			// Construct image URL
			const image = `http://localhost:3000/images/${path.basename(
				outputImagePath
			)}`;

			// Create new Product instance and save to database
			const product = new Product({
				name,
				price,
				details,
				image,
				category,
				merchantId,
				merchantName,
				artist,
			});
			await product.save();

			// Clean up the temporary file
			try {
				fs.unlinkSync(imagePath);
			} catch (cleanupError) {
				console.error("Error cleaning up temporary file:", cleanupError);
			}

			// Return success response
			res.status(201).json({
				success: true,
				message: "Product created successfully",
				product,
			});
		} catch (error) {
			console.error("Error creating product:", error);
			res.status(500).json({ success: false, error: error.message });
		}
	} else {
		res.status(405).json({ error: "Method not allowed" });
	}
}
