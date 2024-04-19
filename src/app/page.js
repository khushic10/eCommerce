"use client";
import { useEffect, useState } from "react";
import Navbar from "../../components/navbar";
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
			<div className="grid grid-cols-5">
				<Link href="/" className="col-span-2 ml-8">
					<img
						src="http://localhost:3000/img/Logo.png"
						alt="Logo"
						className="h-28 "
					/>
				</Link>
				<div className="bg-violet-200 rounded-2xl p-2 col-span-3 mr-4">
					<Navbar />
				</div>
			</div>
			<div className="bg-purple-400 p-6 rounded-3xl shadow-md text-center m-4">
				<h1 className=" text-white font-semibold mb-4 text-3xl">
					Shop Artworks
				</h1>
				<p className="text-yellow-900 text-sm">
					Her Artistry Novel: A showcase of creativity and expression. Explore a
					curated selection of captivating artwork, each piece a chapter in a
					visual story. From vibrant paintings to evocative ideas, immerse
					yourself in a world where imagination knows no bounds. Buy Artworks
					and experience the beauty and narrative by Her Artistry Novel
				</p>
			</div>
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
										className="bg-yellow-300 text-indigo-500 text-xs p-1 my-2 rounded h-1/2 font-semibold"
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
