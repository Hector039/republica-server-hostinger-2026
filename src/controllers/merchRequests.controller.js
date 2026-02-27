import CustomError from "../tools/customErrors/customError.js";
import TErrors from "../tools/customErrors/enum.js";

export default class MerchRequestsController {
	constructor(merchRequestsService, usersService) {
		this.merchRequestsService = merchRequestsService;
		this.usersService = usersService;
	}

	param = async (req, res, next, uid) => {
		//param
		try {
			const user = await this.usersService.getUser(uid);
			if (!user.length) {
				CustomError.createError({
					message: `El usuario de ID ${uid} no encontrado.`,
					code: TErrors.NOT_FOUND,
				});
			}
			req.user = user;
			next();
		} catch (error) {
			next(error);
		}
	};

	getMerchRequests = async (req, res, next) => {
		const { search, value } = req.body;
		try {
			let merchRequests = await this.merchRequestsService.getMerchRequests(
				search,
				value,
			);
			res.status(200).send(merchRequests);
		} catch (error) {
			next(error);
		}
	};

	getDebtorsHistory = async (req, res, next) => {
		const { day, group } = req.params;
		try {
			const debtors = await this.merchRequestsService.getDebtorsHistory(
				day,
				group,
			);
			res.status(200).send(debtors);
		} catch (error) {
			next(error);
		}
	};

	getUserMerchRequest = async (req, res, next) => {
		const user = req.user;
		try {
			let merchRequests = await this.merchRequestsService.getUserMerchRequest(
				user.id_user,
			);
			res.status(200).send(merchRequests);
		} catch (error) {
			next(error);
		}
	};

	getAllUserMerchRequest = async (req, res, next) => {
		const { uid } = req.params;
		try {
			if (!uid) {
				CustomError.createError({
					message: `Datos no recibidos o inválidos.`,
					code: TErrors.INVALID_TYPES,
				});
			}
			const merchRequests =
				await this.merchRequestsService.getAllUserMerchRequest(uid);
			res.status(200).send(merchRequests);
		} catch (error) {
			next(error);
		}
	};

	getMerchRequestById = async (req, res, next) => {
		const { mid } = req.params;
		try {
			let merchRequests = await this.merchRequestsService.getMerchRequestById(mid);
			if (!merchRequests.length) {
				CustomError.createError({
					message: `La solicitud de ID ${mid} no fue encontrada.`,
					code: TErrors.NOT_FOUND,
				});
			}
			res.status(200).send(merchRequests[0]);
		} catch (error) {
			next(error);
		}
	};

	addMerchRequest = async (req, res, next) => {
		const { uid, pid } = req.params;
		try {
			if (!uid || !pid) {
				CustomError.createError({
					message: `Datos no recibidos o inválidos.`,
					code: TErrors.INVALID_TYPES,
				});
			}
			const user = await this.usersService.getUser(uid);
			if (!user.length) {
				CustomError.createError({
					message: `El usuario de ID ${uid} no encontrado.`,
					code: TErrors.NOT_FOUND,
				});
			}
			let newMerchReq = await this.merchRequestsService.addMerchRequest(
				uid,
				parseInt(pid),
			);
			res.status(200).send(newMerchReq);
		} catch (error) {
			next(error);
		}
	};

	addMerchPayment = async (req, res, next) => {
		const { mid, amount, payDate, isElectronic, productPrice, userAmount } =
			req.body;
		try {
			if (!mid || !amount || !payDate) {
				CustomError.createError({
					message: `Datos no recibidos o inválidos.`,
					code: TErrors.INVALID_TYPES,
				});
			}
			const merchReq = await this.merchRequestsService.getMerchRequestById(mid);
			if (!merchReq.length) {
				CustomError.createError({
					message: `El Solicitud de ID ${mid} no encontrada.`,
					code: TErrors.NOT_FOUND,
				});
			}

			await this.merchRequestsService.addMerchPayment(
				mid,
				amount,
				payDate,
				isElectronic,
			);

			const totalUserAmount = parseInt(userAmount) + parseInt(amount);

			if (productPrice <= totalUserAmount) {
				await this.merchRequestsService.updateMerchPayment(mid, payDate);
			}
			res.status(200).send();
		} catch (error) {
			next(error);
		}
	};

	updateMerchPayment = async (req, res, next) => {
		const { mid, payDate } = req.body;
		try {
			if (!payDate || !mid) {
				CustomError.createError({
					message: `Dato no recibido o inválido.`,
					code: TErrors.INVALID_TYPES,
				});
			}
			let merchReq = await this.merchRequestsService.updateMerchPayment(
				mid,
				payDate,
			);
			res.status(200).send(merchReq);
		} catch (error) {
			next(error);
		}
	};

	deleteMerchRequest = async (req, res, next) => {
		const { mid } = req.params;
		try {
			let merchRequests = await this.merchRequestsService.getMerchRequestById(mid);
			if (!merchRequests.length) {
				CustomError.createError({
					message: `Ninguna solicitud de compra fue encontrada.`,
					code: TErrors.NOT_FOUND,
				});
			}
			await this.merchRequestsService.deleteMerchRequest(
				merchRequests[0].id_request,
			);
			res.status(200).send();
		} catch (error) {
			next(error);
		}
	};

	getNewMerchRequests = async (req, res, next) => {
		try {
			let newMerchRequests = await this.merchRequestsService.getNewMerchRequests();
			res.status(200).send(newMerchRequests);
		} catch (error) {
			next(error);
		}
	};

	updateSeenNewMerchRequests = async (req, res, next) => {
		try {
			await this.merchRequestsService.updateSeenMerchRequest();
			res.status(200).send();
		} catch (error) {
			next(error);
		}
	};
}
