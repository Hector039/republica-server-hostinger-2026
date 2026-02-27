import CustomError from "../tools/customErrors/customError.js";
import TErrors from "../tools/customErrors/enum.js";

export default class MothlyPaymentsController {
	constructor(monthlyPaymentsService, usersService) {
		this.monthlyPaymentsService = monthlyPaymentsService;
		this.usersService = usersService;
	}

	getHistoryPayments = async (req, res, next) => {
		const { uid } = req.params;
		try {
			const user = await this.usersService.getUser(uid);
			if (!user.length) {
				CustomError.createError({
					message: `Usuario de ID: ${uid} no encontrado.`,
					code: TErrors.NOT_FOUND,
				});
			}
			const paymentsHistory =
				await this.monthlyPaymentsService.getHistoryPayments(uid);
			res.status(200).send(paymentsHistory);
		} catch (error) {
			next(error);
		}
	};

	getFullHistoryPayments = async (req, res, next) => {
		const { uid } = req.params;
		try {
			const user = await this.usersService.getUser(uid);
			if (!user.length) {
				CustomError.createError({
					message: `Usuario de ID: ${uid} no encontrado.`,
					code: TErrors.NOT_FOUND,
				});
			}
			const paymentsHistory =
				await this.monthlyPaymentsService.getFullHistoryPayments(uid);
			res.status(200).send(paymentsHistory);
		} catch (error) {
			next(error);
		}
	};

	addPayment = async (req, res, next) => {
		const { uid, month, year, payDate, amount, isElectronic } = req.body;
		try {
			if (!uid || !month || !year || !amount) {
				CustomError.createError({
					message: "Datos no recibidos o inválidos.",
					code: TErrors.INVALID_TYPES,
				});
			}
			const user = await this.usersService.getUser(uid);
			if (!user.length) {
				CustomError.createError({
					message: `Usuario de ID: ${uid} no encontrado.`,
					code: TErrors.NOT_FOUND,
				});
			}

			const paymentExists = await this.monthlyPaymentsService.checkPayment(
				uid,
				month,
				year,
			);
			if (paymentExists.length > 0 && paymentExists[0].is_complete === 1) {
				CustomError.createError({
					message: `El pago del mes ${month} y año ${year} ya existe. Fue ${paymentExists[0].is_electronic ? "electrónico" : "en efectivo"}`,
					code: TErrors.CONFLICT,
				});
			} else if (paymentExists.length > 0 && paymentExists[0].is_complete === 0) {
				if (
					(!paymentExists[0].is_electronic && !isElectronic) ||
					(paymentExists[0].is_electronic && isElectronic)
				) {
					if (user[0].amount > parseInt(amount) + paymentExists[0].amount) {
						await this.monthlyPaymentsService.updatePayment(
							paymentExists[0].id_payment,
							payDate,
							parseInt(amount) + paymentExists[0].amount,
						);
						await this.monthlyPaymentsService.updatePaymentHistory(
							paymentExists[0].id_payment,
							payDate,
							parseInt(amount),
							isElectronic,
						);
						return res.status(200).send();
					} else if (user[0].amount <= parseInt(amount) + paymentExists[0].amount) {
						await this.monthlyPaymentsService.updatePayment(
							paymentExists[0].id_payment,
							payDate,
							parseInt(amount) + paymentExists[0].amount,
						);
						await this.monthlyPaymentsService.closePayment(
							paymentExists[0].id_payment,
						);
						await this.monthlyPaymentsService.updatePaymentHistory(
							paymentExists[0].id_payment,
							payDate,
							parseInt(amount),
							isElectronic,
						);

						if (user[0].fee_descr !== "Amigo") {
							await this.monthlyPaymentsService.addRepublicPayment(
								payDate,
								isElectronic,
							);
						}

						return res
							.status(200)
							.send(`Se saldó la cuota mes ${month} del año ${year}`);
					}
				} else {
					CustomError.createError({
						message: `Los tipos de pagos no coinciden. El pago anterior fue ${paymentExists[0].is_electronic ? "electrónico" : "en efectivo"} y se envió un pago ${isElectronic ? "electrónico" : "en efectivo"}`,
						code: TErrors.CONFLICT,
					});
				}
			}

			await this.monthlyPaymentsService.addPayment(
				uid,
				month,
				year,
				payDate,
				isElectronic,
			);
			const newPayment = await this.monthlyPaymentsService.checkPayment(
				uid,
				month,
				year,
			);
			await this.monthlyPaymentsService.updatePayment(
				newPayment[0].id_payment,
				payDate,
				parseInt(amount),
			);
			await this.monthlyPaymentsService.updatePaymentHistory(
				newPayment[0].id_payment,
				payDate,
				parseInt(amount),
				isElectronic,
			);
			if (user[0].amount <= parseInt(amount)) {
				await this.monthlyPaymentsService.closePayment(newPayment[0].id_payment);
				if (user[0].fee_descr !== "Amigo") {
					await this.monthlyPaymentsService.addRepublicPayment(
						payDate,
						isElectronic,
					);
				}
				return res
					.status(200)
					.send(`Se saldó la cuota mes ${month} del año ${year}`);
			}

			res.status(200).send();
		} catch (error) {
			next(error);
		}
	};

	addLinkedPayment = async (req, res, next) => {
		const { uid, month, year, payDate, isLinked, isElectronic } = req.body;
		try {
			if (!uid || !month || !year) {
				CustomError.createError({
					message: "Datos no recibidos o inválidos.",
					code: TErrors.INVALID_TYPES,
				});
			}
			const user = await this.usersService.getUser(uid);
			if (!user.length) {
				CustomError.createError({
					message: `Usuario de ID: ${uid} no encontrado.`,
					code: TErrors.NOT_FOUND,
				});
			}
			const newPayment = await this.monthlyPaymentsService.checkPayment(
				uid,
				month,
				year,
			);
			if (newPayment.length > 0 && newPayment[0].is_complete === 1) {
				CustomError.createError({
					message: `El pago vínculo del mes ${month} y año ${year} ya existe.`,
					code: TErrors.CONFLICT,
				});
			}
			const newLinkedPayment = await this.monthlyPaymentsService.addLinkedPayment(
				uid,
				month,
				year,
				payDate,
				isLinked,
			);
			res.status(200).send(newLinkedPayment);
		} catch (error) {
			next(error);
		}
	};

	getDebtorsHistory = async (req, res, next) => {
		const { month, year, group } = req.params;
		try {
			const debtors = await this.monthlyPaymentsService.getDebtorsHistory(
				month,
				year,
				group,
			);

			res.status(200).send(debtors);
		} catch (error) {
			next(error);
		}
	};

	notifyDebtor = async (req, res, next) => {
		const { uid, date } = req.params;
		try {
			if (!uid || !date) {
				CustomError.createError({
					message: "Datos no recibidos o inválidos.",
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
			const debtHistory = await this.monthlyPaymentsService.getUserDebtInfo(
				uid,
				date,
			);

			if (debtHistory.length === 0) {
				return res.status(200).send(null);
			}
			const meses = [
				" ",
				"Enero",
				"Febrero",
				"Marzo",
				"Abril",
				"Mayo",
				"Junio",
				"Julio",
				"Agosto",
				"Setiembre",
				"Octubre",
				"Noviembre",
				"Diciembre",
			];

			let debtList = [];
			debtHistory.forEach((debt) => {
				debtList.push(
					`- ${meses[parseInt(debt.month_paid)]} del ${debt.year_paid}`,
				);
			});

			res
				.status(200)
				.send(
					`Les recordamos que esta adeudando la cuota correspondiente al/los mes/es de ${debtList}`,
				);
		} catch (error) {
			next(error);
		}
	};

	getUserDebtHistory = async (req, res, next) => {
		const { uid } = req.params;
		try {
			const user = await this.usersService.getUser(uid);
			if (!user.length) {
				CustomError.createError({
					message: `El usuario de ID ${uid} no encontrado.`,
					code: TErrors.NOT_FOUND,
				});
			}
			const debtHistory =
				await this.monthlyPaymentsService.getUserDebtHistory(uid);
			res.status(200).send(debtHistory);
		} catch (error) {
			next(error);
		}
	};

	deleteMonthlyPayment = async (req, res, next) => {
		const { mid, paydate } = req.params;
		try {
			await this.monthlyPaymentsService.deleteMonthlyPayment(mid, paydate);
			res.status(200).send();
		} catch (error) {
			next(error);
		}
	};
}
