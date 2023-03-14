import {SET_SUCCESS, RESET_STORE} from '../actions/constant/ActionTypes';

const INITIAL_STATE = {
	message: '',
	showSuccess: false,
};

const SuccessReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case SET_SUCCESS:
			return {
				...state,
				message: action.payload.message,
				showSuccess: action.payload.showSuccess
					? action.payload.showSuccess
					: false,
			};

		case RESET_STORE:
			return {
				...state,
				message: '',
				showSuccess: false,
			};

		default:
			return state;
	}
};

export default SuccessReducer;
