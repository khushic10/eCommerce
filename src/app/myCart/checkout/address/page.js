import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../../components/Context";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";

export default function Address() {
	const router = useRouter();
	const { formData, setFormData } = useContext(AppContext);
	const [token, setToken] = useState("");
	const [errors, setErrors] = useState({});
	const [error, setError] = useState("");

	useEffect(() => {
		if (typeof window !== "undefined") {
			const storedToken = localStorage.getItem("ecomtoken");
			if (storedToken) {
				setToken(storedToken);
			} else {
				router.push("/login");
			}
		}
	}, [router]);

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
		console.log(validationErrors);
		if (Object.keys(validationErrors).length === 0) {
			try {
				const res = await fetch("/api/user/address", {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(formData),
				});

				if (!res.ok) {
					const error = await res.json();
					console.log(error);
					setError(error.error);
				} else {
					const data = await res.json();
					toast.success(data.message);
					console.log(data.message);
				}
			} catch (error) {
				console.error("Error updating address:", error);
				setError("Error updating address. Please try again later.");
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
		if (fieldName === "email") {
			fieldErrors =
				!value || !value.trim() || !/\S+@\S+\.\S+/.test(value)
					? "Email is invalid"
					: null;
		} else if (
			fieldName === "latitude" ||
			fieldName === "longitude" ||
			fieldName === "__v"
		) {
			fieldErrors = null;
		} else {
			fieldErrors = !value || !value.trim() ? `${fieldName} is required` : null;
		}
		return fieldErrors;
	};

	return (
		<div className="m-4">
			<ToastContainer position="top-center" />
			<form
				onSubmit={handleSubmit}
				className="bg-white p-8 rounded-xl shadow-md"
			>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="mb-4">
						<label className="block text-gray-700 font-semibold mb-2">
							Name:
						</label>
						<input
							className={`w-full px-3 py-2 text-gray-900 border ${
								errors.name ? "border-red-500" : "border-gray-300"
							} rounded-md focus:outline-none focus:border-blue-500`}
							type="text"
							name="name"
							value={formData.name || ""}
							onChange={handleChange}
						/>
						{errors.name && (
							<p className="text-red-500 text-xs mt-1">{errors.name}</p>
						)}
					</div>

					<div className="mb-4">
						<label className="block text-gray-700 font-semibold mb-2">
							Email:
						</label>
						<input
							className={`w-full px-3 py-2 text-gray-900 border ${
								errors.email ? "border-red-500" : "border-gray-300"
							} rounded-md focus:outline-none focus:border-blue-500`}
							type="email"
							name="email"
							value={formData.email || ""}
							onChange={handleChange}
						/>
						{errors.email && (
							<p className="text-red-500 text-xs mt-1">{errors.email}</p>
						)}
					</div>

					<div className="mb-4 col-span-2">
						<label className="block text-gray-700 font-semibold mb-2">
							Phone Number:
						</label>
						<input
							className={`w-full px-3 py-2 text-gray-900 border ${
								errors.phone ? "border-red-500" : "border-gray-300"
							} rounded-md focus:outline-none focus:border-blue-500`}
							type="text"
							name="phone"
							value={formData.phone || ""}
							onChange={handleChange}
						/>
						{errors.phone && (
							<p className="text-red-500 text-xs mt-1">{errors.phone}</p>
						)}
					</div>

					<div className="mb-4">
						<label className="block text-gray-700 font-semibold mb-2">
							Area:
						</label>
						<input
							className={`w-full px-3 py-2 text-gray-900 border ${
								errors.area ? "border-red-500" : "border-gray-300"
							} rounded-md focus:outline-none focus:border-blue-500`}
							type="text"
							name="area"
							value={formData.area || ""}
							onChange={handleChange}
						/>
						{errors.area && (
							<p className="text-red-500 text-xs mt-1">{errors.area}</p>
						)}
					</div>

					<div className="mb-4">
						<label className="block text-gray-700 font-semibold mb-2">
							Street:
						</label>
						<input
							className={`w-full px-3 py-2 text-gray-900 border ${
								errors.street ? "border-red-500" : "border-gray-300"
							} rounded-md focus:outline-none focus:border-blue-500`}
							type="text"
							name="street"
							value={formData.street || ""}
							onChange={handleChange}
						/>
						{errors.street && (
							<p className="text-red-500 text-xs mt-1">{errors.street}</p>
						)}
					</div>

					<div className="mb-4">
						<label className="block text-gray-700 font-semibold mb-2">
							Latitude:
						</label>
						<input
							className={`w-full px-3 py-2 text-gray-900 border ${
								errors.latitude ? "border-red-500" : "border-gray-300"
							} rounded-md focus:outline-none focus:border-blue-500`}
							type="text"
							name="latitude"
							value={formData.latitude || ""}
							onChange={handleChange}
						/>
						{errors.latitude && (
							<p className="text-red-500 text-xs mt-1">{errors.latitude}</p>
						)}
					</div>

					<div className="mb-4">
						<label className="block text-gray-700 font-semibold mb-2">
							Longitude:
						</label>
						<input
							className={`w-full px-3 py-2 text-gray-900 border ${
								errors.longitude ? "border-red-500" : "border-gray-300"
							} rounded-md focus:outline-none focus:border-blue-500`}
							type="text"
							name="longitude"
							value={formData.longitude || ""}
							onChange={handleChange}
						/>
						{errors.longitude && (
							<p className="text-red-500 text-xs mt-1">{errors.longitude}</p>
						)}
					</div>
				</div>

				{error && <p className="text-red-500 mb-4">{error}</p>}

				<div className="flex justify-center">
					<button
						type="submit"
						className="bg-gray-800 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-xl focus:outline-none focus:shadow-outline"
					>
						Submit
					</button>
				</div>
			</form>
		</div>
	);
}
