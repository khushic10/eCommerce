"use client";
import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";

export default function Home() {
	//comment
	const [products, setProducts] = useState([]);
	const [searchKey, setSearchKey] = useState("");
	const [searchError, setSearchError] = useState("");
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
				const response = await fetch("/api/user/products");
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
				const res = await fetch("/api/user/cart", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ productId, quantity: 1 }),
				});
				if (!res.ok) {
					console.log("error");
					toast.error("Error adding item to cart");
				}
				toast.success("Item added to cart");
			} else {
				router.push("/login");
			}
		} catch (error) {
			console.log(error.message);
		}
	};
	const handleSearchInputChange = (e) => {
		const value = e.target.value;
		setSearchKey(value);
		search(value);
	};
	const search = async (category) => {
		try {
			const res = await fetch(`/api/user/search?category=${category}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (!res.ok) {
				const error = await res.json();
				setSearchError(error.error);
			}
			const data = await res.json();
			setProducts(data);
		} catch (error) {
			console.log(error.message);
		}
	};
	return (
		<div>
			<ToastContainer position="top-center" autoClose={1500} />
			<Navbar />
			<div className=" m-12 sm:m-6">
				<div className="md:flex items-center justify-between mb-4">
					<h1 className="text-2xl font-semibold text-custom-orange">
						Available Artworks
					</h1>
					<div className="relative">
						<input
							type="text"
							value={searchKey}
							onChange={handleSearchInputChange}
							className="border border-gray-300 rounded-lg p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-custom-orange focus:border-transparent"
							placeholder="Search by category"
						/>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5 absolute left-3 top-2.5 text-gray-400"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fillRule="evenodd"
								d="M12.9 14.32a8 8 0 111.41-1.41l5.3 5.3a1 1 0 01-1.41 1.42l-5.3-5.3zM8 14a6 6 0 100-12 6 6 0 000 12z"
								clipRule="evenodd"
							/>
						</svg>
					</div>
				</div>
				<div className="container mx-auto">
					<div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-6 md:gap-4 sm:gap-2">
						{products &&
							products.map((product) => (
								<div className=" h-96" key={product._id}>
									<Link href={`/${product._id}`}>
										<div className=" h-72">
											<img
												className=" rounded-2xl h-full w-full sm:mt-2"
												src={product.image}
												alt=""
											/>
										</div>
									</Link>
									<div className="md:flex justify-between ml-2 mr-2 mt-0.5">
										<div>
											<div className="text-sm text-custom-red font-serif">
												Category:
												<span className="text-custom-orange ml-2">
													{product.category}
												</span>
											</div>
											<h2 className=" text-custom-brown text-sm">
												{product.name}
											</h2>
											<p className="flex justify-start items-start text-sm font-bold text-gray-500">
												<span className=" text-xs mr-1 font-semibold">
													Price:
												</span>{" "}
												Rs.
												{product.price}
											</p>
										</div>
										<button
											className="bg-custom-orange font-sans text-custom-gray text-sm py-1 px-2 my-2 rounded-lg h-1/2 font-medium "
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
