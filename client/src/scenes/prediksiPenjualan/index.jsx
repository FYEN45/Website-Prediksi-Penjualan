import {
	Box,
	Typography,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Button,
	Divider,
	Grid,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import BasePage from '../../components/BasePage';
import FlexBetween from '../../components/FlexBetween';

const PrediksiPenjualan = () => {
	const token = localStorage.getItem('token');
	const [message, setMessage] = useState('');

	const { kodeProduk } = useParams();
	const [prediksi, setPrediksi] = useState();

	const getPrediksiPenjualan = async () => {
		try {
			const response = await fetch(
				`http://localhost:3005/prediksi/${kodeProduk}`,
				{
					method: 'GET',
					headers: { Authorization: token, 'Content-Type': 'application/json' },
				}
			);

			const data = await response.json();
			setPrediksi(data);
		} catch (error) {
			setMessage(error.message);
		}
	};

	useEffect(() => {
		getPrediksiPenjualan();
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

			<Box>
				<FlexBetween>
					<Typography
						variant="span"
						fontSize="2.2rem"
						fontWeight="600"
					>{`Prediksi Penjualan - ${kodeProduk}`}</Typography>

					<Button href={`/produk`} variant="contained">
						Kembali
					</Button>
				</FlexBetween>

				{prediksi != null ? (
					<>
						<Grid
							container
							sx={{
								marginTop: '0.5rem',
							}}
						>
							<Grid
								item
								xs={4}
								sx={{
									paddingY: '0.3rem',
									paddingX: '0.5rem',
									backgroundColor: grey[200],
								}}
							>
								<Typography sx={{ textAlign: 'center', fontSize: '1.2rem' }}>
									(SES) Bobot Alpha :{' '}
									<Typography variant="span" sx={{ fontWeight: '700' }}>
										{prediksi.bobotAlpha}
									</Typography>
								</Typography>
							</Grid>
							<Grid
								item
								xs={4}
								sx={{
									paddingY: '0.3rem',
									paddingX: '0.5rem',
									backgroundColor: grey[200],
								}}
							>
								<Typography sx={{ textAlign: 'center', fontSize: '1.2rem' }}>
									(LC) Bobot SES :{' '}
									<Typography variant="span" sx={{ fontWeight: '700' }}>
										{prediksi.bobotSes}
									</Typography>
								</Typography>
							</Grid>
							<Grid
								item
								xs={4}
								sx={{
									paddingY: '0.3rem',
									paddingX: '0.5rem',
									backgroundColor: grey[200],
								}}
							>
								<Typography sx={{ textAlign: 'center', fontSize: '1.2rem' }}>
									(LC) Bobot WMA :{' '}
									<Typography variant="span" sx={{ fontWeight: '700' }}>
										{prediksi.bobotWma}
									</Typography>
								</Typography>
							</Grid>
						</Grid>

						<TableContainer
							sx={{
								maxHeight: '75vh',
								backgroundColor: grey[200],
								padding: '0.6rem',

								marginY: '0.5rem',
							}}
						>
							<Table size="medium" stickyHeader>
								<TableHead>
									<TableRow>
										<TableCell align="center" sx={{ fontSize: '1.1rem' }}>
											Tahun
										</TableCell>
										<TableCell align="center" sx={{ fontSize: '1.1rem' }}>
											Bulan
										</TableCell>
										<TableCell align="center" sx={{ fontSize: '1.1rem' }}>
											Aktual
										</TableCell>
										<TableCell align="center" sx={{ fontSize: '1.1rem' }}>
											WMA
										</TableCell>
										<TableCell align="center" sx={{ fontSize: '1.1rem' }}>
											SES
										</TableCell>
										<TableCell align="center" sx={{ fontSize: '1.1rem' }}>
											LC
										</TableCell>
										<TableCell align="center" sx={{ fontSize: '1.1rem' }}>
											MAPE
										</TableCell>
									</TableRow>
								</TableHead>

								<TableBody>
									{prediksi.bulanPrediksi.map((bulan, index) => (
										<TableRow
											key={`${prediksi.tahunPrediksi[index]}${bulan}`}
											hover={true}
										>
											<TableCell align="center">
												{prediksi.tahunPrediksi[index]}
											</TableCell>
											<TableCell align="center">{bulan}</TableCell>
											<TableCell align="center">
												{prediksi.penjualanAktual[index]}
											</TableCell>
											<TableCell align="center">
												{prediksi.wmaPrediksi[index].toFixed(2)}
											</TableCell>
											<TableCell align="center">
												{prediksi.sesPrediksi[index].toFixed(2)}
											</TableCell>
											<TableCell align="center">
												{prediksi.lcPrediksi[index].toFixed(2)}
											</TableCell>
											<TableCell align="center">
												{prediksi.mapePrediksi[index] !== undefined
													? prediksi.mapePrediksi[index].toFixed(2)
													: null}
											</TableCell>
										</TableRow>
									))}

									<TableRow>
										<TableCell colSpan={2} align="center">
											<Typography fontWeight={500} fontSize="1.1rem">
												Rata - rata
											</Typography>
										</TableCell>
										<TableCell align="center">
											<Typography fontWeight={500} fontSize="1.1rem">
												{prediksi.rataRata.penjualanAktual
													? prediksi.rataRata.penjualanAktual.toFixed(2)
													: '0'}
											</Typography>
										</TableCell>
										<TableCell align="center">
											<Typography fontWeight={500} fontSize="1.1rem">
												{prediksi.rataRata.wmaPrediksi
													? prediksi.rataRata.wmaPrediksi.toFixed(2)
													: '0'}
											</Typography>
										</TableCell>
										<TableCell align="center">
											<Typography fontWeight={500} fontSize="1.1rem">
												{prediksi.rataRata.sesPrediksi
													? prediksi.rataRata.sesPrediksi.toFixed(2)
													: '0'}
											</Typography>
										</TableCell>
										<TableCell align="center">
											<Typography fontWeight={500} fontSize="1.1rem">
												{prediksi.rataRata.lcPrediksi
													? prediksi.rataRata.lcPrediksi.toFixed(2)
													: '0'}
											</Typography>
										</TableCell>
										<TableCell align="center">
											<Typography fontWeight={500} fontSize="1.1rem">
												{prediksi.rataRata.mapePrediksi
													? prediksi.rataRata.mapePrediksi.toFixed(2)
													: '0'}
											</Typography>
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</TableContainer>
						<Box
							sx={{
								bgcolor: 'grey.200',
								paddingY: '0.6rem',
								paddingX: '1rem',
								marginBottom: '1rem',
							}}
						>
							<Typography
								fontWeight="500"
								fontSize="2rem"
								textTransform="uppercase"
							>
								Penjelasan Metode
							</Typography>

							<Divider />

							<Typography textAlign="justify" marginTop="0.4rem">
								<span style={{ fontWeight: '500' }}>
									- Weighted Moving Average (WMA)
								</span>{' '}
								merupakan model prediksi yang dirancang untuk memberikan bobot
								lebih berat kepada data terbaru daripada data pada waktu lampau.
								Metode ini menggunakan 3 data pada waktu lampau untuk
								memprediksi penjualan.
							</Typography>

							<Typography textAlign="justify" marginTop="1rem">
								<span style={{ fontWeight: '500' }}>
									- Single Exponential Smoothing (SES)
								</span>{' '}
								merupakan metode prediksi yang bekerja dengan pemulusan
								terus-menerus terhadap objek yang diamati. Dalam metode ini
								terdapat nilai Faktor Smoothing yang dapat mempengaruhi hasil
								akhir dari prediksi. Semakin besar nilai Faktor Smoothing maka
								prediksi akan menitik beratkan pada bobot Data Aktual sehingga
								data prediksi lebih responsif terhadap perubahan data, sedangkan
								semakin kecil nilai faktor smoothing maka prediksi akan menitik
								beratkan pada bobot Data Historis sehingga peramalan lebih
								stabil dan tidak terlalu dipengaruhi oleh perubahan data.
							</Typography>

							<Typography textAlign="justify" marginTop="1rem">
								<span style={{ fontWeight: '500' }}>
									- Linear Combination (LC)
								</span>{' '}
								merupakan suatu teknik matematika yang digunakan untuk mencari
								solusi sistem persamaan linear. Metode ini melibatkan
								penggabungan atau penjumlahan beberapa persamaan linear dengan
								bobot tertentu untuk mendapatkan solusi yang konsisten dan
								memenuhi semua persamaan yang diberikan.
							</Typography>

							<Typography textAlign="justify" marginTop="1rem">
								<span style={{ fontWeight: '500' }}>
									- Mean Absolute Percentage Error (MAPE)
								</span>{' '}
								merupakan metode perhitungan yang digunakan untuk menghitung
								kesalahan prediksi. Metode ini menghitung rata-rata perbedaan
								absolut antara nilai prediksi dengan nilai aktual, yang
								dinyatakan dalam nilai persentase
							</Typography>

							<Divider sx={{ marginTop: '0.4rem' }} />

							<Typography textAlign="justify" marginTop="1rem">
								<span style={{ fontWeight: '500' }}>*Catatan :</span> Rata-rata
								pada metode WMA, SES, dan MAPE mengabaikan 3 data penjualan
								diawal, dan hasil prediksi. Sedangkan rata-rata pada nilai
								Aktual menggunakan semua nilai aktual yang tersedia.
							</Typography>
						</Box>
					</>
				) : (
					<>Daftar Prediksi Kosong</>
				)}
			</Box>
		</BasePage>
	);
};

export default PrediksiPenjualan;
