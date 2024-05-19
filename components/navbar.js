"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { TiShoppingCart } from "react-icons/ti";

const Navbar = () => {
	const [token, setToken] = useState("");
	useEffect(() => {
		const storedToken = localStorage.getItem("ecomtoken");
		if (storedToken) {
			setToken(storedToken);
		}
	}, []);
	function onLogout() {
		setToken(null);
		localStorage.removeItem("ecomtoken");
	}
	return (
		<nav className="bg-white m-4 mt-0 rounded-2xl grid grid-cols-5">
			<div className="m-2 col-span-3">
				<ul className="flex text-sm font-semibold">
					<li className="m-4 mr-8 ml-8 p-1 hover:bg-gray-300 active:bg-gray-300 rounded-xl">
						<Link href="/">Home</Link>
					</li>
					<li className="m-4 p-1 hover:bg-gray-300 active:bg-gray-300 rounded-xl">
						<Link href="/about">About</Link>
					</li>
				</ul>
			</div>
			<div className="col-span2 m-2">
				<ul className="flex text-sm">
					<li className="m-4 p-1 hover:bg-gray-300 active:bg-gray-300 rounded-xl">
						<Link href="/myCart" className="flex">
							<span className="text-3xl">
								<TiShoppingCart />{" "}
							</span>
							Cart
						</Link>
					</li>
					<li className="m-4 p-1 hover:bg-gray-300 active:bg-gray-300 rounded-xl">
						{token ? (
							<span onClick={() => onLogout()} className=" cursor-pointer">
								Logout
							</span>
						) : (
							<Link href="/login">Login</Link>
						)}
					</li>
				</ul>
			</div>
		</nav>
	);
};

export default Navbar;
