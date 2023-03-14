import {SET_ERROR, RESET_STORE} from '../actions/constant/ActionTypes';

const INITIAL_STATE = {
	message: '',
	showError: false,
};

const ErrorReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case SET_ERROR:
			return {
				...state,
				message: action.payload.message,
				showError: action.payload.showError ? action.payload.showError : false,
			};

		case RESET_STORE:
			return {
				...state,
				message: '',
				showError: false,
			};

		default:
			return state;
	}
};

export default ErrorReducer;
