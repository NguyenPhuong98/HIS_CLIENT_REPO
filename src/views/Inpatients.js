import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { SearchForm } from '../components/commons';
import { InpatientContext } from '../contexts/InpatientContext';
import { AuthContext } from '../contexts/AuthContext';
import InpatientsTable from '../components/inpatients/InpatientsTable';
import { apiUrl } from '../contexts/Constants';
import { DatetimeToString } from '../utils/commons';

const Inpatients = () => {
	let body;
	const { searchFormState, Child } = SearchForm();
	const [inpatientsSearch, setInpatientsSearch] = useState([]);
	const { department, room, patientStatus, patientType, BANumber, dateFrom, dateTo, date } = searchFormState;
	const {
		authState: {
			user: { username },
		},
	} = useContext(AuthContext);
	//Contexts
	const {
		inpatientState: { inpatient, inpatients, inpatientsLoading },
		getInpatients,
	} = useContext(InpatientContext);

	console.log(searchFormState);
	const searchFilter = async () => {
		try {
			const response = await axios.get(
				`${apiUrl}/inpatients/search?department=${department}&room=${room}&patientStatus=${patientStatus}&patientType=${patientType}&BANumber=${BANumber}&dateFrom=${DatetimeToString(
					dateFrom
				)}&dateTo=${DatetimeToString(dateTo)}&date=${DatetimeToString(date)}`
			);
			if (response.data.success) setInpatientsSearch(response.data.inpatients);
		} catch (error) {
			console.log(error);
		}
	};

	const handleSearch = () => {
		searchFilter();
	};
	if (inpatientsLoading) {
		body = (
			<div className="spinner-container">
				<Spinner variant="info" animation="border"></Spinner>
			</div>
		);
	}
	// else if (inpatients.length === 0) {
	// 	body = (
	// 		<>
	// 			<Card className="text-center mx-5 my-5">
	// 				<Card.Header as="h1">Hi {username}</Card.Header>
	// 				<Card.Body>
	// 					<Card.Title>Welcome to learnIt</Card.Title>
	// 					<Card.Text>Click the button below to track your first skill to learn</Card.Text>
	// 				</Card.Body>
	// 			</Card>
	// 		</>
	// 	);
	// }
	else {
		body = (
			<>
				<div className="main text-dark">
					{Child}
					<Button onClick={handleSearch} className="btn-search-inpatient">
						<FontAwesomeIcon icon={faSearch} />
						Tra tìm
					</Button>
					<InpatientsTable inpatientList={inpatientsSearch} />
				</div>

				{/* <Row className="row-cols-1 row-cols-md-3 g-4 mx-auto mt-3">
					{inpatient.map((inpatient, index) => {
						return (
							
						);
					})}
				</Row> */}

				{/* Open Add Post Modal */}
				{/* <OverlayTrigger placement="left" overlay={<Tooltip>Add new thing to learn</Tooltip>}>
					<Button className="btn-floating" variant="Link" onClick={setShowPostModal.bind(this, true)}>
						<img src={addIcon} alt="add" width="60" height="60" />
					</Button>
				</OverlayTrigger> */}
			</>
		);
	}

	return (
		<>
			{body}
			{/* <AddPostModal />
			{post !== null && <UpdatePostModal />} */}
			{/* After post is added, show toast */}
			{/* <Toast
				show={show}
				style={{ position: 'fixed', top: '20%', right: '10px' }}
				className={`bg-${type} text-white`}
				onClose={setShowToast.bind(this, {
					show: false,
					message: '',
					type: null,
				})}
				delay={3000}
				autohide
			>
				<Toast.Body>
					<strong>{message}</strong>
				</Toast.Body>
			</Toast> */}
		</>
	);
};

export default Inpatients;
