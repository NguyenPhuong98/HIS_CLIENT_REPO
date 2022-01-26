import React from 'react';
import { Navigate } from 'react-router-dom';

const Landing = () => {
	return (
		<Navigate to="/login">
			<div>Landing</div>;
		</Navigate>
	);
};

export default Landing;
