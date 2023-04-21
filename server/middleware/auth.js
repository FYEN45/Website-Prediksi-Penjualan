import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const SECRET_TOKEN = process.env.SECRET_TOKEN;

// opsi status : guest / admin
export const authMiddleware = (status) => async (req, res, next) => {
	try {
		let token = req.header('Authorization');

		if (!token) {
			return res.status(403).send('Access Denied');
		}

		const verified = jwt.verify(token, SECRET_TOKEN);

		if (status && verified.status !== status && verified.status !== 'admin') {
			return res.status(401).send('Unauthorized');
		}

		req.user = verified;
		next();
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
};
