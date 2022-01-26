import { Link } from 'react-router-dom';
import { useContext } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
import { AuthContext } from '../../contexts/AuthContext';
import learnItLogo from '../../assets/img/logo.svg';
import logoutIcon from '../../assets/img/logout.svg';

const NavbarMenu = () => {
	const {
		authState: { user },
		logoutUser,
	} = useContext(AuthContext);

	const logout = () => {
		logoutUser();
	};
	return (
		<Navbar expand="lg" bg="primary" variant="dark" className="shadow" style={{ position: 'sticky', zIndex: '999' }}>
			<Navbar.Brand className="font-weight-bolder text-white">
				<img src={learnItLogo} alt="learnItLogo" width="32" height="32" className="mr-2" />
				HIS SOFTWARE
			</Navbar.Brand>

			<Navbar.Toggle aria-controls="basic-navbar-nav" />

			<Navbar.Collapse id="basic-navbar-nav">
				<Nav className="mr-auto">
					<Nav.Link className="font-weight-bolder text-white" to="/dashboard" as={Link}>
						Dashboard
					</Nav.Link>
					<NavDropdown title="Nội trú">
						<NavDropdown.Item>
							<Nav.Link className="font-weight-bolder text-white" to="/inpatients" as={Link}>
								Phiếu chăm sóc
							</Nav.Link>
						</NavDropdown.Item>
					</NavDropdown>
				</Nav>

				<Nav>
					<Nav.Link className="font-weight-bolder text-white" disabled>
						Welcome {user[0].TenNV}
					</Nav.Link>
					<Button variant="secondary" className="font-weight-bolder text-white" onClick={logout}>
						<img src={logoutIcon} alt="logoutIcon" width="32" height="32" className="mr-2" />
						Logout
					</Button>
				</Nav>
			</Navbar.Collapse>
		</Navbar>
	);
};

export default NavbarMenu;
