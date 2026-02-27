export default class UtilsService {
	constructor(repository) {
		this.utilsRepo = repository;
	}
	async getAdminNotifications() {
		const result = await this.utilsRepo.getAdminNotifications();
		return result;
	}

	getFees = async () => {
		const result = await this.utilsRepo.getFees();
		return result;
	};

	updateFees = async (fid, newFee) => {
		const result = await this.utilsRepo.updateFees(fid, newFee);
		return result;
	};

	openCloseFeatures = async (fid, position) => {
		const result = await this.utilsRepo.openCloseFeatures(fid, position);
		return result;
	};

	getPositionFeatures = async () => {
		const result = await this.utilsRepo.getPositionFeatures();
		return result;
	};

	newExpenditures = async (today, descr, amount, isElectronicExpenditure) => {
		const result = await this.utilsRepo.newExpenditures(
			today,
			descr,
			amount,
			isElectronicExpenditure,
		);
		return result;
	};

	newIncome = async (today, descr, amount, isElectronicIncome) => {
		const result = await this.utilsRepo.newIncome(
			today,
			descr,
			amount,
			isElectronicIncome,
		);
		return result;
	};

	dailyInscriptions = async (day) => {
		const result = await this.utilsRepo.dailyInscriptions(day);
		return result;
	};

	getDailyClub = async (day) => {
		const result = await this.utilsRepo.getDailyClub(day);
		return result;
	};

	dailyMonthly = async (day) => {
		const result = await this.utilsRepo.dailyMonthly(day);
		return result;
	};

	dailyAnnual = async (day) => {
		const result = await this.utilsRepo.dailyAnnual(day);
		return result;
	};

	dailyRequests = async (day) => {
		const result = await this.utilsRepo.dailyRequests(day);
		return result;
	};

	dailyExpenditures = async (day) => {
		const result = await this.utilsRepo.dailyExpenditures(day);
		return result;
	};

	dailyIncome = async (day) => {
		const result = await this.utilsRepo.dailyIncome(day);
		return result;
	};

	getDailyClubElectronic = async (day) => {
		const result = await this.utilsRepo.getDailyClubElectronic(day);
		return result;
	};

	dailyMonthlyElectronic = async (day) => {
		const result = await this.utilsRepo.dailyMonthlyElectronic(day);
		return result;
	};

	dailyAnnualElectronic = async (day) => {
		const result = await this.utilsRepo.dailyAnnualElectronic(day);
		return result;
	};

	dailyRequestsElectronic = async (day) => {
		const result = await this.utilsRepo.dailyRequestsElectronic(day);
		return result;
	};

	dailyExpendituresElectronic = async (day) => {
		const result = await this.utilsRepo.dailyExpendituresElectronic(day);
		return result;
	};

	dailyIncomeElectronic = async (day) => {
		const result = await this.utilsRepo.dailyIncomeElectronic(day);
		return result;
	};

	monthlyInscriptions = async (month) => {
		const result = await this.utilsRepo.monthlyInscriptions(month);
		return result;
	};

	monthlyClub = async (month) => {
		const result = await this.utilsRepo.monthlyClub(month);
		return result;
	};

	monthly = async (month) => {
		const result = await this.utilsRepo.monthly(month);
		return result;
	};

	monthlyAnnual = async (month) => {
		const result = await this.utilsRepo.monthlyAnnual(month);
		return result;
	};

	monthlyRequests = async (month) => {
		const result = await this.utilsRepo.monthlyRequests(month);
		return result;
	};

	getExpenditures = async (month) => {
		const result = await this.utilsRepo.getExpenditures(month);
		return result;
	};

	getIncome = async (month) => {
		const result = await this.utilsRepo.getIncome(month);
		return result;
	};

	getMonthGridInfo = async (month) => {
		const result = await this.utilsRepo.getMonthGridInfo(month);
		return result;
	};

	monthlyClubElectronic = async (month) => {
		const result = await this.utilsRepo.monthlyClubElectronic(month);
		return result;
	};

	monthlyElectronic = async (month) => {
		const result = await this.utilsRepo.monthlyElectronic(month);
		return result;
	};

	monthlyAnnualElectronic = async (month) => {
		const result = await this.utilsRepo.monthlyAnnualElectronic(month);
		return result;
	};

	monthlyRequestsElectronic = async (month) => {
		const result = await this.utilsRepo.monthlyRequestsElectronic(month);
		return result;
	};

	getExpendituresElectronic = async (month) => {
		const result = await this.utilsRepo.getExpendituresElectronic(month);
		return result;
	};

	getIncomeElectronic = async (month) => {
		const result = await this.utilsRepo.getIncomeElectronic(month);
		return result;
	};

	getMonthGridInfoElectronic = async (month) => {
		const result = await this.utilsRepo.getMonthGridInfoElectronic(month);
		return result;
	};

	getProducts = async () => {
		const result = await this.utilsRepo.getProducts();
		return result;
	};
	updateProductPrice = async (newPrice, pid) => {
		return await this.utilsRepo.updateProductPrice(newPrice, pid);
	};
	newProduct = async (title, price) => {
		return await this.utilsRepo.newProduct(title, price);
	};
	deleteProduct = async (pid) => {
		return await this.utilsRepo.deleteProduct(pid);
	};
}
