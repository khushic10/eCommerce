"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MerchantNavbar from "@/components/merchantNavbar";
import { ToastContainer, toast } from "react-toastify";

export default function CreateProduct() {
	const initialState = {
		categoryName: "",
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

	const handleSubmit = async (e) => {
		e.preventDefault();
		const validationErrors = validateForm(formData);
		console.log(formData);
		if (Object.keys(validationErrors).length === 0) {
			try {
				if (token) {
					const response = await fetch("/api/merchant/category", {
						method: "POST",

						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
						body: JSON.stringify(formData),
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
		fieldErrors = !value.trim() ? `${fieldName} is required` : null;
		return fieldErrors;
	};

	return (
		<>
			<ToastContainer position="top-center" autoClose={1500} />
			<div className="pb-8">
				<MerchantNavbar />
				<div className="max-w-md mx-auto mt-8 p-6 bg-custom-creme rounded-lg shadow-md">
					<h1 className="text-2xl font-bold text-custom-brown mb-4 text-center">
						Add Category
					</h1>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label
								htmlFor="categoryName"
								className="text-custom-black font-medium"
							>
								Category Name:
							</label>
							<input
								type="text"
								id="name"
								name="categoryName"
								value={formData.categoryName}
								onChange={handleChange}
								className="block w-full mt-1 rounded-md shadow-sm focus:border-custom-orange focus:ring focus:ring-custom-orange focus:ring-opacity-50"
							/>
							{errors.categoryName && (
								<div className="text-red-600">{errors.categoryName}</div>
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
