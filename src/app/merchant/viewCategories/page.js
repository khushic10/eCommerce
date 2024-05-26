"use client";
import MerchantNavbar from "@/components/merchantNavbar";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

export default function page() {
	const [categories, setCategories] = useState([]);
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
				const response = await fetch("/api/merchant/category", {
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				if (response.ok) {
					const data = await response.json();
					console.log(data);
					setCategories(data);
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
	const Remove = async (categoryId) => {
		try {
			if (token) {
				const res = await fetch("/api/merchant/category", {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ categoryId }),
				});
				if (!res.ok) {
					const data = await res.json();
					toast.error(data.error);
				} else {
					const data = await res.json();
					toast.success(data.message);
					setCategories(data.category);
					fetchData();
				}
			}
		} catch (error) {
			console.log(error.message);
		}
	};
	return (
		<div className="">
			<ToastContainer position="top-center" autoClose={1500} />
			<MerchantNavbar />
			<div className="mx-16 my-10">
				<div className="grid grid-cols-6 gap-2">
					{categories &&
						categories.map((category) => (
							<div
								className="bg-white shadow-md rounded-lg p-4"
								key={category._id}
							>
								<div className="flex justify-between items-center mb-2">
									<div className="text-lg text-custom-black">
										{category.categoryName}
									</div>
									<button
										className="bg-custom-orange text-custom-gray text-sm py-1 px-2 rounded-lg font-medium"
										onClick={() => Remove(category._id)}
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
