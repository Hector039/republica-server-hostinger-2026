export default class InscriptionsRequestsRepository {
	constructor(database) {
		this.database = database;
	}

	getInscriptionsRequests = async (search, value) => {
		const sql2 = `SELECT 
                            u.last_name, 
                            u.first_name, 
                            u.tel_contact, 
                            e.event_name, 
                            e.event_date, 
                            e.inscription_price,
                            i.inscription_date, 
                            i.pay_date, 
                            i.id_inscription, 
                            COALESCE(SUM(ip.amount), 0) AS total_amount
                        FROM users u
                        JOIN inscription_requests i ON u.id_user = i.id_user
                        JOIN custom_events e ON e.id_event = i.id_event
                        LEFT JOIN inscription_payments ip ON i.id_inscription = ip.id_inscription
                        WHERE u.user_status = 1
                        GROUP BY 
                            u.last_name, 
                            u.first_name, 
                            u.tel_contact, 
                            e.event_name, 
                            e.event_date, 
                            e.inscription_price, 
                            i.inscription_date, 
                            i.pay_date, 
                            i.id_inscription`;

		try {
			if (search === "TODO") {
				const [rows, fields] = await this.database.execute(sql2);
				return rows;
			} else if (!value) {
				const [rows, fields] = await this.database.execute(sql2);
				return rows;
			} else if (value === "0" && search === "user_status") {
				const sql3 = `SELECT 
                            u.last_name, 
                            u.first_name, 
                            u.tel_contact, 
                            e.event_name, 
                            e.event_date, 
                            e.inscription_price,
                            i.inscription_date, 
                            i.pay_date, 
                            i.id_inscription, 
                            COALESCE(SUM(ip.amount), 0) AS total_amount
                        FROM users u
                        JOIN inscription_requests i ON u.id_user = i.id_user
                        JOIN custom_events e ON e.id_event = i.id_event
                        LEFT JOIN inscription_payments ip ON i.id_inscription = ip.id_inscription
                        WHERE u.user_status = 0
                        GROUP BY 
                            u.last_name,
                            u.first_name, 
                            u.tel_contact, 
                            e.event_name, 
                            e.event_date, 
                            e.inscription_price, 
                            i.inscription_date, 
                            i.pay_date, 
                            i.id_inscription`;

				const [rows, fields] = await this.database.execute(sql3);
				return rows;
			} else if (search === "event_name") {
				let valueWilcardDescription = value + "%";

				const sql4 = `SELECT 
                            u.last_name, 
                            u.first_name, 
                            u.tel_contact, 
                            e.event_name, 
                            e.event_date, 
                            e.inscription_price,
                            i.inscription_date, 
                            i.pay_date, 
                            i.id_inscription, 
                            COALESCE(SUM(ip.amount), 0) AS total_amount
                        FROM users u
                        JOIN inscription_requests i ON u.id_user = i.id_user
                        JOIN custom_events e ON e.id_event = i.id_event
                        LEFT JOIN inscription_payments ip ON i.id_inscription = ip.id_inscription
                        WHERE e.${search} LIKE '${valueWilcardDescription}' AND  u.user_status = 1
                        GROUP BY 
                            u.last_name, 
                            u.first_name, 
                            u.tel_contact, 
                            e.event_name, 
                            e.event_date, 
                            e.inscription_price, 
                            i.inscription_date, 
                            i.pay_date, 
                            i.id_inscription`;

				const [rows, fields] = await this.database.execute(sql4);
				return rows;
			} else if (search === "pay_date") {
				console.log(value);

				let valueWilcardDescription = value + "%";

				const sql5 = `SELECT 
                            u.last_name, 
                            u.first_name, 
                            u.tel_contact, 
                            e.event_name, 
                            e.event_date, 
                            e.inscription_price,
                            i.inscription_date, 
                            i.pay_date, 
                            i.id_inscription, 
                            COALESCE(SUM(ip.amount), 0) AS total_amount
                        FROM users u
                        JOIN inscription_requests i ON u.id_user = i.id_user
                        JOIN custom_events e ON e.id_event = i.id_event
                        LEFT JOIN inscription_payments ip ON i.id_inscription = ip.id_inscription
                        WHERE ip.${search} LIKE '${valueWilcardDescription}' AND  u.user_status = 1
                        GROUP BY 
                            u.last_name, 
                            u.first_name, 
                            u.tel_contact, 
                            e.event_name, 
                            e.event_date, 
                            e.inscription_price, 
                            i.inscription_date, 
                            i.pay_date, 
                            i.id_inscription`;

				const [rows, fields] = await this.database.execute(sql5);
				return rows;
			} else {
				let valueWilcard = value + "%";

				const sql3 = `SELECT 
                            u.last_name, 
                            u.first_name, 
                            u.tel_contact, 
                            e.event_name, 
                            e.event_date, 
                            e.inscription_price,
                            i.inscription_date, 
                            i.pay_date, 
                            i.id_inscription, 
                            COALESCE(SUM(ip.amount), 0) AS total_amount
                        FROM users u
                        JOIN inscription_requests i ON u.id_user = i.id_user
                        JOIN custom_events e ON e.id_event = i.id_event
                        LEFT JOIN inscription_payments ip ON i.id_inscription = ip.id_inscription
                        WHERE u.${search} LIKE '${valueWilcard}' AND  u.user_status = 1
                        GROUP BY 
                            u.last_name, 
                            u.first_name, 
                            u.tel_contact, 
                            e.event_name, 
                            e.event_date, 
                            e.inscription_price, 
                            i.inscription_date, 
                            i.pay_date, 
                            i.id_inscription`;

				const [rows, fields] = await this.database.execute(sql3);
				return rows;
			}
		} catch (err) {
			throw err;
		}
	};

	getInscriptionRequest = async (iid) => {
		try {
			const sql = "SELECT * FROM `inscription_requests` WHERE id_inscription = ?";
			const [rows, fields] = await this.database.query(sql, [iid]);
			return rows;
		} catch (err) {
			throw err;
		}
	};

	getUserInscriptionsRequests = async (uid) => {
		try {
			const sql2 = `SELECT e.id_event, e.publication_date, e.event_date, e.event_name, e.event_description, e.inscription_price, i.id_user, i.id_inscription, i.pay_date
                  FROM custom_events e JOIN inscription_requests i  
                  ON e.id_event = i.id_event WHERE i.pay_date IS NOT NULL AND  i.id_user = ?`;
			const [rows, fields] = await this.database.query(sql2, [uid]);
			return rows;
		} catch (err) {
			throw err;
		}
	};

	getAllUserInscriptions = async (uid) => {
		try {
			const sql2 = `SELECT e.id_event, e.publication_date, e.event_date, e.event_name, e.event_description, 
                            e.inscription_price, i.id_user, i.id_inscription, i.pay_date, COALESCE(SUM(ip.amount), 0) AS amount
                  FROM custom_events e JOIN inscription_requests i ON e.id_event = i.id_event 
                  LEFT JOIN inscription_payments ip ON i.id_inscription = ip.id_inscription
                  WHERE i.id_user = ?
                  GROUP BY e.id_event, e.publication_date, e.event_date, e.event_name, e.event_description, 
                            e.inscription_price, i.id_user, i.id_inscription, i.pay_date`;
			const [rows, fields] = await this.database.query(sql2, [uid]);
			return rows;
		} catch (err) {
			throw err;
		}
	};

	addInscriptionRequest = async (eid, uid) => {
		try {
			const sql =
				"INSERT INTO `inscription_requests` (`id_user`, `id_event`) VALUES (?, ?)";
			const [result, fields] = await this.database.execute(sql, [uid, eid]);
			return result;
		} catch (err) {
			throw err;
		}
	};

	deleteInscriptionRequest = async (iid) => {
		try {
			const sql = "DELETE FROM `inscription_requests` WHERE id_inscription = ?";
			const [result, fields] = await this.database.execute(sql, [iid]);
			return;
		} catch (err) {
			throw err;
		}
	};

	updateInscriptionRequest = async (iid, payDate) => {
		try {
			const sql =
				"UPDATE `inscription_requests` SET pay_date = ? WHERE `id_inscription` = ?";
			const values = [payDate, iid];

			const [result, fields] = await this.database.execute(sql, values);

			return result;
		} catch (err) {
			throw err;
		}
	};

	addInscPayment = async (iid, amount, payDate) => {
		try {
			const sql =
				"INSERT INTO `inscription_payments`(`id_inscription`, `amount`, `pay_date`) VALUES (?, ?, ?)";
			const [result, fields] = await this.database.execute(sql, [
				iid,
				amount,
				payDate,
			]);
			return result;
		} catch (err) {
			throw err;
		}
	};

	checkPaymentExist = async (iid) => {
		try {
			const sql2 = `SELECT 
        ir.id_inscription, 
        ir.pay_date,
        ce.inscription_price,
        COALESCE(SUM(ip.amount), 0) AS total_amount
        
    FROM custom_events ce JOIN inscription_requests ir ON ce.id_event = ir.id_event
    LEFT JOIN inscription_payments ip ON ir.id_inscription = ip.id_inscription
    WHERE ir.id_inscription = ?
    GROUP BY ce.inscription_price`;

			const [rows, fields] = await this.database.query(sql2, [iid]);
			return rows;
		} catch (err) {
			throw err;
		}
	};

	getNewInscriptionRequests = async () => {
		try {
			const sql2 = `SELECT 
        u.first_name, 
        u.last_name, 
        u.tel_contact, 
        e.event_name, 
        e.event_date, 
        e.inscription_price,
        i.inscription_date, 
        i.pay_date, 
        i.id_inscription, 
        COALESCE(SUM(ip.amount), 0) AS total_amount
    FROM users u
    JOIN inscription_requests i ON u.id_user = i.id_user
    JOIN custom_events e ON e.id_event = i.id_event
    LEFT JOIN inscription_payments ip ON i.id_inscription = ip.id_inscription
    WHERE i.seen = 0
    GROUP BY 
        u.first_name, 
        u.last_name, 
        u.tel_contact, 
        e.event_name, 
        e.event_date, 
        e.inscription_price, 
        i.inscription_date, 
        i.pay_date, 
        i.id_inscription`;

			const sql = `SELECT u.first_name, u.last_name, u.tel_contact, e.event_name, e.event_date, e.inscription_price,
                            i.inscription_date, i.pay_date, i.id_inscription, COALESCE(SUM(ip.amount), 0) AS total_amount
                  FROM users u JOIN custom_events e JOIN inscription_requests i JOIN inscription_payments ip
                  ON u.id_user = i.id_user AND e.id_event = i.id_event AND i.id_inscription = ip.id_inscription
                  WHERE i.seen = 0
                  GROUP BY u.first_name, u.last_name, u.tel_contact, e.event_name, e.event_date, e.inscription_price, i.inscription_date, i.pay_date`;
			const [rows, fields] = await this.database.query(sql2);
			return rows;
		} catch (err) {
			throw err;
		}
	};

	updateSeenInscriptionRequests = async () => {
		try {
			const sql = "UPDATE `inscription_requests` SET seen = 1";
			const [result, fields] = await this.database.execute(sql);

			return result;
		} catch (err) {
			throw err;
		}
	};

	async getDebtorsHistory(day, group) {
		try {
			if (group === "todo") {
				const sql2 = `SELECT 
                        u.id_user, 
                        u.first_name, 
                        u.last_name,
                        u.tel_contact,
                        u.user_status
                    FROM users u
                    LEFT JOIN inscription_requests i ON u.id_user = i.id_user
                    JOIN custom_events e ON i.id_event = e.id_event
                    WHERE i.pay_date IS NULL AND u.user_status = 1
                    AND e.event_date = ?`;
				const [rows, fields] = await this.database.query(sql2, [day]);
				return rows;
			}

			const sql2 = `SELECT 
                        u.id_user, 
                        u.first_name, 
                        u.last_name,
                        u.tel_contact,
                        u.user_status
                    FROM users u
                    LEFT JOIN inscription_requests i ON u.id_user = i.id_user
                    JOIN custom_events e ON i.id_event = e.id_event
                    WHERE i.pay_date IS NULL AND u.user_status = 1
                    AND e.event_date = ? AND u.user_group = ?`;
			const [rows, fields] = await this.database.query(sql2, [day, group]);
			return rows;
		} catch (err) {
			throw err;
		}
	}

	checkInscriptionExistence = async (eid, uid) => {
		try {
			const sql2 = `SELECT e.event_name, i.id_inscription
                  FROM custom_events e JOIN inscription_requests i  
                  ON e.id_event = i.id_event WHERE i.id_user = ? AND e.id_event = ?`;
			const [rows, fields] = await this.database.query(sql2, [uid, eid]);
			return rows;
		} catch (err) {
			throw err;
		}
	};
}
