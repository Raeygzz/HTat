import {CLEAR_TEXT_INPUT, RESET_STORE} from './constant/ActionTypes';

export const clearTextInputReq = (req) => (dispatch) => {
	dispatch({
		type: CLEAR_TEXT_INPUT,
		payload: req,
	});
};

export const resetStore = () => {
	return {
		type: RESET_STORE,
	};
};
