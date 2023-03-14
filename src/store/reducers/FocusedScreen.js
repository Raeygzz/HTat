import {FOCUSED_SCREEN, RESET_STORE} from '../actions/constant/ActionTypes';

const INITIAL_STATE = {
	isFocused: true,
};

const FocusedScreenReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case FOCUSED_SCREEN:
			return {
				...state,
				isFocused: action.payload,
			};

		case RESET_STORE:
			return {
				...state,
				isFocused: true,
			};

		default:
			return state;
	}
};

export default FocusedScreenReducer;
