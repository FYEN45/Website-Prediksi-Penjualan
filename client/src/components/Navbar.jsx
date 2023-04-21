import React from 'react';
import { Box, Typography, Link, Button } from '@mui/material';
import FlexBetween from './FlexBetween';
import BasePage from './BasePage';

import logo from '../assets/logo.png';

const Navbar = (props) => {
	const status = localStorage.getItem('status');

	const handleLogout = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('status');
		localStorage.removeItem('message');

		window.location.href = '/';
	};

	return (
		<Box sx={{ bgcolor: 'primary.light', minWidth: '800px' }}>
			<BasePage>
				<FlexBetween
					sx={{
						width: '100%',
						height: '5rem',
						py: '0.5rem',
					}}
				>
					<FlexBetween>
						<img
							src={logo}
							alt="Logo"
							style={{
								height: '60px',
								marginRight: '1rem',
							}}
						/>

						<Box>
							<Typography color="grey.100" fontSize="1.25rem" fontWeight="500">
								Sumber Jaya Mandiri
							</Typography>
							<Typography color="grey.100">Prediksi Penjualan</Typography>
						</Box>
					</FlexBetween>

					<FlexBetween sx={{ gap: '1rem' }}>
						<Link href="/" color="grey.100" underline="hover">
							Home
						</Link>

						{props.isLoggedIn ? (
							<>
								<Link href="/produk" color="grey.100" underline="hover">
									Daftar Produk
								</Link>

								{status === 'admin' ? (
									<Link href="/user" color="grey.100" underline="hover">
										Daftar User
									</Link>
								) : null}

								<Button
									variant="contained"
									color="error"
									onClick={handleLogout}
								>
									Logout
								</Button>
							</>
						) : (
							<Button
								variant="contained"
								color="warning"
								onClick={() => {
									window.location.href = '/login';
								}}
							>
								Login
							</Button>
						)}
					</FlexBetween>
				</FlexBetween>
			</BasePage>
		</Box>
	);
};

export default Navbar;
