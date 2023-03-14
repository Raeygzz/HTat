import {
	APPLE_REGISTRATION_POST_API_REQUEST,
	APPLE_REGISTRATION_POST_API_SUCCESS,
	APPLE_REGISTRATION_POST_API_FAILURE,
	//
	FACEBOOK_REGISTRATION_POST_API_REQUEST,
	FACEBOOK_REGISTRATION_POST_API_SUCCESS,
	FACEBOOK_REGISTRATION_POST_API_FAILURE,
	//
	REGISTER_POST_API_REQUEST,
	REGISTER_POST_API_SUCCESS,
	REGISTER_POST_API_FAILURE,
	//
	PRESENT_SOCIAL_MEDIA_TERMS_POLICIES,
	HIDE_SOCIAL_MEDIA_TERMS_POLICIES,
	//
	RESET_STORE,
} from '../actions/constant/ActionTypes';

const INITIAL_STATE = {
	presentSocialMediaTermsPolicies: false,
};

const RegisterEmailReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case PRESENT_SOCIAL_MEDIA_TERMS_POLICIES:
			return {
				...state,
				presentSocialMediaTermsPolicies: true,
			};

		case HIDE_SOCIAL_MEDIA_TERMS_POLICIES:
			return {
				...state,
				presentSocialMediaTermsPolicies: false,
			};

		case APPLE_REGISTRATION_POST_API_REQUEST:
			return {
				...state,
			};

		case APPLE_REGISTRATION_POST_API_SUCCESS:
			return {
				...state,
			};

		case APPLE_REGISTRATION_POST_API_FAILURE:
			return {
				...state,
			};

		case FACEBOOK_REGISTRATION_POST_API_REQUEST:
			return {
				...state,
			};

		case FACEBOOK_REGISTRATION_POST_API_SUCCESS:
			return {
				...state,
			};

		case FACEBOOK_REGISTRATION_POST_API_FAILURE:
			return {
				...state,
			};

		case REGISTER_POST_API_REQUEST:
			return {
				...state,
			};

		case REGISTER_POST_API_SUCCESS:
			return {
				...state,
			};

		case REGISTER_POST_API_FAILURE:
			return {
				...state,
			};

		case RESET_STORE:
			return {
				...state,
				presentSocialMediaTermsPolicies: false,
			};

		default:
			return state;
	}
};

export default RegisterEmailReducer;
