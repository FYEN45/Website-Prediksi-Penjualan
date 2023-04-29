import {
	Box,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
	Button,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import BasePage from '../../components/BasePage';
import FlexBetween from '../../components/FlexBetween';

const DaftarProduk = () => {
	const token = localStorage.getItem('token');
	const status = localStorage.getItem('status');

	const [message, setMessage] = useState();
	const [success, setSuccess] = useState('');

	const [daftarProduk, setDaftarProduk] = useState([]);

	const getDaftarProduk = async () => {
		try {
			const response = await fetch(`http://localhost:3005/produk/daftar`, {
				method: 'GET',
				headers: {
					Authorization: token,
					'Content-Type': 'application/json',
				},
			});

			const data = await response.json();
			setDaftarProduk(data);
		} catch (error) {
			setSuccess('error');
			setMessage(error.message);
		}
	};

	const handleHapus = async (e, kodeProduk) => {
		e.preventDefault();
		const data = { kodeProduk };

		try {
			const response = await fetch('http://localhost:3005/produk/hapus', {
				method: 'POST',
				headers: { Authorization: token, 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			});

			const { success, message } = await response.json();
			setSuccess(success);
			setMessage(message);
			getDaftarProduk();
		} catch (error) {
			setSuccess('error');
			setMessage(error.message);
		}
	};

	useEffect(() => {
		getDaftarProduk();

		const localMessage = localStorage.getItem('message');
		const localSuccess = localStorage.getItem('success');

		if (localMessage) {
			setMessage(localMessage);
			localStorage.removeItem('message');
		}

		if (localSuccess) {
			setSuccess(localSuccess);
			localStorage.removeItem('success');
		}
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

			<Box>
				<FlexBetween>
					<Typography variant="span" fontSize="2.2rem" fontWeight="600">
						Daftar Produk
					</Typography>

					{status === 'admin' ? (
						<Button href="/produk/tambah" variant="contained" color="success">
							Tambah Produk
						</Button>
					) : null}
				</FlexBetween>

				{daftarProduk.length !== 0 ? (
					<TableContainer
						sx={{
							backgroundColor: grey[200],
							padding: '0.6rem',

							marginTop: '1rem',
						}}
					>
						<Table size="medium">
							<TableHead>
								<TableRow>
									<TableCell align="center" sx={{ fontSize: '1.1rem' }}>
										Kode Produk
									</TableCell>
									<TableCell align="center" sx={{ fontSize: '1.1rem' }}>
										Nama Produk
									</TableCell>
									<TableCell align="center" sx={{ fontSize: '1.1rem' }}>
										Jenis Produk
									</TableCell>
									<TableCell align="center" sx={{ fontSize: '1.1rem' }}>
										Total Penjualan
									</TableCell>
									<TableCell align="center" sx={{ fontSize: '1.1rem' }}>
										Menu
									</TableCell>
								</TableRow>
							</TableHead>

							<TableBody>
								{daftarProduk.map(
									({ kodeProduk, namaProduk, jenisProduk, totalPenjualan }) => (
										<TableRow key={kodeProduk} hover={true}>
											<TableCell align="center">{kodeProduk}</TableCell>
											<TableCell align="center">{namaProduk}</TableCell>
											<TableCell align="center">{jenisProduk}</TableCell>
											<TableCell align="center">{totalPenjualan}</TableCell>
											<TableCell align="center">
												<Box
													sx={{
														display: 'flex',
														justifyContent: 'center',
													}}
												>
													<Button
														href={`/produk/prediksi/${kodeProduk}`}
														variant="contained"
														size="small"
														sx={{ marginRight: '0.4rem' }}
													>
														Prediksi
													</Button>
													<Button
														href={`/produk/penjualan/${kodeProduk}`}
														variant="contained"
														size="small"
													>
														Penjualan
													</Button>
												</Box>

												<Box
													sx={{
														marginTop: '0.4rem',
														display: 'flex',
														justifyContent: 'center',
													}}
												>
													{status === 'admin' ? (
														<>
															<Button
																href={`/produk/edit/${kodeProduk}`}
																variant="contained"
																size="small"
																sx={{ marginRight: '0.4rem' }}
															>
																Edit
															</Button>
															<Button
																variant="contained"
																size="small"
																color="error"
																onClick={(e) => handleHapus(e, kodeProduk)}
															>
																Hapus
															</Button>
														</>
													) : null}
												</Box>
											</TableCell>
										</TableRow>
									)
								)}
							</TableBody>
						</Table>
					</TableContainer>
				) : (
					<Box>Data Produk Tidak Ditemukan</Box>
				)}
			</Box>
		</BasePage>
	);
};

export default DaftarProduk;
