import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const DeleteConfirmation = (props) => {
	const [open, setOpen] = useState(false);
	const [namaProduk, setNamaProduk] = useState();

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	function handleDelete() {
		props.onDelete();
		setOpen(false);
	}

	useEffect(() => {
		setNamaProduk(props.nama);
	}, []); //eslint-disable-line react-hooks/exhaustive-deps

	return (
		<div>
			<Button
				variant="contained"
				size="small"
				color="error"
				onClick={handleClickOpen}
			>
				Delete
			</Button>

			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">{'Konfirmasi Hapus'}</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						Apakah anda yakin ingin menghapus "{namaProduk}"
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button
						variant="contained"
						size="small"
						color="error"
						onClick={handleClose}
					>
						Tidak
					</Button>
					<Button
						variant="contained"
						size="small"
						color="success"
						onClick={handleDelete}
						autoFocus
					>
						Konfirmasi
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default DeleteConfirmation;
