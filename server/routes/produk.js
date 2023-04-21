import express from 'express';
import {
	getDaftarProduk,
	postTambahProduk,
	postHapusProduk,
	getProduk,
	postEditProduk,
} from '../controllers/produk.js';
import { authMiddleware } from '../middleware/auth.js';
import { logActivity } from '../middleware/log.js';

const router = express();

router.get('/daftar', authMiddleware('guest'), logActivity, getDaftarProduk);

router.get(
	'/data/:kodeProduk',
	authMiddleware('admin'),
	logActivity,
	getProduk
);

router.post('/tambah', authMiddleware('admin'), logActivity, postTambahProduk);
router.post('/edit', authMiddleware('admin'), logActivity, postEditProduk);
router.post('/hapus', authMiddleware('admin'), logActivity, postHapusProduk);

export default router;
