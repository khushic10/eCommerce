import React from "react";
import Link from "next/link";
import Navbar from "../../components/navbar";

export default function AboutUs() {
	return (
		<div>
			<Navbar />
			<div className="container mx-auto px-4 py-8">
				<div className="bg-custom-creme my-2 mx-20 p-8 rounded-lg shadow-md mb-8">
					<h1 className="text-3xl font-bold text-custom-orange mb-4 text-center font-serif">
						About Us
					</h1>
					<p className="text-custom-brown mb-6">
						Welcome to our vibrant world of art! At{" "}
						<span className="text-custom-orange font-semibold font-serif">
							Artistry Novel
						</span>
						, we believe that every wall deserves a splash of color and a story
						to tell. Our journey began with a passion for creativity and an
						unwavering love for the transformative power of art. We are
						dedicated to bringing you a curated collection of colorful paintings
						that inspire, captivate, and elevate your space.
					</p>

					<div className="flex flex-wrap space-y-4 md:space-y-0 md:space-x-4">
						<div className="bg-white p-8 rounded-lg shadow-md flex-1">
							<h3 className="text-2xl font-semibold text-custom-orange mb-4 font-serif">
								Our Vision
							</h3>
							<p className="text-custom-brown">
								Our vision is simple: to make art accessible to everyone. We aim
								to connect art enthusiasts with beautiful, high-quality
								paintings that resonate with their personal style and taste.
								Whether you are looking for a bold statement piece or a subtle
								touch of elegance, our diverse collection caters to all
								preferences and aesthetics.
							</p>
						</div>
						<div className="bg-white p-8 rounded-lg shadow-md flex-1">
							<h3 className="text-2xl font-semibold text-custom-orange mb-4 font-serif">
								Our Collection
							</h3>
							<p className="text-custom-brown">
								Each painting in our collection is a testament to our commitment
								to quality and creativity. We work with talented artists who
								pour their heart and soul into every brushstroke, ensuring that
								each piece is unique and tells its own story. From abstract
								masterpieces to contemporary designs, our paintings are designed
								to add a burst of color and life to any room.
							</p>
						</div>
					</div>

					<div className="bg-white p-8 rounded-lg shadow-md mt-4">
						<h3 className="text-2xl font-semibold text-custom-orange mb-4 font-serif">
							Our Values
						</h3>
						<div className="text-custom-brown">
							<p>
								At the core of our business are values that guide us every day:
							</p>
							<ul className="list-disc list-inside ml-4">
								<li className="mb-2">
									<span className="font-bold">Quality</span>: We prioritize the
									highest standards in every aspect of our business, from the
									selection of materials to the final product.
								</li>
								<li className="mb-2">
									<span className="font-bold">Creativity</span>: We celebrate
									artistic expression and encourage innovation in every piece we
									offer.
								</li>
								<li className="mb-2">
									<span className="font-bold">Customer Satisfaction</span>: Your
									happiness is our top priority. We strive to provide an
									exceptional shopping experience, from browsing to delivery.
								</li>
								<li className="mb-2">
									<span className="font-bold">Community</span>: We believe in
									supporting the art community and fostering a love for art in
									all its forms.
								</li>
							</ul>
						</div>
					</div>

					<p className="text-custom-brown mt-6">
						Thank you for choosing{" "}
						<span className="text-custom-orange font-semibold font-serif">
							Artistry Novel
						</span>{" "}
						as your go-to destination for beautiful, colorful paintings. We look
						forward to helping you find the perfect piece that brings joy and
						inspiration to your home.
					</p>
				</div>
			</div>
		</div>
	);
}
