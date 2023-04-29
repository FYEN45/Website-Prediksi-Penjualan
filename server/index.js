'use strict';

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import multer from 'multer';
import XLSX from 'xlsx';
import path from 'path';

import { connection } from './javascripts/mysql.js';
import produkRoutes from './routes/produk.js';
import penjualanRoutes from './routes/dataPenjualan.js';
import prediksiRoutes from './routes/dataPrediksi.js';
import userRoutes from './routes/user.js';

// Server Configuration
dotenv.config();

const port = 3005;
const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(
	helmet.crossOriginResourcePolicy({
		policy: 'cross-origin',
	})
);
app.use(morgan('common'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

const __dirname = path.resolve();

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads');
	},
	filename: function (req, file, cb) {
		const date = new Date().toISOString().replace(/:/g, '-');
		cb(null, date + '-' + file.originalname);
	},
});

const upload = multer({ storage: storage });

// Routes Khusus upload file
app.post(
	'/upload/:kodeProduk',
	upload.single('file'),
	async function (req, res) {
		try {
			const { kodeProduk } = req.params;

			// Baca file yang diunggah
			const workbook = XLSX.readFile(req.file.path);

			// Ambil data dari file Excel atau CSV
			const worksheet = workbook.Sheets[workbook.SheetNames[0]];
			const temp = XLSX.utils.sheet_to_json(worksheet);
			const data = temp.map((item) => {
				const newItem = {};
				for (const key in item) {
					newItem[key.toLowerCase()] = item[key];
				}
				return newItem;
			});

			// Cek apakah file memiliki header yang dibutuhkan
			const requiredHeaders = ['tahun', 'bulan', 'penjualan'];
			const fileHeaders = Object.keys(data[0]).map((header) =>
				header.toLowerCase()
			);
			const extraHeaders = fileHeaders.filter(
				(header) => !requiredHeaders.includes(header)
			);

			if (extraHeaders.length > 0) {
				throw new Error(
					`File memiliki kolom header yang tidak dibutuhkan: ${extraHeaders.join(
						', '
					)}`
				);
			}

			if (!requiredHeaders.every((header) => fileHeaders.includes(header))) {
				throw new Error('File tidak memiliki kolom header yang dibutuhkan.');
			}

			for (let i = 0; i < data.length; i++) {
				const { tahun, bulan, penjualan } = data[i];
				const kodePenjualan = `${kodeProduk}${tahun}${bulan}`;

				// Simpan data penjualan ke dalam tabel 'penjualan'
				await connection.execute(
					`INSERT INTO penjualan (kodePenjualan, kodeProduk, tahun, bulan, penjualan)
          VALUES (?, ?, ?, ?, ?)`,
					[kodePenjualan, kodeProduk, tahun, bulan, penjualan]
				);

				// Perbarui jumlah penjualan total di tabel 'produk'
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
			}

			// Kirim balasan dengan data yang diambil dari file
			res.status(200).json({ message: 'Berhasil upload data penjualan' });
		} catch (error) {
			// Kirim balasan dengan pesan error jika terjadi kesalahan
			res.status(500).json({ message: error.message });
		}
	}
);

// Routes untuk download template
app.get('/download', function (req, res) {
	const filePath = path.join(__dirname, 'public', 'Template Upload.xlsx');
	res.sendFile(filePath, function (err) {
		if (err) {
			console.log(err);
			res.status(err.status).end();
		} else {
			console.log('Sent:', filePath);
		}
	});
});

// Routes
app.use('/produk', produkRoutes);
app.use('/penjualan', penjualanRoutes);
app.use('/prediksi', prediksiRoutes);
app.use('/user', userRoutes);

app.listen(port, () => {
	console.log(`API Server running on port ${port}`);
});
