import express from "express";
import indexRoute from "../routes/index.route.js";
import cookieParser from "cookie-parser";
import passport from "passport";
import initializePassport from "../config/passport.config.js";
import __dirname from "../tools/utils.js";
import cors from "cors";
import session from "express-session";
import errorHandler from "../middlewares/errorHandler.js";
import { imgPath } from "../data/imgPath.js";
import "dotenv/config";

const corsOptions = {
	origin: "http://localhost:5173",
	credentials: true,
};

export default async function appLoader(app) {
	app.use(cookieParser(process.env.USERCOOKIESECRET));
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use(cors(corsOptions));
	app.use(express.static(__dirname + "/public"));
	app.use(express.static(imgPath));
	app.use(
		session({
			secret: process.env.USERCOOKIESECRET,
			resave: false,
			saveUninitialized: true,
		}),
	);

	initializePassport();
	app.use(passport.initialize());
	app.use(passport.session());

	app.use("/", indexRoute);

	app.use(errorHandler);

	return app;
}
