import React, { useEffect, useState } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { blue, grey } from '@mui/material/colors';

import Navbar from './components/Navbar';

import HomePage from './scenes/homePage';
import DaftarProduk from './scenes/daftarProduk';
import TambahProduk from './scenes/tambahProduk';
import DaftarPenjualan from './scenes/daftarPenjualan';
import NotFound from './scenes/notFound';
import TambahPenjualan from './scenes/tambahPenjualan';
import PrediksiPenjualan from './scenes/prediksiPenjualan';
import EditProduk from './scenes/editProduk';

import { CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import EditPenjualan from './scenes/editPenjualan';
import Login from './scenes/login';
import DaftarUser from './scenes/daftarUser';
import TambahUser from './scenes/tambahUser';
import EditUser from './scenes/editUser';
import UserLog from './scenes/userLog';

const theme = createTheme({
	palette: {
		primary: {
			main: blue[700],
		},
		background: {
			default: grey[50],
		},
	},
});

const App = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	useEffect(() => {
		setIsLoggedIn(localStorage.getItem('token') ? true : false);
	}, []);

	return (
		<div className="app">
			<BrowserRouter>
				<ThemeProvider theme={theme}>
					<CssBaseline />

					<Navbar isLoggedIn={isLoggedIn} />

					<Routes>
						<Route path="/" element={<HomePage />} />

						<Route path="/login" element={<Login />} />

						<Route path="user">
							<Route index element={<DaftarUser />} />
							<Route path="tambah" element={<TambahUser />} />
							<Route path="edit/:username" element={<EditUser />} />

							<Route path="log" element={<UserLog />} />
						</Route>

						<Route path="produk">
							<Route index element={<DaftarProduk />} />
							<Route path="tambah" element={<TambahProduk />} />
							<Route path="edit/:kodeProduk" element={<EditProduk />} />

							<Route
								path="prediksi/:kodeProduk"
								element={<PrediksiPenjualan />}
							/>

							<Route path="penjualan">
								<Route path=":kodeProduk" element={<DaftarPenjualan />} />
								<Route
									path="tambah/:kodeProduk"
									element={<TambahPenjualan />}
								/>
								<Route path="edit/:kodePenjualan" element={<EditPenjualan />} />
							</Route>
						</Route>

						<Route path="*" element={<NotFound />} />
					</Routes>
				</ThemeProvider>
			</BrowserRouter>
		</div>
	);
};

export default App;
