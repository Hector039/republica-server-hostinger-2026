import jwt from "jsonwebtoken";
import "dotenv/config";

export const isSessionOn = () => {
	return async (req, res, next) => {
		const token = req.header("Authorization")?.split(" ")[1];
		if (token === undefined) {
			next();
		} else {
			try {
				jwt.verify(token, process.env.USERCOOKIESECRET);
				return;
			} catch (error) {
				next();
			}
		}
	};
};
