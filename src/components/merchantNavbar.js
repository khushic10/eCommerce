"use client";
import { TiShoppingCart } from "react-icons/ti";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaUser } from "react-icons/fa";

export default function MerchantNavbar() {
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [login, setLogin] = useState(false);
	const router = useRouter();

	const handleDropdownToggle = () => {
		setDropdownOpen(!dropdownOpen);
	};

	useEffect(() => {
		if (typeof window !== "undefined") {
			const storedToken = localStorage.getItem("merchantToken");
			if (storedToken) {
				setLogin(true);
			}
		}
	}, []);

	const handleLogout = () => {
		localStorage.removeItem("merchantToken");
		setLogin(false);
		router.push("/merchant/merchantLogin");
	};

	return (
		<>
			<div className="bg-custom-brown text-white text-sm text-center font-serif p-1 rounded-t-3xl tracking-wider">
				Her Artistry Novel <span className="ml-32">herArtistry@gmail.com</span>
			</div>
			<nav className="bg-white w-full py-1 px-4 flex justify-between items-center shadow-md">
				<div className="">
					<Link href="/merchant">
						<img src="/img/Logo.png" alt="Logo" className="h-20" />
					</Link>
				</div>
				<div className="flex-grow flex justify-center">
					<ul className="flex space-x-12 text-lg font-serif">
						<Link href="/merchant">
							<li className="text-custom-black mx-4 hover:text-gray-300 ">
								My Artworks
							</li>
						</Link>

						<Link href="/merchant/addItem">
							<li className="text-custom-black hover:text-gray-300">
								Add Artwork
							</li>
						</Link>
						<Link href="/merchant/addCategory">
							<li className="text-custom-black mx-4 hover:text-gray-300 ">
								Add Category
							</li>
						</Link>

						<Link href="/merchant/viewCategories">
							<li className="text-custom-black hover:text-gray-300">
								View Categories
							</li>
						</Link>
					</ul>
				</div>
				<div className="relative">
					{login ? (
						<button
							onClick={handleDropdownToggle}
							className="focus:outline-none"
						>
							<div className="text-custom-orange text-xl border border-custom-orange rounded-full p-1">
								<FaUser />
							</div>
						</button>
					) : (
						<Link href="/merchant/merchantLogin">
							<div className="text-custom-black mx-4 hover:text-gray-300">
								Login
							</div>
						</Link>
					)}
					{dropdownOpen && login && (
						<div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-10">
							<a
								href="#"
								onClick={handleLogout}
								className="block px-4 py-2 text-custom-black hover:bg-gray-200"
							>
								Logout
							</a>
						</div>
					)}
				</div>
			</nav>
		</>
	);
}
