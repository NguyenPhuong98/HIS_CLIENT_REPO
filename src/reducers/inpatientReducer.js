import {
	INPATIENTS_LOADED_SUCCESS,
	INPATIENTS_LOADED_FAIL,
	INPATIENT_FIND,
	COUPONCARES_LOADED_SUCCESS,
	COUPONCARES_LOADED_FAIL,
} from '../contexts/Constants';

export const inpatientReducer = (state, action) => {
	const { type, payload } = action;

	switch (type) {
		case INPATIENTS_LOADED_SUCCESS:
			return {
				...state,
				inpatients: payload,
				inpatientsLoading: false,
			};
		case INPATIENTS_LOADED_FAIL:
			return {
				...state,
				inpatients: [],
				inpatientsLoading: false,
			};
		case INPATIENT_FIND:
			return {
				...state,
				inpatient: payload,
			};
		case COUPONCARES_LOADED_SUCCESS:
			return {
				...state,
				inpatientCouponCares: payload,
			};
		case COUPONCARES_LOADED_FAIL:
			return {
				...state,
				inpatientCouponCares: [],
			};
		default:
			return state;
	}
};
