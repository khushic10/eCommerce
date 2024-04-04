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
		<nav className="bg-purple-200 rounded-2xl p-2">
			<div className="bg-white m-8 mt-0 rounded-2xl flex justify-between">
				<div className="m-4">
					<ul className="flex text-xl font-medium">
						<li className="m-4">
							<Link href="/">Home</Link>
						</li>
						<li className="m-4">
							<Link href="/about">About</Link>
						</li>
					</ul>
				</div>
				<div className="m-4">
					<ul className="flex text-xl">
						<li className="m-4">
							<Link href="/myCart" className="flex">
								<span className="text-3xl">
									<TiShoppingCart />{" "}
								</span>
								Cart
							</Link>
						</li>
						<li className="m-4">
							{token ? (
								<span onClick={() => onLogout()}>Logout</span>
							) : (
								<Link href="/login">Login</Link>
							)}
						</li>
					</ul>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
