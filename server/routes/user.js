import express from 'express';
import {
	getDaftarUser,
	getDataUser,
	postEditUser,
	postHapusUser,
	postTambahUser,
	postUserLogin,
	getUserLog,
} from '../controllers/user.js';
import { authMiddleware } from '../middleware/auth.js';
import { logActivity } from '../middleware/log.js';

const router = express();

router.post('/login', postUserLogin);

router.get('/daftar', authMiddleware('guest'), logActivity, getDaftarUser);

router.get(
	'/data/:username',
	authMiddleware('admin'),
	logActivity,
	getDataUser
);

router.post('/tambah', authMiddleware('admin'), logActivity, postTambahUser);
router.post('/edit', authMiddleware('admin'), logActivity, postEditUser);
router.post('/hapus', authMiddleware('admin'), logActivity, postHapusUser);

router.get('/log', authMiddleware('admin'), getUserLog);

export default router;
