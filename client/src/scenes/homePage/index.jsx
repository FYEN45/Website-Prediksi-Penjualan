import { Typography, Box, Divider } from '@mui/material';
import React, { useState, useEffect } from 'react';
import BasePage from '../../components/BasePage';

import banner from '../../assets/banner.jpg';

const HomePage = () => {
	const [message, setMessage] = useState('');

	useEffect(() => {
		const localMessage = localStorage.getItem('message');
		if (localMessage) {
			setMessage(localMessage);
			localStorage.removeItem('message');
		}
	}, []); //eslint-disable-line react-hooks/exhaustive-deps

	return (
		<BasePage>
			{message ? (
				<Box
					sx={{
						width: '100%',
						border: '2px solid #f48fb1',
						borderRadius: '5px',
						paddingX: '0.8rem',
						paddingY: '1rem',
						marginY: '1rem',

						bgcolor: '#f8bbd0',
					}}
				>
					<Typography variant="h6" fontWeight="500" color="grey.800">
						{message}
					</Typography>
				</Box>
			) : null}

			<Box sx={{ maxWidth: '1150px', position: 'relative' }}>
				<img src={banner} alt="banner" style={{ width: '100%' }} />

				<Box
					sx={{
						position: 'absolute',
						top: '50%',
						left: '35%',
						transform: 'translate(-50%, -50%)',
						textAlign: 'left',
					}}
				>
					<Typography variant="h4" fontWeight="400" color="grey.700">
						Selamat Datang di
					</Typography>
					<Typography
						variant="h3"
						fontWeight="600"
						color="grey.800"
						sx={{ paddingBottom: '0.5rem', borderBottom: '1px solid grey' }}
					>
						Website Prediksi Penjualan
					</Typography>

					<Typography
						color="grey.700"
						variant="h6"
						sx={{ marginTop: '0.2rem', paddingLeft: '0.5rem' }}
					>
						Sumber Jaya Mandiri
					</Typography>
				</Box>
			</Box>

			<Box
				sx={{
					bgcolor: 'grey.200',
					paddingY: '0.6rem',
					paddingX: '1rem',
					marginBottom: '1rem',
				}}
			>
				<Typography fontWeight="500" fontSize="2rem" textTransform="uppercase">
					Tentang Website Prediksi Penjualan
				</Typography>

				<Divider />

				<Typography textAlign="justify" marginTop="0.4rem">
					Website Prediksi Penjualan merupakan sebuah perangkat lunak berbasis
					website yang dirancang untuk membantu perusahaan dan bisnis dalam
					memprediksi penjualan di masa depan. Perangkat lunak ini didukung oleh
					metode-metode yang telah teruji dan terbukti, yaitu{' '}
					<span style={{ fontStyle: 'italic' }}>Weighted Moving Average</span>{' '}
					dan{' '}
					<span style={{ fontStyle: 'italic' }}>
						Single Exponential Smoothing
					</span>
					, yang mampu memproses data-data penjualan di masa lalu untuk
					memberikan hasil prediksi yang akurat.
				</Typography>

				<Typography textAlign="justify" marginTop="0.6rem">
					Dalam prosesnya, Website Prediksi Penjualan akan mengumpulkan,
					memproses, dan menganalisis data penjualan dari masa lalu untuk
					menghasilkan informasi tentang tren penjualan yang terjadi. Metode{' '}
					<span style={{ fontStyle: 'italic' }}>Weighted Moving Average</span>{' '}
					yang digunakan pada perangkat lunak ini adalah salah satu metode yang
					paling sering digunakan dalam melakukan prediksi penjualan, karena
					metode ini dapat memberikan perhatian lebih kepada data-data terbaru
					sehingga hasil prediksinya lebih akurat.
				</Typography>

				<Typography textAlign="justify" marginTop="0.6rem">
					Selain itu, perangkat lunak ini juga dilengkapi dengan metode{' '}
					<span style={{ fontStyle: 'italic' }}>
						Single Exponential Smoothing
					</span>
					, yang mampu mengatasi masalah tren dan fluktuasi yang terjadi pada
					data penjualan, sehingga hasil prediksinya lebih stabil dan akurat.
					Dengan adanya dua metode ini, Website Prediksi Penjualan dapat
					memberikan hasil prediksi yang lebih baik dan akurat bagi perusahaan
					dan bisnis dalam membuat keputusan strategis di masa depan.
				</Typography>
			</Box>

			<Box
				sx={{
					bgcolor: 'grey.200',
					paddingY: '0.6rem',
					paddingX: '1rem',
					marginBottom: '1rem',
				}}
			>
				<Typography fontWeight="500" fontSize="2rem" textTransform="uppercase">
					Tentang Sumber Jaya Mandiri
				</Typography>

				<Divider />

				<Typography textAlign="justify" marginTop="0.4rem">
					Sumber Jaya Mandiri adalah toko retail yang berlokasi di Tangerang,
					Banten. Sumber Jaya Mandiri menjual perkakas tukang, bahan bangunan,
					dan elektronik rumahan dengan kualitas terjamin dan harga terjangkau.
					Pelanggan bisa memilih berbagai jenis produk seperti gergaji, obeng,
					palu, kabel, stopkontak, rantai, lampu, setrika, kipas angin dan lain
					sebagainya. Dengan berbagai jenis produk yang ditawarkan dan pelayanan
					yang ramah, Sumber Jaya Mandiri adalah pilihan tepat bagi mereka yang
					membutuhkan kebutuhan perkakas tukang, bahan bangunan, dan elektronik
					rumahan.
				</Typography>

				<Divider
					sx={{
						marginTop: '1rem',
					}}
				/>

				<Typography sx={{ marginTop: '0.4rem', opacity: '0.5' }}>
					Dibuat oleh : 32190098 - Ferry Gunawan
				</Typography>
			</Box>
		</BasePage>
	);
};

export default HomePage;
