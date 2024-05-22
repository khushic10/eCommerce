"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function page() {
	const [token, setToken] = useState("");
	const [products, setProducts] = useState(null);
	const [amount, setAmount] = useState("");
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
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
		purchase_order_name: name,
		customer_info: {
			name: name,
			email: email,
			phone: phone,
		},
	};
	useEffect(() => {
		if (token) {
			fetchData();
		}
	}, [token]);
	const fetchData = async () => {
		try {
			const res = await fetch("/api/user/cart", {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (res.ok) {
				const data = await res.json();
				setProducts(data);
				setAmount(data.TotalCost * 100);
				console.log(data);
			} else {
				const error = await res.json();
				console.log(error.error);
			}
		} catch (error) {
			console.error("Error fetching products:", error);
		}
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
	const handleSubmit = async (e) => {
		e.preventDefault();

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
			<Link
				href="/myCart"
				className="bg-gray-700 text-white px-4 py-1 rounded-lg"
			>
				Back
			</Link>
			<h1 className="text-2xl font-bold mb-6 text-center">Payment</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				<div className="border shadow-md rounded-xl max-h-svh overflow-auto p-4 bg-white">
					<h2 className="text-xl font-semibold mb-4 text-center">
						Your Orders
					</h2>
					<div>
						{products &&
							products.cart.items &&
							products.cart.items.map((product) => (
								<div
									className="grid grid-cols-2 gap-4 m-2 items-center"
									key={product.product._id}
								>
									<div className="h-40">
										<img
											className="rounded-2xl h-full w-auto object-cover"
											src={product.product.image}
											alt={product.product.name}
										/>
									</div>
									<div className="ml-2">
										<h3 className="text-lg font-semibold">
											Her Artistry Novel
										</h3>
										<h2 className="text-sm text-red-800">
											{product.product.name}
										</h2>
										<p className="text-sm font-bold text-gray-500">
											<span className="text-xs mr-1 font-semibold">Price:</span>{" "}
											Rs. {product.product.price}
										</p>
									</div>
								</div>
							))}
					</div>
				</div>
				<div>
					<div className="border shadow p-4 rounded-xl mb-8">
						<h1 className="text-xl font-semibold mb-4 text-center">
							Order Summary
						</h1>
						<div className="bg-gray-200 rounded-xl p-4">
							<h1 className="text-lg font-semibold mb-2">Cart Items</h1>
							<h2 className="text-sm text-yellow-700 mb-1">
								Total No Of Items: {products ? products.NoOfItems : 0}
							</h2>
							<h2 className="text-sm text-yellow-700">
								Total Cost:Rs. {products ? products.TotalCost : 0}
							</h2>
						</div>
					</div>
					<form
						onSubmit={handleSubmit}
						className="bg-white p-8 rounded-xl shadow-md"
					>
						<div className="mb-4">
							<label
								htmlFor="name"
								className="block text-gray-700 font-semibold mb-2"
							>
								Name:
							</label>
							<input
								className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
								type="text"
								id="name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
							/>
						</div>
						<div className="mb-4">
							<label
								htmlFor="email"
								className="block text-gray-700 font-semibold mb-2"
							>
								Email:
							</label>
							<input
								className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
								type="email"
								id="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>
						<div className="mb-4">
							<label
								htmlFor="phone"
								className="block text-gray-700 font-semibold mb-2"
							>
								Phone:
							</label>
							<input
								className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
								type="text"
								id="phone"
								value={phone}
								onChange={(e) => setPhone(e.target.value)}
								required
							/>
						</div>
						{error && <p className="text-red-500 mb-4">{error}</p>}
						<div className="flex justify-center">
							<button
								type="submit"
								className="bg-gray-800 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-xl focus:outline-none focus:shadow-outline"
							>
								Proceed To Payment
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
