"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreateProduct() {
	const [formData, setFormData] = useState({
		name: "",
		details: "",
		price: "",
		image: null,
	});
	const [token, setToken] = useState(null);
	const router = useRouter();
	function onLogout() {
		setToken(null);
		localStorage.removeItem("merchantToken");
	}
	useEffect(() => {
		if (typeof window !== "undefined") {
			const storedToken = localStorage.getItem("merchantToken");
			const storedRole = localStorage.getItem("role");
			if (storedToken && storedRole === "merchant") {
				console.log(storedRole);
				setToken(storedToken);
			} else {
				router.push("/merchantLogin");
			}
		}
	}, []);

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
			if (token) {
				const response = await fetch("/api/upload", {
					method: "POST",
					body: postData,
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				if (!response.ok) {
					throw new Error("Failed to create product");
				}

				const data = await response.json();
				console.log("Product created successfully:", data);
				// Reset form fields or provide feedback to the user
			} else {
				router.push("/merchantLogin");
			}
		} catch (error) {
			console.error("Error creating product:", error.message);
			// Handle errors or provide feedback to the user
		}
	};

	return (
		<div>
			<button onClick={() => onLogout()}>Logout</button>
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
