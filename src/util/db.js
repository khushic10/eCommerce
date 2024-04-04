const USERNAME = process.env.DB_USER;
const PASSWORD = process.env.DB_PASSWORD;
import mongoose from "mongoose";

async function connectToDatabase() {
	const uri = `mongodb+srv://${USERNAME}:${PASSWORD}@cluster0.9jtywu7.mongodb.net/eCommerce?retryWrites=true&w=majority&appName=Cluster0`;

	try {
		await mongoose.connect(uri, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("Connected to MongoDB Atlas");
	} catch (err) {
		console.error("Error connecting to MongoDB Atlas", err);
		throw err;
	}
}

export { connectToDatabase };
// export const connectionSrt = `mongodb+srv://${USERNAME}:${PASSWORD}@cluster0.9jtywu7.mongodb.net/eCommerce?retryWrites=true&w=majority&appName=Cluster0`;
// console.log(connectionSrt);
