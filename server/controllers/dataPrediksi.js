import { connection } from '../javascripts/mysql.js';

// Nilai alpha antara 0,1 sampai 0,9
const menghitungSES = (alpha, dataAktual, dataPrediksi) => {
	const hasilSES = dataAktual * alpha + (1 - alpha) * dataPrediksi;
	return hasilSES;
};

// Data Aktual 0 > Data Aktual 1 > Data Aktual 2
const menghitungWMA = (dataAktual0, dataAktual1, dataAktual2) => {
	const bobot = [3, 2, 1];

	const WMA =
		(dataAktual0 * bobot[0] + dataAktual1 * bobot[1] + dataAktual2 * bobot[2]) /
		(bobot[0] + bobot[1] + bobot[2]);

	return WMA;
};

// Bobot Linear Combination antara 0,1 sampai 0,9
const menghitungLinearCombination = (bobot, hasilSES, hasilWMA) => {
	const bobotSES = bobot;
	const bobotWMA = 1 - bobot;

	const hasilLinearCombination = hasilSES * bobotSES + hasilWMA * bobotWMA;

	return hasilLinearCombination;
};

// Menghitung rata - rata dari array
const average = (arr) => arr.reduce((acc, val) => acc + val, 0) / arr.length;

export const getPrediksiPenjualan = async (req, res) => {
	try {
		const { kodeProduk } = req.params;
		const bobot = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];

		const [rows] = await connection.execute(
			`SELECT * FROM penjualan WHERE kodeProduk = ? ORDER BY tahun ASC, bulan ASC`,
			[kodeProduk]
		);

		let tahunAktual = [];
		let bulanAktual = [];
		let penjualanAktual = [];

		// Memindahkan data yang diterima dari database kedalam variabel
		for (let x in rows) {
			tahunAktual.push(rows[x].tahun);
			bulanAktual.push(rows[x].bulan);
			penjualanAktual.push(rows[x].penjualan);
		}

		// Mempersiapkan data - data prediksi
		let tahunPrediksi = tahunAktual;
		let bulanPrediksi = bulanAktual;
		let wmaPrediksi = [];
		let sesPrediksi = [];
		let lcPrediksi = [];
		let mapePrediksi = [];

		// Menghitung WMA
		for (let x in penjualanAktual) {
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

		// Menghitung SES & Sekaligus mencari bobot alpha yang paling cocok.
		let averageMapeSes;
		let bobotAlpha;

		for (let z in bobot) {
			let sesTemp = [];
			let mapeSes = [];
			sesTemp[0] = penjualanAktual[0];

			let alpha = bobot[z];

			for (let x in penjualanAktual) {
				if (
					penjualanAktual[x - 1] != undefined &&
					sesTemp[x - 1] != undefined
				) {
					const ses = menghitungSES(
						alpha,
						penjualanAktual[x - 1],
						sesTemp[x - 1]
					);
					sesTemp[x] = ses;
				}
			}

			// Menghitung mape setiap prediksi ses
			for (let x in sesTemp) {
				if (penjualanAktual[x] === 0) {
					mapeSes[x] = 0;
				} else {
					mapeSes[x] = Math.abs(
						((penjualanAktual[x] - sesTemp[x]) / penjualanAktual[x]) * 100
					);
				}
			}

			if (averageMapeSes === undefined && bobotAlpha === undefined) {
				averageMapeSes = average(mapeSes);
				bobotAlpha = alpha;
				sesPrediksi = sesTemp;
			}

			if (averageMapeSes > average(mapeSes)) {
				averageMapeSes = average(mapeSes);
				bobotAlpha = alpha;
				sesPrediksi = sesTemp;
			}
		}

		// Menghitung Linear Combination & Mencari bobot terbaik
		let averageMapeLc;
		let bobotSes;
		let bobotWma;

		for (let z in bobot) {
			let lcTemp = [];
			let mapeLc = [];

			let bobotSesTemp = bobot[z];

			for (let x in penjualanAktual) {
				if (wmaPrediksi[x] === 0) {
					lcTemp[x] = 0;
				} else {
					lcTemp[x] = menghitungLinearCombination(
						bobotSesTemp,
						sesPrediksi[x],
						wmaPrediksi[x]
					);
				}
			}

			// Menghitung mape setiap prediksi LC
			for (let x in lcTemp) {
				if (wmaPrediksi[x] == 0) {
					mapeLc[x] = 0;
				} else {
					mapeLc[x] = Math.abs(
						((penjualanAktual[x] - lcTemp[x]) / penjualanAktual[x]) * 100
					);
				}
			}

			if (averageMapeLc === undefined && bobotSes === undefined) {
				averageMapeLc = average(mapeLc);
				bobotSes = bobotSesTemp;
				bobotWma = 1 - bobotSes;
				lcPrediksi = lcTemp;
				mapePrediksi = mapeLc;
			}

			if (averageMapeLc > average(mapeLc)) {
				averageMapeLc = average(mapeLc);
				bobotSes = bobotSesTemp;
				bobotWma = Number((1 - bobotSes).toFixed(1));
				lcPrediksi = lcTemp;
				mapePrediksi = mapeLc;
			}
		}

		// Bulan & Tahun Prediksi
		tahunPrediksi[tahunPrediksi.length] =
			bulanPrediksi.length == 12
				? tahunPrediksi[tahunPrediksi.length - 1] + 1
				: tahunPrediksi[tahunPrediksi.length - 1];

		bulanPrediksi[bulanPrediksi.length] =
			bulanPrediksi.length == 12
				? 1
				: bulanPrediksi[bulanPrediksi.length - 1] + 1;

		// Prediksi WMA baru
		wmaPrediksi[wmaPrediksi.length] = menghitungWMA(
			penjualanAktual[wmaPrediksi.length - 1],
			penjualanAktual[wmaPrediksi.length - 2],
			penjualanAktual[wmaPrediksi.length - 3]
		);

		// Prediksi SES baru
		sesPrediksi[sesPrediksi.length] = menghitungSES(
			bobotAlpha,
			parseFloat(penjualanAktual[sesPrediksi.length - 1]),
			parseFloat(sesPrediksi[sesPrediksi.length - 1])
		);

		// Prediksi Linear Combination baru
		lcPrediksi[lcPrediksi.length] = menghitungLinearCombination(
			bobotSes,
			sesPrediksi[lcPrediksi.length],
			wmaPrediksi[lcPrediksi.length]
		);

		// Menghitung rata rata
		const rataRata = {
			penjualanAktual: 0,
			wmaPrediksi: 0,
			sesPrediksi: 0,
			lcPrediksi: 0,
			mapePrediksi: 0,
		};

		rataRata.penjualanAktual = average(penjualanAktual);
		rataRata.wmaPrediksi = average(wmaPrediksi.slice(3, -1));
		rataRata.sesPrediksi = average(sesPrediksi.slice(3, -1));
		rataRata.lcPrediksi = average(lcPrediksi.slice(3, -1));
		rataRata.mapePrediksi = average(mapePrediksi.slice(3));

		res.status(200).json({
			tahunPrediksi,
			bulanPrediksi,
			penjualanAktual,
			wmaPrediksi,
			bobotAlpha,
			sesPrediksi,
			bobotSes,
			bobotWma,
			lcPrediksi,
			mapePrediksi,
			rataRata,
		});
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};
