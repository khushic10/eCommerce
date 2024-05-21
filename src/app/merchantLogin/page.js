"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/navbar";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const router = useRouter();

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const res = await fetch("/api/merchantLogin", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			});

			if (!res.ok) {
				throw new Error("Invalid credentials");
			}

			const data = await res.json();
			localStorage.setItem("merchantToken", data.token);
			localStorage.setItem("role", data.role);
			router.push("/addItem");
		} catch (error) {
			setError(error.message);
		}
	};

	return (
		<>
			<div className="grid grid-cols-4">
				<Link href="/" className="col-span-2">
					<img
						src="http://localhost:3000/img/Logo.png"
						alt="Logo"
						className="h-32 "
					/>
				</Link>
				<div className=" col-span-2">
					<Navbar />
				</div>
			</div>
			<div className="grid grid-cols-2 mx-32 mb-10 border-2 border-purple-500 rounded-2xl">
				<div className=" bg-purple-400 col-span-1 p-6 rounded-tl-2xl rounded-bl-2xl flex flex-col justify-center items-center">
					<h1 className="text-3xl font-bold text-white my-6">Merchant Login</h1>
					<form onSubmit={handleSubmit}>
						<div>
							<div className=" text-sm font-semibold text-white mb-2">
								Email
							</div>
							<input
								className="w-64 h-10 px-4 py-2 mb-4 border rounded-md focus:outline-none focus:border-blue-500 placeholder-gray-400"
								type="email"
								id="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>
						<div>
							<div className=" text-sm font-semibold text-white mb-2">
								Password
							</div>
							<input
								className="w-64 h-10 px-4 py-2 mb-4 border rounded-md focus:outline-none focus:border-blue-500 placeholder-gray-400"
								type="password"
								id="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>
						{error && <p>{error}</p>}
						<div className="flex justify-center align-center m-8">
							<button
								type="submit"
								className="bg-gray-800 hover:bg-blue-700 text-white font-semibold py-1 px-10 rounded-xl focus:outline-none focus:shadow-outline"
							>
								Login
							</button>
						</div>
					</form>
				</div>
				<div className="col-span-1">
					<img
						className="w-full h-full rounded-2xl"
						src="http://localhost:3000/img/web.png"
						alt="logo"
					/>
				</div>
			</div>
		</>
	);
}
