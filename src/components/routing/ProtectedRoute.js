import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import Spinner from 'react-bootstrap/Spinner';
import { NavbarMenu } from '../commons';

const ProtectedRoute = ({ children }) => {
	let location = useLocation();
	const {
		authState: { authLoading, isAuthenticated },
	} = useContext(AuthContext);
	if (authLoading) {
		return (
			<div className="spinner-container">
				<Spinner animation="border" variant="info" />
			</div>
		);
	}
	if (!isAuthenticated) {
		return <Navigate to="/login" state={{ from: location }} />;
	}

	return (
		<>
			<NavbarMenu />
			{children}
		</>
	);
	// return isAuthenticated === true ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
