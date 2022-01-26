import { useState, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { AuthContext } from '../../contexts/AuthContext';
import { AlertMessage } from '../commons';
const LoginForm = () => {
	//Context
	const { loginUser } = useContext(AuthContext);
	const usernameRef = useRef();

	//Router
	// Local state
	const [loginForm, setLoginForm] = useState({
		username: '',
		password: '',
	});

	const [alert, setAlert] = useState(null);

	const { username, password } = loginForm;
	const changeLoginForm = (e) => {
		setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
		setAlert(null);
	};
	const login = async (e) => {
		e.preventDefault();
		try {
			const loginData = await loginUser(loginForm);
			if (loginData.success) {
			} else {
				setAlert({ type: 'danger', message: loginData.message });
				setLoginForm({ username: '', password: '' });
				usernameRef.current.focus();
			}
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<>
			<Form className="my-4" onSubmit={login}>
				<Form.Group className="mb-3">
					<Form.Control
						type="text"
						placeholder="Username"
						name="username"
						required
						ref={usernameRef}
						value={username}
						onChange={changeLoginForm}
					/>
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Control
						type="password"
						placeholder="Password"
						name="password"
						required
						value={password}
						onChange={changeLoginForm}
					/>
				</Form.Group>
				<AlertMessage info={alert} />
				<Button variant="success" type="submit">
					Login
				</Button>
			</Form>
			<p>
				Don't have an account?
				<Link to="/register">
					<Button variant="info" size="sm" className="ml-2">
						Register
					</Button>
				</Link>
			</p>
		</>
	);
};

export default LoginForm;
