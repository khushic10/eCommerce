"use client";
import { useState } from "react";

export default function CreateProduct() {
	const [formData, setFormData] = useState({
		name: "",
		details: "",
		price: "",
		image: null,
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleImageChange = (e) => {
		setFormData({ ...formData, image: e.target.files[0] });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const postData = new FormData();
		postData.append("name", formData.name);
		postData.append("details", formData.details);
		postData.append("price", formData.price);
		postData.append("image", formData.image);

		try {
			const response = await fetch("/api/upload", {
				method: "POST",
				body: postData,
			});

			if (!response.ok) {
				throw new Error("Failed to create product");
			}

			const data = await response.json();
			console.log("Product created successfully:", data);
			// Reset form fields or provide feedback to the user
		} catch (error) {
			console.error("Error creating product:", error.message);
			// Handle errors or provide feedback to the user
		}
	};

	return (
		<div>
			<h1>Create Product</h1>
			<form onSubmit={handleSubmit}>
				<div>
					<label htmlFor="name">Name:</label>
					<input
						type="text"
						id="name"
						name="name"
						value={formData.name}
						onChange={handleChange}
					/>
				</div>
				<div>
					<label htmlFor="details">Details:</label>
					<textarea
						id="details"
						name="details"
						value={formData.details}
						onChange={handleChange}
					/>
				</div>
				<div>
					<label htmlFor="price">Price:</label>
					<input
						type="text"
						id="price"
						name="price"
						value={formData.price}
						onChange={handleChange}
					/>
				</div>
				<div>
					<label htmlFor="image">Image:</label>
					<input
						type="file"
						id="image"
						name="image"
						accept="image/*"
						onChange={handleImageChange}
					/>
				</div>
				<button type="submit">Submit</button>
			</form>
		</div>
	);
}