import { useState, useEffect, useReducer } from 'react';
import Axios from 'axios';
import DatePicker from 'react-datepicker';
import Form from 'react-bootstrap/Form';
import { apiUrl, DEPARTMENTS_LOADED_SUCCESS, ROOMS_LOADED_SUCCESS } from '../../contexts/Constants';
import { listReducer } from '../../reducers/listReducer';

const SearchForm = () => {
	const [searchFormState, setSearchFormState] = useState({
		department: '3872502',
		room: '0',
		patientStatus: '1',
		patientType: '2',
		BANumber: '',
		dateFrom: new Date().setHours(0, 0, 0, 0),
		dateTo: new Date().setHours(23, 59, 59, 999),
		date: new Date(),
	});
	// Note
	/**
	 * patientStatus:
	 * 1 - Đang điều trị tại khoa
	 * 2 - Theo ngày vào khoa
	 * 3 - Đã xuất, chuyển khoa
	 * 4 - Theo số bệnh án
	 */
	/**
	 * patientType
	 * 2 - Tất cả
	 * 1 - Bảo hiểm
	 * 0 - Dịch vụ
	 */

	const [list, dispatch] = useReducer(listReducer, {
		departments: [],
		rooms: [],
	});

	const getDepartments = async () => {
		try {
			const response = await Axios.get(`${apiUrl}/list/departments`);
			if (response.data.success) {
				dispatch({ type: DEPARTMENTS_LOADED_SUCCESS, payload: response.data.data });
			}
		} catch (error) {}
	};
	const getRooms = async () => {
		try {
			const response = await Axios.get(`${apiUrl}/list/rooms`);
			if (response.data.success) {
				dispatch({ type: ROOMS_LOADED_SUCCESS, payload: response.data.data });
			}
		} catch (error) {}
	};

	useEffect(() => {
		getDepartments();
	}, []);
	useEffect(() => {
		getRooms();
	}, []);

	const handleChange = (e) => {
		setSearchFormState({ ...searchFormState, [e.target.name]: e.target.value });
	};
	return {
		searchFormState,
		Child: (
			<>
				<Form className="form-search d-flex">
					<div className="form-search-wrapper">
						<Form.Group className="d-flex mb-3 form-search__group">
							<Form.Label className="label-text">Khoa điều trị</Form.Label>
							<Form.Select
								name="department"
								value={searchFormState.department}
								onChange={handleChange}
								disabled={searchFormState.patientStatus === '4' ? true : false}
								className="input-department"
							>
								{list.departments.map((department) => {
									if (department.NoiTru === true) {
										return (
											<option key={department.MaKhoa} value={department.MaKhoa}>
												{department.TenKhoa}
											</option>
										);
									}
								})}
							</Form.Select>
							<Form.Select
								name="room"
								onChange={handleChange}
								disabled={searchFormState.patientStatus === '4' ? true : false}
								className="input-room"
							>
								<option value="0">Tất cả</option>
								{list.rooms.map((room) => {
									if (room.MaKhoa === searchFormState.department && room.LoaiPhong === 'DT')
										return (
											<option key={room.PhongSo} value={room.PhongSo}>
												{room.TenPhong}
											</option>
										);
								})}
							</Form.Select>
						</Form.Group>
						<Form.Group className="d-flex mb-3 form-search__group">
							<Form.Label className="label-text">Chọn bệnh nhân</Form.Label>
							<Form.Select name="patientStatus" onChange={handleChange}>
								<option value="1">Đang điều trị tại khoa</option>
								<option value="2">Theo ngày vào khoa</option>
								<option value="3">Đã xuất, chuyển khoa</option>
								<option value="4">Theo số bệnh án</option>
							</Form.Select>
							<Form.Select
								name="patientType"
								onChange={handleChange}
								disabled={searchFormState.patientStatus === '4' ? true : false}
							>
								<option value="2">Tất cả</option>
								<option value="1">Bảo hiểm</option>
								<option value="0">Dịch vụ</option>
							</Form.Select>
						</Form.Group>
					</div>
					<div className="form-search-wrapper">
						<Form.Group className="d-flex mb-3 form-search__group">
							<Form.Label className="label-text">Số bệnh án</Form.Label>
							<Form.Control
								type="text"
								className=""
								name="BANumber"
								onChange={handleChange}
								disabled={searchFormState.patientStatus === '4' ? false : true}
							></Form.Control>
						</Form.Group>
						<Form.Group className="d-flex mb-3 form-search__group">
							<Form.Label className="label-text">
								{searchFormState.patientStatus === '1' || searchFormState.patientStatus === '4'
									? 'Ngày'
									: searchFormState.patientStatus === '2'
									? 'Vào khoa từ'
									: 'Ra khoa từ'}
							</Form.Label>

							{searchFormState.patientStatus === '1' || searchFormState.patientStatus === '4' ? (
								<DatePicker
									selected={searchFormState.date}
									onChange={(date) => {
										setSearchFormState({ ...searchFormState, date: date });
									}}
									timeInputLabel="Time:"
									dateFormat="MM/dd/yyyy h:mm aa"
									showTimeInput
									disabled={searchFormState.patientStatus === '4' ? true : false}
								/>
							) : (
								<>
									<DatePicker
										selected={searchFormState.dateFrom}
										onChange={(date) => {
											setSearchFormState({ ...searchFormState, dateFrom: date });
										}}
										selectsStart
										timeInputLabel="Time:"
										dateFormat="MM/dd/yyyy h:mm aa"
										showTimeInput
										startDate={searchFormState.dateFrom}
										endDate={searchFormState.dateTo}
										disabled={searchFormState.patientStatus === '4' ? true : false}
									/>
									<DatePicker
										selected={searchFormState.dateTo}
										onChange={(date) => {
											setSearchFormState({ ...searchFormState, dateTo: date });
										}}
										selectsEnd
										timeInputLabel="Time:"
										dateFormat="MM/dd/yyyy h:mm aa"
										showTimeInput
										endDate={searchFormState.dateTo}
										minDate={searchFormState.dateFrom}
										disabled={searchFormState.patientStatus === '4' ? true : false}
									/>
								</>
							)}
							{/* <DatePicker /> */}
						</Form.Group>
					</div>
				</Form>
			</>
		),
	};
};

export default SearchForm;
