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
import DeleteConfirmation from '../../components/DeleteConfirmation';

const DaftarUser = () => {
	const token = localStorage.getItem('token');

	const [message, setMessage] = useState('');
	const [success, setSuccess] = useState('');

	const [daftarUser, setDaftarUser] = useState([]);

	const getDaftarUser = async () => {
		try {
			const response = await fetch(`http://localhost:3005/user/daftar`, {
				method: 'GET',
				headers: {
					Authorization: token,
					'Content-Type': 'application/json',
				},
			});

			const data = await response.json();
			setDaftarUser(data);
		} catch (error) {
			setSuccess('error');
			setMessage(error.message);
		}
	};

	const handleHapus = async (username) => {
		// e.preventDefault();
		const data = { username };

		try {
			const response = await fetch('http://localhost:3005/user/hapus', {
				method: 'POST',
				headers: { Authorization: token, 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			});

			const { success, message } = await response.json();
			setSuccess(success);
			setMessage(message);
			getDaftarUser();
		} catch (error) {
			setSuccess('error');
			setMessage(error.message);
		}
	};

	useEffect(() => {
		getDaftarUser();

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
						Daftar User
					</Typography>

					<Box>
						<Button href="/user/log" variant="contained" color="info">
							Log
						</Button>

						<Button
							href="/user/tambah"
							variant="contained"
							color="success"
							sx={{ marginLeft: '0.5rem' }}
						>
							Tambah User
						</Button>
					</Box>
				</FlexBetween>

				{daftarUser.length !== 0 ? (
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
										Username
									</TableCell>
									<TableCell align="center" sx={{ fontSize: '1.1rem' }}>
										Nama
									</TableCell>
									<TableCell align="center" sx={{ fontSize: '1.1rem' }}>
										No. Telepon
									</TableCell>
									<TableCell align="center" sx={{ fontSize: '1.1rem' }}>
										Alamat
									</TableCell>
									<TableCell align="center" sx={{ fontSize: '1.1rem' }}>
										Status
									</TableCell>
									<TableCell align="center" sx={{ fontSize: '1.1rem' }}>
										Menu
									</TableCell>
								</TableRow>
							</TableHead>

							<TableBody>
								{daftarUser.map(
									({ username, nama, noTelepon, alamat, status }) => (
										<TableRow key={username} hover={true}>
											<TableCell align="center">{username}</TableCell>
											<TableCell align="center">{nama}</TableCell>
											<TableCell align="center">{noTelepon}</TableCell>
											<TableCell
												align="center"
												sx={{
													maxWidth: '15rem',
													whiteSpace: 'nowrap',
													overflow: 'hidden',
													textOverflow: 'ellipsis',
												}}
											>
												{alamat}
											</TableCell>
											<TableCell align="center">{status}</TableCell>
											<TableCell align="center">
												<Box
													sx={{
														display: 'flex',
														justifyContent: 'center',
													}}
												>
													<Button
														href={`/user/edit/${username}`}
														variant="contained"
														size="small"
														sx={{ marginRight: '0.4rem' }}
													>
														Edit
													</Button>

													{/* <Button
													variant="contained"
													size="small"
													color="error"
													onClick={(e) => handleHapus(e, username)}
												>
													Hapus
												</Button> */}

													<DeleteConfirmation
														nama={`User ${username}`}
														onDelete={() => handleHapus(username)}
													/>
												</Box>
											</TableCell>
										</TableRow>
									)
								)}
							</TableBody>
						</Table>
					</TableContainer>
				) : (
					<Box>Data User Tidak Ditemukan</Box>
				)}
			</Box>
		</BasePage>
	);
};

export default DaftarUser;
