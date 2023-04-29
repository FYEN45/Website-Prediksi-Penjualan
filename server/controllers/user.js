import { connection } from '../javascripts/mysql.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const SECRET_TOKEN = process.env.SECRET_TOKEN;

export const postUserLogin = async (req, res) => {
	const { username, password } = req.body;

	const [row] = await connection.execute(
		`SELECT * FROM user WHERE username='${username}'`
	);

	if (row[0]) {
		const status = row[0].status;

		if (row[0].password === password) {
			const token = jwt.sign({ username, status }, SECRET_TOKEN);

			res
				.status(200)
				.json({ success: 'ok', message: 'Berhasil Login', token, status });
		} else {
			res
				.status(400)
				.json({ success: 'error', message: 'Username / Password salah' });
		}
	} else {
		res
			.status(400)
			.json({ success: 'error', message: 'Username tidak ditemukan' });
	}
};

export const getDataUser = async (req, res) => {
	try {
		const { username } = req.params;

		const [rows] = await connection.execute(
			'SELECT * FROM user WHERE username = ?',
			[username]
		);

		if (rows.length === 0) {
			return res
				.status(404)
				.json({ success: 'error', message: 'User tidak ditemukan' });
		}

		res.status(200).json(rows[0]);
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json({ success: 'error', message: 'Terjadi kesalahan pada server' });
	}
};

export const getDaftarUser = async (req, res) => {
	try {
		const [rows] = await connection.execute(
			'SELECT username, nama, noTelepon, alamat, status FROM `user`'
		);

		res.status(200).json(rows);
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json({ success: 'error', message: 'Terjadi kesalahan pada server' });
	}
};

export const postTambahUser = async (req, res) => {
	try {
		const { username, nama, noTelepon, alamat, status, password } = req.body;

		await connection.execute(
			'INSERT INTO user (username, nama, noTelepon, alamat, status, password) VALUES (?, ?, ?, ?, ?, ?)',
			[username, nama, noTelepon, alamat, status, password]
		);

		res.status(200).json({ success: 'ok', message: 'Input User Sukses' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: 'error', message: error.message });
	}
};

export const postEditUser = async (req, res) => {
	try {
		const { username, nama, noTelepon, alamat, status, password } = req.body;

		await connection.execute(
			'UPDATE user SET nama=?, noTelepon=?, alamat=?, status=?, password=? WHERE username=?',
			[nama, noTelepon, alamat, status, password, username]
		);

		res.status(200).json({ success: 'ok', message: 'Ubah User Sukses' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: 'error', message: error.message });
	}
};

export const postHapusUser = async (req, res) => {
	try {
		const { username } = req.body;

		await connection.execute('DELETE FROM user WHERE username=?', [username]);

		res.status(200).json({ success: 'ok', message: 'Hapus User Sukses' });
	} catch (error) {
		res.status(404).json({ success: 'error', message: error.message });
	}
};

export const getUserLog = async (req, res) => {
	try {
		const [rows] = await connection.execute(
			'SELECT * FROM `logActivity` ORDER BY waktu DESC'
		);

		res.status(200).json(rows);
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json({ success: 'error', message: 'Terjadi kesalahan pada server' });
	}
};
