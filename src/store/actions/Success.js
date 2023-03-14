import {SET_SUCCESS, RESET_STORE} from './constant/ActionTypes';

export const setSuccess = (success) => (dispatch) => {
	dispatch({
		type: SET_SUCCESS,
		payload: success,
	});
};

export const resetStore = () => {
	return {
		type: RESET_STORE,
	};
};
