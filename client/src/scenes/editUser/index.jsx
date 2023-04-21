import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import BasePage from '../../components/BasePage';
import { Box, Button, TextField, Typography } from '@mui/material';

const EditUser = () => {
	const token = localStorage.getItem('token');
	const [message, setMessage] = useState('');

	const { username } = useParams();

	const [nama, setNama] = useState('');
	const [noTelepon, setNoTelepon] = useState('');
	const [alamat, setAlamat] = useState('');
	const [status, setStatus] = useState('');
	const [password, setPassword] = useState('');

	const getDataUser = async () => {
		try {
			const response = await fetch(
				`http://localhost:3005/user/data/${username}`,
				{
					method: 'GET',
					headers: {
						Authorization: token,
						'Content-Type': 'application/json',
					},
				}
			);

			const data = await response.json();

			setNama(data.nama);
			setNoTelepon(data.noTelepon);
			setAlamat(data.alamat);
			setStatus(data.status);
			setPassword(data.password);
		} catch (error) {
			setMessage(error.message);
		}
	};

	const handleEdit = async (e) => {
		e.preventDefault();
		const data = { username, nama, noTelepon, alamat, status, password };

		try {
			const response = await fetch(`http://localhost:3005/user/edit`, {
				method: 'POST',
				headers: {
					Authorization: token,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});

			const { message } = await response.json();
			localStorage.setItem('message', message);
			window.location.href = '/user';
		} catch (error) {
			setMessage(error.message);
		}
	};

	useEffect(() => {
		getDataUser();
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
				>{`Edit User - ${username}`}</Typography>

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
						id="Username"
						label="Username"
						variant="outlined"
						value={username}
					/>

					<TextField
						fullWidth
						required
						margin="dense"
						id="nama"
						label="Nama"
						variant="outlined"
						value={nama}
						onChange={(e) => setNama(e.target.value)}
					/>

					<TextField
						fullWidth
						required
						margin="dense"
						id="noTelepon"
						label="No. Telepon"
						variant="outlined"
						value={noTelepon}
						onChange={(e) => setNoTelepon(e.target.value)}
					/>

					<TextField
						fullWidth
						required
						margin="dense"
						id="alamat"
						label="Alamat"
						variant="outlined"
						value={alamat}
						onChange={(e) => setAlamat(e.target.value)}
					/>

					<TextField
						fullWidth
						required
						margin="dense"
						id="status"
						label="Status"
						variant="outlined"
						value={status}
						onChange={(e) => setStatus(e.target.value)}
					/>

					<TextField
						fullWidth
						required
						margin="dense"
						id="password"
						label="Password"
						variant="outlined"
						value={password}
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

export default EditUser;
