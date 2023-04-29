import { connection } from '../javascripts/mysql.js';

export const getDaftarPenjualan = async (req, res) => {
	try {
		const [rows] = await connection.execute('SELECT * FROM penjualan');

		res.status(200).json(rows);
	} catch (error) {
		console.error(error);
		res.status(500).json({ status: 'error', message: error.message });
	}
};

export const getDaftarPenjualanProduk = async (req, res) => {
	try {
		const { kodeProduk } = req.params;

		const [rows] = await connection.execute(
			'SELECT * FROM penjualan WHERE kodeProduk = ? ORDER BY tahun ASC, bulan ASC',
			[kodeProduk]
		);

		res.status(200).json(rows);
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: 'error', message: error.message });
	}
};

export const getDataPenjualanProduk = async (req, res) => {
	try {
		const { kodePenjualan } = req.params;

		const [row] = await connection.execute(
			'SELECT * FROM penjualan WHERE kodePenjualan = ?',
			[kodePenjualan]
		);

		if (row.length === 0) {
			return res
				.status(404)
				.json({ success: 'error', message: 'Data penjualan tidak ditemukan' });
		}

		res.status(200).json(row[0]);
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: 'error', message: error.message });
	}
};

export const postTambahPenjualan = async (req, res) => {
	try {
		const { kodePenjualan, kodeProduk, tahun, bulan, penjualan } = req.body;

		await connection.execute(
			`INSERT INTO penjualan (kodePenjualan, kodeProduk, tahun, bulan, penjualan) 
			VALUES (?, ?, ?, ?, ?)`,
			[kodePenjualan, kodeProduk, tahun, bulan, penjualan]
		);

		const [row] = await connection.execute(
			'SELECT totalPenjualan FROM produk WHERE kodeProduk = ?',
			[kodeProduk]
		);

		const totalPenjualanBaru =
			parseInt(row[0].totalPenjualan) + parseInt(penjualan);

		await connection.execute(
			'UPDATE produk SET totalPenjualan = ? WHERE kodeProduk = ?',
			[totalPenjualanBaru, kodeProduk]
		);

		res.status(200).json({ success: 'ok', message: 'Input Penjualan Sukses' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: 'error', message: error.message });
	}
};

export const postEditPenjualan = async (req, res) => {
	try {
		const { kodePenjualan, kodeProduk, tahun, bulan, penjualan } = req.body;

		if (!kodePenjualan || !kodeProduk || !tahun || !bulan || !penjualan) {
			return res
				.status(400)
				.json({ success: 'error', error: 'Data tidak lengkap' });
		}

		const result = await connection.execute(
			`UPDATE penjualan SET tahun=?, bulan=?, penjualan=? WHERE kodePenjualan=?`,
			[tahun, bulan, penjualan, kodePenjualan]
		);

		if (result.affectedRows === 0) {
			return res
				.status(404)
				.json({ success: 'error', message: 'Transaksi tidak ditemukan' });
		}

		res.status(200).json({ success: 'ok', message: 'Ubah Penjualan Sukses' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: 'error', message: error.message });
	}
};

export const postHapusPenjualan = async (req, res) => {
	try {
		const { kodePenjualan } = req.body;

		const [rowTransaksi] = await connection.execute(
			'SELECT * FROM penjualan WHERE kodePenjualan = ?',
			[kodePenjualan]
		);

		if (rowTransaksi.length === 0) {
			return res
				.status(404)
				.json({ success: 'error', message: 'Data Transaksi tidak ditemukan' });
		}

		const kodeProduk = rowTransaksi[0].kodeProduk;

		const [rowProduk] = await connection.execute(
			'SELECT * FROM produk WHERE kodeProduk = ?',
			[kodeProduk]
		);

		const totalPenjualan =
			parseInt(rowProduk[0].totalPenjualan) -
			parseInt(rowTransaksi[0].penjualan);

		await connection.execute(
			`UPDATE produk SET totalPenjualan=? WHERE kodeProduk=?`,
			[totalPenjualan, kodeProduk]
		);

		await connection.execute('DELETE FROM penjualan WHERE kodePenjualan=?', [
			kodePenjualan,
		]);

		res.status(200).json({ success: 'ok', message: 'Hapus Penjualan Sukses' });
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json({ success: 'error', message: 'Internal server error' });
	}
};
