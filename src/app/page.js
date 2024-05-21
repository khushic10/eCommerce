"use client";
import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
	const [products, setProducts] = useState([]);
	const [token, setToken] = useState("");
	const router = useRouter();

	useEffect(() => {
		if (typeof window !== "undefined") {
			const storedUserId = localStorage.getItem("ecomtoken");
			if (storedUserId) {
				setToken(storedUserId);
			}
		}
		const fetchData = async () => {
			try {
				const response = await fetch("/api/products");
				const data = await response.json();
				setProducts(data);
			} catch (error) {
				console.error("Error fetching products:", error);
			}
		};

		fetchData();
	}, []);

	const addCart = async (productId) => {
		try {
			if (token) {
				const res = await fetch("/api/cart", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ productId, quantity: 1 }),
				});
				if (!res.ok) {
					console.log("error");
					throw new Error("Error adding item to cart");
				}
				alert("Item has been successfully added to the cart.");
			} else {
				router.push("/login");
			}
		} catch (error) {
			console.log(error.message);
		}
	};
	return (
		<div>
			<Navbar />
			<div className=" m-12">
				<h1 className="m-2 text-2xl text-yellow-700 ">Available Artworks</h1>
				<div className="container mx-auto">
					<div className="grid grid-cols-4 gap-6">
						{products.map((product) => (
							<div className=" h-96" key={product._id}>
								<Link href={`/${product._id}`}>
									<div className=" h-72">
										<img
											className=" rounded-2xl h-full w-full"
											src={product.image}
											alt=""
										/>
									</div>
								</Link>
								<div className="flex justify-between ml-2 mr-2 mt-0.5">
									<div>
										<h2 className=" text-purple-900 text-sm">{product.name}</h2>
										<p className="flex justify-start items-start text-sm font-bold text-gray-500">
											<span className=" text-xs mr-1 font-semibold">
												Price:
											</span>{" "}
											Rs.
											{product.price}
										</p>
									</div>
									<button
										className="bg-custom-orange font-sans text-custom-gray text-sm py-1 px-2 my-2 rounded-lg h-1/2 font-medium"
										onClick={() => addCart(product._id)}
									>
										Add To Cart
									</button>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
