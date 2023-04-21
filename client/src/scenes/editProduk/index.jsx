import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import BasePage from '../../components/BasePage';
import { Box, Button, TextField, Typography } from '@mui/material';

const EditProduk = () => {
	const token = localStorage.getItem('token');
	const [message, setMessage] = useState('');

	const { kodeProduk } = useParams();
	const [namaProduk, setNamaProduk] = useState('');
	const [jenisProduk, setJenisProduk] = useState('');
	const [totalPenjualan, setTotalPenjualan] = useState(0);

	const getDataProduk = async () => {
		try {
			const response = await fetch(
				`http://localhost:3005/produk/data/${kodeProduk}`,
				{
					method: 'GET',
					headers: {
						Authorization: token,
						'Content-Type': 'application/json',
					},
				}
			);

			const data = await response.json();

			setNamaProduk(data.namaProduk);
			setJenisProduk(data.jenisProduk);
			setTotalPenjualan(data.totalPenjualan);
		} catch (error) {
			setMessage(error.message);
		}
	};

	const handleEdit = async (e) => {
		e.preventDefault();
		const data = { kodeProduk, namaProduk, jenisProduk, totalPenjualan };

		try {
			const response = await fetch(`http://localhost:3005/produk/edit`, {
				method: 'POST',
				headers: {
					Authorization: token,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});

			const { message } = await response.json();
			localStorage.setItem('message', message);
			window.location.href = '/produk';
		} catch (error) {
			setMessage(error.message);
		}
	};

	useEffect(() => {
		getDataProduk();
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
				<Typography
					variant="span"
					fontSize="2.2rem"
					fontWeight="600"
				>{`Edit Produk - ${kodeProduk}`}</Typography>

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
						label="Nama Produk"
						variant="outlined"
						value={namaProduk}
						onChange={(e) => setNamaProduk(e.target.value)}
					/>
					<TextField
						fullWidth
						required
						margin="dense"
						id="jenisProduk"
						label="Jenis Produk"
						variant="outlined"
						value={jenisProduk}
						onChange={(e) => setJenisProduk(e.target.value)}
					/>

					<TextField
						fullWidth
						required
						margin="dense"
						id="penjualan"
						label="Total Penjualan"
						variant="outlined"
						value={totalPenjualan}
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

export default EditProduk;
