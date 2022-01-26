import React from 'react';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import { AuthContext } from '../contexts/AuthContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from 'react-bootstrap/spinner';

const Auth = ({ authRoute }) => {
	let body;
	const navigate = useNavigate();
	const {
		authState: { authLoading, isAuthenticated },
	} = useContext(AuthContext);

	if (authLoading) {
		body = (
			<div className="d-flex justify-content-center mt-2">
				<Spinner animation="border" variant="info"></Spinner>
			</div>
		);
	} else if (isAuthenticated) {
		navigate('/inpatients');
	} else {
		body = (
			<>
				{authRoute === 'login' && <LoginForm />}
				{authRoute === 'register' && <RegisterForm />}
			</>
		);
	}
	return (
		<div className="landing">
			<div className="dark-overlay">
				<div className="landing-inner">
					<h1>LearnIT</h1>
					<h4>keep track of what you are learning</h4>
					{body}
				</div>
			</div>
		</div>
	);
};

export default Auth;
