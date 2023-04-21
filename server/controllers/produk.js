import { connection } from '../javascripts/mysql.js';

export const getProduk = async (req, res) => {
	try {
		const { kodeProduk } = req.params;

		const [rows] = await connection.execute(
			'SELECT * FROM produk WHERE kodeProduk = ?',
			[kodeProduk]
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

export const getDaftarProduk = async (req, res) => {
	try {
		const [rows] = await connection.execute('SELECT * FROM `produk`');

		res.status(200).json(rows);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Terjadi kesalahan pada server' });
	}
};

export const postTambahProduk = async (req, res) => {
	try {
		const { kodeProduk, namaProduk, jenisProduk, totalPenjualan } = req.body;

		await connection.execute(
			'INSERT INTO produk (kodeProduk, namaProduk, jenisProduk, totalPenjualan) VALUES (?, ?, ?, ?)',
			[kodeProduk, namaProduk, jenisProduk, totalPenjualan]
		);

		res.status(200).json({ message: 'Input Produk Sukses' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: error.message });
	}
};

export const postEditProduk = async (req, res) => {
	try {
		const { kodeProduk, namaProduk, jenisProduk, totalPenjualan } = req.body;

		if (!kodeProduk || !namaProduk || !jenisProduk || !totalPenjualan) {
			return res.status(400).json({ message: 'Data tidak lengkap' });
		}

		await connection.execute(
			'UPDATE produk SET namaProduk=?, jenisProduk=?, totalPenjualan=? WHERE kodeProduk=?',
			[namaProduk, jenisProduk, totalPenjualan, kodeProduk]
		);

		res.status(200).json({ message: 'Ubah Produk Sukses' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: error.message });
	}
};

export const postHapusProduk = async (req, res) => {
	try {
		const { kodeProduk } = req.body;

		await connection.execute('DELETE FROM produk WHERE kodeProduk=?', [
			kodeProduk,
		]);

		res.status(200).json({ message: 'Hapus Produk Sukses' });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};
