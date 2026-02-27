export default class ProductService {
	constructor(repository) {
		this.merchRepo = repository;
	}

	async getMerchRequests(search, value) {
		const result = await this.merchRepo.getMerchRequests(search, value);
		return result;
	}

	async getUserMerchRequest(uid) {
		const result = await this.merchRepo.getUserMerchRequest(uid);
		return result;
	}

	async getAllUserMerchRequest(uid) {
		const result = await this.merchRepo.getAllUserMerchRequest(uid);
		return result;
	}

	async getMerchRequestById(mid) {
		const result = await this.merchRepo.getMerchRequestById(mid);
		return result;
	}

	async addMerchRequest(uid, pid) {
		const result = await this.merchRepo.addMerchRequest(uid, pid);
		return result;
	}

	async addMerchPayment(mid, amount, payDate, isElectronic) {
		const result = await this.merchRepo.addMerchPayment(
			mid,
			amount,
			payDate,
			isElectronic,
		);
		return result;
	}

	async updateMerchRequest(mid, merchReqUpdated) {
		const result = await this.merchRepo.updateMerchRequest(mid, merchReqUpdated);
		return result;
	}

	async deleteMerchRequest(mid) {
		const result = await this.merchRepo.deleteMerchRequest(mid);
		return result;
	}

	async updateMerchPayment(mid, payDate) {
		const result = await this.merchRepo.updateMerchPayment(mid, payDate);
		return result;
	}

	async getNewMerchRequests() {
		const result = await this.merchRepo.getNewMerchRequests();
		return result;
	}

	async updateSeenMerchRequest() {
		const result = await this.merchRepo.updateSeenMerchRequest();
		return result;
	}

	getDebtorsHistory = async (day, group) => {
		const result = await this.merchRepo.getDebtorsHistory(day, group);
		return result;
	};
}
