"use client";
import { TiShoppingCart } from "react-icons/ti";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaUser } from "react-icons/fa";

export default function Navbar() {
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [login, setLogin] = useState(false);
	const [token, setToken] = useState(null); // Initialize token state
	const router = useRouter();

	const handleDropdownToggle = () => {
		setDropdownOpen(!dropdownOpen);
	};

	useEffect(() => {
		// Check if token is stored in local storage on initial render
		if (typeof window !== "undefined") {
			const storedToken = localStorage.getItem("ecomtoken");
			if (storedToken) {
				setToken(storedToken);
				setLogin(true); // Set login state to true
			}
		}
	}, []);

	const handleLogout = () => {
		localStorage.removeItem("ecomtoken");
		setToken(null); // Clear token state
		setLogin(false);
		router.push("/");
	};

	return (
		<>
			<div className="bg-custom-brown text-white text-sm text-center font-serif p-1 rounded-t-3xl tracking-wider">
				Her Artistry Novel <span className="ml-32">herArtistry@gmail.com</span>
			</div>
			<nav className="bg-white w-full py-1 px-4 flex justify-between items-center shadow-md">
				<div className="">
					<Link href="/">
						<img
							src="http://localhost:3000/img/Logo.png"
							alt="Logo"
							className="h-20"
						/>
					</Link>
				</div>
				<div className="flex-grow flex justify-center">
					<ul className="flex space-x-12 text-lg font-serif">
						<Link href="/">
							<li className="text-custom-black mx-4 hover:text-gray-300 ">
								Home
							</li>
						</Link>

						<Link href="/about">
							<li className="text-custom-black hover:text-gray-300">About</li>
						</Link>

						<Link href="/myCart">
							<li className="text-custom-black hover:text-gray-300 flex items-center">
								<TiShoppingCart className="mr-1" />
								Cart
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
						<Link href="/login">
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
			<div className="bg-custom-pink p-2 pb-4 text-center">
				<h1 className=" text-gray-400 mb-2 text-2xl font-serif tracking-wide">
					Shop Artworks
				</h1>
				<p className="text-custom-brown text-sm font-serif px-16">
					Her Artistry Novel: A showcase of creativity and expression. Explore a
					curated selection of captivating artwork, each piece a chapter in a
					visual story. From vibrant paintings to evocative ideas, immerse
					yourself in a world where imagination knows no bounds. Buy Artworks
					and experience the beauty and narrative by Her Artistry Novel
				</p>
			</div>
		</>
	);
}