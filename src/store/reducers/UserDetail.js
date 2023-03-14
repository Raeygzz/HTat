import {
	USER_DETAIL_GET_API_REQUEST,
	USER_DETAIL_GET_API_SUCCESS,
	USER_DETAIL_GET_API_FAILURE,
	//
	PRESENT_USER_DETAIL_SCREEN_MODAL,
	HIDE_USER_DETAIL_SCREEN_MODAL,
	//
	USER_DETAIL_PUT_API_REQUEST,
	USER_DETAIL_PUT_API_SUCCESS,
	USER_DETAIL_PUT_API_FAILURE,
	//
	RESET_STORE,
} from '../actions/constant/ActionTypes';

const INITIAL_STATE = {
	email: '',
	cc_emails: '',
	first_name: '',
	last_name: '',
	completedStripeOnboarding: 0,
	presentUserDetailScreenModal: false,
};

const UserDetailReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case USER_DETAIL_GET_API_REQUEST:
			return {
				...state,
			};

		case USER_DETAIL_GET_API_SUCCESS:
			return {
				...state,
				email: action.payload.email ? action.payload.email : '',
				cc_emails: action.payload.cc_emails ? action.payload.cc_emails : '',
				first_name: action.payload.first_name ? action.payload.first_name : '',
				last_name: action.payload.last_name ? action.payload.last_name : '',
				completedStripeOnboarding: action.payload.completed_stripe_onboarding,
			};

		case USER_DETAIL_GET_API_FAILURE:
			return {
				...state,
			};

		case PRESENT_USER_DETAIL_SCREEN_MODAL:
			return {
				...state,
				presentUserDetailScreenModal: true,
			};

		case HIDE_USER_DETAIL_SCREEN_MODAL:
			return {
				...state,
				presentUserDetailScreenModal: false,
			};

		case USER_DETAIL_PUT_API_REQUEST:
			return {
				...state,
			};

		case USER_DETAIL_PUT_API_SUCCESS:
			return {
				...state,
			};

		case USER_DETAIL_PUT_API_FAILURE:
			return {
				...state,
			};

		case RESET_STORE:
			return {
				...state,
				email: '',
				cc_emails: '',
				first_name: '',
				last_name: '',
				completedStripeOnboarding: 0,
				presentUserDetailScreenModal: false,
			};

		default:
			return state;
	}
};

export default UserDetailReducer;
