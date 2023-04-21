import express from 'express';
import {
	getDaftarPenjualan,
	getDaftarPenjualanProduk,
	getDataPenjualanProduk,
	postHapusPenjualan,
	postTambahPenjualan,
	postEditPenjualan,
} from '../controllers/dataPenjualan.js';
import { authMiddleware } from '../middleware/auth.js';
import { logActivity } from '../middleware/log.js';

const router = express();

// router.get('/daftar', authMiddleware('guest'), getDaftarPenjualan);

router.get(
	'/daftar/:kodeProduk',
	authMiddleware('guest'),
	logActivity,
	getDaftarPenjualanProduk
);

router.get(
	`/data/:kodePenjualan`,
	authMiddleware('admin'),
	logActivity,
	getDataPenjualanProduk
);

router.post(
	'/tambah',
	authMiddleware('admin'),
	logActivity,
	postTambahPenjualan
);

router.post('/edit', authMiddleware('admin'), logActivity, postEditPenjualan);

router.post('/hapus', authMiddleware('admin'), logActivity, postHapusPenjualan);

export default router;
