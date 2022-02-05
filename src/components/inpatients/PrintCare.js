import { forwardRef } from 'react';
import Moment from 'react-moment';
import { StringToObject } from '../../utils/commons';
import logoBV from '../../assets/img/logo_bv.PNG';

export const PrintCare = forwardRef((props, ref) => {
	const inpatient = props.inpatient;
	const couponCares = props.couponCares;
	return (
		<div ref={ref}>
			<div className="print-container">
				<div className="print-header">
					<div className="print-header-item header-logo-wrapper">
						<div className="header-logo">
							<img src={logoBV} alt="" />
						</div>
						<div className="header-info-hospital">
							<p>Sở Y Tế Thanh Hóa</p>
							<p>Bệnh viện Đa Khoa Thanh Hà</p>
							<p>Khoa Liên Chuyên Khoa</p>
						</div>
					</div>

					<div className="print-header-item">
						<h1 className="header-title">PHIẾU CHĂM SÓC</h1>
						<div className="header-subtitle">Y tá (điều dưỡng) ghi Phiếu số: ...........</div>
					</div>
					<div className="print-header-item">
						<p>MS:09/BV-01</p>
						<p>Số vào viện:..........</p>
					</div>
				</div>
				<div className="print-info">
					<div className="info-row">
						<div className="info-item-wrapper info-name">
							<span>Họ tên người bệnh: </span>
							<span className="info-item__content">{inpatient[0].HoDem}</span>
						</div>
						<div className="info-item-wrapper">
							<span className="info-item__label">Tuổi: </span>
							<span className="info-item__content">{new Date().getFullYear() - inpatient[0].NamSinh}</span>
						</div>
						<div className="info-item-wrapper">
							<span className="info-item__label">Giới tính: </span>
							<span className="info-item__content">{inpatient[0].GioiTinh}</span>
						</div>
					</div>
					<div className="info-row">
						<div className="info-item-wrapper">
							<span>Giường số: </span>
							<span className="info-item__content">{inpatient[0].GiuongSo}</span>
						</div>
						<div className="info-item-wrapper">
							<span className="info-item__label">Buồng: </span>
							<span className="info-item__content">{inpatient[0].TenPhong}</span>
						</div>
						<div className="info-item-wrapper">
							<span className="info-item__label">Chẩn đoán: </span>
							<span className="info-item__content">{inpatient[0].TenCDoan}</span>
						</div>
					</div>
				</div>
				<div className="print-content">
					<table className="table table-care">
						<thead>
							<tr>
								<th scope="col">Ngày</th>
								<th scope="col">Giờ</th>
								<th scope="col">Theo dõi diễn biến</th>
								<th scope="col">Thưc hiện y lệnh/Chăm sóc</th>
								<th scope="col">Ký tên</th>
							</tr>
						</thead>
						<tbody>
							{couponCares &&
								couponCares.map((couponCare) => (
									<tr key={couponCare.MaDTri}>
										<td>
											<Moment format="DD/MM/yyyy">{couponCare.NgayDTri}</Moment>
										</td>
										<td>
											<Moment format="HH:mm:ss">{couponCare.NgayDTri}</Moment>
										</td>
										<td>{couponCare.DienBien}</td>
										<td>
											{StringToObject(couponCare.YLenh)
												.map((command) => command.Name)
												.join(';')}
										</td>
										<td></td>
									</tr>
								))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
});
