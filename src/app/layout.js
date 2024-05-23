import { Inter } from "next/font/google";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "Artistry Novel",
	description: "E-commerce website that includes artworks to be sold",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className="bg-custom-creme">
				<div className="m-6 bg-custom-gray rounded-3xl">{children}</div>
			</body>
		</html>
	);
}
