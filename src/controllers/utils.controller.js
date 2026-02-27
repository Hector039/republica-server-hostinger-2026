import CustomError from "../tools/customErrors/customError.js";
import TErrors from "../tools/customErrors/enum.js";

export default class UtilsController {
	constructor(utilsService) {
		this.utilsService = utilsService;
	}

	getAdminNotifications = async (req, res, next) => {
		try {
			const { merchReq, inscReq } =
				await this.utilsService.getAdminNotifications();
			res.status(200).send({ merchReq: merchReq, inscReq: inscReq });
		} catch (error) {
			next(error);
		}
	};

	getFees = async (req, res, next) => {
		try {
			const fees = await this.utilsService.getFees();
			res.status(200).send(fees);
		} catch (error) {
			next(error);
		}
	};

	updateFees = async (req, res, next) => {
		const { fid, newFee } = req.body;

		try {
			if (!fid || newFee === undefined) {
				CustomError.createError({
					message: `Faltan datos o son inválidos.`,
					code: TErrors.INVALID_TYPES,
				});
			}
			await this.utilsService.updateFees(fid, newFee);
			res.status(200).send();
		} catch (error) {
			next(error);
		}
	};

	openCloseFeatures = async (req, res, next) => {
		const { fid, pos } = req.params;
		try {
			if (!fid || pos === undefined) {
				CustomError.createError({
					message: `Faltan datos o son inválidos.`,
					code: TErrors.INVALID_TYPES,
				});
			}
			const isOpen = await this.utilsService.openCloseFeatures(fid, pos);
			res.status(200).send(isOpen);
		} catch (error) {
			next(error);
		}
	};

	getPositionFeatures = async (req, res, next) => {
		try {
			const featuresPositions = await this.utilsService.getPositionFeatures();
			res.status(200).send(featuresPositions);
		} catch (error) {
			next(error);
		}
	};

	newExpenditures = async (req, res, next) => {
		const { descr, amount, payDate, isElectronicExpenditure } = req.body;

		try {
			if (!payDate || !descr || !amount) {
				CustomError.createError({
					message: `Faltan datos o son inválidos.`,
					code: TErrors.INVALID_TYPES,
				});
			}
			await this.utilsService.newExpenditures(
				payDate,
				descr,
				amount,
				isElectronicExpenditure,
			);
			res.status(200).send();
		} catch (error) {
			next(error);
		}
	};

	newIncome = async (req, res, next) => {
		const { descr, amount, payDate, isElectronicIncome } = req.body;

		try {
			if (!payDate || !descr || !amount) {
				CustomError.createError({
					message: `Faltan datos o son inválidos.`,
					code: TErrors.INVALID_TYPES,
				});
			}
			await this.utilsService.newIncome(
				payDate,
				descr,
				amount,
				isElectronicIncome,
			);
			res.status(200).send();
		} catch (error) {
			next(error);
		}
	};

	dailyInscriptions = async (req, res, next) => {
		const { day } = req.params;

		try {
			const dayPayments = await this.utilsService.dailyInscriptions(day);
			res.status(200).send(dayPayments);
		} catch (error) {
			next(error);
		}
	};

	getDailyClub = async (req, res, next) => {
		const { day } = req.params;

		try {
			const dayPayments = await this.utilsService.getDailyClub(day);
			res.status(200).send(dayPayments);
		} catch (error) {
			next(error);
		}
	};

	dailyMonthly = async (req, res, next) => {
		const { day } = req.params;

		try {
			const dayPayments = await this.utilsService.dailyMonthly(day);
			res.status(200).send(dayPayments);
		} catch (error) {
			next(error);
		}
	};

	dailyAnnual = async (req, res, next) => {
		const { day } = req.params;

		try {
			const dayPayments = await this.utilsService.dailyAnnual(day);
			res.status(200).send(dayPayments);
		} catch (error) {
			next(error);
		}
	};

	dailyRequests = async (req, res, next) => {
		const { day } = req.params;

		try {
			const dayPayments = await this.utilsService.dailyRequests(day);
			res.status(200).send(dayPayments);
		} catch (error) {
			next(error);
		}
	};

	dailyExpenditures = async (req, res, next) => {
		const { day } = req.params;

		try {
			const dayPayments = await this.utilsService.dailyExpenditures(day);
			res.status(200).send(dayPayments);
		} catch (error) {
			next(error);
		}
	};

	dailyIncome = async (req, res, next) => {
		const { day } = req.params;

		try {
			const income = await this.utilsService.dailyIncome(day);
			res.status(200).send(income);
		} catch (error) {
			next(error);
		}
	};

	getDailyClubElectronic = async (req, res, next) => {
		const { day } = req.params;

		try {
			const dayPayments = await this.utilsService.getDailyClubElectronic(day);
			res.status(200).send(dayPayments);
		} catch (error) {
			next(error);
		}
	};

	dailyMonthlyElectronic = async (req, res, next) => {
		const { day } = req.params;

		try {
			const dayPayments = await this.utilsService.dailyMonthlyElectronic(day);
			res.status(200).send(dayPayments);
		} catch (error) {
			next(error);
		}
	};

	dailyAnnualElectronic = async (req, res, next) => {
		const { day } = req.params;

		try {
			const dayPayments = await this.utilsService.dailyAnnualElectronic(day);
			res.status(200).send(dayPayments);
		} catch (error) {
			next(error);
		}
	};

	dailyRequestsElectronic = async (req, res, next) => {
		const { day } = req.params;

		try {
			const dayPayments = await this.utilsService.dailyRequestsElectronic(day);
			res.status(200).send(dayPayments);
		} catch (error) {
			next(error);
		}
	};

	dailyExpendituresElectronic = async (req, res, next) => {
		const { day } = req.params;

		try {
			const dayPayments = await this.utilsService.dailyExpendituresElectronic(day);
			res.status(200).send(dayPayments);
		} catch (error) {
			next(error);
		}
	};

	dailyIncomeElectronic = async (req, res, next) => {
		const { day } = req.params;

		try {
			const income = await this.utilsService.dailyIncomeElectronic(day);
			res.status(200).send(income);
		} catch (error) {
			next(error);
		}
	};

	monthlyClub = async (req, res, next) => {
		const { month } = req.params;

		try {
			const monthPayments = await this.utilsService.monthlyClub(month);
			res.status(200).send(monthPayments);
		} catch (error) {
			next(error);
		}
	};

	monthly = async (req, res, next) => {
		const { month } = req.params;

		try {
			const monthPayments = await this.utilsService.monthly(month);
			res.status(200).send(monthPayments);
		} catch (error) {
			next(error);
		}
	};

	monthlyAnnual = async (req, res, next) => {
		const { month } = req.params;

		try {
			const monthPayments = await this.utilsService.monthlyAnnual(month);
			res.status(200).send(monthPayments);
		} catch (error) {
			next(error);
		}
	};

	monthlyInscriptions = async (req, res, next) => {
		const { month } = req.params;

		try {
			const monthPayments = await this.utilsService.monthlyInscriptions(month);
			res.status(200).send(monthPayments);
		} catch (error) {
			next(error);
		}
	};

	monthlyRequests = async (req, res, next) => {
		const { month } = req.params;

		try {
			const monthPayments = await this.utilsService.monthlyRequests(month);
			res.status(200).send(monthPayments);
		} catch (error) {
			next(error);
		}
	};

	getExpenditures = async (req, res, next) => {
		const { month } = req.params;
		try {
			const expenditures = await this.utilsService.getExpenditures(month);
			res.status(200).send(expenditures);
		} catch (error) {
			next(error);
		}
	};

	getIncome = async (req, res, next) => {
		const { month } = req.params;
		try {
			const income = await this.utilsService.getIncome(month);
			res.status(200).send(income);
		} catch (error) {
			next(error);
		}
	};

	getMonthGridInfo = async (req, res, next) => {
		const { month } = req.params;

		try {
			const monthInfo = await this.utilsService.getMonthGridInfo(month);
			res.status(200).send(monthInfo);
		} catch (error) {
			next(error);
		}
	};

	monthlyClubElectronic = async (req, res, next) => {
		const { month } = req.params;

		try {
			const monthPayments = await this.utilsService.monthlyClubElectronic(month);
			res.status(200).send(monthPayments);
		} catch (error) {
			next(error);
		}
	};

	monthlyElectronic = async (req, res, next) => {
		const { month } = req.params;

		try {
			const monthPayments = await this.utilsService.monthlyElectronic(month);
			res.status(200).send(monthPayments);
		} catch (error) {
			next(error);
		}
	};

	monthlyAnnualElectronic = async (req, res, next) => {
		const { month } = req.params;

		try {
			const monthPayments = await this.utilsService.monthlyAnnualElectronic(month);
			res.status(200).send(monthPayments);
		} catch (error) {
			next(error);
		}
	};

	monthlyRequestsElectronic = async (req, res, next) => {
		const { month } = req.params;

		try {
			const monthPayments =
				await this.utilsService.monthlyRequestsElectronic(month);
			res.status(200).send(monthPayments);
		} catch (error) {
			next(error);
		}
	};

	getExpendituresElectronic = async (req, res, next) => {
		const { month } = req.params;
		try {
			const expenditures =
				await this.utilsService.getExpendituresElectronic(month);
			res.status(200).send(expenditures);
		} catch (error) {
			next(error);
		}
	};

	getIncomeElectronic = async (req, res, next) => {
		const { month } = req.params;
		try {
			const income = await this.utilsService.getIncomeElectronic(month);
			res.status(200).send(income);
		} catch (error) {
			next(error);
		}
	};

	getMonthGridInfoElectronic = async (req, res, next) => {
		const { month } = req.params;

		try {
			const monthInfo = await this.utilsService.getMonthGridInfoElectronic(month);
			res.status(200).send(monthInfo);
		} catch (error) {
			next(error);
		}
	};

	getProducts = async (req, res, next) => {
		try {
			const products = await this.utilsService.getProducts();
			res.status(200).send(products);
		} catch (error) {
			next(error);
		}
	};

	updateProductPrice = async (req, res, next) => {
		const { newPrice, pid } = req.body;

		try {
			if (!pid || !newPrice) {
				CustomError.createError({
					message: `Faltan datos o son inválidos.`,
					code: TErrors.INVALID_TYPES,
				});
			}
			await this.utilsService.updateProductPrice(newPrice, pid);
			res.status(200).send();
		} catch (error) {
			next(error);
		}
	};

	newProduct = async (req, res, next) => {
		const { title, price } = req.body;

		try {
			if (!title || !price) {
				CustomError.createError({
					message: `Faltan datos o son inválidos.`,
					code: TErrors.INVALID_TYPES,
				});
			}
			await this.utilsService.newProduct(title, price);
			res.status(200).send();
		} catch (error) {
			next(error);
		}
	};

	deleteProduct = async (req, res, next) => {
		const { pid } = req.params;

		try {
			if (!pid) {
				CustomError.createError({
					message: `Faltan datos o son inválidos.`,
					code: TErrors.INVALID_TYPES,
				});
			}
			await this.utilsService.deleteProduct(pid);
			res.status(200).send();
		} catch (error) {
			next(error);
		}
	};
}
