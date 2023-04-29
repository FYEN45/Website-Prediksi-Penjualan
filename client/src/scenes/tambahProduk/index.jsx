import React from 'react';
import { useState } from 'react';

import { Box, Typography, Button, TextField } from '@mui/material';
import BasePage from '../../components/BasePage';

const TambahProduk = () => {
	const token = localStorage.getItem('token');

	const [message, setMessage] = useState('');
	const [success, setSuccess] = useState('');

	const [kodeProduk, setKodeProduk] = useState('');
	const [namaProduk, setNamaProduk] = useState('');
	const [jenisProduk, setJenisProduk] = useState('');
	const [totalPenjualan, setTotalPenjualan] = useState(0);

	const [kodeProdukError, setKodeProdukError] = useState(false);
	const [namaProdukError, setNamaProdukError] = useState(false);
	const [jenisProdukError, setJenisProdukError] = useState(false);

	const handleTambah = async (e) => {
		e.preventDefault();
		setKodeProdukError(false);
		setNamaProdukError(false);
		setJenisProdukError(false);

		if (kodeProduk.length === 0) {
			setKodeProdukError(true);
		}

		if (namaProduk.length === 0) {
			setNamaProdukError(true);
		}

		if (jenisProduk.length === 0) {
			setJenisProdukError(true);
		}

		if (
			kodeProduk.length === 0 ||
			namaProduk.length === 0 ||
			jenisProduk.length === 0
		) {
			return;
		}

		const data = { kodeProduk, namaProduk, jenisProduk, totalPenjualan };

		try {
			const response = await fetch('http://localhost:3005/produk/tambah', {
				method: 'POST',
				headers: { Authorization: token, 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			});

			const { success, message } = await response.json();
			localStorage.setItem('success', success);
			localStorage.setItem('message', message);

			window.location.href = '/produk';
		} catch (error) {
			setSuccess('error');
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
						border: `2px solid ${success === 'ok' ? '#a5d6a7' : '#f48fb1'}`,
						borderRadius: '5px',
						paddingX: '0.8rem',
						paddingY: '1rem',
						marginBottom: '1rem',

						bgcolor: `${success === 'ok' ? '#c8e6c9' : '#f8bbd0'}`,
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
					Tambah Produk
				</Typography>

				<Box
					component="form"
					sx={{
						width: '20rem',
					}}
				>
					<TextField
						fullWidth
						required
						margin="dense"
						id="kodeProduk"
						label="Kode Produk"
						variant="outlined"
						error={kodeProdukError}
						onChange={(e) => setKodeProduk(e.target.value)}
					/>

					<TextField
						fullWidth
						required
						margin="dense"
						id="namaProduk"
						label="Nama Produk"
						variant="outlined"
						error={namaProdukError}
						onChange={(e) => setNamaProduk(e.target.value)}
					/>

					<TextField
						fullWidth
						required
						margin="dense"
						id="jenisProduk"
						label="Jenis Produk"
						variant="outlined"
						error={jenisProdukError}
						onChange={(e) => setJenisProduk(e.target.value)}
					/>

					<TextField
						fullWidth
						disabled
						margin="dense"
						id="penjualan"
						defaultValue={0}
						label="Total Penjualan"
						variant="outlined"
						onChange={(e) => setTotalPenjualan(e.target.value)}
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
							onClick={() => (window.location.href = '/produk')}
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
							onClick={handleTambah}
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

export default TambahProduk;
