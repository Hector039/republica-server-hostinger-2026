import jwt from "jsonwebtoken";
import "dotenv/config";

export const userPassJwt = () => {
	return (req, res, next) => {
		const authHeader = req.header("Authorization");
		const token =
			authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

		// 1. Si no hay token: Enviamos respuesta clara al front
		if (!token) {
			return res.status(401).json({
				status: "error",
				error: "NO_TOKEN",
				message: "Token inexistente, redirigir al Login.",
			});
		}

		try {
			//console.log("token y userCookie: ", token, process.env.USERCOOKIESECRET);

			// 2. Verificar el token
			const decoded = jwt.verify(token, process.env.USERCOOKIESECRET);

			// 3. Todo bien: Cargamos en req y seguimos
			req.user = decoded;
			next();
		} catch (error) {
			// 4. Manejo de errores específicos de JWT
			if (error.name === "TokenExpiredError") {
				return res.status(401).json({
					status: "error",
					error: "TOKEN_EXPIRED",
					message: "Tu sesión ha expirado, por favor inicia sesión de nuevo.",
				});
			}

			// Cualquier otro error (token malformado, firma inválida, etc.)
			return res.status(403).json({
				status: "error",
				error: "INVALID_TOKEN",
				message: "Token inválido o corrupto.",
			});
		}
	};
};
