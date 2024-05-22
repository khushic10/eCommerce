"use client";
import MerchantNavbar from "@/components/merchantNavbar";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

export default function page() {
	const [products, setProducts] = useState([]);
	const [token, setToken] = useState("");
	const router = useRouter();
	useEffect(() => {
		if (typeof window !== "undefined") {
			const storedToken = localStorage.getItem("merchantToken");
			const storedRole = localStorage.getItem("role");
			if (storedToken && storedRole === "merchant") {
				setToken(storedToken);
			} else {
				router.push("/merchant/merchantLogin");
			}
		}
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch("/api/merchant/merchantProduct", {
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				if (response.ok) {
					const data = await response.json();
					console.log(data);
					setProducts(data);
				} else {
					const error = await response.json();
					console.log(error);
				}
			} catch (error) {
				console.error("Error fetching products:", error);
			}
		};
		if (token) {
			fetchData();
		}
	}, [token]);
	const Remove = async (productId) => {
		try {
			if (token) {
				const res = await fetch("/api/merchant/merchantProduct", {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ productId }),
				});
				if (!res.ok) {
					console.log("error");
					toast.error("Error deleting the artwork");
				} else {
					toast.success("Artwork has been deleted successfully");
					const data = await res.json();
					setProducts(data.products);
					fetchData();
				}
			}
		} catch (error) {
			console.log(error.message);
		}
	};
	return (
		<div>
			<ToastContainer position="top-center" autoClose={1500} />
			<MerchantNavbar />
			<div className="m-12">
				<div className="grid grid-cols-3 gap-2">
					{products &&
						products.map((product) => (
							<div className=" h-96" key={product._id}>
								<div className=" h-72">
									<img
										className=" rounded-2xl h-full w-full"
										src={product.image}
										alt=""
									/>
								</div>
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
										onClick={() => Remove(product._id)}
									>
										Delete
									</button>
								</div>
							</div>
						))}
				</div>
			</div>
		</div>
	);
}
