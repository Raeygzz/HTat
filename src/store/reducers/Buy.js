import {
	BUY_ITEM_POST_API_REQUEST,
	BUY_ITEM_POST_API_SUCCESS,
	BUY_ITEM_POST_API_FAILURE,
	//
	BUY_ITEM_PAYMENT_SUCCESS,
	//
	BUY_ITEM_PAYMENT_POST_API_REQUEST,
	BUY_ITEM_PAYMENT_POST_API_SUCCESS,
	BUY_ITEM_PAYMENT_POST_API_FAILURE,
	//
	RESET_ONLY_HIRE_BUY_STORE,
	//
	SEND_EMAIL_POST_API_REQUEST,
	SEND_EMAIL_POST_API_SUCCESS,
	SEND_EMAIL_POST_API_FAILURE,
	//
	RESET_STORE,
} from '../actions/constant/ActionTypes';

const INITIAL_STATE = {
	itemBuyId: '',
	buyItemPaymentSuccess: false,
};

const BuyReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case BUY_ITEM_POST_API_REQUEST:
			return {
				...state,
			};

		case BUY_ITEM_POST_API_SUCCESS:
			return {
				...state,
				itemBuyId: action.payload.item_buy_id,
			};

		case BUY_ITEM_POST_API_FAILURE:
			return {
				...state,
			};

		case BUY_ITEM_PAYMENT_SUCCESS:
			return {
				...state,
				buyItemPaymentSuccess: action.payload,
			};

		case BUY_ITEM_PAYMENT_POST_API_REQUEST:
			return {
				...state,
			};

		case BUY_ITEM_PAYMENT_POST_API_SUCCESS:
			return {
				...state,
			};

		case BUY_ITEM_PAYMENT_POST_API_FAILURE:
			return {
				...state,
			};

		case RESET_ONLY_HIRE_BUY_STORE:
			return {
				...state,
				itemBuyId: '',
				buyItemPaymentSuccess: false,
			};

		case SEND_EMAIL_POST_API_REQUEST:
			return {
				...state,
			};

		case SEND_EMAIL_POST_API_SUCCESS:
			return {
				...state,
			};

		case SEND_EMAIL_POST_API_FAILURE:
			return {
				...state,
			};

		case RESET_STORE:
			return {
				...state,
				itemBuyId: '',
				buyItemPaymentSuccess: false,
			};

		default:
			return state;
	}
};

export default BuyReducer;
