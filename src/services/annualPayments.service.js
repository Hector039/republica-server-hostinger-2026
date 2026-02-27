export default class AnnualPaymentsService {
	constructor(repository) {
		this.paymentsRepo = repository;
	}

	async addPayment(uid, year, payDate, isElectronic) {
		try {
			const payment = await this.paymentsRepo.addPayment(
				uid,
				year,
				payDate,
				isElectronic,
			);
			return payment;
		} catch (error) {
			throw error;
		}
	}

	async updatePayment(pid, payDate, amount) {
		try {
			const payment = await this.paymentsRepo.updatePayment(pid, payDate, amount);
			return payment;
		} catch (error) {
			throw error;
		}
	}

	async updatePaymentHistory(pid, payDate, amount, isElectronic) {
		try {
			const payment = await this.paymentsRepo.updatePaymentHistory(
				pid,
				payDate,
				amount,
				isElectronic,
			);
			return payment;
		} catch (error) {
			throw error;
		}
	}

	async closePayment(pid) {
		try {
			await this.paymentsRepo.closePayment(pid);
			return;
		} catch (error) {
			throw error;
		}
	}

	getHistoryPayments = async (uid) => {
		const result = await this.paymentsRepo.getHistoryPayments(uid);
		return result;
	};

	getDebtorsHistory = async (year, group) => {
		const result = await this.paymentsRepo.getDebtorsHistory(year, group);
		return result;
	};

	getDayTotalPayments = async (day) => {
		const result = await this.paymentsRepo.getDayTotalPayments(day);
		return result;
	};

	getUserDebtHistory = async (uid) => {
		const result = await this.paymentsRepo.getUserDebtHistory(uid);
		return result;
	};

	getUserDebtInfo = async (uid, date) => {
		const result = await this.paymentsRepo.getUserDebtInfo(uid, date);
		return result;
	};

	checkPayment = async (uid, year) => {
		const result = await this.paymentsRepo.checkPayment(uid, year);
		return result;
	};

	getAnnualFee = async () => {
		const result = await this.paymentsRepo.getAnnualFee();
		return result;
	};

	deleteAnnualPayment = async (aid) => {
		const result = await this.paymentsRepo.deleteAnnualPayment(aid);
		return result;
	};

	getFullHistoryPayments = async (uid) => {
		const result = await this.paymentsRepo.getFullHistoryPayments(uid);
		return result;
	};
}
