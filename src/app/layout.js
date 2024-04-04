import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../../components/navbar";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "Her Artistry Novel",
	description: "E-commerce website that includes artworks to be sold",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className="bg-purple-200">
				<div className="bg-white m-8 rounded-2xl p-6">{children}</div>
			</body>
		</html>
	);
}
