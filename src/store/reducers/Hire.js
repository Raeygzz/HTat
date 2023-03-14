import {
	HIRE_ITEM_BY_ID_GET_API_REQUEST,
	HIRE_ITEM_BY_ID_GET_API_SUCCESS,
	HIRE_ITEM_BY_ID_GET_API_FAILURE,
	//
	SHOULD_RUN_FUNCTION,
	//
	CALENDAR_HEADER_TITLE,
	//
	HIRE_ITEM_POST_API_REQUEST,
	HIRE_ITEM_POST_API_SUCCESS,
	HIRE_ITEM_POST_API_FAILURE,
	//
	HIRE_ITEM_PAYMENT_SUCCESS,
	//
	// PRESENT_HIRE_MAKE_PAYMENT_SCREEN_MODAL,
	// HIDE_HIRE_MAKE_PAYMENT_SCREEN_MODAL,
	//
	// CLEAR_HIRE_CALCULATED_DISTANCE,
	// CLEAR_COLLECTIONTYPE_PICKER_DEFAULT_VALUE,
	//
	FIND_DISTANCE_GET_API_REQUEST,
	FIND_DISTANCE_GET_API_SUCCESS,
	FIND_DISTANCE_GET_API_FAILURE,
	//
	HIRING_LIST_GET_API_REQUEST,
	HIRING_LIST_GET_API_SUCCESS,
	HIRING_LIST_GET_API_FAILURE,
	//
	HIRING_OUT_LIST_GET_API_REQUEST,
	HIRING_OUT_LIST_GET_API_SUCCESS,
	HIRING_OUT_LIST_GET_API_FAILURE,
	//
	HIRING_BY_ID_GET_API_REQUEST,
	HIRING_BY_ID_GET_API_SUCCESS,
	HIRING_BY_ID_GET_API_FAILURE,
	//
	PRESENT_HIRE_FILTER_SCREEN_MODAL,
	HIDE_HIRE_FILTER_SCREEN_MODAL,
	//
	HIRE_ITEM_PAYMENT_POST_API_REQUEST,
	HIRE_ITEM_PAYMENT_POST_API_SUCCESS,
	HIRE_ITEM_PAYMENT_POST_API_FAILURE,
	//
	HIRE_ITEM_STRIPE_PAYMENT_SUCCESS,
	//
	CANCEL_HIRING_POST_API_REQUEST,
	CANCEL_HIRING_POST_API_SUCCESS,
	CANCEL_HIRING_POST_API_FAILURE,
	//
	DAY_TO_PRICE_POST_API_REQUEST,
	DAY_TO_PRICE_POST_API_SUCCESS,
	DAY_TO_PRICE_POST_API_FAILURE,
	//
	RESET_ONLY_HIRE_BUY_STORE,
	//
	RESET_STORE,
} from '../actions/constant/ActionTypes';

const INITIAL_STATE = {
	singleHireItem: {},
	shouldRunFunction: false,
	hireItemErrorMessage: '',
	hireCalculatedDistance: '',
	clearCollectionTypePickerDefaultValue: false,
	calendarHeaderTitle: '',
	// itemHireSuccess: false,
	itemHireId: '',
	hireItemPaymentSuccess: false,
	hireItemStripeCostDetail: {},
	hireItemStripePaymentSuccess: false,
	// presentHireMakePaymentScreenModal: false,
	hiringList: [],
	hiringMeta: {},
	hiringLinks: {},
	hiringOnProfileVisible: true,
	hiringOutList: [],
	hiringOutMeta: {},
	hiringOutLinks: {},
	singleHiringItem: {},
	presentHireFilterScreenModal: false,
	numberOfDaysToPrice: '',
};

const HireReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case SHOULD_RUN_FUNCTION:
			return {
				...state,
				shouldRunFunction: action.payload,
			};

		case CALENDAR_HEADER_TITLE:
			return {
				...state,
				calendarHeaderTitle: action.payload,
			};

		case HIRE_ITEM_BY_ID_GET_API_REQUEST:
			return {
				...state,
			};

		case HIRE_ITEM_BY_ID_GET_API_SUCCESS:
			return {
				...state,
				singleHireItem: action.payload,
			};

		case HIRE_ITEM_BY_ID_GET_API_FAILURE:
			return {
				...state,
			};

		case HIRE_ITEM_POST_API_REQUEST:
			return {
				...state,
			};

		case HIRE_ITEM_POST_API_SUCCESS:
			return {
				...state,
				// itemHireSuccess: true,
				itemHireId: action.payload.item_hire_id,
			};

		case HIRE_ITEM_POST_API_FAILURE:
			return {
				...state,
				hireItemErrorMessage: action.payload,
			};

		case HIRE_ITEM_PAYMENT_SUCCESS:
			return {
				...state,
				hireItemPaymentSuccess: action.payload,
			};

		// case PRESENT_HIRE_MAKE_PAYMENT_SCREEN_MODAL:
		// 	return {
		// 		...state,
		// 		presentHireMakePaymentScreenModal: true,
		// 	};

		// case HIDE_HIRE_MAKE_PAYMENT_SCREEN_MODAL:
		// 	return {
		// 		...state,
		// 		presentHireMakePaymentScreenModal: false,
		// 	};

		case PRESENT_HIRE_FILTER_SCREEN_MODAL:
			return {
				...state,
				presentHireFilterScreenModal: true,
			};

		case HIDE_HIRE_FILTER_SCREEN_MODAL:
			return {
				...state,
				presentHireFilterScreenModal: false,
			};

		// case CLEAR_HIRE_CALCULATED_DISTANCE:
		// 	return {
		// 		...state,
		// 		hireCalculatedDistance: '',
		// 	};

		// case CLEAR_COLLECTIONTYPE_PICKER_DEFAULT_VALUE:
		// 	return {
		// 		...state,
		// 		clearCollectionTypePickerDefaultValue: action.payload,
		// 	};

		case FIND_DISTANCE_GET_API_REQUEST:
			return {
				...state,
			};

		case FIND_DISTANCE_GET_API_SUCCESS:
			return {
				...state,
				hireCalculatedDistance: action.payload,
			};

		case FIND_DISTANCE_GET_API_FAILURE:
			return {
				...state,
			};

		case HIRING_LIST_GET_API_REQUEST:
			return {
				...state,
			};

		case HIRING_LIST_GET_API_SUCCESS:
			return {
				...state,
				hiringMeta: action.payload.meta,
				hiringLinks: action.payload.links,
				hiringList:
					action.payload.meta.current_page === 1
						? action.payload.data
						: [...state.hiringList, ...action.payload.data],
				hiringOnProfileVisible: action.payload.hiringOnProfileVisible,
			};

		case HIRING_LIST_GET_API_FAILURE:
			return {
				...state,
			};

		case HIRING_OUT_LIST_GET_API_REQUEST:
			return {
				...state,
			};

		case HIRING_OUT_LIST_GET_API_SUCCESS:
			return {
				...state,
				hiringOutMeta: action.payload.meta,
				hiringOutLinks: action.payload.links,
				hiringOutList:
					action.payload.meta.current_page === 1
						? action.payload.data
						: [...state.hiringOutList, ...action.payload.data],
			};

		case HIRING_OUT_LIST_GET_API_FAILURE:
			return {
				...state,
			};

		case HIRING_BY_ID_GET_API_REQUEST:
			return {
				...state,
			};

		case HIRING_BY_ID_GET_API_SUCCESS:
			return {
				...state,
				singleHiringItem: action.payload,
			};

		case HIRING_BY_ID_GET_API_FAILURE:
			return {
				...state,
			};

		case HIRE_ITEM_PAYMENT_POST_API_REQUEST:
			return {
				...state,
			};

		case HIRE_ITEM_PAYMENT_POST_API_SUCCESS:
			return {
				...state,
				hireItemStripeCostDetail: action.payload,
			};

		case HIRE_ITEM_PAYMENT_POST_API_FAILURE:
			return {
				...state,
			};

		case HIRE_ITEM_STRIPE_PAYMENT_SUCCESS:
			return {
				...state,
				hireItemStripePaymentSuccess: action.payload,
			};

		case CANCEL_HIRING_POST_API_REQUEST:
			return {
				...state,
			};

		case CANCEL_HIRING_POST_API_SUCCESS:
			return {
				...state,
			};

		case CANCEL_HIRING_POST_API_FAILURE:
			return {
				...state,
			};

		case DAY_TO_PRICE_POST_API_REQUEST:
			return {
				...state,
			};

		case DAY_TO_PRICE_POST_API_SUCCESS:
			return {
				...state,
				numberOfDaysToPrice: action.payload,
			};

		case DAY_TO_PRICE_POST_API_FAILURE:
			return {
				...state,
			};

		case RESET_ONLY_HIRE_BUY_STORE:
			return {
				...state,
				singleHireItem: {},
				shouldRunFunction: false,
				hireItemErrorMessage: '',
				hireCalculatedDistance: '',
				clearCollectionTypePickerDefaultValue: false,
				calendarHeaderTitle: '',
				// itemHireSuccess: false,
				itemHireId: '',
				hireItemPaymentSuccess: false,
				hireItemStripeCostDetail: {},
				hireItemStripePaymentSuccess: false,
				// presentHireMakePaymentScreenModal: false,
				hiringList: [],
				hiringMeta: {},
				hiringLinks: {},
				hiringOnProfileVisible: true,
				hiringOutList: [],
				hiringOutMeta: {},
				hiringOutLinks: {},
				singleHiringItem: {},
				presentHireFilterScreenModal: false,
				numberOfDaysToPrice: '',
			};

		case RESET_STORE:
			return {
				...state,
				singleHireItem: {},
				shouldRunFunction: false,
				hireItemErrorMessage: '',
				hireCalculatedDistance: '',
				clearCollectionTypePickerDefaultValue: false,
				calendarHeaderTitle: '',
				// itemHireSuccess: false,
				itemHireId: '',
				hireItemPaymentSuccess: false,
				hireItemStripeCostDetail: {},
				hireItemStripePaymentSuccess: false,
				// presentHireMakePaymentScreenModal: false,
				hiringList: [],
				hiringMeta: {},
				hiringLinks: {},
				hiringOnProfileVisible: true,
				hiringOutList: [],
				hiringOutMeta: {},
				hiringOutLinks: {},
				singleHiringItem: {},
				presentHireFilterScreenModal: false,
				numberOfDaysToPrice: '',
			};

		default:
			return state;
	}
};

export default HireReducer;
