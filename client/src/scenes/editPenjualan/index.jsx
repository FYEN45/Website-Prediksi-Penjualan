import React, { useEffect, useState } from 'react';
import BasePage from '../../components/BasePage';
import { useNavigate, useParams } from 'react-router';
import { Box, Typography, Button, TextField } from '@mui/material';

const EditPenjualan = () => {
	const token = localStorage.getItem('token');

	const [message, setMessage] = useState('');
	const [success, setSuccess] = useState('');

	const navigate = useNavigate();

	const { kodePenjualan } = useParams();
	const [kodeProduk, setKodeProduk] = useState('');
	const [tahun, setTahun] = useState(0);
	const [bulan, setBulan] = useState(0);
	const [penjualan, setPenjualan] = useState(0);

	const getDataPenjualan = async () => {
		try {
			const response = await fetch(
				`http://localhost:3005/penjualan/data/${kodePenjualan}`,
				{
					method: 'GET',
					headers: { Authorization: token, 'Content-Type': 'application/json' },
				}
			);

			const data = await response.json();

			setKodeProduk(data.kodeProduk);
			setTahun(data.tahun);
			setBulan(data.bulan);
			setPenjualan(data.penjualan);
		} catch (error) {
			setSuccess('error');
			setMessage(error.message);
		}
	};

	const handleEdit = async (e) => {
		e.preventDefault();
		const data = { kodePenjualan, kodeProduk, tahun, bulan, penjualan };

		try {
			const response = await fetch(`http://localhost:3005/penjualan/edit`, {
				method: 'POST',
				headers: { Authorization: token, 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			});

			const { success, message } = await response.json();
			localStorage.setItem('message', message);
			localStorage.setItem('success', success);

			window.location.href = `/produk/penjualan/${kodeProduk}`;
		} catch (error) {
			setSuccess('error');
			setMessage(error.message);
		}
	};

	useEffect(() => {
		getDataPenjualan();
	}, []); //eslint-disable-line react-hooks/exhaustive-deps

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
				<Typography
					variant="span"
					fontSize="2.2rem"
					fontWeight="600"
				>{`Edit Penjualan - ${kodePenjualan}`}</Typography>

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
						id="kodePenjualan"
						label="Kode Transaksi"
						variant="outlined"
						value={kodePenjualan}
					/>
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
						disabled
						margin="dense"
						id="tahun"
						label="Tahun"
						variant="outlined"
						type="number"
						value={tahun}
						onChange={(e) => setTahun(e.target.value)}
					/>
					<TextField
						fullWidth
						required
						disabled
						margin="dense"
						id="bulan"
						label="Bulan"
						variant="outlined"
						type="number"
						value={bulan}
						onChange={(e) => setBulan(e.target.value)}
					/>

					<TextField
						fullWidth
						required
						margin="dense"
						id="penjualan"
						label="Penjualan"
						variant="outlined"
						type="number"
						value={penjualan}
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
							onClick={() => navigate(`/produk/penjualan/${kodeProduk}`)}
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
							onClick={handleEdit}
							sx={{
								marginLeft: '0.2rem',
							}}
						>
							Simpan
						</Button>
					</Box>
				</Box>
			</Box>
		</BasePage>
	);
};

export default EditPenjualan;
