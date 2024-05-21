import React from "react";
import Link from "next/link";
import Navbar from "../../components/navbar";

export default function page() {
	return (
		<div>
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
		</div>
	);
}
