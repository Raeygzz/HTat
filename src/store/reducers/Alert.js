import {
	PRESENT_ALERT,
	HIDE_ALERT,
	RESET_ONLY_ALERT_FROM_STORE,
	RESET_STORE,
} from '../actions/constant/ActionTypes';

const INITIAL_STATE = {
	presentAlert: false,
	data: null,
	modalTitle: '',
	modalMessage: '',
	showCancelButton: true,
	cancelButtonText: 'Cancel',
	okButtonText: 'Ok',
	shouldLogout: false,
	shouldNavigate: false,
	navigation: '',
	navigateTo: '',
	shouldRunFunction: false,
	shouldCallback: null,
	shouldCallback_2: null,
	functionHandler: '',
	cancelButtonFunctionHandler: '',
};

const ALertReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case PRESENT_ALERT:
			return {
				...state,
				presentAlert: true,

				data: action.payload.data != null ? action.payload.data : null,

				modalTitle: action.payload.title != '' ? action.payload.title : '',

				modalMessage:
					action.payload.message != '' ? action.payload.message : '',

				showCancelButton: action.payload.showCancelButton
					? action.payload.showCancelButton
					: false,

				cancelButtonText: action.payload.cancelButtonText
					? action.payload.cancelButtonText
					: 'Cancel',

				okButtonText: action.payload.okButtonText
					? action.payload.okButtonText
					: 'Ok',

				shouldLogout: action.payload.shouldLogout
					? action.payload.shouldLogout
					: false,

				shouldNavigate: action.payload.shouldNavigate
					? action.payload.shouldNavigate
					: false,

				navigation: action.payload.navigation ? action.payload.navigation : '',

				navigateTo: action.payload.navigateTo ? action.payload.navigateTo : '',

				shouldRunFunction: action.payload.shouldRunFunction
					? action.payload.shouldRunFunction
					: false,

				shouldCallback: action.payload.shouldCallback
					? action.payload.shouldCallback
					: null,

				shouldCallback_2: action.payload.shouldCallback_2
					? action.payload.shouldCallback_2
					: null,

				functionHandler: action.payload.functionHandler
					? action.payload.functionHandler
					: '',

				cancelButtonFunctionHandler: action.payload.cancelButtonFunctionHandler
					? action.payload.cancelButtonFunctionHandler
					: '',
			};

		case HIDE_ALERT:
			return {
				...state,
				presentAlert: false,
			};

		case RESET_ONLY_ALERT_FROM_STORE:
			return {
				...state,
				presentAlert: false,
				data: null,
				modalTitle: '',
				modalMessage: '',
				showCancelButton: true,
				cancelButtonText: 'Cancel',
				okButtonText: 'Ok',
				shouldLogout: false,
				shouldNavigate: false,
				navigation: '',
				navigateTo: '',
				shouldRunFunction: false,
				shouldCallback: null,
				shouldCallback_2: null,
				functionHandler: '',
				cancelButtonFunctionHandler: '',
			};

		case RESET_STORE:
			return {
				...state,
				presentAlert: false,
				data: null,
				modalTitle: '',
				modalMessage: '',
				showCancelButton: true,
				cancelButtonText: 'Cancel',
				okButtonText: 'Ok',
				shouldLogout: false,
				shouldNavigate: false,
				navigation: '',
				navigateTo: '',
				shouldRunFunction: false,
				shouldCallback: null,
				shouldCallback_2: null,
				functionHandler: '',
				cancelButtonFunctionHandler: '',
			};

		default:
			return state;
	}
};

export default ALertReducer;
