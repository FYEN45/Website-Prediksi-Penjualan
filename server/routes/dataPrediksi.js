import express from 'express';
import { getPrediksiPenjualan } from '../controllers/dataPrediksi.js';
import { authMiddleware } from '../middleware/auth.js';
import { logActivity } from '../middleware/log.js';

const router = express();

router.get(
	'/:kodeProduk',
	authMiddleware('guest'),
	logActivity,
	getPrediksiPenjualan
);

export default router;
