import { generateToken, createHash, isValidPass } from "../tools/utils.js";
import CustomError from "../tools/customErrors/customError.js";
import TErrors from "../tools/customErrors/enum.js";
import 'dotenv/config'


export default class UsersController {
    constructor(service) {
        this.usersService = service;
    }

    getUsers = async (req, res, next) => {
        const { search, value } = req.body;
        try {
            const users = await this.usersService.getUsers(search, value);
            res.status(200).send(users)
        } catch (error) {
            next(error)
        }
    }

    getUsersClean = async (req, res, next) => {
        const { search, value } = req.body;
        try {
            const users = await this.usersService.getUsersClean(search, value);
            res.status(200).send(users)
        } catch (error) {
            next(error)
        }
    }

    getUsersWithUnpaidMonth = async (req, res, next) => {
        const { search, value } = req.body;
        try {
            const users = await this.usersService.getUsersWithUnpaidMonth(search, value);
            res.status(200).send(users)
        } catch (error) {
            next(error)
        }
    }

    getUsersWithUnpaidAnnual = async (req, res, next) => {
        const { search, value } = req.body;
        try {
            const users = await this.usersService.getUsersWithUnpaidAnnual(search, value);
            res.status(200).send(users)
        } catch (error) {
            next(error)
        }
    }

    getUser = async (req, res, next) => {
        const uid = req.user === null ? null : req.user.id_user;
        try {
            if (uid === null){
                return res.status(200).send(null)
            }
            const user = await this.usersService.getUser(uid);
            if (!user.length) {
                CustomError.createError({
                    message: `El usuario de ID ${uid} no encontrado.`,
                    code: TErrors.NOT_FOUND,
                });
            }
            res.status(200).send(user[0])
        } catch (error) {
            next(error)
        }
    }

    updateUser = async (req, res, next) => {
        const uid = req.user.id_user;
        const { first_name, last_name, email, birth_date, dni, tel_contact } = req.body;
        try {
            if (!first_name || !last_name || !birth_date || !dni || !tel_contact) {
                CustomError.createError({
                    message: `Faltan datos o son inválidos.`,
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
            if (user[0].dni !== dni) {
                const userByDni = await this.usersService.getUserByDni(dni);
                if (userByDni.length !== 0) {
                    CustomError.createError({
                        message: `El usuario de DNI ${dni} ya existe.`,
                        code: TErrors.CONFLICT,
                    });
                } else {
                    await this.usersService.updateUser(uid, { first_name, last_name, email, birth_date, dni, tel_contact });
                    return res.status(200).send(`Usuario correctamente actualizado!`)
                }

            }
            await this.usersService.updateUserWoDni(uid, { first_name, last_name, email, birth_date, tel_contact });
            res.status(200).send(`Usuario correctamente actualizado!`)
        } catch (error) {
            next(error)
        }
    }

    changeUserStatus = async (req, res, next) => {
        const { uid, userStatus } = req.body;
        try {
            if (userStatus === undefined) {
                CustomError.createError({
                    message: `Faltan datos o son inválidos.`,
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
            const changeStatus = await this.usersService.changeUserStatus(uid, userStatus);
            res.status(200).send(changeStatus)
        } catch (error) {
            next(error)
        }
    }

    changeUserGroup = async (req, res, next) => {
        const { uid, newUserGroup } = req.body;
        try {
            if (!newUserGroup) {
                CustomError.createError({
                    message: `Faltan datos o son inválidos.`,
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
            const userGroup = await this.usersService.changeUserGroup(uid, newUserGroup);
            res.status(200).send(userGroup)
        } catch (error) {
            next(error)
        }
    }

    changeUserFee = async (req, res, next) => {
        const { uid, userFee } = req.body;
        try {
            if (!userFee) {
                CustomError.createError({
                    message: `Faltan datos o son inválidos.`,
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
            const changeFee = await this.usersService.changeUserFee(uid, userFee);
            res.status(200).send(changeFee)
        } catch (error) {
            next(error)
        }
    }

    userLogin = async (req, res, next) => {
        try {
            const id_user = req.user.id_user;
            const first_name = req.user.first_name;
            const last_name = req.user.last_name;
            const email = req.user.email;
            const birth_date = req.user.birth_date;
            const dni = req.user.dni;
            const is_admin = req.user.is_admin;
            const user_status = req.user.user_status;
            const register_date = req.user.register_date;
            const fee = req.user.id_fee;
            const tel_contact = req.user.tel_contact;
            const user_group = req.user.user_group;
            let token = generateToken({ id_user, first_name, last_name, dni });

            res.status(200).send({ id_user, first_name, last_name, email, birth_date, dni, is_admin, user_status, register_date, fee, tel_contact, user_group, token })
        } catch (error) {
            next(error)
        }
    }

    userSignIn = async (req, res, next) => {
        try {
            const id_user = req.user.id_user;
            const first_name = req.user.first_name;
            const last_name = req.user.last_name;
            const email = req.user.email;
            const birth_date = req.user.birth_date;
            const dni = req.user.dni;
            const is_admin = req.user.is_admin;
            const user_status = req.user.user_status;
            const register_date = req.user.register_date;
            const fee = req.user.id_fee;
            const tel_contact = req.user.tel_contact;
            const user_group = req.user.user_group;
            let token = generateToken({ id_user, first_name, last_name, dni });

            res.status(200).send({ id_user, first_name, last_name, email, birth_date, dni, is_admin, user_status, register_date, fee, tel_contact, user_group, token })
        } catch (error) {
            next(error)
        }
    }


    userLogout = async (req, res) => {
        return res.status(200).send("Usuario deslogueado!");
    }


    passRestoration = async (req, res, next) => {
        const { code } = req.body;
        try {
            if (!code) {
                CustomError.createError({
                    message: `Faltan datos o son inválidos.`,
                    code: TErrors.INVALID_TYPES,
                });
            }

            const user = await this.usersService.getUserByDni(code.slice(0, 8));
            if (!user.length) {
                CustomError.createError({
                    name: "Error restaurando contraseña",
                    message: `Usuario no encontrado.`,
                    code: TErrors.NOT_FOUND,
                });
            }

		const date = user[0].birth_date.split(/[-/]/);
        	const userBirthDate = String(date[0]) + String(date[1]) + String(date[2])
        	const userBirthDateCode = String(code).slice(8)

            if (userBirthDateCode != userBirthDate) {
                CustomError.createError({
                    name: "Error restaurando contraseña",
                    message: `Código incorrecto, intente nuevamente.`,
                    code: TErrors.NOT_FOUND,
                });
            }
            res.status(200).send({ uid: user[0].id_user });
        } catch (error) {
            next(error)
        }
    }

    userChangePass = async (req, res, next) => {
        const { uid, password } = req.body;
        
        
        try {
            const user = await this.usersService.getUser(uid);
            if (!user.length) {
                CustomError.createError({
                    name: "Error restaurando contraseña",
                    message: `Usuario con ID ${uid} no encontrado.`,
                    code: TErrors.INVALID_TYPES,
                });
            }
            if (password.length < 8) {
                CustomError.createError({
                    name: "Error restaurando contraseña",
                    message: "Contraseña inválida. Debe tener 8 carácteres mínimo.",
                    code: TErrors.INVALID_TYPES,
                });
            }
            if (isValidPass(password, user[0].user_password)) {
                CustomError.createError({
                    name: "Error restaurando contraseña",
                    message: "La contraseña debe ser diferente a la anterior.",
                    code: TErrors.INVALID_TYPES,
                });
            }
            await this.usersService.updateUserPassword(uid, createHash(password));
            res.status(200).send("Se cambió la contraseña correctamente.")
        } catch (error) {
            next(error)
        }
    }

   deleteUser = async (req, res, next) => {
        const { uid } = req.params;
        try {
            if (!uid) {
                CustomError.createError({
                    message: `Faltan datos o son inválidos.`,
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
            await this.usersService.deleteUser(uid);
            res.status(200).send()
        } catch (error) {
            next(error)
        }
    }

}

