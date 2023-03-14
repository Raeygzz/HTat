import {
	BUSINESS_PROFILE_GET_API_REQUEST,
	BUSINESS_PROFILE_GET_API_SUCCESS,
	BUSINESS_PROFILE_GET_API_FAILURE,
	//
	BUSINESS_PROFILE_POST_API_REQUEST,
	BUSINESS_PROFILE_POST_API_SUCCESS,
	BUSINESS_PROFILE_POST_API_FAILURE,
	//
	STRIPE_CONNECT_GET_API_REQUEST,
	STRIPE_CONNECT_GET_API_SUCCESS,
	STRIPE_CONNECT_GET_API_FAILURE,
	//
	PRESENT_STRIPE_REVIEW_DETAIL_SCREEN_MODAL,
	HIDE_STRIPE_REVIEW_DETAIL_SCREEN_MODAL,
	//
	STRIPE_BALANCE_GET_API_REQUEST,
	STRIPE_BALANCE_GET_API_SUCCESS,
	STRIPE_BALANCE_GET_API_FAILURE,
	//
	RESET_STORE,
} from '../actions/constant/ActionTypes';

const INITIAL_STATE = {
	businessProfileDetails: [],
	redirectUrl: '',
	stripeConnectOrLoginStatus: false,
	presentStripeReviewDetail: false,
	stripeBalance: {available_balance: 0, pending_balance: 0},
};

const SettingsReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case BUSINESS_PROFILE_GET_API_REQUEST:
			return {
				...state,
			};

		case BUSINESS_PROFILE_GET_API_SUCCESS:
			return {
				...state,
				businessProfileDetails: action.payload,
			};

		case BUSINESS_PROFILE_GET_API_FAILURE:
			return {
				...state,
			};

		case BUSINESS_PROFILE_POST_API_REQUEST:
			return {
				...state,
			};

		case BUSINESS_PROFILE_POST_API_SUCCESS:
			return {
				...state,
			};

		case BUSINESS_PROFILE_POST_API_FAILURE:
			return {
				...state,
			};

		case STRIPE_CONNECT_GET_API_REQUEST:
			return {
				...state,
				stripeConnectOrLoginStatus: true,
			};

		case STRIPE_CONNECT_GET_API_SUCCESS:
			return {
				...state,
				stripeConnectOrLoginStatus: false,
				redirectUrl: action.payload.redirect_url,
			};

		case STRIPE_CONNECT_GET_API_FAILURE:
			return {
				...state,
			};

		case PRESENT_STRIPE_REVIEW_DETAIL_SCREEN_MODAL:
			return {
				...state,
				presentStripeReviewDetail: true,
			};

		case HIDE_STRIPE_REVIEW_DETAIL_SCREEN_MODAL:
			return {
				...state,
				presentStripeReviewDetail: false,
			};

		case STRIPE_BALANCE_GET_API_REQUEST:
			return {
				...state,
			};

		case STRIPE_BALANCE_GET_API_SUCCESS:
			return {
				...state,
				stripeBalance: action.payload,
			};

		case STRIPE_BALANCE_GET_API_FAILURE:
			return {
				...state,
			};

		case RESET_STORE:
			return {
				...state,
				businessProfileDetails: [],
				redirectUrl: '',
				stripeConnectOrLoginStatus: false,
				presentStripeReviewDetail: false,
				stripeBalance: {available_balance: 0, pending_balance: 0},
			};

		default:
			return state;
	}
};

export default SettingsReducer;
