export default class MerchRequestsRepository {
	constructor(database) {
		this.database = database;
	}

	getMerchRequests = async (search, value) => {
		let result = [];

		const sql2 = `SELECT  u.id_user, u.last_name, u.first_name, u.tel_contact, m.id_request, m.req_date, m.req_description, m.pay_date, mp.is_electronic, COALESCE(SUM(mp.amount), 0) AS amount                  FROM users u JOIN merch_requests m ON u.id_user = m.id_user 
                  LEFT JOIN merch_payments mp ON m.id_request = mp.id_request
                  WHERE u.user_status = 1
                  GROUP BY 
                      u.id_user, 
                      u.last_name, 
                      u.first_name, 
                      u.tel_contact, 
                      m.id_request, 
                      m.req_date, 
                      m.req_description, 
                      m.pay_date,
                      mp.is_electronic`;

		try {
			if (search === "TODO") {
				const [rows, fields] = await this.database.execute(sql2);
				result = rows;
			} else if (!value) {
				const [rows, fields] = await this.database.execute(sql2);
				result = rows;
			} else if (value === "0" && search === "user_status") {
				const sql3 = `SELECT  u.id_user, u.last_name, u.first_name, u.tel_contact, m.id_request, m.req_date, m.req_description, m.pay_date, mp.is_electronic, COALESCE(SUM(mp.amount), 0) AS amount
                        FROM users u JOIN merch_requests m ON u.id_user = m.id_user 
                        LEFT JOIN merch_payments mp ON m.id_request = mp.id_request
                        WHERE u.user_status = 0
                        GROUP BY 
                            u.id_user, 
                            u.last_name, 
                            u.first_name, 
                            u.tel_contact, 
                            m.id_request, 
                            m.req_date, 
                            m.req_description, 
                            m.pay_date,
                      mp.is_electronic`;

				const [rows, fields] = await this.database.execute(sql3);
				result = rows;
			} else if (search === "pay_date") {
				let valueWilcardDescription = value + "%";

				const sql4 = `SELECT  u.id_user, u.last_name, u.first_name, u.tel_contact, m.id_request, m.req_date, m.req_description, m.pay_date, mp.is_electronic, COALESCE(SUM(mp.amount), 0) AS amount
                        FROM users u JOIN merch_requests m ON u.id_user = m.id_user 
                        LEFT JOIN merch_payments mp ON m.id_request = mp.id_request
                        WHERE mp.${search} LIKE '${valueWilcardDescription}' AND  u.user_status = 1
                        GROUP BY 
                            u.id_user, 
                            u.last_name, 
                            u.first_name, 
                            u.tel_contact, 
                            m.id_request, 
                            m.req_date, 
                            m.req_description, 
                            m.pay_date,
                      mp.is_electronic`;

				const [rows, fields] = await this.database.execute(sql4);
				result = rows;
			} else {
				let valueWilcard = value + "%";

				const sql3 = `SELECT  u.id_user, u.last_name, u.first_name, u.tel_contact, m.id_request, m.req_date, m.req_description, m.pay_date, mp.is_electronic, COALESCE(SUM(mp.amount), 0) AS amount
                        FROM users u JOIN merch_requests m ON u.id_user = m.id_user 
                        LEFT JOIN merch_payments mp ON m.id_request = mp.id_request
                        WHERE u.${search} LIKE '${valueWilcard}' AND u.user_status = 1
                        GROUP BY 
                            u.id_user, 
                            u.last_name, 
                            u.first_name, 
                            u.tel_contact, 
                            m.id_request, 
                            m.req_date, 
                            m.req_description, 
                            m.pay_date,
                      mp.is_electronic`;

				const [rows, fields] = await this.database.execute(sql3);
				result = rows;
			}
			const productQuery = `SELECT * FROM products;`;
			const [productRows, fields] = await this.database.execute(productQuery);

			const finalArray = result
				.map((res) => {
					// Buscamos el producto que coincida
					const product = productRows.find(
						(p) => p.id_product === parseInt(res.req_description),
					);

					// Si no hay producto, devolvemos null (para luego filtrarlo)
					if (!product) return null;

					// Si hay coincidencia, retornamos el objeto combinado
					return {
						...res,
						title: product.title,
						price: product.price,
					};
				})
				// Eliminamos los nulos (los que no tuvieron coincidencia)
				.filter((item) => item !== null);
			/* console.log("products: ", productRows);

			console.log(
				"resultados y final array en getUserMErch: ",
				result,
				finalArray,
			);
 */
			return finalArray;
		} catch (err) {
			throw err;
		}
	};

	getUserMerchRequest = async (uid) => {
		try {
			const sql = `SELECT m.req_date, m.req_description, m.pay_date, m.id_request, COALESCE(SUM(mp.amount), 0) AS amount
                  FROM users u JOIN merch_requests m ON u.id_user = m.id_user LEFT JOIN merch_payments mp ON m.id_request = mp.id_request
                  WHERE m.pay_date IS NOT NULL AND m.id_user = ?
                  GROUP BY m.id_request, m.req_date, m.req_description, m.pay_date`;

			const sql2 = `SELECT m.id_request, m.req_date, m.req_description, m.pay_date, COALESCE(SUM(mp.amount), 0) AS amount
                  FROM users u JOIN merch_requests m ON u.id_user = m.id_user LEFT JOIN merch_payments mp ON m.id_request = mp.id_request
                  WHERE u.id_user = ?
                  GROUP BY m.id_request, m.req_date, m.req_description, m.pay_date`;
			const [rows, fields] = await this.database.execute(sql, [uid]);
			return rows;
		} catch (err) {
			throw err;
		}
	};

	getAllUserMerchRequest = async (uid) => {
		try {
			const sql2 = `SELECT m.id_request, m.req_date, m.req_description, m.pay_date, COALESCE(SUM(mp.amount), 0) AS amount
                FROM users u JOIN merch_requests m ON u.id_user = m.id_user 
				LEFT JOIN merch_payments mp ON m.id_request = mp.id_request
                WHERE u.id_user = ?
                GROUP BY m.id_request, m.req_date, m.req_description, m.pay_date`;

			const [rows, fields] = await this.database.execute(sql2, [uid]);

			const productQuery = `SELECT * FROM products;`;
			const [productRows, productfields] =
				await this.database.execute(productQuery);

			const finalArray = rows.map((res) => {
				// Buscamos el producto que coincida
				const product = productRows.find(
					(p) => p.id_product === parseInt(res.req_description),
				);

				// Si no hay producto, devolvemos null (para luego filtrarlo)
				if (!product) return null;

				// Si hay coincidencia, retornamos el objeto combinado
				return {
					...res,
					title: product.title,
					price: product.price,
				};
			});
			return finalArray;
		} catch (err) {
			throw err;
		}
	};

	getNewMerchRequests = async () => {
		try {
			const sql = `SELECT  u.id_user,  u.first_name,  u.last_name, u.tel_contact, m.id_request, m.req_date, m.req_description, m.pay_date, COALESCE(SUM(mp.amount), 0) AS total_amount
                  FROM users u JOIN merch_requests m ON u.id_user = m.id_user 
                  LEFT JOIN merch_payments mp ON m.id_request = mp.id_request
                  WHERE m.seen = 0
                  GROUP BY 
                      u.id_user, 
                      u.first_name, 
                      u.last_name, 
                      u.tel_contact, 
                      m.id_request, 
                      m.req_date, 
                      m.req_description, 
                      m.pay_date`;
			const [rows, fields] = await this.database.query(sql);
			return rows;
		} catch (err) {
			throw err;
		}
	};

	getMerchRequestById = async (mid) => {
		try {
			const sql = "SELECT * FROM `merch_requests` WHERE id_request = ?";
			const [rows, fields] = await this.database.execute(sql, [mid]);
			return rows;
		} catch (err) {
			throw err;
		}
	};

	addMerchRequest = async (uid, pid) => {
		try {
			const sql =
				"INSERT INTO `merch_requests`(`id_user`, `req_description`) VALUES (?, ?)";
			const [result, fields] = await this.database.execute(sql, [uid, pid]);
			return result;
		} catch (err) {
			throw err;
		}
	};

	addMerchPayment = async (mid, amount, payDate, isElectronic) => {
		try {
			const sql =
				"INSERT INTO `merch_payments`(`id_request`, `amount`, `pay_date`, `is_electronic`) VALUES (?, ?, ?, ?)";
			const [result, fields] = await this.database.execute(sql, [
				mid,
				amount,
				payDate,
				isElectronic,
			]);
			return result;
		} catch (err) {
			throw err;
		}
	};

	updateMerchPayment = async (mid, payDate) => {
		try {
			const sql =
				"UPDATE `merch_requests` SET pay_date = ? WHERE `id_request` = ?";

			const [result, fields] = await this.database.execute(sql, [payDate, mid]);

			return result;
		} catch (err) {
			throw err;
		}
	};

	deleteMerchRequest = async (mid) => {
		try {
			const sql = "DELETE FROM `merch_requests` WHERE id_request = ?";
			const [result, fields] = await this.database.execute(sql, [mid]);
			return;
		} catch (err) {
			throw err;
		}
	};

	updateSeenMerchRequest = async () => {
		try {
			const sql = "UPDATE `merch_requests` SET seen = 1";
			const [result, fields] = await this.database.execute(sql);

			return result;
		} catch (err) {
			throw err;
		}
	};

	async getDebtorsHistory(day, group) {
		try {
			if (group === "todo") {
				const sql = `SELECT 
        u.id_user, 
        u.first_name, 
        u.last_name,
        u.tel_contact,
        u.user_status
                  FROM users u
                  LEFT JOIN merch_requests m ON u.id_user = m.id_user
                  WHERE m.pay_date IS NULL AND u.user_status = 1
                  AND m.req_date = ?`;
				const [rows, fields] = await this.database.query(sql, [day]);
				return rows;
			}
			const sql = `SELECT 
                        u.id_user, 
                        u.first_name, 
                        u.last_name,
                        u.tel_contact,
                        u.user_status
                FROM users u
                LEFT JOIN merch_requests m ON u.id_user = m.id_user
                WHERE m.pay_date IS NULL AND u.user_status = 1
                AND m.req_date = ? AND u.user_group = ?`;
			const [rows, fields] = await this.database.query(sql, [day, group]);

			return rows;
		} catch (err) {
			throw err;
		}
	}
}
