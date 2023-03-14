import {SET_ERROR, RESET_STORE} from './constant/ActionTypes';

export const setError = (error) => (dispatch) => {
	dispatch({
		type: SET_ERROR,
		payload: error,
	});
};

export const resetStore = () => {
	return {
		type: RESET_STORE,
	};
};
