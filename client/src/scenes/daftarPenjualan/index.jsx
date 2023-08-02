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
	TextField,
	Divider,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import BasePage from '../../components/BasePage';
import FlexBetween from '../../components/FlexBetween';
import DeleteConfirmation from '../../components/DeleteConfirmation';

const DaftarPenjualan = () => {
	const token = localStorage.getItem('token');
	const status = localStorage.getItem('status');

	const [message, setMessage] = useState('');
	const [success, setSuccess] = useState('');

	const { kodeProduk } = useParams();
	const [file, setFile] = useState(null);
	const [daftarPenjualan, setDaftarPenjualan] = useState([]);

	const getDaftarPenjualan = async () => {
		try {
			const response = await fetch(
				`http://localhost:3005/penjualan/daftar/${kodeProduk}`,
				{
					method: 'GET',
					headers: {
						Authorization: token,
						'Content-Type': 'application/json',
					},
				}
			);

			const data = await response.json();
			setDaftarPenjualan(data);
		} catch (error) {
			setSuccess('error');
			setMessage(error.message);
		}
	};

	const handleHapus = async (kodePenjualan) => {
		// e.preventDefault();
		const data = { kodePenjualan };

		try {
			const response = await fetch('http://localhost:3005/penjualan/hapus', {
				method: 'POST',
				headers: { Authorization: token, 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			});

			const { success, message } = await response.json();
			setSuccess(success);
			setMessage(message);
			getDaftarPenjualan();
		} catch (error) {
			setSuccess('error');
			setMessage(error.message);
		}
	};

	const handleFileChange = (event) => {
		setFile(event.target.files[0]);
	};

	const handleUploadFile = async (event) => {
		event.preventDefault();

		if (file) {
			const formData = new FormData();
			formData.append('file', file);

			try {
				const response = await fetch(
					`http://localhost:3005/upload/${kodeProduk}`,
					{
						method: 'POST',
						headers: { Authorization: token },
						body: formData,
					}
				);

				if (!response.ok) {
					const { message } = await response.json();
					throw new Error(message);
				}

				getDaftarPenjualan();
			} catch (error) {
				setSuccess('error');
				setMessage(error.message);
			}
		}
	};

	const handleDownloadFile = async (event) => {
		event.preventDefault();

		try {
			const response = await fetch('http://localhost:3005/download');
			const blob = await response.blob();
			const urlBlob = URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = urlBlob;
			link.download = 'Template Upload.xlsx'; // ganti nama file sesuai kebutuhan
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} catch (error) {
			setSuccess('error');
			setMessage(error.message);
		}
	};

	useEffect(() => {
		getDaftarPenjualan();

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
			<Box>
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

				<FlexBetween>
					<Typography variant="span" fontSize="2.2rem" fontWeight="600">
						{`Daftar Penjualan - ${kodeProduk}`}
					</Typography>

					<Box>
						{status === 'admin' ? (
							<Button
								href={`/produk/penjualan/tambah/${kodeProduk}`}
								variant="contained"
								color="success"
								sx={{
									marginLeft: '0.4rem',
								}}
							>
								Tambah Penjualan
							</Button>
						) : null}

						<Button
							href={`/produk`}
							variant="contained"
							sx={{ marginLeft: '0.4rem' }}
						>
							Kembali
						</Button>
					</Box>
				</FlexBetween>

				{daftarPenjualan.length !== 0 ? (
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
										Kode Transaksi
									</TableCell>
									<TableCell align="center" sx={{ fontSize: '1.1rem' }}>
										Kode Produk
									</TableCell>
									<TableCell align="center" sx={{ fontSize: '1.1rem' }}>
										Tahun
									</TableCell>
									<TableCell align="center" sx={{ fontSize: '1.1rem' }}>
										Bulan
									</TableCell>
									<TableCell align="center" sx={{ fontSize: '1.1rem' }}>
										Penjualan
									</TableCell>
									{status === 'admin' ? (
										<TableCell align="center" sx={{ fontSize: '1.1rem' }}>
											Menu
										</TableCell>
									) : null}
								</TableRow>
							</TableHead>

							<TableBody>
								{daftarPenjualan.map(
									({ kodePenjualan, kodeProduk, tahun, bulan, penjualan }) => (
										<TableRow key={kodePenjualan} hover={true}>
											<TableCell align="center">{kodePenjualan}</TableCell>
											<TableCell align="center">{kodeProduk}</TableCell>
											<TableCell align="center">{tahun}</TableCell>
											<TableCell align="center">{bulan}</TableCell>
											<TableCell align="center">{penjualan}</TableCell>

											{status === 'admin' ? (
												<TableCell align="center">
													<Box
														sx={{
															display: 'flex',
															justifyContent: 'center',
														}}
													>
														<Button
															href={`/produk/penjualan/edit/${kodePenjualan}`}
															variant="contained"
															size="small"
															sx={{ marginRight: '0.4rem' }}
														>
															Edit
														</Button>

														{/* <Button
														variant="contained"
														onClick={(e) => handleHapus(e, kodePenjualan)}
													>
														Hapus
													</Button> */}

														<DeleteConfirmation
															nama={`Penjualan Tahun ${tahun} Bulan ${bulan}`}
															onDelete={() => handleHapus(kodePenjualan)}
														/>
													</Box>
												</TableCell>
											) : null}
										</TableRow>
									)
								)}
							</TableBody>
						</Table>
					</TableContainer>
				) : (
					<Box>Data Penjualan Tidak Ditemukan</Box>
				)}

				{status === 'admin' ? (
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'center',
							marginTop: '1rem',
						}}
					>
						<form
							onSubmit={handleUploadFile}
							style={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
								gap: '1rem',
							}}
						>
							<TextField
								type="file"
								accept=".xlsx, .xls, .csv"
								variant="outlined"
								margin="dense"
								label="Upload File"
								onChange={handleFileChange}
								InputLabelProps={{
									shrink: true,
								}}
							/>
							<Button type="submit" variant="contained" color="primary">
								Upload
							</Button>

							<Button
								onClick={handleDownloadFile}
								variant="contained"
								color="success"
							>
								Download Template
							</Button>
						</form>
					</Box>
				) : null}

				{status === 'admin' ? (
					<Box
						sx={{
							bgcolor: 'grey.200',
							paddingY: '0.6rem',
							paddingX: '1rem',
							marginY: '1rem',
						}}
					>
						<Typography
							fontWeight="500"
							fontSize="2rem"
							textTransform="uppercase"
						>
							Catatan
						</Typography>

						<Divider />

						<Typography textAlign="justify" marginTop="0.4rem">
							- Apabila pada periode tertentu tidak memiliki penjualan, mohon
							untuk melakukan tambah penjualan dengan jumlah 0 pada periode
							tersebut.
						</Typography>
					</Box>
				) : null}
			</Box>
		</BasePage>
	);
};

export default DaftarPenjualan;
