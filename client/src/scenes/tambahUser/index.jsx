import React, { useState } from 'react';

import { Box, Typography, Button, TextField } from '@mui/material';
import BasePage from '../../components/BasePage';

const TambahUser = () => {
	const token = localStorage.getItem('token');
	const [message, setMessage] = useState('');

	const [username, setUsername] = useState('');
	const [nama, setNama] = useState('');
	const [noTelepon, setNoTelepon] = useState('');
	const [alamat, setAlamat] = useState('');
	const [status, setStatus] = useState('');
	const [password, setPassword] = useState('');

	const [usernameError, setUsernameError] = useState(false);
	const [namaError, setNamaError] = useState(false);
	const [noTeleponError, setNoTeleponError] = useState(false);
	const [alamatError, setAlamatError] = useState(false);
	const [statusError, setStatusError] = useState(false);
	const [passwordError, setPasswordError] = useState(false);

	const handleTambah = async (e) => {
		e.preventDefault();
		setUsernameError(false);
		setNamaError(false);
		setNoTeleponError(false);
		setAlamatError(false);
		setStatusError(false);
		setPasswordError(false);

		// validasi input tidak kosong~

		const data = { username, nama, noTelepon, alamat, status, password };

		try {
			const response = await fetch('http://localhost:3005/user/tambah', {
				method: 'POST',
				headers: { Authorization: token, 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			});

			const { message } = await response.json();
			localStorage.setItem('message', message);
			window.location.href = '/user';
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
					Tambah User
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
						id="Username"
						label="Username"
						variant="outlined"
						error={usernameError}
						onChange={(e) => setUsername(e.target.value)}
					/>

					<TextField
						fullWidth
						required
						margin="dense"
						id="nama"
						label="Nama"
						variant="outlined"
						error={namaError}
						onChange={(e) => setNama(e.target.value)}
					/>

					<TextField
						fullWidth
						required
						margin="dense"
						id="noTelepon"
						label="No. Telepon"
						variant="outlined"
						error={noTeleponError}
						onChange={(e) => setNoTelepon(e.target.value)}
					/>

					<TextField
						fullWidth
						required
						margin="dense"
						id="alamat"
						label="Alamat"
						variant="outlined"
						error={alamatError}
						onChange={(e) => setAlamat(e.target.value)}
					/>

					<TextField
						fullWidth
						required
						margin="dense"
						id="status"
						label="Status"
						variant="outlined"
						error={statusError}
						onChange={(e) => setStatus(e.target.value)}
					/>

					<TextField
						fullWidth
						required
						margin="dense"
						id="password"
						label="Password"
						variant="outlined"
						error={passwordError}
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
							variant="contained"
							color="error"
							onClick={() => (window.location.href = '/user')}
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

export default TambahUser;
