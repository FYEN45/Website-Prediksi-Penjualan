import React from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { Box, Typography, Button, TextField } from '@mui/material';
import BasePage from '../../components/BasePage';

const TambahPenjualan = () => {
	const token = localStorage.getItem('token');
	const [message, setMessage] = useState('');

	const { kodeProduk } = useParams();

	const [tahun, setTahun] = useState(2023);
	const [bulan, setBulan] = useState(1);
	const [penjualan, setPenjualan] = useState(0);

	const [tahunError, setTahunError] = useState(false);
	const [bulanError, setBulanError] = useState(false);
	const [penjualanError, setPenjualanError] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (tahun < 2000) {
			setTahunError(true);
		}

		if (bulan < 1 || bulan > 12) {
			setBulanError(true);
		}

		if (penjualan < 0) {
			setPenjualanError(true);
		}

		if (tahun.length === 0 || bulan.length === 0 || penjualan.length === 0) {
			return;
		}

		const kodePenjualan = `${kodeProduk}${tahun}${bulan}`;
		const data = {
			kodePenjualan,
			kodeProduk,
			tahun,
			bulan,
			penjualan,
		};

		try {
			const response = await fetch('http://localhost:3005/penjualan/tambah', {
				method: 'POST',
				headers: { Authorization: token, 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			});

			const { message } = await response.json();
			localStorage.setItem('message', message);
			window.location.href = `/produk/penjualan/${kodeProduk}`;
		} catch (error) {
			setMessage(error.message);
		}
	};

	return (
		<BasePage
			sx={{
				paddingTop: '1rem',
			}}
		>
			{message ? (
				<Box
					sx={{
						width: '100%',
						border: '2px solid #f48fb1',
						borderRadius: '5px',
						paddingX: '0.8rem',
						paddingY: '1rem',
						marginBottom: '1rem',

						bgcolor: '#f8bbd0',
					}}
				>
					<Typography variant="h6" fontWeight="500" color="grey.800">
						{message}
					</Typography>
				</Box>
			) : null}

			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				<Typography variant="span" fontSize="2.2rem" fontWeight="600">
					Tambah Penjualan
				</Typography>

				<Box
					component="form"
					sx={{
						width: '20rem',
					}}
				>
					<TextField
						fullWidth
						disabled
						margin="dense"
						id="kodeProduk"
						label="Kode Produk"
						variant="outlined"
						value={kodeProduk}
					/>

					<TextField
						fullWidth
						required
						margin="dense"
						id="namaProduk"
						type="number"
						value={tahun}
						label="Tahun"
						variant="outlined"
						error={tahunError}
						onChange={(e) => setTahun(e.target.value)}
					/>

					<TextField
						fullWidth
						required
						margin="dense"
						id="jenisProduk"
						type="number"
						value={bulan}
						label="Bulan"
						variant="outlined"
						error={bulanError}
						onChange={(e) => setBulan(e.target.value)}
					/>

					<TextField
						fullWidth
						required
						margin="dense"
						id="penjualan"
						type="number"
						defaultValue={0}
						label="Penjualan"
						variant="outlined"
						error={penjualanError}
						onChange={(e) => setPenjualan(e.target.value)}
					/>

					<Box
						sx={{
							display: 'flex',
							justifyContent: 'center',

							marginTop: '0.4rem',
						}}
					>
						<Button
							variant="contained"
							color="error"
							onClick={() => {
								window.location.href = `/produk/penjualan/${kodeProduk}`;
							}}
							sx={{
								marginRight: '0.2rem',
							}}
						>
							Batal
						</Button>

						<Button
							variant="contained"
							color="success"
							type="submit"
							onClick={handleSubmit}
							sx={{
								marginLeft: '0.2rem',
							}}
						>
							Tambah
						</Button>
					</Box>
				</Box>
			</Box>
		</BasePage>
	);
};

export default TambahPenjualan;
