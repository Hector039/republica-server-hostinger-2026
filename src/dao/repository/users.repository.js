export default class UsersRepository {
	constructor(database) {
		this.database = database;
	}

	getUsers = async (search, value) => {
		const sql = `SELECT 
                        u.id_user, 
                        u.first_name, 
                        u.last_name, 
                        u.dni, 
                        u.register_date, 
                        u.user_status, 
                        f.fee_descr,
                        f.amount AS fee_month,
                        (SELECT f2.amount FROM fees f2 WHERE f2.id_fee = 10) AS fee_annual,
                        
                        -- Última cuota mensual impaga
                        mp.year_paid AS last_unpaid_month_year,
                        mp.month_paid AS last_unpaid_month,
                        mp.amount AS last_unpaid_month_amount,
                        
                        -- Último pago anual impago
                        ap.year_paid AS last_unpaid_year,
                        ap.amount AS last_unpaid_amount

                    FROM users u
                    JOIN fees f ON u.id_fee = f.id_fee

                    -- Unión con pagos mensuales
                    LEFT JOIN monthly_payments mp 
                        ON u.id_user = mp.id_user 
                        AND mp.is_complete = 0
                        AND (mp.year_paid, mp.month_paid) = (
                            SELECT mp2.year_paid, mp2.month_paid
                            FROM monthly_payments mp2
                            WHERE mp2.id_user = u.id_user 
                            AND mp2.is_complete = 0
                            ORDER BY mp2.year_paid DESC, mp2.month_paid DESC
                            LIMIT 1
                        )

                    -- Unión con pagos anuales
                    LEFT JOIN annual_payments ap 
                        ON u.id_user = ap.id_user 
                        AND ap.is_complete = 0
                        AND ap.year_paid = (
                            SELECT MAX(ap2.year_paid)
                            FROM annual_payments ap2
                            WHERE ap2.id_user = u.id_user 
                            AND ap2.is_complete = 0
                        )
                    WHERE u.user_status = 1`;

		try {
			if (search === "TODO") {
				const [rows, fields] = await this.database.execute(sql);
				return rows;
			} else if (!value) {
				const [rows, fields] = await this.database.execute(sql);
				return rows;
			} else if (value === "0" && search === "user_status") {
				const sql2 = `SELECT 
                        u.id_user, 
                        u.first_name, 
                        u.last_name, 
                        u.dni, 
                        u.register_date, 
                        u.user_status, 
                        f.fee_descr,
                        f.amount AS fee_month,
                        (SELECT f2.amount FROM fees f2 WHERE f2.id_fee = 10) AS fee_annual,
                        
                        -- Última cuota mensual impaga
                        mp.year_paid AS last_unpaid_month_year,
                        mp.month_paid AS last_unpaid_month,
                        mp.amount AS last_unpaid_month_amount,
                        
                        -- Último pago anual impago
                        ap.year_paid AS last_unpaid_year,
                        ap.amount AS last_unpaid_amount

                    FROM users u
                    JOIN fees f ON u.id_fee = f.id_fee

                    -- Unión con pagos mensuales
                    LEFT JOIN monthly_payments mp 
                        ON u.id_user = mp.id_user 
                        AND mp.is_complete = 0
                        AND (mp.year_paid, mp.month_paid) = (
                            SELECT mp2.year_paid, mp2.month_paid
                            FROM monthly_payments mp2
                            WHERE mp2.id_user = u.id_user 
                            AND mp2.is_complete = 0
                            ORDER BY mp2.year_paid DESC, mp2.month_paid DESC
                            LIMIT 1
                        )

                    -- Unión con pagos anuales
                    LEFT JOIN annual_payments ap 
                        ON u.id_user = ap.id_user 
                        AND ap.is_complete = 0
                        AND ap.year_paid = (
                            SELECT MAX(ap2.year_paid)
                            FROM annual_payments ap2
                            WHERE ap2.id_user = u.id_user 
                            AND ap2.is_complete = 0
                        )
                    WHERE u.user_status = 0`;
				const [rows, fields] = await this.database.execute(sql2);
				return rows;
			} else if (search === "monthly_pay_date") {
				const sql3 = `SELECT 
                            u.id_user, 
                            u.first_name, 
                            u.last_name, 
                            u.dni, 
                            u.register_date, 
                            u.user_status, 
                            f.fee_descr,
                            f.amount AS fee_month,
                            (SELECT f2.amount FROM fees f2 WHERE f2.id_fee = 10) AS fee_annual,

                            -- Última cuota mensual impaga
                            mp.year_paid AS last_unpaid_month_year,
                            mp.month_paid AS last_unpaid_month,
                            mp.amount AS last_unpaid_month_amount,

                            -- Último pago anual impago
                            ap.year_paid AS last_unpaid_year,
                            ap.amount AS last_unpaid_amount

                        FROM users u
                        JOIN fees f ON u.id_fee = f.id_fee

                        -- Pagos mensuales pendientes
                        LEFT JOIN monthly_payments mp 
                            ON u.id_user = mp.id_user 
                            
                            AND (mp.year_paid, mp.month_paid) = (
                                SELECT mp2.year_paid, mp2.month_paid
                                FROM monthly_payments mp2
                                WHERE mp2.id_user = u.id_user
                                ORDER BY mp2.year_paid DESC, mp2.month_paid DESC
                                LIMIT 1
                            )

                        -- Pagos anuales pendientes
                        LEFT JOIN annual_payments ap 
                            ON u.id_user = ap.id_user
                            AND ap.year_paid = (
                                SELECT MAX(ap2.year_paid)
                                FROM annual_payments ap2
                                WHERE ap2.id_user = u.id_user
                            )

                        -- JOIN con historial de pagos mensuales (fecha de pago real)
                        INNER JOIN monthly_payments_history mph 
                            ON mph.id_payment = mp.id_payment
                            AND mph.pay_date = '${value}'

                        WHERE u.user_status = 1`;

				const [rows, fields] = await this.database.execute(sql3);
				return rows;
			} else if (search === "annual_pay_date") {
				const sql4 = `SELECT 
                        u.id_user, 
                        u.first_name, 
                        u.last_name, 
                        u.dni, 
                        u.register_date, 
                        u.user_status, 
                        f.fee_descr,
                        f.amount AS fee_month,
                        (SELECT f2.amount FROM fees f2 WHERE f2.id_fee = 10) AS fee_annual,
                        
                        -- Última cuota mensual impaga
                        mp.year_paid AS last_unpaid_month_year,
                        mp.month_paid AS last_unpaid_month,
                        mp.amount AS last_unpaid_month_amount,
                        
                        -- Último pago anual impago
                        ap.year_paid AS last_unpaid_year,
                        ap.amount AS last_unpaid_amount

                    FROM users u
                    JOIN fees f ON u.id_fee = f.id_fee

                    -- Unión con pagos mensuales
                    LEFT JOIN monthly_payments mp 
                        ON u.id_user = mp.id_user
                        AND (mp.year_paid, mp.month_paid) = (
                            SELECT mp2.year_paid, mp2.month_paid
                            FROM monthly_payments mp2
                            WHERE mp2.id_user = u.id_user
                            ORDER BY mp2.year_paid DESC, mp2.month_paid DESC
                            LIMIT 1
                        )

                    -- Unión con pagos anuales
                    LEFT JOIN annual_payments ap 
                        ON u.id_user = ap.id_user
                        AND ap.year_paid = (
                            SELECT MAX(ap2.year_paid)
                            FROM annual_payments ap2
                            WHERE ap2.id_user = u.id_user
                        )

                        -- JOIN con historial de pagos anuales (fecha de pago real)
                        INNER JOIN annual_payments_history aph 
                            ON aph.id_payment = ap.id_payment
                            AND aph.pay_date = '${value}'

                    WHERE u.user_status = 1`;

				const [rows, fields] = await this.database.execute(sql4);
				return rows;
			} else {
				let valueWilcard = value + "%";
				const sql5 = `SELECT 
                        u.id_user, 
                        u.first_name, 
                        u.last_name, 
                        u.dni, 
                        u.register_date, 
                        u.user_status, 
                        f.fee_descr,
                        f.amount AS fee_month,
                        (SELECT f2.amount FROM fees f2 WHERE f2.id_fee = 10) AS fee_annual,
                        
                        -- Última cuota mensual impaga
                        mp.year_paid AS last_unpaid_month_year,
                        mp.month_paid AS last_unpaid_month,
                        mp.amount AS last_unpaid_month_amount,
                        
                        -- Último pago anual impago
                        ap.year_paid AS last_unpaid_year,
                        ap.amount AS last_unpaid_amount

                    FROM users u
                    JOIN fees f ON u.id_fee = f.id_fee

                    -- Unión con pagos mensuales
                    LEFT JOIN monthly_payments mp 
                        ON u.id_user = mp.id_user 
                        AND mp.is_complete = 0
                        AND (mp.year_paid, mp.month_paid) = (
                            SELECT mp2.year_paid, mp2.month_paid
                            FROM monthly_payments mp2
                            WHERE mp2.id_user = u.id_user 
                            AND mp2.is_complete = 0
                            ORDER BY mp2.year_paid DESC, mp2.month_paid DESC
                            LIMIT 1
                        )

                    -- Unión con pagos anuales
                    LEFT JOIN annual_payments ap 
                        ON u.id_user = ap.id_user 
                        AND ap.is_complete = 0
                        AND ap.year_paid = (
                            SELECT MAX(ap2.year_paid)
                            FROM annual_payments ap2
                            WHERE ap2.id_user = u.id_user 
                            AND ap2.is_complete = 0
                        )

                    WHERE u.${search} LIKE '${valueWilcard}' AND u.user_status = 1`;

				const [rows, fields] = await this.database.execute(sql5);
				return rows;
			}
		} catch (err) {
			throw err;
		}
	};

	getUsersClean = async (search, value) => {
		const sql = `SELECT 
                    u.id_user, 
                    u.last_name, 
                    u.first_name, 
                    u.dni, 
                    u.register_date, 
                    u.birth_date, 
                    u.user_status, 
                    u.tel_contact, 
                    u.user_group,
                    f.id_fee,
                    f.fee_descr
                    FROM users u JOIN fees f ON u.id_fee = f.id_fee
                    WHERE u.user_status = 1`;

		try {
			if (search === "TODO") {
				const [rows, fields] = await this.database.execute(sql);
				return rows;
			} else if (!value) {
				const [rows, fields] = await this.database.execute(sql);
				return rows;
			} else if (value === "0" && search === "user_status") {
				const sql2 = `SELECT 
                    u.id_user, 
                    u.first_name, 
                    u.last_name, 
                    u.dni, 
                    u.register_date, 
                    u.birth_date, 
                    u.user_status, 
                    u.tel_contact, 
                    u.user_group,
                    f.id_fee,
                    f.fee_descr
                    FROM users u JOIN fees f ON u.id_fee = f.id_fee
                    WHERE u.user_status = 0`;
				const [rows, fields] = await this.database.execute(sql2);
				return rows;
			} else {
				let valueWilcard = value + "%";

				const sql3 = `SELECT 
                    u.id_user, 
                    u.first_name, 
                    u.last_name, 
                    u.dni, 
                    u.register_date, 
                    u.birth_date,
                    u.user_status, 
                    u.tel_contact,
                    u.user_group,
                    f.id_fee,
                    f.fee_descr
                    FROM users u JOIN fees f ON u.id_fee = f.id_fee 
                    WHERE u.${search} LIKE '${valueWilcard}' AND u.user_status = 1`;

				const [rows, fields] = await this.database.execute(sql3);
				return rows;
			}
		} catch (err) {
			throw err;
		}
	};

	changeUserStatus = async (uid, userStatus) => {
		try {
			const sql = "UPDATE `users` SET user_status = ? WHERE id_user = ?";
			const values = [userStatus, uid];

			const [result, fields] = await this.database.execute(sql, values);

			return fields;
		} catch (err) {
			throw err;
		}
	};

	changeUserGroup = async (uid, newGroup) => {
		try {
			const sql = "UPDATE `users` SET user_group = ? WHERE id_user = ?";
			const values = [newGroup, uid];

			const [result, fields] = await this.database.execute(sql, values);

			return result;
		} catch (err) {
			throw err;
		}
	};

	changeUserFee = async (uid, newFee) => {
		try {
			const sql = "UPDATE `users` SET id_fee = ? WHERE id_user = ?";

			const [result, fields] = await this.database.execute(sql, [newFee, uid]);

			return result;
		} catch (err) {
			throw err;
		}
	};

	updateUserPassword = async (uid, newPassword) => {
		try {
			const sql = "UPDATE `users` SET user_password = ? WHERE id_user = ?";
			const values = [newPassword, uid];

			const [result, fields] = await this.database.execute(sql, values);

			return result;
		} catch (err) {
			throw err;
		}
	};

	getUser = async (uid) => {
		try {
			const sql = `SELECT u.first_name, u.last_name, u.dni, u.register_date, u.user_status, u.birth_date, u.tel_contact, u.email, u.id_user, u.is_admin, u.user_password, u.user_group, f.fee_descr, f.amount
                  FROM users u JOIN fees f ON u.id_fee = f.id_fee WHERE id_user = ?`;
			const [rows, fields] = await this.database.execute(sql, [uid]);
			return rows;
		} catch (err) {
			throw err;
		}
	};

	getUserByEmail = async (email) => {
		try {
			const sql = "SELECT * FROM `users` WHERE email = ?";
			const [rows, fields] = await this.database.execute(sql, [email]);
			return rows;
		} catch (err) {
			throw err;
		}
	};

	getUserByDni = async (dni) => {
		try {
			const sql = "SELECT * FROM `users` WHERE dni = ?";
			const [rows, fields] = await this.database.execute(sql, [dni]);
			return rows;
		} catch (err) {
			throw err;
		}
	};

	addUser = async (newuser) => {
		try {
			const sql =
				"INSERT INTO `users`(`first_name`, `last_name`, `email`, `birth_date`, `user_password`, `dni`, `tel_contact`) VALUES (?, ?, ?, ?, ?, ?, ?)";
			const values = [
				newuser.first_name,
				newuser.last_name,
				newuser.email,
				newuser.birth_date,
				newuser.user_password,
				newuser.dni,
				newuser.tel_contact,
			];
			const [result, fields] = await this.database.execute(sql, values);
			return result;
		} catch (err) {
			throw err;
		}
	};

	updateUser = async (uid, updatedUser) => {
		try {
			const sql =
				"UPDATE `users` SET `first_name` = ?, `last_name` = ?, `email` = ?, `birth_date` = ?, `dni` = ?, `tel_contact` = ? WHERE `id_user` = ?";
			const values = [
				updatedUser.first_name,
				updatedUser.last_name,
				updatedUser.email,
				updatedUser.birth_date,
				updatedUser.dni,
				updatedUser.tel_contact,
				uid,
			];

			const [result, fields] = await this.database.execute(sql, values);

			return result;
		} catch (err) {
			throw err;
		}
	};

	updateUserWoDni = async (uid, updatedUser) => {
		try {
			const sql =
				"UPDATE `users` SET `first_name` = ?, `last_name` = ?, `email` = ?, `birth_date` = ?, `tel_contact` = ? WHERE `id_user` = ?";
			const values = [
				updatedUser.first_name,
				updatedUser.last_name,
				updatedUser.email,
				updatedUser.birth_date,
				updatedUser.tel_contact,
				uid,
			];

			const [result, fields] = await this.database.execute(sql, values);

			return result;
		} catch (err) {
			throw err;
		}
	};

	deleteUser = async (uid) => {
		try {
			const sql = "DELETE FROM `users` WHERE `id_user` = ?";
			const [result, fields] = await this.database.execute(sql, [uid]);
			return result;
		} catch (err) {
			throw err;
		}
	};
}
