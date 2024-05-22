import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className="bg-custom-creme">
				<div className="m-6 bg-custom-gray rounded-3xl">{children}</div>
			</body>
		</html>
	);
}
