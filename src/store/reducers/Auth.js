import {
	// FORCE_UPDATE_GET_API_REQUEST,
	// FORCE_UPDATE_GET_API_SUCCESS,
	// FORCE_UPDATE_GET_API_FAILURE,
	//
	SET_SPLASH,
	//
	SET_USER,
	//
	SET_TOKEN,
	//
	SET_USER_ONBOARDING_SCREEN,
	//
	SHOW_USER_ONBOARDING_SCREEN,
	//
	ACCOUNT_DELETE_API_REQUEST,
	ACCOUNT_DELETE_API_SUCCESS,
	ACCOUNT_DELETE_API_FAILURE,
	//
	RESET_STORE,
} from '../actions/constant/ActionTypes';

const INITIAL_STATE = {
	forceUpdateFlag: false,
	// activateCheckUpdateNeededFunction: null,
	splashLoading: true,
	accessToken: '',
	id: '',
	user: '',
	loginDateTime: '',
	isAuthenticated: false,
	showUserOnboardingScreen: false,
	removeMyAccountButtonDisabled: false,
};

const AuthReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case SET_SPLASH:
			return {
				...state,
				splashLoading: action.payload,
			};

		case SET_USER:
			return {
				...state,
				user: action.payload.user ? action.payload.user : '',
				id: action.payload.user.id ? action.payload.user.id : '',
				loginDateTime: new Date(),
			};

		case SET_USER_ONBOARDING_SCREEN:
			return {
				...state,
				showUserOnboardingScreen: action.payload.showUserOnboardingScreen,
			};

		case SHOW_USER_ONBOARDING_SCREEN:
			return {
				...state,
				showUserOnboardingScreen: action.payload,
			};

		case SET_TOKEN:
			return {
				...state,
				accessToken: action.payload,
				isAuthenticated: true,
			};

		// case FORCE_UPDATE_GET_API_REQUEST:
		// 	return {
		// 		...state,
		// 	};

		// case FORCE_UPDATE_GET_API_SUCCESS:
		// 	return {
		// 		...state,
		// 		forceUpdateFlag: action.payload,
		// 		// activateCheckUpdateNeededFunction: true,
		// 	};

		// case FORCE_UPDATE_GET_API_FAILURE:
		// 	return {
		// 		...state,
		// 		// activateCheckUpdateNeededFunction: true,
		// 	};

		case ACCOUNT_DELETE_API_REQUEST:
			return {
				...state,
				removeMyAccountButtonDisabled: true,
			};

		case ACCOUNT_DELETE_API_SUCCESS:
			return {
				...state,
				removeMyAccountButtonDisabled: false,
			};

		case ACCOUNT_DELETE_API_FAILURE:
			return {
				...state,
				removeMyAccountButtonDisabled: false,
			};

		case RESET_STORE:
			return {
				...state,
				forceUpdateFlag: false,
				// activateCheckUpdateNeededFunction: null,
				splashLoading: true,
				accessToken: '',
				id: '',
				user: '',
				loginDateTime: '',
				isAuthenticated: false,
				showUserOnboardingScreen: false,
				removeMyAccountButtonDisabled: false,
			};

		default:
			return state;
	}
};

export default AuthReducer;
