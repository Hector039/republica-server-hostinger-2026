import loaders from "./loaders/index.js";
import express from "express";
import "dotenv/config";
const port = process.env.PORT || 5000;

async function startServer() {
	const app = express();

	await loaders(app);

	app.listen(port, (err) => {
		if (err) {
			console.log(err);
			return;
		}
		console.log(`Servidor escuchando en puerto ${process.env.PORT}`);
	});
}

startServer();
