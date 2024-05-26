"use client";
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AppContext } from "@/components/Context";

export default function Payment({ amount, id }) {
	const [token, setToken] = useState("");
	const { formData, setFormData } = useContext(AppContext);
	const [error, setError] = useState("");
	const router = useRouter();
	useEffect(() => {
		if (typeof window !== "undefined") {
			const storedToken = localStorage.getItem("ecomtoken");
			if (storedToken) {
				setToken(storedToken);
			} else {
				router.push("/login");
			}
		}
	}, []);
	const payload = {
		return_url: "http://localhost:3000/success/",
		website_url: "http://localhost:3000/",
		amount: amount,
		purchase_order_id: "test12",
		purchase_order_name: formData.name,
		customer_info: {
			name: formData.name,
			email: formData.email,
			phone: formData.phone,
		},
	};
	const emptyCart = async () => {
		try {
			if (token) {
				const res = await fetch("/api/user/cart", {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				});
				if (!res.ok) {
					const error = await res.json();
					console.log(error.error);
				} else {
					const data = await res.json();
					console.log(data);
				}
			}
		} catch (error) {
			console.log(error.message);
		}
	};
	const handleCash = () => {
		emptyCart();
		router.push("/orderSuccess");
	};
	const handleSubmit = async () => {
		try {
			const res = await fetch("/api/user/payment", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});

			if (!res.ok) {
				const error = await res.json();
				console.log(error);
			} else {
				const data = await res.json();
				console.log(data);
				emptyCart();
				router.push(data.payment_url);
			}
		} catch (error) {
			setError(error.message);
		}
	};
	return (
		<div className="p-8">
			<div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md">
				<h1 className="text-2xl font-bold mb-6 text-center">
					Proceed to Payment
				</h1>
				<div className="text-center mb-4">Select payment method</div>
				<div className="flex flex-col items-center gap-4">
					<div
						className="bg-custom-pink text-custom-black border border-gray-300 rounded-md py-2 px-4 cursor-pointer hover:bg-gray-100"
						onClick={handleCash}
					>
						Cash on delivery
					</div>
					<div
						className="bg-custom-pink text-custom-black borderborder border-gray-300 rounded-md py-2 px-4 cursor-pointer hover:bg-gray-100"
						onClick={handleSubmit}
					>
						Khalti payment
					</div>
				</div>
			</div>
		</div>
	);
}
