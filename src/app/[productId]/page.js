"use client";
import { useEffect, useState } from "react";
import Navbar from "../../components/navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";

export default function ProductDetail({ params }) {
	const [product, setProduct] = useState();
	const [other, setOther] = useState([]);
	const [token, setToken] = useState("");
	const [quantity, setQuantity] = useState(0);
	const router = useRouter();
	const productId = params.productId;
	useEffect(() => {
		if (typeof window !== "undefined") {
			const storedUserId = localStorage.getItem("ecomtoken");
			if (storedUserId) {
				setToken(storedUserId);
			}
		}
		const fetchData = async () => {
			try {
				const response = await fetch(
					`/api/user/product?productId=${productId}`
				);
				const data = await response.json();
				setProduct(data);
			} catch (error) {
				console.error("Error fetching products:", error);
			}
			try {
				const response = await fetch(
					`/api/user/otherProduct/?productId=${productId}`
				);
				const data = await response.json();
				setOther(data);
			} catch (error) {
				console.error("Error fetching products:", error);
			}
		};

		fetchData();
	}, []);
	const decreaseQuantity = () => {
		if (quantity > 0) {
			setQuantity((prevQuantity) => prevQuantity - 1);
		}
	};
	const increaseQuantity = () => {
		if (quantity < 10) {
			setQuantity((prevQuantity) => prevQuantity + 1);
		}
	};

	const addCart = async () => {
		try {
			if (token) {
				const res = await fetch("/api/user/cart", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ productId, quantity }),
				});
				if (!res.ok) {
					console.log("error");
					throw new Error("Error adding item to cart");
				}
				toast.success("Item added to the cart.");
			} else {
				router.push("/login");
			}
		} catch (error) {
			console.log(error.message);
		}
	};
	return (
		<div>
			<ToastContainer position="top-center" autoClose={1500} />
			<Navbar />
			{product && (
				<div className=" m-12">
					<Link
						href="/"
						className=" bg-custom-black text-white rounded py-1 px-2"
					>
						Back
					</Link>
					<div className="grid grid-cols-2 gap-6">
						<div className="h-screen">
							<img
								className=" rounded-2xl h-full w-full"
								src={product.image}
								alt=""
							/>
						</div>
						<div className=" ml-2 mr-2 mt-0.5">
							<h1 className="m-2 text-4xl text-yellow-700 font-serif">
								{product.name}
							</h1>
							<div>
								<p className="m-2 text-xm font-semibold text-custom-black font-sans">
									{product.details}
								</p>
								<p className="flex justify-start items-start text-xl font-bold text-gray-500 m-4">
									<span className=" text-sm mr-1 font-semibold font-serif">
										Price:
									</span>{" "}
									Rs.
									{product.price}
								</p>
								<div className="flex items-center m-4 text-yellow-700 font-serif">
									Quantity:
									<button
										className="bg-red-500 m-2 px-2 text-xl rounded-md text-white font-bold"
										onClick={decreaseQuantity}
									>
										-
									</button>
									{quantity}
									<button
										className="bg-green-500 m-2 px-2 text-xl rounded-md text-white font-bold"
										onClick={increaseQuantity}
									>
										+
									</button>
								</div>
								<button
									className="bg-custom-orange text-custom-gray text-sm p-2 m-2 rounded-lg h-1/2 font-semibold"
									onClick={() => addCart(productId)}
								>
									Add To Cart
								</button>
								<div className="grid grid-cols-4 gap-2 mt-2">
									{other.map((other) => (
										<Link href={`/${other._id}`} key={other._id}>
											<div className="h-40 p-1 hover:bg-custom-red rounded-2xl">
												<img
													className=" rounded-2xl h-full w-full"
													src={other.image}
													alt=""
												/>
											</div>
										</Link>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
