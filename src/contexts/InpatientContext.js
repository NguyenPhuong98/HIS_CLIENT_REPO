import { createContext, useReducer, useState, useEffect } from 'react';
import axios from 'axios';
import { inpatientReducer } from '../reducers/inpatientReducer';
import {
	apiUrl,
	INPATIENTS_LOADED_SUCCESS,
	INPATIENTS_LOADED_FAIL,
	INPATIENT_FIND,
	COUPONCARES_LOADED_SUCCESS,
	COUPONCARES_LOADED_FAIL,
} from './Constants';

export const InpatientContext = createContext();

const InpatientContextProvider = ({ children }) => {
	//States
	const [inpatientState, dispatch] = useReducer(inpatientReducer, {
		inpatient: null,
		inpatients: [],
		inpatientsLoading: true,
		inpatientCouponCares: [],
	});

	// Get All post
	const getInpatients = async () => {
		try {
			const response = await axios.get(`${apiUrl}/inpatients`);
			if (response.data.success) {
				dispatch({
					type: INPATIENTS_LOADED_SUCCESS,
					payload: response.data.patients,
				});
			}
		} catch (error) {
			dispatch({ type: INPATIENTS_LOADED_FAIL });
		}
	};

	const getInpatientByMaBA = async (baNumber) => {
		try {
			const response = await axios.get(`${apiUrl}/inpatients/${baNumber}`);
			if (response.data.success) {
				dispatch({
					type: INPATIENT_FIND,
					payload: response.data.patient,
				});
			}
			// return response.data.patient;
		} catch (error) {
			console.error(error);
		}
	};

	const getInpatientCouponCares = async (baNumber) => {
		try {
			const response = await axios.get(`${apiUrl}/inpatients/${baNumber}/couponcare`);
			console.log(response.data.couponCares);
			if (response.data.success) {
				dispatch({
					type: COUPONCARES_LOADED_SUCCESS,
					payload: response.data.couponCares,
				});
			}
		} catch (error) {
			dispatch({ type: COUPONCARES_LOADED_FAIL });
		}
	};

	const inpatientContextData = {
		inpatientState,
		getInpatients,
		getInpatientByMaBA,
		getInpatientCouponCares,
	};
	return <InpatientContext.Provider value={inpatientContextData}> {children}</InpatientContext.Provider>;
};

export default InpatientContextProvider;
