import { useContext } from 'react';
import Table from 'react-bootstrap/Table';
import { useNavigate } from 'react-router-dom';
import { InpatientContext } from '../../contexts/InpatientContext';

const InpatientsTable = ({ inpatientList }) => {
	// const { findInpatient } = useContext(InpatientContext);
	const navigate = useNavigate();

	const handleDoubleClick = (id) => {
		navigate(`/inpatients/${id}`);
	};

	const convertDate = (string) => {
		const myDate = new Date(string);
		var dateString = myDate.getDate() + '-' + (myDate.getMonth() + 1) + '-' + myDate.getFullYear();
		return dateString;
	};

	return (
		<table className="table table-inpatients">
			<thead className="head-tb">
				<tr>
					<th className="col-sm-2">Mã bệnh án</th>
					<th className="col-sm-3">Họ tên</th>
					<th className="col-sm-1">Năm sinh</th>
					<th className="col-sm-1">Giới tính</th>
					<th className="col-sm-5">Địa chỉ</th>
					<th className="col-sm-1">Cấp cứu</th>
					<th className="col-sm-2">Ngày vào khoa</th>
					<th className="col-sm-3">Phòng điều trị</th>
					<th className="col-sm-1">Giường</th>
					<th className="col-sm-1">Ra viện</th>
				</tr>
			</thead>
			<tbody className="body-tb">
				{inpatientList &&
					inpatientList.map((inpatient) => (
						<tr key={inpatient.MaBA} onDoubleClick={handleDoubleClick.bind(this, inpatient.MaBA)}>
							<td>{inpatient.MaBA}</td>
							<td>{inpatient.HoDem}</td>
							<td>{inpatient.NamSinh}</td>
							<td>{inpatient.GioiTinh}</td>
							<td>{inpatient.DiaChi}</td>
							<td>
								<input
									type="checkbox"
									checked={inpatient.CapCuu}
									disabled
									style={{ transform: 'scale(1.5)', color: 'black' }}
								/>
							</td>
							<td>{convertDate(inpatient.NgayVao)}</td>
							<td>{inpatient.TenPhong}</td>
							<td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{inpatient.GiuongSo}</td>
							<td>
								<input
									type="checkbox"
									checked={inpatient.Ravien}
									disabled
									style={{ transform: 'scale(1.5)', color: 'black' }}
								/>
							</td>
						</tr>
					))}
			</tbody>
		</table>
	);
};

export default InpatientsTable;
