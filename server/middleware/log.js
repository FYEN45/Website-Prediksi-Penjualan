import { connection } from '../javascripts/mysql.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import moment from 'moment';

dotenv.config();
const SECRET_TOKEN = process.env.SECRET_TOKEN;

export const logActivity = async (req, res, next) => {
	try {
		let token = req.header('Authorization');
		const verified = jwt.verify(token, SECRET_TOKEN);

		const username = verified.username;
		const { originalUrl, method, body } = req;

		await connection.execute(
			`
		INSERT INTO logActivity (waktu, username, method, url, data)
		VALUES (?,?,?,?,?)`,
			[
				moment().format('YYYY-MM-DD HH:mm:ss'),
				username,
				method,
				originalUrl,
				JSON.stringify(req.body),
			]
		);

		next();
	} catch (error) {
		console.error(error);
	}
};
