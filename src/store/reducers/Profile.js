import {
	PRESENT_ADDRESS_SCREEN_MODAL,
	HIDE_ADDRESS_SCREEN_MODAL,
	//
	ADDRESS_ADD_SUCCESS,
	//
	CREATE_ADDRESS_POST_API_REQUEST,
	CREATE_ADDRESS_POST_API_SUCCESS,
	CREATE_ADDRESS_POST_API_FAILURE,
	//
	USER_ONBOARDING_ADDRESS_POST_API_REQUEST,
	USER_ONBOARDING_ADDRESS_POST_API_SUCCESS,
	USER_ONBOARDING_ADDRESS_POST_API_FAILURE,
	//
	ADDRESS_PUT_API_REQUEST,
	ADDRESS_PUT_API_SUCCESS,
	ADDRESS_PUT_API_FAILURE,
	//
	ADDRESS_BY_ID_GET_API_REQUEST,
	ADDRESS_BY_ID_GET_API_SUCCESS,
	ADDRESS_BY_ID_GET_API_FAILURE,
	//
	ADDRESS_LIST_GET_API_REQUEST,
	ADDRESS_LIST_GET_API_SUCCESS,
	ADDRESS_LIST_GET_API_FAILURE,
	//
	ADDRESS_BY_ID_DELETE_API_REQUEST,
	ADDRESS_BY_ID_DELETE_API_SUCCESS,
	ADDRESS_BY_ID_DELETE_API_FAILURE,
	//
	ADDRESS_RESPONSE_MESSAGE,
	//
	RESET_STORE,
} from '../actions/constant/ActionTypes';

const INITIAL_STATE = {
	addressAddSuccess: false,
	addressList: [],
	addressPickerList: [],
	addressById: [],
	addressResponseMessage: '',
	presentAddressScreenModal: false,
};

const ProfileReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case PRESENT_ADDRESS_SCREEN_MODAL:
			return {
				...state,
				presentAddressScreenModal: true,
			};

		case HIDE_ADDRESS_SCREEN_MODAL:
			return {
				...state,
				presentAddressScreenModal: false,
			};

		// address add success
		case ADDRESS_ADD_SUCCESS:
			return {
				...state,
				addressAddSuccess: action.payload,
			};

		// create address
		case CREATE_ADDRESS_POST_API_REQUEST:
			return {
				...state,
			};

		case CREATE_ADDRESS_POST_API_SUCCESS:
			return {
				...state,
				addressAddSuccess: action.payload,
			};

		case CREATE_ADDRESS_POST_API_FAILURE:
			return {
				...state,
			};

		// user onboarding address
		case USER_ONBOARDING_ADDRESS_POST_API_REQUEST:
			return {
				...state,
			};

		case USER_ONBOARDING_ADDRESS_POST_API_SUCCESS:
			return {
				...state,
			};

		case USER_ONBOARDING_ADDRESS_POST_API_FAILURE:
			return {
				...state,
			};

		// update address
		case ADDRESS_PUT_API_REQUEST:
			return {
				...state,
			};

		case ADDRESS_PUT_API_SUCCESS:
			return {
				...state,
				addressAddSuccess: action.payload,
			};

		case ADDRESS_PUT_API_FAILURE:
			return {
				...state,
			};

		// address list
		case ADDRESS_LIST_GET_API_REQUEST:
			return {
				...state,
			};

		case ADDRESS_LIST_GET_API_SUCCESS:
			return {
				...state,
				addressList: action.payload.addressList,
				addressPickerList: action.payload.addressPickerList,
			};

		case ADDRESS_LIST_GET_API_FAILURE:
			return {
				...state,
			};

		// address by id
		case ADDRESS_BY_ID_GET_API_REQUEST:
			return {
				...state,
			};

		case ADDRESS_BY_ID_GET_API_SUCCESS:
			return {
				...state,
				addressById: action.payload,
			};

		case ADDRESS_BY_ID_GET_API_FAILURE:
			return {
				...state,
			};

		// delete address by id
		case ADDRESS_BY_ID_DELETE_API_REQUEST:
			return {
				...state,
			};

		case ADDRESS_BY_ID_DELETE_API_SUCCESS:
			return {
				...state,
				addressAddSuccess: action.payload,
			};

		case ADDRESS_BY_ID_DELETE_API_FAILURE:
			return {
				...state,
				addressResponseMessage: action.payload,
			};

		case ADDRESS_RESPONSE_MESSAGE:
			return {
				...state,
				addressResponseMessage: '',
			};

		// reset store
		case RESET_STORE:
			return {
				...state,
				addressAddSuccess: false,
				addressList: [],
				addressPickerList: [],
				addressById: [],
				addressResponseMessage: '',
				presentAddressScreenModal: false,
			};

		default:
			return state;
	}
};

export default ProfileReducer;
