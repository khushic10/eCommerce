"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../../../components/navbar";
import { useRouter } from "next/navigation";

export default function Page() {
	const [token, setToken] = useState("");
	const [products, setProducts] = useState(null);
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
	useEffect(() => {
		if (token) {
			fetchData();
		}
	}, [token]);
	const fetchData = async () => {
		try {
			const res = await fetch("/api/cart", {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (res.ok) {
				const data = await res.json();
				setProducts(data);
			} else {
				const error = await res.json();
				console.log(error.error);
			}
		} catch (error) {
			console.error("Error fetching products:", error);
		}
	};
	const Remove = async (productId) => {
		try {
			if (token) {
				const res = await fetch("/api/cart", {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ productId }),
				});
				if (!res.ok) {
					console.log("error");
					throw new Error("Error deleting item from cart");
				}
				setProducts(
					products.filter((product) => product.product._id !== productId)
				);
				alert("Item has been successfully deleted from the cart.");
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	return (
		<div>
			<div className="grid grid-cols-4">
				<Link href="/" className="col-span-2">
					<img
						src="http://localhost:3000/img/Logo.png"
						alt="Logo"
						className="h-32 "
					/>
				</Link>
				<div className=" col-span-2">
					<Navbar />
				</div>
			</div>
			<div className=" m-12">
				<h1 className="m-2 text-2xl text-yellow-700">Artworks in Cart</h1>
				<div className="container mx-auto">
					<div className="grid grid-cols-4 gap-6">
						{products &&
							products.cart.items &&
							products.cart.items.map((product) => (
								<div className=" h-96" key={product.product._id}>
									<div className=" h-72">
										<img
											className=" rounded-2xl h-full w-full"
											src={product.product.image}
											alt=""
										/>
									</div>
									<div className="flex justify-between ml-2 mr-2 mt-0.5">
										<div>
											<h2 className=" text-purple-900 text-sm">
												{product.product.name}
											</h2>
											<p className="flex justify-start items-start text-sm font-bold text-gray-500">
												<span className=" text-xs mr-1 font-semibold">
													Price:
												</span>{" "}
												Rs.
												{product.product.price}
											</p>
											<h3 className=" text-purple-900 text-sm">
												Quantity: {product.quantity}
											</h3>
										</div>
										<button
											className="bg-red-500 text-white text-xs p-1 my-2 rounded h-1/2 font-semibold"
											onClick={() => Remove(product.product._id)}
										>
											Remove
										</button>
									</div>
								</div>
							))}
					</div>
					<h2 className="text-sm text-yellow-700">
						Total No Of Items In Cart: {products ? products.NoOfItems : 0}
					</h2>
					<h2 className="text-sm text-yellow-700">
						Total Cost for Items in Cart: {products ? products.TotalCost : 0}
					</h2>
				</div>
			</div>
		</div>
	);
}