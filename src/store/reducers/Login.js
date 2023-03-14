import {
	LOGIN_POST_API_REQUEST,
	LOGIN_POST_API_SUCCESS,
	LOGIN_POST_API_FAILURE,
	FORGOT_PASSWORD_POST_API_REQUEST,
	FORGOT_PASSWORD_POST_API_SUCCESS,
	FORGOT_PASSWORD_POST_API_FAILURE,
} from '../actions/constant/ActionTypes';

const INITIAL_STATE = {};

const LoginReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case LOGIN_POST_API_REQUEST:
			return {
				...state,
			};

		case LOGIN_POST_API_SUCCESS:
			return {
				...state,
			};

		case LOGIN_POST_API_FAILURE:
			return {
				...state,
			};

		case FORGOT_PASSWORD_POST_API_REQUEST:
			return {
				...state,
			};

		case FORGOT_PASSWORD_POST_API_SUCCESS:
			return {
				...state,
			};

		case FORGOT_PASSWORD_POST_API_FAILURE:
			return {
				...state,
			};

		default:
			return state;
	}
};

export default LoginReducer;
