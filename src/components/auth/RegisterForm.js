import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { AlertMessage } from '../commons';
import { AuthContext } from '../../contexts/AuthContext';
const RegisterForm = () => {
	const { registerUser } = useContext(AuthContext);

	const [registerForm, setRegisterForm] = useState({
		username: '',
		password: '',
		confirmPassword: '',
	});

	const [alert, setAlert] = useState(null);

	const { username, password, confirmPassword } = registerForm;
	const changeRegisterForm = (e) => {
		setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
		setAlert(null);
	};

	const register = async (e) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			setAlert({ type: 'danger', message: 'Password not match' });
			return;
		}

		try {
			const registerData = await registerUser(registerForm);
			if (!registerData.success) {
				setAlert({ type: 'danger', message: registerData.message });
			}
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<>
			<Form className="my-4" onSubmit={register}>
				<Form.Group className="mb-3">
					<Form.Control
						type="text"
						placeholder="Username"
						name="username"
						required
						value={username}
						onChange={changeRegisterForm}
					/>
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Control
						type="password"
						placeholder="Password"
						name="password"
						required
						value={password}
						onChange={changeRegisterForm}
					/>
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Control
						type="password"
						placeholder="Confirm Password"
						name="confirmPassword"
						required
						value={confirmPassword}
						onChange={changeRegisterForm}
					/>
				</Form.Group>
				<AlertMessage info={alert} />
				<Button variant="success" type="submit">
					Register
				</Button>
			</Form>
			<p>
				Already have an account?
				<Link to="/login">
					<Button variant="info" size="sm" className="ml-2">
						Login
					</Button>
				</Link>
			</p>
		</>
	);
};

export default RegisterForm;
