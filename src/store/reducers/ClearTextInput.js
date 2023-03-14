import {CLEAR_TEXT_INPUT, RESET_STORE} from '../actions/constant/ActionTypes';

const INITIAL_STATE = {
	textInputClear: false,
};

const ClearTextInputReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case CLEAR_TEXT_INPUT:
			return {
				...state,
				textInputClear: action.payload ? action.payload : false,
			};

		case RESET_STORE:
			return {
				...state,
				textInputClear: false,
			};

		default:
			return state;
	}
};

export default ClearTextInputReducer;
