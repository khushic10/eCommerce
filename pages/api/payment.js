const key = process.env.PAYMENT_KEY;
console.log(key);
export default async function handler(req, res) {
	if (req.method === "POST") {
		try {
			const payload = req.body;
			const externalResponse = await fetch(
				"https://a.khalti.com/api/v2/epayment/initiate/",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Key ${key}`,
					},
					body: JSON.stringify(payload),
				}
			);

			const responseData = await externalResponse.json();

			res.status(200).json(responseData);
		} catch (error) {
			console.error("Error sending data to external API:", error);
			res.status(500).json({ error: "Internal server error" });
		}
	} else {
		res.status(405).json({ error: "Method Not Allowed" });
	}
}
