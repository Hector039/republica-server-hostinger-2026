export default class UsersService {
    constructor(repository) {
        this.userRepo = repository;
    }

    async getUsers(search, value) {
        const result = await this.userRepo.getUsers(search, value);
        return result;
    }

    async getUsersClean(search, value) {
        const result = await this.userRepo.getUsersClean(search, value);
        return result;
    }

    async getUser(uid) {
        const result = await this.userRepo.getUser(uid);
        return result;
    }

    async getUserByEmail(email) {
        const result = await this.userRepo.getUserByEmail(email);
        return result;
    }

    async getUserByDni(dni) {
        const result = await this.userRepo.getUserByDni(dni);
        return result;
    }

    async addUser(newUser) {
        const result = await this.userRepo.addUser(newUser);
        return result;
    }

    async updateUserPassword(email, password) {
        const result = await this.userRepo.updateUserPassword(email, password);
        return result;
    }

    async updateUser(uid, updatedUser) {
        const result = await this.userRepo.updateUser(uid, updatedUser);
        return result;
    }

    async updateUserWoDni(uid, updatedUser){
        const result = await this.userRepo.updateUserWoDni(uid, updatedUser);
        return result;
    }
    
    async changeUserStatus(uid, userStatus) {
        const result = await this.userRepo.changeUserStatus(uid, userStatus);
        return result;
    }

    
    async changeUserGroup(uid, newUserGroup) {
        await this.userRepo.changeUserGroup(uid, newUserGroup);
        return;
    }

    async changeUserFee(uid, userFee) {
        await this.userRepo.changeUserFee(uid, userFee);
        return;
    }

    async deleteUser(uid) {
        await this.userRepo.deleteUser(uid);
        return;
    }
    
};
