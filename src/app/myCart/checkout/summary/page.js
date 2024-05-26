"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Summary({ products }) {
	return (
		<div className="p-6">
			<div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					<div className="border shadow-md rounded-xl max-h-96 overflow-auto p-4 bg-white">
						<h2 className="text-xl font-semibold mb-4 text-center">
							Your Orders
						</h2>
						<div>
							{products &&
								products.cart.items &&
								products.cart.items.map((product) => (
									<div
										className="grid grid-cols-2 gap-4 m-2 items-center"
										key={product.product._id}
									>
										<div className="h-40">
											<img
												className="rounded-2xl h-full w-auto object-cover"
												src={product.product.image}
												alt={product.product.name}
											/>
										</div>
										<div className="ml-2">
											<h3 className="text-lg font-semibold">
												Her Artistry Novel
											</h3>
											<h2 className="text-sm text-red-800">
												{product.product.name}
											</h2>
											<p className="text-sm font-bold text-gray-500">
												<span className="text-xs mr-1 font-semibold">
													Price:
												</span>{" "}
												Rs. {product.product.price}
											</p>
										</div>
									</div>
								))}
						</div>
					</div>
					<div>
						<div className="border shadow p-4 rounded-xl mb-8">
							<h1 className="text-custom-brown text-xl font-semibold mb-4 text-center">
								Order Summary
							</h1>
							<div className="bg-gray-200 rounded-xl p-4">
								<h2 className="text-sm text-yellow-700 mb-1">
									Total No Of Items: {products ? products.NoOfItems : 0}
								</h2>
								<h2 className="text-sm text-yellow-700">
									Total Cost of all Items: Rs.{" "}
									{products ? products.TotalCost : 0}
								</h2>
								<h2 className="text-sm text-yellow-700">
									Delivery Charges: Free
								</h2>
							</div>
							<h2 className="m-4 text-lg text-custom-black">
								Total Payable Amount: Rs. {products ? products.TotalCost : 0}
							</h2>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
