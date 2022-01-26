import { DEPARTMENTS_LOADED_SUCCESS, ROOMS_LOADED_SUCCESS } from '../contexts/Constants';

export const listReducer = (state, action) => {
	const { type, payload } = action;

	switch (type) {
		case DEPARTMENTS_LOADED_SUCCESS:
			return {
				...state,
				departments: payload,
			};
		case ROOMS_LOADED_SUCCESS:
			return {
				...state,
				rooms: payload,
			};
		default:
			return state;
	}
};
