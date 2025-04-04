import Link from "next/link";
import React from "react";

export default function page() {
	return (
		<>
			<div className="p-8 text-center">
				<div className="m-8">
					<div className="h-32 flex items-center justify-center">
						<img
							src="/img/greenTick.jpg"
							alt="Success"
							className="rounded-2xl h-full w-auto object-cover mr-4"
						/>
						<div className="text-5xl font-bold text-green-600">Success</div>
					</div>
					<div className="mt-4 text-lg text-gray-500 font-semibold">
						Thank you for ordering.
					</div>
					<div className="bg-custom-pink p-4 rounded-lg mt-4 text-lg text-gray-700">
						Your selected cash on delivery. Your Order was successful. You will
						receive your artworks within 2 weeks from the order date. Please
						provide the cash upon the delivery of the artworks
					</div>
				</div>
				<Link
					href="/"
					className="bg-custom-orange text-white px-2 py-1 rounded ml-12"
				>
					Back to Home Page
				</Link>
			</div>
		</>
	);
}
