import {
	ADD_CARD_WEBVIEW_GET_API_REQUEST,
	ADD_CARD_WEBVIEW_GET_API_SUCCESS,
	ADD_CARD_WEBVIEW_GET_API_FAILURE,
	//
	CLEAR_ADD_CARD_HTML,
	//
	LIST_USER_CARD_GET_API_REQUEST,
	LIST_USER_CARD_GET_API_SUCCESS,
	LIST_USER_CARD_GET_API_FAILURE,
	//
	//
	DEFAULT_CARD_POST_API_REQUEST,
	DEFAULT_CARD_POST_API_SUCCESS,
	DEFAULT_CARD_POST_API_FAILURE,
	//
	CARD_DELETE_DEFAULT_SUCCESS,
	//
	PRESENT_SAVED_CARD_SCREEN_MODAL,
	HIDE_SAVED_CARD_SCREEN_MODAL,
	//
	RESET_STORE,
} from '../actions/constant/ActionTypes';

const INITIAL_STATE = {
	addCardHtml: '',
	cardList: [],
	cardDetails: {},
	filteredCardList: [],
	cardDeleteDefaultSuccess: false,
	presentSavedCardPaymentScreenModal: false,
};

const UserCardReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ADD_CARD_WEBVIEW_GET_API_REQUEST:
			return {
				...state,
			};

		case ADD_CARD_WEBVIEW_GET_API_SUCCESS:
			return {
				...state,
				addCardHtml: action.payload,
			};

		case ADD_CARD_WEBVIEW_GET_API_FAILURE:
			return {
				...state,
			};

		case CLEAR_ADD_CARD_HTML:
			return {
				...state,
				addCardHtml: '',
			};

		case LIST_USER_CARD_GET_API_REQUEST:
			return {
				...state,
			};

		case LIST_USER_CARD_GET_API_SUCCESS:
			return {
				...state,
				cardList: action.payload?.cardList ? action.payload.cardList : [],
				cardDetails: action.payload?.cardDetails
					? action.payload.cardDetails
					: {},
				filteredCardList: action.payload?.filteredCardList
					? action.payload.filteredCardList
					: [],
			};

		case LIST_USER_CARD_GET_API_FAILURE:
			return {
				...state,
			};

		case DEFAULT_CARD_POST_API_REQUEST:
			return {
				...state,
			};

		case DEFAULT_CARD_POST_API_SUCCESS:
			return {
				...state,
			};

		case DEFAULT_CARD_POST_API_FAILURE:
			return {
				...state,
			};

		case CARD_DELETE_DEFAULT_SUCCESS:
			return {
				...state,
				cardDeleteDefaultSuccess: action.payload,
			};

		case PRESENT_SAVED_CARD_SCREEN_MODAL:
			return {
				...state,
				presentSavedCardPaymentScreenModal: true,
			};

		case HIDE_SAVED_CARD_SCREEN_MODAL:
			return {
				...state,
				presentSavedCardPaymentScreenModal: false,
			};

		case RESET_STORE:
			return {
				...state,
				addCardHtml: '',
				cardList: [],
				cardDetails: {},
				filteredCardList: [],
				cardDeleteDefaultSuccess: false,
				presentSavedCardPaymentScreenModal: false,
			};

		default:
			return state;
	}
};

export default UserCardReducer;
