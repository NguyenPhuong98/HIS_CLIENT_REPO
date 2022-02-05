import { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import Moment from 'react-moment';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import DatePicker from 'react-datepicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrashAlt, faPrint, faUndo, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';
import { makeStyles, styled } from '@mui/styles';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';
import { default as Button1 } from '@mui/material/Button';
import { apiUrl } from '../contexts/Constants';
import { AuthContext } from '../contexts/AuthContext';
import { InpatientContext } from '../contexts/InpatientContext';
import { PrintCare } from '../components/inpatients/PrintCare';
import { ConfirmDialog } from '../components/commons';
import { StringToObject, DatetimeToString } from '../utils/commons';

const useStyles = makeStyles({
	center: {
		textAlign: 'center',
	},
	button: {
		fontSize: '16px',
	},
	time_print: {
		display: 'flex',
		marginBottom: '20px',
	},
});

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
	'& .MuiDialogContent-root': {
		// padding: '30px',
	},
	'& .MuiDialogActions-root': {
		// padding: theme.spacing(1),
	},
}));

const BootstrapDialogTitle = (props) => {
	const { children, onClose, ...other } = props;

	return (
		<DialogTitle sx={{ m: 0, p: 2 }} {...other}>
			{children}
			{onClose ? (
				<IconButton
					aria-label="close"
					onClick={onClose}
					sx={{
						position: 'absolute',
						right: 8,
						top: 8,
						color: (theme) => theme.palette.grey[500],
					}}
				>
					<CloseIcon />
				</IconButton>
			) : null}
		</DialogTitle>
	);
};

BootstrapDialogTitle.propTypes = {
	children: PropTypes.node,
	onClose: PropTypes.func.isRequired,
};
const Inpatient = () => {
	let { id } = useParams();
	const navigate = useNavigate();
	const printRef = useRef();
	const classes = useStyles();

	const {
		authState: { user },
	} = useContext(AuthContext);
	const {
		inpatientState: { inpatient },
		getInpatientByMaBA,
	} = useContext(InpatientContext);
	const [careInfo, setCareInfo] = useState({
		time: new Date(),
		couponCode: '',
		happen: '',
		commands: [],
		user: user[0].MaNV,
	});
	const [show, setShow] = useState({
		showSearchResult: false,
		showChoseTimePrint: false,
	});
	const [searchText, setSearchText] = useState('');
	const [listCommand, setListCommand] = useState([]);
	const [couponCare, setCouponCare] = useState({
		listCouponCare: [],
		againLoad: false,
	});
	const [couponCarePeriod, setCouponCarePeriod] = useState([]);
	console.log('log lần 1:', couponCarePeriod);
	const [state, setState] = useState({
		stateCreate: false,
		stateEdit: true,
		stateRemove: true,
		statePrint: false,
		stateSave: true,
		stateCancel: true,
		stateTime: true,
		stateHappen: true,
		stateSearch: true,
		stateCommands: true,
	});

	const [confirmDialog, setConfirmDialog] = useState({
		isOpen: false,
		title: '',
		subtitle: '',
		onClick: () => {},
	});

	const [timePrint, setTimePrint] = useState({
		timeFrom: new Date(new Date().setHours(0, 0, 0, 0)),
		timeTo: new Date(new Date().setHours(23, 59, 59, 999)),
	});
	const { time, couponCode, happen, commands } = careInfo;
	const {
		stateCreate,
		stateEdit,
		stateRemove,
		statePrint,
		stateSave,
		stateCancel,
		stateTime,
		stateHappen,
		stateSearch,
		stateCommands,
	} = state;
	const { listCouponCare, againLoad } = couponCare;
	const { showSearchResult, showChoseTimePrint } = show;
	const { timeFrom, timeTo } = timePrint;
	useEffect(() => {
		loadCommands();
	}, []);
	useEffect(() => {
		getInpatientByMaBA(id);
	}, []);
	useEffect(() => {
		getInpatientCouponCares();
	}, [againLoad]);

	const getInpatientCouponCares = async () => {
		try {
			const response = await axios.get(`${apiUrl}/inpatients/couponcare?MaBA=${id}`);
			setCouponCare({ ...couponCare, listCouponCare: response.data.couponCares });
		} catch (error) {}
	};

	const loadCommands = async () => {
		try {
			const response = await axios.get(`${apiUrl}/list/commands`);
			setListCommand(response.data.commands);
		} catch (error) {
			console.error(error);
		}
	};

	const getPeriodCouponCares = async () => {
		try {
			let TimeFrom = DatetimeToString(timeFrom);
			let TimeTo = DatetimeToString(timeTo);
			const response = await axios.get(
				`${apiUrl}/inpatients/couponcare?MaBA=${id}&TimeFrom=${TimeFrom}&TimeTo=${TimeTo}`
			);
			setCouponCarePeriod(response.data.couponCares);
		} catch (error) {}
	};

	// Handle when add/remove command
	const FilterCommands = () => {
		const newCommands = listCommand.filter((command) => {
			const text =
				Object.values(command)[0].toString().toLowerCase() + Object.values(command)[1].toString().toLowerCase();
			return text.includes(searchText.toLowerCase());
		});
		return newCommands;
	};

	const addCommand = (cmd) => {
		const commands = careInfo.commands;
		if (commands.length > 0) {
			var commandFilter = commands.filter((command) => {
				return Object.values(command)[0] === Object.values(cmd)[0];
			});
			if (commandFilter.length > 0) {
				return commands;
			}
		}
		return [...commands, cmd];
	};

	const removeCommand = (cmd) => {
		const commands = careInfo.commands;
		const newCommands = commands.filter((command) => Object.values(command)[0] !== Object.values(cmd)[0]);
		return newCommands;
	};

	const handleChoseCommand = (cmd) => {
		setSearchText('');
		setCareInfo({ ...careInfo, commands: addCommand(cmd) });
	};

	const handleDeleteCommand = (cmd) => {
		setCareInfo({ ...careInfo, commands: removeCommand(cmd) });
	};

	const handleChangeCommands = (command, e) => {
		const cmds = commands;
		const cmdFix = { ID: command.ID, Name: e.target.value };
		cmds.splice(
			cmds.findIndex((cmd) => cmd.ID === command.ID),
			1,
			cmdFix
		);
		setCareInfo({
			...careInfo,
			commands: cmds,
		});
	};
	// Handle button
	const handleCreate = () => {
		setShow({ ...show, showChoseTimePrint: true });
		setState({
			...state,
			stateCreate: true,
			stateSave: false,
			stateEdit: true,
			stateCancel: false,
			stateRemove: true,
			stateTime: false,
			stateHappen: false,
			stateSearch: false,
			stateCommands: false,
		});
		setCareInfo({ ...careInfo, couponCode: 'LẬP PHIẾU MỚI', happen: '', commands: [] });
	};
	const handleEdit = () => {
		setState({
			...state,
			stateCancel: false,
			stateEdit: true,
			stateSave: false,
			stateTime: false,
			stateHappen: false,
			stateSearch: false,
			stateCommands: false,
		});
	};
	const handleDelete = async (couponCode) => {
		setConfirmDialog({ ...ConfirmDialog, isOpen: false });
		try {
			const response = await axios.delete(`${apiUrl}/inpatients/couponcare?MaBA=${id}&MaDTri=${couponCode}`);
			console.log(response);
			if (response.data.success) {
				console.log(11111111);
				setCouponCare({ ...couponCare, againLoad: !againLoad });
				toast.success('Xóa phiếu chăm sóc thành công!');
				setCareInfo({ ...careInfo, time: new Date(), couponCode: '', happen: '', commands: [] });
				setState({
					...state,
					stateCreate: false,
					stateEdit: true,
					stateRemove: true,
					stateSave: true,
					stateCancel: true,
				});
			}
		} catch (error) {}
	};

	const handleChosePrint = useReactToPrint({
		content: () => printRef.current,
	});

	const handleClose = () => {
		setShow({ ...show, showChoseTimePrint: false });
	};
	const handleSave = async () => {
		if (happen === '' || commands.length === 0) {
			toast.warn('Bạn chưa nhập thông tin diễn biến/y lệnh');
		} else {
			try {
				const dataPost = {
					...careInfo,
					time: DatetimeToString(time),
					commands: commands.map((command) => `${command.ID}&${command.Name}`).join('; '),
				};
				console.log('dataPost:', dataPost);
				const response = await axios.post(`${apiUrl}/inpatients/couponcare?MaBA=${id}`, dataPost);
				if (response.data.success) {
					setCareInfo({ ...careInfo, couponCode: response.data.MaDTri });
					setCouponCare({ ...couponCare, againLoad: !againLoad });
					setState({
						...state,
						stateCreate: false,
						stateSave: true,
						stateCancel: true,
						stateTime: true,
						stateHappen: true,
						stateSearch: true,
						stateCommands: true,
					});
				}
			} catch (error) {}
		}
	};
	const handleCancel = () => {
		setCareInfo({ ...careInfo, time: new Date(), couponCode: '', happen: '', commands: [] });
		setState({
			...state,
			stateCreate: false,
			stateEdit: true,
			stateRemove: true,
			stateSave: true,
			stateCancel: true,
			stateTime: true,
			stateHappen: true,
			stateSearch: true,
			stateCommands: true,
		});
	};

	// Handle when click CouponCare
	const handleClickCouponCare = (couponCare) => {
		let commands = [];
		commands = StringToObject(couponCare.YLenh);

		console.log(couponCare);
		setCareInfo({
			...careInfo,
			time: new Date(couponCare.NgayDTri),
			couponCode: couponCare.MaDTri,
			happen: couponCare.DienBien,
			commands: commands,
		});
		setState({ ...state, stateRemove: false, stateEdit: false });
	};
	return (
		<>
			{inpatient && (
				<>
					<div className="main" onClick={(e) => setShow({ ...show, showSearchResult: false })}>
						<div className="info-hc mt-3 text-dark">
							<div className="info-hc-item info-hc-name">
								<label className="info-hc-item__title info-hc-name__tite">Họ và tên</label>
								<input type="text" name="" id="" value={inpatient[0].HoDem} className="item__content--name" disabled />
							</div>
							<div className="info-hc-item info-hc-yob">
								<label className="info-hc-item__title info-hc-yob__title">Năm sinh</label>
								<input
									type="text"
									name=""
									id=""
									value={inpatient[0].NamSinh}
									className="item__content--year"
									disabled
								/>
							</div>
							<div className="info-hc-item info-hc-gender">
								<label className="info-hc-item__title info-hc-gender__title">Giới tính</label>
								<input
									type="text"
									name=""
									id=""
									value={inpatient[0].GioiTinh}
									className="item__content--gender"
									disabled
								/>
							</div>
							<div className="info-hc-item info-hc-address">
								<label className="info-hc-item__title info-hc-address__title">Địa chỉ</label>
								<input
									type="text"
									name=""
									id=""
									value={inpatient[0].DiaChi}
									className="item__content--address"
									disabled
								/>
							</div>
							<div className="info-hc-item info-hc-type">
								<label className="info-hc-item__title info-hc-type__title">Đối tượng</label>
								<input
									type="text"
									name=""
									id=""
									value={inpatient[0].TypeBN === '1' ? 'Bảo hiểm' : 'Dịch vụ'}
									className="item__content--type"
									disabled
								/>
							</div>
							<div className="info-hc-item info-hc-thebh">
								<label className="info-hc-item__title info-hc-thebh__title">Số thẻ KCB</label>
								<input
									type="text"
									name=""
									id=""
									value={inpatient[0].MaTheKCB}
									className="item__content--mathe"
									disabled
								/>
							</div>
							<div className="info-hc-item info-hc-bed">
								<label className="info-hc-item__title info-hc-bed__title">Giường</label>
								<input
									type="text"
									name=""
									id=""
									value={inpatient[0].GiuongSo}
									className="item__content--bed"
									disabled
								/>
							</div>
							<div className="info-hc-item info-hc-room">
								<label className="info-hc-item__title info-hc-room__title">Phòng</label>
								<input
									type="text"
									name=""
									id=""
									value={inpatient[0].TenPhong}
									className="item__content--room"
									disabled
								/>
							</div>
							<div className="info-hc-item info-hc-department">
								<label className="info-hc-item__title info-hc-department__title">Khoa điều trị</label>
								<input
									type="text"
									name=""
									id=""
									value={inpatient[0].TenKhoa}
									className="item__content--department"
									disabled
								/>
							</div>
							<div className="info-hc-item info-hc-banumber">
								<label className="info-hc-item__title info-hc-banumber__title">Số bệnh án</label>
								<input
									type="text"
									name=""
									id=""
									value={inpatient[0].MaBA}
									className="item__content--banumber"
									disabled
								/>
							</div>
							<div className="info-hc-item info-hc-diagnose">
								<label className="info-hc-item__title info-hc-diagnose__title">Chẩn đoán</label>
								<input type="text" name="" id="" value={inpatient[0].TenCDoan} className="item__content--cd" disabled />
							</div>
							<div className="info-hc-item info-hc-doctor">
								<label className="info-hc-item__title info-hc-doctor__title">BS điều trị</label>
								<input
									type="text"
									name=""
									id=""
									value={inpatient[0].BSDieuTri}
									className="item__content--doctor"
									disabled
								/>
							</div>
							<div className="descript-form">Thông tin hành chính</div>
						</div>
						<div className="btns-control mt-3">
							<Button variant="success" className="btn-create icon-btn" disabled={stateCreate} onClick={handleCreate}>
								<FontAwesomeIcon icon={faPlus} className="mr-2 " />
								Lập mới
							</Button>{' '}
							<Button variant="success" className="btn-edit icon-btn" disabled={stateEdit} onClick={handleEdit}>
								<FontAwesomeIcon icon={faEdit} className="mr-2 " />
								Sửa phiếu
							</Button>{' '}
							<Button
								variant="success"
								className="btn-delete icon-btn"
								disabled={stateRemove}
								onClick={() => {
									setConfirmDialog({
										isOpen: true,
										title: 'Bạn chắc chắn muốn xóa phiếu chăm sóc này?',
										subtitle: 'Bạn không thể hoàn tác hành động này ',
										onConfirm: () => {
											handleDelete(couponCode);
										},
									});
								}}
							>
								<FontAwesomeIcon icon={faTimes} className="mr-2 " />
								Xóa phiếu
							</Button>{' '}
							<Button
								variant="success"
								className="btn-print icon-btn"
								disabled={statePrint}
								onClick={(e) => {
									e.stopPropagation();
									setShow({ ...show, showChoseTimePrint: true });
								}}
							>
								<FontAwesomeIcon icon={faPrint} className="mr-2 " />
								In phiếu CS
							</Button>{' '}
							<Button
								variant="success"
								className="btn-return icon-btn"
								onClick={() => {
									navigate('/inpatients');
								}}
							>
								<FontAwesomeIcon icon={faUndo} className="mr-2 " />
								Quay về
							</Button>{' '}
							<Button variant="success" className="btn-save icon-btn" disabled={stateSave} onClick={handleSave}>
								<FontAwesomeIcon icon={faSave} className="mr-2 " />
								Lưu phiếu
							</Button>{' '}
							<Button variant="success" className="btn-cancel icon-btn" disabled={stateCancel} onClick={handleCancel}>
								<FontAwesomeIcon icon={faTrashAlt} className="mr-2 " />
								Hủy bỏ
							</Button>{' '}
							<div style={{ display: 'none' }}>
								{/* <div> */}
								<PrintCare ref={printRef} couponCares={couponCarePeriod} inpatient={inpatient} />
							</div>
						</div>

						<Form className="form-input text-dark mt-3">
							<div className="form-wrapper">
								<Form.Group className="form-group-item form-group__time">
									<Form.Label>Thời gian lập phiếu chăm sóc</Form.Label>
									<DatePicker
										className="time-input"
										selected={time}
										timeInputLabel="Time:"
										dateFormat="dd/MM/yyyy h:mm aa"
										showTimeInput
										disabled={stateTime}
										onChange={(date) => setCareInfo({ ...careInfo, time: date })}
									/>
								</Form.Group>
								<Form.Group className="form-group-item form-group__vote">
									<Form.Label>Số phiếu chăm sóc</Form.Label>
									<Form.Control className="vote-input" type="text" value={couponCode} disabled></Form.Control>
								</Form.Group>
							</div>
							<div className="form-wrapper">
								<Form.Group className="form-group-item form-group__happen">
									<Form.Label>Theo dõi diễn biến</Form.Label>
									<Form.Control
										type="text"
										as="textarea"
										className="form-group__happen-input"
										disabled={stateHappen}
										onChange={(e) => {
											setCareInfo({ ...careInfo, happen: e.target.value });
										}}
										value={happen}
									></Form.Control>
								</Form.Group>
								<Form.Group className="form-group-item form-group__commands">
									<Form.Label>Thực hiện y lệnh chăm sóc</Form.Label>
									<div className="control-wrapper">
										<Form.Control
											type="text"
											onChange={(e) => {
												setSearchText(e.target.value);
											}}
											onClick={(e) => {
												e.stopPropagation();
												setShow({ ...show, showSearchResult: true });
											}}
											value={searchText}
											disabled={stateSearch}
											className="form-group__commands-input"
										></Form.Control>
										{showSearchResult && (
											<div className="search-result">
												{FilterCommands().map((command, index) => (
													<p className="search-result-item" key={index} onClick={() => handleChoseCommand(command)}>
														{Object.values(command)[0]} - {Object.values(command)[1]}
													</p>
												))}
											</div>
										)}
									</div>

									<div className="commands">
										{commands &&
											commands.map((command) => (
												<div className="command-wrap" key={Object.values(command)[0]}>
													<Form.Control
														type="text"
														as="textarea"
														id={Object.values(command)[0]}
														name={Object.values(command)[0]}
														defaultValue={Object.values(command)[1]}
														onChange={(e) => handleChangeCommands(command, e)}
														disabled={stateCommands}
													/>
													<span
														className="icon-delete"
														disabled={stateCommands}
														onClick={() => {
															if (!stateCommands) {
																handleDeleteCommand(command);
															}
														}}
													>
														&times;
													</span>
												</div>
											))}
									</div>
								</Form.Group>
							</div>
						</Form>
						<table className="table">
							<thead className="head-tb">
								<tr>
									<th className="col-sm-1">Ngày</th>
									<th className="col-sm-2">Theo dõi diễn biến</th>
									<th className="col-sm-2">Thực hiện y lệnh/chăm sóc</th>
									<th className="col-sm-1">Người thực hiện</th>
								</tr>
							</thead>
							<tbody>
								{listCouponCare &&
									listCouponCare.map((couponCare) => (
										<tr key={couponCare.MaDTri} onClick={handleClickCouponCare.bind(this, couponCare)}>
											<td>
												<Moment format="DD/MM/yyyy HH:mm:ss">{couponCare.NgayDTri}</Moment>
											</td>
											<td>{couponCare.DienBien}</td>
											<td>
												{StringToObject(couponCare.YLenh)
													.map((command) => command.Name)
													.join(';')}
											</td>
											<td>{couponCare.NVTH}</td>
										</tr>
									))}
							</tbody>
						</table>
					</div>
					<ToastContainer
						position="top-center"
						autoClose={3000}
						hideProgressBar={false}
						newestOnTop={false}
						closeOnClick={false}
						rtl={false}
						pauseOnFocusLoss
						draggable
						pauseOnHover
					/>

					{/* Dialog delete couponCare */}
					<ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
					{/* Chose time print */}
					<BootstrapDialog aria-labelledby="customized-dialog-title" open={showChoseTimePrint} onClose={handleClose}>
						<BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
							Chọn khoảng thời gian in
						</BootstrapDialogTitle>
						<DialogContent dividers>
							<div className={classes.time_print}>
								<Typography style={{ width: '140px' }}>Từ ngày</Typography>
								<DatePicker
									className="time-input"
									selected={timeFrom}
									dateFormat="dd/MM/yyyy"
									onChange={(date) => setTimePrint({ ...timePrint, timeFrom: date })}
								/>
							</div>
							<div className={classes.time_print}>
								<Typography style={{ width: '140px' }}>Đến ngày</Typography>
								<DatePicker
									className="time-input"
									selected={timeTo}
									dateFormat="dd/MM/yyyy"
									onChange={(date) => setTimePrint({ ...timePrint, timeTo: date })}
								/>
							</div>
						</DialogContent>
						<DialogActions>
							<Button1
								// color="success"
								// variant="contained"
								autoFocus
								onClick={() => {
									getPeriodCouponCares();
									setTimeout(() => {
										handleChosePrint();
									}, 500);
									setShow({ ...show, showChoseTimePrint: false });
								}}
								className={classes.button}
							>
								Đồng ý
							</Button1>
							<Button1
								// color="error"
								// variant="contained"
								onClick={() => {
									setShow({ ...show, showChoseTimePrint: false });
								}}
								className={classes.button}
							>
								Hủy bỏ
							</Button1>
						</DialogActions>
					</BootstrapDialog>
				</>
			)}
		</>
	);
};

export default Inpatient;
