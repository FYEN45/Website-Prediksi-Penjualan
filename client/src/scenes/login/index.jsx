import React, { useState, useEffect } from 'react';
import BasePage from '../../components/BasePage';
import { Button, TextField, Box, Typography } from '@mui/material';

const Login = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const [message, setMessage] = useState('');
	const [success, setSuccess] = useState('');

	const handleLogin = async (event) => {
		event.preventDefault();

		if (!username || !password) return;

		try {
			const response = await fetch('http://localhost:3005/user/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, password }),
			});

			const data = await response.json();

			if (data.token && data.status) {
				localStorage.setItem('token', data.token);
				localStorage.setItem('success', data.success);
				localStorage.setItem('message', data.message);
				localStorage.setItem('status', data.status);
				window.location.href = '/';
			}

			if (!data.token) {
				// localStorage.setItem('error', data.error);
				setSuccess(data.success);
				setMessage(data.message);
				// window.location.href = '/login';
			}
		} catch (error) {
			setSuccess('error');
			setMessage(error.message);
		}
	};

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (token) window.location.href = '/';
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
					flexDirection: 'row',
					justifyContent: 'space-between',
					gap: '1rem',
				}}
			>
				<Box
					component="form"
					sx={{
						minWidth: '24rem',

						paddingY: '1rem',
						paddingX: '2rem',
						backgroundColor: 'grey.200',
					}}
				>
					<Typography variant="span" fontSize="2.2rem" fontWeight="600">
						Login
					</Typography>

					<TextField
						fullWidth
						required
						margin="dense"
						id="username"
						label="Username"
						variant="outlined"
						onChange={(e) => setUsername(e.target.value)}
					/>

					<TextField
						fullWidth
						required
						margin="dense"
						id="password"
						label="Password"
						variant="outlined"
						type="password"
						onChange={(e) => setPassword(e.target.value)}
					/>

					<Box
						sx={{
							display: 'flex',
							justifyContent: 'center',

							marginTop: '0.4rem',
						}}
					>
						<Button
							href="#"
							variant="contained"
							color="success"
							type="submit"
							onClick={handleLogin}
							sx={{
								marginLeft: '0.2rem',
							}}
						>
							Login
						</Button>
					</Box>
				</Box>

				<Box
					sx={{
						backgroundColor: 'grey.200',
						paddingY: '1rem',
						paddingX: '2rem',
					}}
				>
					<Typography variant="span" fontSize="2.2rem" fontWeight="600">
						Halaman Login
					</Typography>
					<Typography fontSize="1.1rem">
						Halaman Login merupakan sebuah halaman dalam website prediksi
						penjualan. Halaman ini berfungsi untuk mengirim data dari pengguna
						berupa <span style={{ fontStyle: 'italic' }}>Username</span> dan{' '}
						<span style={{ fontStyle: 'italic' }}>Password</span> ke sisi server
						untuk melakukan validasi dan otoritasi pengguna.
					</Typography>
				</Box>
			</Box>
		</BasePage>
	);
};

export default Login;
