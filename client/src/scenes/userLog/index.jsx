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

const UserLog = () => {
	const token = localStorage.getItem('token');

	const [logUser, setLogUser] = useState([]);

	const getUserLog = async () => {
		try {
			const response = await fetch(`http://localhost:3005/user/log`, {
				method: 'GET',
				headers: {
					Authorization: token,
					'Content-Type': 'application/json',
				},
			});

			const data = await response.json();
			setLogUser(data);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		getUserLog();
	}, []); //eslint-disable-line react-hooks/exhaustive-deps

	return (
		<BasePage
			sx={{
				paddingTop: '1rem',
			}}
		>
			<Box>
				<FlexBetween>
					<Typography variant="span" fontSize="2.2rem" fontWeight="600">
						{`User Log`}
					</Typography>

					<Button
						href={`/user`}
						variant="contained"
						color="info"
						sx={{
							marginLeft: '0.4rem',
						}}
					>
						Kembali
					</Button>
				</FlexBetween>

				{logUser.length !== 0 ? (
					<TableContainer
						sx={{
							width: '100%',
							maxHeight: '80vh',
							backgroundColor: grey[200],
							padding: '0.6rem',

							marginY: '1rem',
						}}
					>
						<Table size="medium">
							<TableHead>
								<TableRow>
									<TableCell align="center" sx={{ fontSize: '1.1rem' }}>
										Waktu
									</TableCell>
									<TableCell align="center" sx={{ fontSize: '1.1rem' }}>
										Username
									</TableCell>
									<TableCell align="center" sx={{ fontSize: '1.1rem' }}>
										Method
									</TableCell>
									<TableCell align="center" sx={{ fontSize: '1.1rem' }}>
										URL
									</TableCell>
									<TableCell align="center" sx={{ fontSize: '1.1rem' }}>
										Data
									</TableCell>
								</TableRow>
							</TableHead>

							<TableBody>
								{logUser.map(
									({ nomor, waktu, username, method, url, data }) => (
										<TableRow key={nomor} hover={true}>
											<TableCell align="center">{waktu}</TableCell>
											<TableCell align="center">{username}</TableCell>
											<TableCell align="center">{method}</TableCell>
											<TableCell align="center">{url}</TableCell>
											<TableCell
												align="center"
												sx={{
													maxWidth: '15rem',
													whiteSpace: 'nowrap',
													overflow: 'hidden',
													textOverflow: 'ellipsis',
												}}
											>
												{data}
											</TableCell>
										</TableRow>
									)
								)}
							</TableBody>
						</Table>
					</TableContainer>
				) : (
					<Box>Log User Tidak Ditemukan</Box>
				)}
			</Box>
		</BasePage>
	);
};

export default UserLog;
