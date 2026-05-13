export default class UsersRepository {
	constructor(database) {
		this.database = database;
	}

	getUsers = async (search, value) => {
		const sqlModified = `SELECT 
                        u.id_user, 
                        u.first_name, 
                        u.last_name, 
                        u.dni, 
                        f.fee_descr,
                        f.amount AS fee_month,
                        (SELECT f2.amount FROM fees f2 WHERE f2.id_fee = 10) AS fee_annual,

                        -- Datos del último pago mensual incompleto
                        m.amount AS last_unpaid_month_amount,
                        m.month_paid AS month_paid,
                        m.year_paid AS year_paid,

                        -- Datos del último pago anual incompleto
                        a.amount AS annual_pending_amount,
                        a.year_paid AS annual_pending_year

                    FROM users u
                    INNER JOIN fees f ON u.id_fee = f.id_fee

                    -- Join para el último pago mensual incompleto
                    LEFT JOIN (
                        SELECT m1.*
                        FROM monthly_payments m1
                        WHERE m1.is_complete = 0
                        AND m1.id_payment = (
                            SELECT MAX(m2.id_payment) 
                            FROM monthly_payments m2 
                            WHERE m2.id_user = m1.id_user AND m2.is_complete = 0
                        )
                    ) m ON u.id_user = m.id_user
                    
                    -- Join para el último pago anual incompleto
                    LEFT JOIN (
                        SELECT a1.*
                        FROM annual_payments a1
                        WHERE a1.is_complete = 0
                        AND a1.id_payment = (
                            SELECT MAX(a2.id_payment) 
                            FROM annual_payments a2 
                            WHERE a2.id_user = a1.id_user AND a2.is_complete = 0
                        )
                    ) a ON u.id_user = a.id_user
                    WHERE u.user_status = true;`;

		try {
			if (search === "TODO" || !value) {
				const [rows, fields] = await this.database.execute(sqlModified);
				return rows;
			} else if (value === "0" && search === "user_status") {
				const sqlModified = `SELECT 
                        u.id_user, 
                        u.first_name, 
                        u.last_name, 
                        u.dni, 
                        f.fee_descr,
                        f.amount AS fee_month,
                        (SELECT f2.amount FROM fees f2 WHERE f2.id_fee = 10) AS fee_annual,

                        -- Datos del último pago mensual incompleto
                        m.amount AS last_unpaid_month_amount,
                        m.month_paid AS month_paid,
                        m.year_paid AS year_paid,

                        -- Datos del último pago anual incompleto
                        a.amount AS annual_pending_amount,
                        a.year_paid AS annual_pending_year

                    FROM users u
                    INNER JOIN fees f ON u.id_fee = f.id_fee

                    -- Join para el último pago mensual incompleto
                    LEFT JOIN (
                        SELECT m1.*
                        FROM monthly_payments m1
                        WHERE m1.is_complete = 0
                        AND m1.id_payment = (
                            SELECT MAX(m2.id_payment) 
                            FROM monthly_payments m2 
                            WHERE m2.id_user = m1.id_user AND m2.is_complete = 0
                        )
                    ) m ON u.id_user = m.id_user
                    
                    -- Join para el último pago anual incompleto
                    LEFT JOIN (
                        SELECT a1.*
                        FROM annual_payments a1
                        WHERE a1.is_complete = 0
                        AND a1.id_payment = (
                            SELECT MAX(a2.id_payment) 
                            FROM annual_payments a2 
                            WHERE a2.id_user = a1.id_user AND a2.is_complete = 0
                        )
                    ) a ON u.id_user = a.id_user
                    WHERE u.user_status = false;`;

				const [rows, fields] = await this.database.execute(sqlModified);
				return rows;
			} else if (search === "monthly_pay_date_cash") {
				const sqlDateModified = `SELECT 
                                    u.id_user, 
                                    u.first_name, 
                                    u.last_name, 
                                    u.dni, 
                                    f.fee_descr,
                                    f.amount AS fee_month,
                                    (SELECT f2.amount FROM fees f2 WHERE f2.id_fee = 10) AS fee_annual,

                                    -- Datos del último pago mensual incompleto
                                    m.amount AS last_unpaid_month_amount,
                                    m.month_paid AS month_paid,
                                    m.year_paid AS year_paid,

                                    -- Datos del último pago anual incompleto
                                    a.amount AS annual_pending_amount,
                                    a.year_paid AS annual_pending_year

                                FROM users u
                                INNER JOIN fees f ON u.id_fee = f.id_fee

                                -- Filtramos por los usuarios que pagaron en la fecha y método específico
                                INNER JOIN (
                                    SELECT id_user
                                    FROM (
                                        SELECT mph.id_payment, mp.id_user 
                                        FROM monthly_payments_history mph
                                        JOIN monthly_payments mp ON mph.id_payment = mp.id_payment
                                        WHERE mph.pay_date = '${value}' AND mph.is_electronic = false
                                        ORDER BY mph.id_monthly_payment DESC
                                    ) AS sub_pagos
                                    GROUP BY id_user -- Evita usuarios repetidos si pagaron varias veces el mismo día
                                ) pagos_dia ON u.id_user = pagos_dia.id_user
                                
                                -- Buscamos el último registro mensual incompleto
                                LEFT JOIN (
                                    SELECT m1.*
                                    FROM monthly_payments m1
                                    WHERE m1.is_complete = 0
                                    AND m1.id_payment = (
                                        SELECT MAX(m2.id_payment) 
                                        FROM monthly_payments m2 
                                        WHERE m2.id_user = m1.id_user AND m2.is_complete = 0
                                    )
                                ) m ON u.id_user = m.id_user
                                
                                -- Buscamos el último registro anual incompleto
                                LEFT JOIN (
                                    SELECT a1.*
                                    FROM annual_payments a1
                                    WHERE a1.is_complete = 0
                                    AND a1.id_payment = (
                                        SELECT MAX(a2.id_payment) 
                                        FROM annual_payments a2 
                                        WHERE a2.id_user = a1.id_user AND a2.is_complete = 0
                                    )
                                ) a ON u.id_user = a.id_user
                                WHERE u.user_status = true;`;

				const [rows, fields] = await this.database.execute(sqlDateModified);
				return rows;
			} else if (search === "monthly_pay_date_electronic") {
				const sqlDateModified = `SELECT 
                                    u.id_user, 
                                    u.first_name, 
                                    u.last_name, 
                                    u.dni, 
                                    f.fee_descr,
                                    f.amount AS fee_month,
                                    (SELECT f2.amount FROM fees f2 WHERE f2.id_fee = 10) AS fee_annual,

                                    -- Datos del último pago mensual incompleto
                                    m.amount AS last_unpaid_month_amount,
                                    m.month_paid AS month_paid,
                                    m.year_paid AS year_paid,

                                    -- Datos del último pago anual incompleto
                                    a.amount AS annual_pending_amount,
                                    a.year_paid AS annual_pending_year

                                FROM users u
                                INNER JOIN fees f ON u.id_fee = f.id_fee

                                -- Filtramos por los usuarios que pagaron en la fecha y método específico
                                INNER JOIN (
                                    SELECT id_user
                                    FROM (
                                        SELECT mph.id_payment, mp.id_user 
                                        FROM monthly_payments_history mph
                                        JOIN monthly_payments mp ON mph.id_payment = mp.id_payment
                                        WHERE mph.pay_date = '${value}' AND mph.is_electronic = true
                                        ORDER BY mph.id_monthly_payment DESC
                                    ) AS sub_pagos
                                    GROUP BY id_user -- Evita usuarios repetidos si pagaron varias veces el mismo día
                                ) pagos_dia ON u.id_user = pagos_dia.id_user
                                
                                -- Buscamos el último registro mensual incompleto
                                LEFT JOIN (
                                    SELECT m1.*
                                    FROM monthly_payments m1
                                    WHERE m1.is_complete = 0
                                    AND m1.id_payment = (
                                        SELECT MAX(m2.id_payment) 
                                        FROM monthly_payments m2 
                                        WHERE m2.id_user = m1.id_user AND m2.is_complete = 0
                                    )
                                ) m ON u.id_user = m.id_user
                                
                                -- Buscamos el último registro anual incompleto
                                LEFT JOIN (
                                    SELECT a1.*
                                    FROM annual_payments a1
                                    WHERE a1.is_complete = 0
                                    AND a1.id_payment = (
                                        SELECT MAX(a2.id_payment) 
                                        FROM annual_payments a2 
                                        WHERE a2.id_user = a1.id_user AND a2.is_complete = 0
                                    )
                                ) a ON u.id_user = a.id_user
                                WHERE u.user_status = true;`;

				const [rows, fields] = await this.database.execute(sqlDateModified);
				return rows;
			} else if (search === "annual_pay_date_cash") {
				const sqlAnnualDateModified = `SELECT 
                                                u.id_user, 
                                                u.first_name, 
                                                u.last_name, 
                                                u.dni, 
                                                f.fee_descr,
                                                f.amount AS fee_month,
                                                (SELECT f2.amount FROM fees f2 WHERE f2.id_fee = 10) AS fee_annual,

                                                -- Datos del último pago mensual incompleto
                                                m.amount AS last_unpaid_month_amount,
                                                m.month_paid AS month_paid,
                                                m.year_paid AS year_paid,

                                                -- Datos del último pago anual incompleto
                                                a.amount AS annual_pending_amount,
                                                a.year_paid AS annual_pending_year

                                            FROM users u
                                            INNER JOIN fees f ON u.id_fee = f.id_fee

                                            -- Filtramos por los usuarios que registraron un pago ANUAL en la fecha y método específico
                                            INNER JOIN (
                                                SELECT id_user
                                                FROM (
                                                    SELECT aph.id_payment, ap.id_user 
                                                    FROM annual_payments_history aph
                                                    JOIN annual_payments ap ON aph.id_payment = ap.id_payment
                                                    WHERE aph.pay_date = '${value}' AND aph.is_electronic = false
                                                    ORDER BY aph.id_annual_payment DESC
                                                ) AS sub_pagos_anuales
                                                GROUP BY id_user 
                                            ) pagos_dia ON u.id_user = pagos_dia.id_user
                                            
                                            -- Buscamos el último registro mensual incompleto para mostrar como información adicional
                                            LEFT JOIN (
                                                SELECT m1.*
                                                FROM monthly_payments m1
                                                WHERE m1.is_complete = 0
                                                AND m1.id_payment = (
                                                    SELECT MAX(m2.id_payment) 
                                                    FROM monthly_payments m2 
                                                    WHERE m2.id_user = m1.id_user AND m2.is_complete = 0
                                                )
                                            ) m ON u.id_user = m.id_user
                                            
                                            -- Buscamos el último registro anual incompleto (podría ser el que acaba de pagar si fue parcial)
                                            LEFT JOIN (
                                                SELECT a1.*
                                                FROM annual_payments a1
                                                WHERE a1.is_complete = 0
                                                AND a1.id_payment = (
                                                    SELECT MAX(a2.id_payment) 
                                                    FROM annual_payments a2 
                                                    WHERE a2.id_user = a1.id_user AND a2.is_complete = 0
                                                )
                                            ) a ON u.id_user = a.id_user
                                            WHERE u.user_status = true;`;

				const [rows, fields] = await this.database.execute(sqlAnnualDateModified);
				return rows;
			} else if (search === "annual_pay_date_electronic") {
				const sqlAnnualDateModified = `SELECT 
                                                u.id_user, 
                                                u.first_name, 
                                                u.last_name, 
                                                u.dni, 
                                                f.fee_descr,
                                                f.amount AS fee_month,
                                                (SELECT f2.amount FROM fees f2 WHERE f2.id_fee = 10) AS fee_annual,

                                                -- Datos del último pago mensual incompleto
                                                m.amount AS last_unpaid_month_amount,
                                                m.month_paid AS month_paid,
                                                m.year_paid AS year_paid,

                                                -- Datos del último pago anual incompleto
                                                a.amount AS annual_pending_amount,
                                                a.year_paid AS annual_pending_year

                                            FROM users u
                                            INNER JOIN fees f ON u.id_fee = f.id_fee

                                            -- Filtramos por los usuarios que registraron un pago ANUAL en la fecha y método específico
                                            INNER JOIN (
                                                SELECT id_user
                                                FROM (
                                                    SELECT aph.id_payment, ap.id_user 
                                                    FROM annual_payments_history aph
                                                    JOIN annual_payments ap ON aph.id_payment = ap.id_payment
                                                    WHERE aph.pay_date = '${value}' AND aph.is_electronic = true
                                                    ORDER BY aph.id_annual_payment DESC
                                                ) AS sub_pagos_anuales
                                                GROUP BY id_user 
                                            ) pagos_dia ON u.id_user = pagos_dia.id_user
                                            
                                            -- Buscamos el último registro mensual incompleto para mostrar como información adicional
                                            LEFT JOIN (
                                                SELECT m1.*
                                                FROM monthly_payments m1
                                                WHERE m1.is_complete = 0
                                                AND m1.id_payment = (
                                                    SELECT MAX(m2.id_payment) 
                                                    FROM monthly_payments m2 
                                                    WHERE m2.id_user = m1.id_user AND m2.is_complete = 0
                                                )
                                            ) m ON u.id_user = m.id_user
                                            
                                            -- Buscamos el último registro anual incompleto (podría ser el que acaba de pagar si fue parcial)
                                            LEFT JOIN (
                                                SELECT a1.*
                                                FROM annual_payments a1
                                                WHERE a1.is_complete = 0
                                                AND a1.id_payment = (
                                                    SELECT MAX(a2.id_payment) 
                                                    FROM annual_payments a2 
                                                    WHERE a2.id_user = a1.id_user AND a2.is_complete = 0
                                                )
                                            ) a ON u.id_user = a.id_user
                                            WHERE u.user_status = true;`;

				const [rows, fields] = await this.database.execute(sqlAnnualDateModified);
				return rows;
			} else {
				let valueWilcard = value + "%";
				const sqlModified = `SELECT 
                        u.id_user, 
                        u.first_name, 
                        u.last_name, 
                        u.dni, 
                        f.fee_descr,
                        f.amount AS fee_month,
                        (SELECT f2.amount FROM fees f2 WHERE f2.id_fee = 10) AS fee_annual,

                        -- Datos del último pago mensual incompleto
                        m.amount AS last_unpaid_month_amount,
                        m.month_paid AS month_paid,
                        m.year_paid AS year_paid,

                        -- Datos del último pago anual incompleto
                        a.amount AS annual_pending_amount,
                        a.year_paid AS annual_pending_year

                    FROM users u
                    INNER JOIN fees f ON u.id_fee = f.id_fee

                    -- Join para el último pago mensual incompleto
                    LEFT JOIN (
                        SELECT m1.*
                        FROM monthly_payments m1
                        WHERE m1.is_complete = 0
                        AND m1.id_payment = (
                            SELECT MAX(m2.id_payment) 
                            FROM monthly_payments m2 
                            WHERE m2.id_user = m1.id_user AND m2.is_complete = 0
                        )
                    ) m ON u.id_user = m.id_user
                    
                    -- Join para el último pago anual incompleto
                    LEFT JOIN (
                        SELECT a1.*
                        FROM annual_payments a1
                        WHERE a1.is_complete = 0
                        AND a1.id_payment = (
                            SELECT MAX(a2.id_payment) 
                            FROM annual_payments a2 
                            WHERE a2.id_user = a1.id_user AND a2.is_complete = 0
                        )
                    ) a ON u.id_user = a.id_user
                    WHERE u.${search} LIKE '${valueWilcard}' AND u.user_status = true;`;

				const [rows, fields] = await this.database.execute(sqlModified);
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
			if (search === "TODO" || !value) {
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
                    WHERE u.${search} LIKE '${valueWilcard}'`;

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
