import { Typography } from '@mui/material';
import React from 'react';
import BasePage from '../../components/BasePage';

const notFound = () => {
	return (
		<BasePage
			sx={{
				paddingTop: '1rem',
			}}
		>
			<Typography variant="h4" align="center" color="error.dark">
				Halaman tidak ditemukan.
			</Typography>
		</BasePage>
	);
};

export default notFound;
