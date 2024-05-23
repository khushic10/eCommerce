"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MerchantNavbar from "@/components/merchantNavbar";
import { ToastContainer, toast } from "react-toastify";

export default function CreateProduct() {
	const initialState = {
		name: "",
		details: "",
		price: "",
		image: null,
		category: "",
	};
	const [formData, setFormData] = useState(initialState);
	const [token, setToken] = useState(null);
	const router = useRouter();
	const [errors, setErrors] = useState({});
	const [error, setError] = useState("");
	useEffect(() => {
		if (typeof window !== "undefined") {
			const storedToken = localStorage.getItem("merchantToken");
			const storedRole = localStorage.getItem("role");
			if (storedToken && storedRole === "merchant") {
				console.log(storedRole);
				setToken(storedToken);
			} else {
				router.push("/merchant/merchantLogin");
			}
		}
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
		const validationErrors = validateField(name, value);
		setErrors({
			...errors,
			[name]: validationErrors,
		});
	};

	const handleImageChange = (e) => {
		setFormData({ ...formData, image: e.target.files[0] });
		const validationErrors = validateField("image", e.target.files[0]);
		setErrors({
			...errors,
			image: validationErrors,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const validationErrors = validateForm(formData);
		console.log(formData);
		if (Object.keys(validationErrors).length === 0) {
			const postData = new FormData();
			postData.append("name", formData.name);
			postData.append("details", formData.details);
			postData.append("price", formData.price);
			postData.append("image", formData.image);
			postData.append("category", formData.category);
			try {
				if (token) {
					const response = await fetch("/api/merchant/upload", {
						method: "POST",
						body: postData,
						headers: {
							Authorization: `Bearer ${token}`,
						},
					});

					if (!response.ok) {
						const error = await response.json();
						console.log(error.error);
					}

					const data = await response.json();
					toast.success(data.message);
					setFormData(initialState);
				} else {
					router.push("/merchant/merchantLogin");
				}
			} catch (error) {
				console.error("Error creating product:", error.message);
				// Handle errors or provide feedback to the user
			}
		} else {
			setErrors(validationErrors);
		}
	};
	const validateForm = (data) => {
		let errors = {};
		for (let field in data) {
			const fieldErrors = validateField(field, data[field]);
			if (fieldErrors) {
				errors[field] = fieldErrors;
			}
		}
		return errors;
	};

	const validateField = (fieldName, value) => {
		let fieldErrors = null;
		if (fieldName === "image") {
			fieldErrors = value === null ? `${fieldName} is required` : null;
		} else {
			fieldErrors = !value.trim() ? `${fieldName} is required` : null;
		}
		return fieldErrors;
	};

	return (
		<>
			<ToastContainer position="top-center" autoClose={1500} />
			<div className="pb-8">
				<MerchantNavbar />
				<div className="max-w-md mx-auto mt-8 p-6 bg-custom-creme rounded-lg shadow-md">
					<h1 className="text-2xl font-bold text-custom-brown mb-4 text-center">
						Create Product
					</h1>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label htmlFor="name" className="text-custom-black font-medium">
								Name:
							</label>
							<input
								type="text"
								id="name"
								name="name"
								value={formData.name}
								onChange={handleChange}
								className="block w-full mt-1 rounded-md shadow-sm focus:border-custom-orange focus:ring focus:ring-custom-orange focus:ring-opacity-50"
							/>
							{errors.name && <div className="text-red-600">{errors.name}</div>}
						</div>
						<div>
							<label
								htmlFor="details"
								className="text-custom-black font-medium"
							>
								Details:
							</label>
							<textarea
								id="details"
								name="details"
								value={formData.details}
								onChange={handleChange}
								className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-custom-orange focus:ring focus:ring-custom-orange focus:ring-opacity-50"
							/>
							{errors.details && (
								<div className="text-red-600">{errors.details}</div>
							)}
						</div>
						<div>
							<label htmlFor="price" className="text-custom-black font-medium">
								Price:
							</label>
							<input
								type="number"
								id="price"
								name="price"
								value={formData.price}
								onChange={handleChange}
								className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-custom-orange focus:ring focus:ring-custom-orange focus:ring-opacity-50"
							/>
							{errors.price && (
								<div className="text-red-600">{errors.price}</div>
							)}
						</div>
						<div>
							<label
								htmlFor="category"
								className="text-custom-black font-medium"
							>
								Category:
							</label>
							<select
								id="category"
								name="category"
								value={formData.category}
								onChange={handleChange}
								className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-custom-orange focus:ring focus:ring-custom-orange focus:ring-opacity-50"
							>
								<option>--Select--</option>
								<option value="acrylic">Acrylic Painting</option>
								<option value="watercolor">Watercolor Painting</option>
								<option value="mandala">Mandala Art</option>
								<option value="digital">Digital Art</option>
								<option value="craft">Crafts</option>
							</select>
							{errors.category && (
								<div className="text-red-600">{errors.category}</div>
							)}
						</div>
						<div>
							<label htmlFor="image" className="text-custom-black font-medium">
								Image:
							</label>
							<input
								type="file"
								id="image"
								name="image"
								accept="image/*"
								onChange={handleImageChange}
								className="block mt-1"
							/>
							{errors.image && (
								<div className="text-red-600">{errors.image}</div>
							)}
						</div>
						<button
							type="submit"
							className="w-full bg-custom-orange text-white py-2 px-4 rounded-md shadow-sm hover:bg-custom-red focus:outline-none focus:ring-2 focus:ring-custom-orange focus:ring-opacity-50"
						>
							Submit
						</button>
					</form>
				</div>
			</div>
		</>
	);
}
