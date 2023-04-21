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

			res.status(200).json({ message: 'Berhasil Login', token, status });
		} else {
			res.status(400).json({ message: 'Username / Password salah' });
		}
	} else {
		res.status(400).json({ message: 'Username tidak ditemukan' });
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
			return res.status(404).json({ message: 'Produk tidak ditemukan' });
		}

		res.status(200).json(rows[0]);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Terjadi kesalahan pada server' });
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
		res.status(500).json({ message: 'Terjadi kesalahan pada server' });
	}
};

export const postTambahUser = async (req, res) => {
	try {
		const { username, nama, noTelepon, alamat, status, password } = req.body;

		await connection.execute(
			'INSERT INTO user (username, nama, noTelepon, alamat, status, password) VALUES (?, ?, ?, ?, ?, ?)',
			[username, nama, noTelepon, alamat, status, password]
		);

		res.status(200).json({ message: 'Input User Sukses' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: error.message });
	}
};

export const postEditUser = async (req, res) => {
	try {
		const { username, nama, noTelepon, alamat, status, password } = req.body;

		await connection.execute(
			'UPDATE user SET nama=?, noTelepon=?, alamat=?, status=?, password=? WHERE username=?',
			[nama, noTelepon, alamat, status, password, username]
		);

		res.status(200).json({ message: 'Ubah User Sukses' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: error.message });
	}
};

export const postHapusUser = async (req, res) => {
	try {
		const { username } = req.body;

		await connection.execute('DELETE FROM user WHERE username=?', [username]);

		res.status(200).json({ message: 'Hapus User Sukses' });
	} catch (error) {
		res.status(404).json({ message: error.message });
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
		res.status(500).json({ message: 'Terjadi kesalahan pada server' });
	}
};
