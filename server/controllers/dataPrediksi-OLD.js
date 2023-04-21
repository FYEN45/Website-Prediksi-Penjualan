import { connection } from '../javascripts/mysql.js';

const menghitungSES = (dataAktual0, dataPrediksi0) => {
	const alpha = 0.5;
	const hasilSES = dataAktual0 * alpha + (1 - alpha) * dataPrediksi0;
	return hasilSES;
};

const menghitungWMA = (dataAktual0, dataAktual1, dataAktual2) => {
	const bobot = [3, 2, 1];

	const WMA =
		(dataAktual0 * bobot[0] + dataAktual1 * bobot[1] + dataAktual2 * bobot[2]) /
		(bobot[0] + bobot[1] + bobot[2]);

	return WMA;
};

const menghitungLinearCombination = (hasilSES, hasilWMA) => {
	const bobotSES = 0.5;
	const bobotWMA = 1 - bobotSES;

	const hasilLinearCombination = hasilSES * bobotSES + hasilWMA * bobotWMA;

	return hasilLinearCombination;
};

export const getPrediksiPenjualan = async (req, res) => {
	try {
		const { kodeProduk } = req.params;

		const [row_aktual] = await connection.execute(
			`SELECT * FROM penjualan WHERE kodeProduk = ? ORDER BY tahun ASC, bulan ASC`,
			[kodeProduk]
		);

		let tahunAktual = [];
		let bulanAktual = [];
		let penjualanAktual = [];

		for (let x in row_aktual) {
			tahunAktual.push(row_aktual[x].tahun);
			bulanAktual.push(row_aktual[x].bulan);
			penjualanAktual.push(row_aktual[x].penjualan);
		}

		let tahunPrediksi = [];
		let bulanPrediksi = [];
		let wmaPrediksi = [];
		let sesPrediksi = [];
		let hybridPrediksi = [];
		let mapePrediksi = [];

		tahunPrediksi[0] = tahunAktual[0];
		bulanPrediksi[0] = bulanAktual[0];
		sesPrediksi[0] = penjualanAktual[0];
		wmaPrediksi[0] = 0;

		//menghitung ses
		for (let x in row_aktual) {
			if (
				penjualanAktual[x - 1] != undefined &&
				sesPrediksi[x - 1] != undefined
			) {
				const ses = menghitungSES(penjualanAktual[x - 1], sesPrediksi[x - 1]);

				tahunPrediksi[x] = tahunAktual[x];
				bulanPrediksi[x] = bulanAktual[x];
				sesPrediksi[x] = ses;
			}
		}

		// menghitung wma
		for (let x in row_aktual) {
			if (
				penjualanAktual[x - 1] != undefined &&
				penjualanAktual[x - 2] != undefined &&
				penjualanAktual[x - 3] != undefined
			) {
				const wma = menghitungWMA(
					penjualanAktual[x - 1],
					penjualanAktual[x - 2],
					penjualanAktual[x - 3]
				);
				wmaPrediksi[x] = wma;
			} else {
				wmaPrediksi[x] = 0;
			}
		}

		// bulan tahun prediksi baru
		tahunPrediksi[tahunPrediksi.length] =
			bulanPrediksi.length == 12
				? tahunPrediksi[tahunPrediksi.length - 1] + 1
				: tahunPrediksi[tahunPrediksi.length - 1];

		bulanPrediksi[bulanPrediksi.length] =
			bulanPrediksi.length == 12
				? 1
				: bulanPrediksi[bulanPrediksi.length - 1] + 1;

		// prediksi WMA baru
		wmaPrediksi[wmaPrediksi.length] = menghitungWMA(
			penjualanAktual[sesPrediksi.length - 1],
			penjualanAktual[sesPrediksi.length - 2],
			penjualanAktual[sesPrediksi.length - 3]
		);

		// prediksi SES baru
		sesPrediksi[sesPrediksi.length] = menghitungSES(
			parseFloat(penjualanAktual[sesPrediksi.length - 1]),
			parseFloat(sesPrediksi[sesPrediksi.length - 1])
		);

		// menghitung linear combination
		for (let x in wmaPrediksi) {
			if (wmaPrediksi[x] !== 0) {
				hybridPrediksi.push(
					menghitungLinearCombination(wmaPrediksi[x], sesPrediksi[x])
				);
			} else {
				hybridPrediksi.push(0);
			}
		}

		// menghitung MAPE
		for (let x in penjualanAktual) {
			if (wmaPrediksi[x] !== 0) {
				mapePrediksi[x] =
					((penjualanAktual[x] - hybridPrediksi[x]) / penjualanAktual[x]) * 100;
			} else {
				mapePrediksi[x] = 0;
			}
		}

		// menghitung rata rata
		const rataRata = {
			penjualanAktual: 0,
			wmaPrediksi: 0,
			sesPrediksi: 0,
			hybridPrediksi: 0,
			mapePrediksi: 0,
		};

		const average = (arr) =>
			arr.reduce((acc, val) => acc + val, 0) / arr.length;

		rataRata.penjualanAktual = average(penjualanAktual);
		rataRata.wmaPrediksi = average(wmaPrediksi.slice(3, -1));
		rataRata.sesPrediksi = average(sesPrediksi.slice(3, -1));
		rataRata.hybridPrediksi = average(hybridPrediksi.slice(3, -1));
		rataRata.mapePrediksi = average(mapePrediksi.slice(3));

		res.status(200).json({
			// tahunAktual,
			// bulanAktual,
			tahunPrediksi,
			bulanPrediksi,
			penjualanAktual,
			wmaPrediksi,
			sesPrediksi,
			hybridPrediksi,
			mapePrediksi,
			rataRata,
		});
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};
