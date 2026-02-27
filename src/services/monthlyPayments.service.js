export default class MonthlyPaymentsService {
	constructor(repository) {
		this.paymentsRepo = repository;
	}

	async addPayment(uid, month, year, payDate, isElectronic) {
		try {
			const payment = await this.paymentsRepo.addPayment(
				uid,
				month,
				year,
				payDate,
				isElectronic,
			);
			return payment;
		} catch (error) {
			throw error;
		}
	}

	async addLinkedPayment(uid, month, year, payDate, isLinked, isElectronic) {
		try {
			const payment = await this.paymentsRepo.addLinkedPayment(
				uid,
				month,
				year,
				payDate,
				isLinked,
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

	async addRepublicPayment(payDate, isElectronic) {
		try {
			const payment = await this.paymentsRepo.addRepublicPayment(
				payDate,
				isElectronic,
			);
			return payment;
		} catch (error) {
			throw error;
		}
	}

	getHistoryPayments = async (uid) => {
		const result = await this.paymentsRepo.getHistoryPayments(uid);
		return result;
	};

	getDebtorsHistory = async (month, year, group) => {
		const result = await this.paymentsRepo.getDebtorsHistory(month, year, group);
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

	checkPayment = async (uid, month, year) => {
		const result = await this.paymentsRepo.checkPayment(uid, month, year);
		return result;
	};

	deleteMonthlyPayment = async (mid, paydate) => {
		const result = await this.paymentsRepo.deleteMonthlyPayment(mid, paydate);
		return result;
	};

	getFullHistoryPayments = async (uid) => {
		const result = await this.paymentsRepo.getFullHistoryPayments(uid);
		return result;
	};
}
