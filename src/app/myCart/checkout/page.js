"use client";
import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import Summary from "./summary/page";
import Address from "./address/page";
import Payment from "./payment/page";
import { GrNext, GrPrevious } from "react-icons/gr";
import { useRouter } from "next/navigation";
import { AppContext } from "@/components/Context";

export default function CheckoutPage() {
	const [token, setToken] = useState("");
	const { formData, setFormData } = useContext(AppContext);
	const [products, setProducts] = useState(null);
	const [amount, setAmount] = useState(0); // Initialize amount state
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
	}, [router]);

	useEffect(() => {
		if (token) {
			fetchData();
			fetchAddress();
		}
	}, [token]);
	const fetchAddress = async () => {
		try {
			const res = await fetch("/api/user/address", {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (res.ok) {
				const data = await res.json();
				setFormData(data[0]); // Set the fetched data to the formData state
			} else {
				const error = await res.json();
				console.log(error.error);
			}
		} catch (error) {
			console.error("Error fetching address:", error);
		}
	};

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

	const [page, setPage] = useState(1);

	const nextPage = () => {
		setPage(page + 1);
	};

	const prevPage = () => {
		setPage(page - 1);
	};

	return (
		<div className="p-8">
			<Link href="/myCart">
				<div className="bg-gray-700 text-white px-4 py-1 rounded-lg w-16">
					Back
				</div>
			</Link>
			<div className="flex justify-between my-8 mx-60">
				<button
					className={`${
						page === 1 ? "bg-custom-brown text-white" : "text-gray-400"
					} px-4 py-1 rounded-xl`}
					onClick={() => setPage(1)}
				>
					Summary
				</button>
				<button
					className={`${
						page === 2 ? "bg-custom-brown text-white" : "text-gray-400"
					} px-4 py-1 rounded-xl`}
					onClick={() => setPage(2)}
				>
					Shipping Address
				</button>
				<button
					className={`${
						page === 3 ? "bg-custom-brown text-white" : "text-gray-400"
					} px-4 py-1 rounded-xl`}
					onClick={() => setPage(3)}
				>
					Payment
				</button>
			</div>
			<div className="flex justify-center items-center">
				<div>
					{page !== 1 && (
						<button
							onClick={prevPage}
							className="bg-white text-custom-black py-2 px-1 text-2xl shadow-md rounded-lg"
						>
							<GrPrevious />
						</button>
					)}
				</div>
				<div>
					{page === 1 && <Summary products={products} />}
					{page === 2 && <Address />}
					{page === 3 && <Payment amount={amount} id={products._id} />}
				</div>
				<div>
					{page !== 3 ? (
						<button
							onClick={nextPage}
							className="bg-white text-custom-black py-2 px-1 text-2xl shadow-md rounded-lg"
						>
							<GrNext />
						</button>
					) : (
						<button
							className="bg-white text-custom-black py-2 px-1 text-2xl shadow-md rounded-lg"
							disabled
						>
							<GrNext />
						</button>
					)}
				</div>
			</div>
		</div>
	);
}
