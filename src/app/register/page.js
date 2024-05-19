"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../../components/navbar";

export default function Register() {
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const router = useRouter();

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const res = await fetch("/api/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, username, password }),
			});

			if (!res.ok) {
				throw new Error("Invalid credentials");
			}

			const data = await res.json();
			console.log(data);
			router.push("/login");
		} catch (error) {
			setError(error.message);
		}
	};

	return (
		<>
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
			<div className="grid grid-cols-2 mx-32 mb-10 border-2 border-purple-500 rounded-2xl">
				<div className=" bg-purple-400 col-span-1 p-6 rounded-tl-2xl rounded-bl-2xl flex flex-col justify-center items-center">
					<h1 className="text-3xl font-bold text-white my-6">User Register</h1>
					<form onSubmit={handleSubmit}>
						<div>
							<div className=" text-sm font-semibold text-white mb-2">
								Username
							</div>
							<input
								className="w-64 h-10 px-4 py-2 mb-4 border rounded-md focus:outline-none focus:border-blue-500 placeholder-gray-400"
								type="text"
								id="username"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								required
							/>
						</div>
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
								SignUp
							</button>
						</div>
						<div>
							Already have an account?{" "}
							<Link href="/login">
								<span className="cursor-pointer text-indigo-600 font-semibold">
									Sign In
								</span>
							</Link>
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
