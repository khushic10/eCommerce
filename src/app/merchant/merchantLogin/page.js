"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/navbar";

export default function Login() {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [errors, setErrors] = useState({});
	const [error, setError] = useState("");
	const router = useRouter();
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
		if (Object.keys(validationErrors).length === 0) {
			try {
				const res = await fetch("/api/merchantLogin", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(formData),
				});

				if (!res.ok) {
					const error = res.json();
					setError(error.error);
				}

				const data = await res.json();
				localStorage.setItem("merchantToken", data.token);
				localStorage.setItem("merchantId", `${data.merchantId}`);
				localStorage.setItem("role", `${data.role}`);
				router.push("/");
			} catch (error) {
				setError(error.message);
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
				!value.trim() || !/\S+@\S+\.\S+/.test(value)
					? "Email is invalid"
					: null;
		} else {
			fieldErrors = !value.trim() ? `${fieldName} is required` : null;
		}
		return fieldErrors;
	};

	return (
		<div className="flex justify-center items-center min-h-screen bg-custom-gray">
			<div className="bg-custom-red w-1/2 p-6 rounded-2xl rounded-bl-2xl flex flex-col justify-center items-center">
				<h1 className="text-3xl font-bold text-custom-gray my-6">
					Merchant Login
				</h1>
				<form onSubmit={handleSubmit}>
					<div>
						<div className="text-sm font-semibold text-custom-creme mb-2">
							Email
						</div>
						<input
							className="w-64 h-10 px-4 py-2 mb-4 border rounded-md focus:outline-none focus:border-custom-brown placeholder-custom-gray"
							type="email"
							id="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							required
						/>
						{errors.email && <div className="text-red-600">{errors.email}</div>}
					</div>
					<div>
						<div className="text-sm font-semibold text-custom-creme mb-2">
							Password
						</div>
						<input
							className="w-64 h-10 px-4 py-2 mb-4 border rounded-md focus:outline-none focus:border-custom-brown placeholder-custom-gray"
							type="password"
							id="password"
							name="password"
							value={formData.password}
							onChange={handleChange}
							required
						/>
						{errors.password && (
							<div className="text-red-600">{errors.password}</div>
						)}
					</div>
					{error && <p className="text-red-600">{error}</p>}
					<div className="flex justify-center align-center m-8">
						<button
							type="submit"
							className="bg-custom-brown hover:bg-custom-black text-custom-creme font-semibold py-1 px-10 rounded-xl focus:outline-none focus:shadow-outline"
						>
							Login
						</button>
					</div>
					<div className="text-center text-custom-black">
						Don't have an account yet?{" "}
						<Link href="/merchant/merchantRegister">
							<span className="cursor-pointer text-custom-black font-semibold">
								Sign Up
							</span>
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
}
