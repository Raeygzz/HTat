import {
	PRESENT_PHOTOS_SCREEN_MODAL,
	HIDE_PHOTOS_SCREEN_MODAL,
	//
	REMOVE_ADVERT_ERROR_MESSAGE,
	//
	CREATE_ADVERT_POST_API_REQUEST,
	CREATE_ADVERT_POST_API_SUCCESS,
	CREATE_ADVERT_POST_API_FAILURE,
	//
	UPDATE_ADVERT_POST_API_REQUEST,
	UPDATE_ADVERT_POST_API_SUCCESS,
	UPDATE_ADVERT_POST_API_FAILURE,
	//
	ADVERT_LIST_GET_API_REQUEST,
	ADVERT_LIST_GET_API_SUCCESS,
	ADVERT_LIST_GET_API_FAILURE,
	//
	ADVERT_BY_ID_GET_API_REQUEST,
	ADVERT_BY_ID_GET_API_SUCCESS,
	ADVERT_BY_ID_GET_API_FAILURE,
	//
	PAUSE_RESUME_POST_API_REQUEST,
	PAUSE_RESUME_POST_API_SUCCESS,
	PAUSE_RESUME_POST_API_FAILURE,
	//
	PRESENT_ADVERT_SCREEN_MODAL,
	HIDE_ADVERT_SCREEN_MODAL,
	//
	ADVERT_DELETE_SUCCESS,
	//
	ADVERT_DELETING_OBJECT,
	//
	ADVERT_BY_ID_DELETE_API_REQUEST,
	ADVERT_BY_ID_DELETE_API_SUCCESS,
	ADVERT_BY_ID_DELETE_API_FAILURE,
	//
	STORE_PHOTOS_POST_API_REQUEST,
	STORE_PHOTOS_POST_API_SUCCESS,
	STORE_PHOTOS_POST_API_FAILURE,
	//
	DELETE_PHOTO_SUCCESS,
	//
	PHOTO_DELETE_API_REQUEST,
	PHOTO_DELETE_API_SUCCESS,
	PHOTO_DELETE_API_FAILURE,
	//
	MAKE_CALENDAR_UNAVAILABLE_DATE_POST_API_REQUEST,
	MAKE_CALENDAR_UNAVAILABLE_DATE_POST_API_SUCCESS,
	MAKE_CALENDAR_UNAVAILABLE_DATE_POST_API_FAILURE,
	//
	CALENDAR_UNAVAILABLE_DATE_LIST_GET_API_REQUEST,
	CALENDAR_UNAVAILABLE_DATE_LIST_GET_API_SUCCESS,
	CALENDAR_UNAVAILABLE_DATE_LIST_GET_API_FAILURE,
	//
	CALENDAR_DATE_BY_ID_DELETE_API_REQUEST,
	CALENDAR_DATE_BY_ID_DELETE_API_SUCCESS,
	CALENDAR_DATE_BY_ID_DELETE_API_FAILURE,
	//
	RESET_ONLY_CALENDAR_FROM_STORE,
	//
	RESET_STORE,
} from '../actions/constant/ActionTypes';

const INITIAL_STATE = {
	advertList: [],
	advertMeta: {},
	advertLinks: {},
	advertOnProfileVisible: true,
	singleAdvert: {},
	mainImageErrorMessage: '',
	photosErrorMessage: '',
	lengthErrorMessage: '',
	widthErrorMessage: '',
	depthErrorMessage: '',
	// deliveryAvailableErrorMessage: '',
	subCategoryErrorMessage: '',
	deliveryChargeErrorMessage: '',
	perDayErrorMessage: '',
	perWeekErrorMessage: '',
	forSaleErrorMessage: '',
	deletePhotoSuccess: false,
	deleteAdvertSuccess: false,
	deletingAdvertObject: {},
	calendarUnavailableDateList: [],
	presentPhotosScreenModal: false,
	presentAdvertScreenModal: false,
};

const AdvertsReducer = (state = INITIAL_STATE, action) => {
	// console.log('action ==> ', action.payload);
	switch (action.type) {
		case PRESENT_PHOTOS_SCREEN_MODAL:
			return {
				...state,
				presentPhotosScreenModal: true,
			};

		case HIDE_PHOTOS_SCREEN_MODAL:
			return {
				...state,
				presentPhotosScreenModal: false,
			};

		case CREATE_ADVERT_POST_API_REQUEST:
			return {
				...state,
			};

		case CREATE_ADVERT_POST_API_SUCCESS:
			return {
				...state,
			};

		case CREATE_ADVERT_POST_API_FAILURE:
			return {
				...state,
				mainImageErrorMessage: action.payload?.main_image
					? action.payload?.main_image[0]
					: '',
				photosErrorMessage: action.payload?.photos
					? action.payload?.photos[0]
					: '',
				lengthErrorMessage: action.payload?.length_mm
					? action.payload?.length_mm[0]
					: '',
				widthErrorMessage: action.payload?.width_mm
					? action.payload?.width_mm[0]
					: '',
				depthErrorMessage: action.payload?.height_mm
					? action.payload?.height_mm[0]
					: '',
				// deliveryAvailableErrorMessage: action.payload?.is_for_delivery
				// 	? action.payload?.is_for_delivery[0]
				// 	: '',
				subCategoryErrorMessage: action.payload?.sub_category_id
					? action.payload?.sub_category_id[0]
					: '',
				deliveryChargeErrorMessage: action.payload?.delivery_charge_mile
					? action.payload?.delivery_charge_mile[0]
					: '',
				perDayErrorMessage: action.payload?.per_day_price
					? action.payload?.per_day_price[0]
					: '',
				perWeekErrorMessage: action.payload?.per_week_price
					? action.payload?.per_week_price[0]
					: '',
				forSaleErrorMessage: action.payload?.selling_price
					? action.payload?.selling_price[0]
					: '',
				// advertFailureResponse: action.payload,
			};

		case REMOVE_ADVERT_ERROR_MESSAGE:
			return {
				...state,
				mainImageErrorMessage: '',
				photosErrorMessage: '',
				lengthErrorMessage: '',
				widthErrorMessage: '',
				depthErrorMessage: '',
				// deliveryAvailableErrorMessage: '',
				subCategoryErrorMessage: '',
				deliveryChargeErrorMessage: '',
				perDayErrorMessage: '',
				perWeekErrorMessage: '',
				forSaleErrorMessage: '',
			};

		case UPDATE_ADVERT_POST_API_REQUEST:
			return {
				...state,
			};

		case UPDATE_ADVERT_POST_API_SUCCESS:
			return {
				...state,
			};

		case UPDATE_ADVERT_POST_API_FAILURE:
			return {
				...state,
				mainImageErrorMessage: action.payload?.main_image
					? action.payload?.main_image[0]
					: '',
				lengthErrorMessage: action.payload?.length_mm
					? action.payload?.length_mm[0]
					: '',
				widthErrorMessage: action.payload?.width_mm
					? action.payload?.width_mm[0]
					: '',
				depthErrorMessage: action.payload?.height_mm
					? action.payload?.height_mm[0]
					: '',
				// deliveryAvailableErrorMessage: action.payload?.is_for_delivery
				// 	? action.payload?.is_for_delivery[0]
				// 	: '',
				subCategoryErrorMessage: action.payload?.sub_category_id
					? action.payload?.sub_category_id[0]
					: '',
				deliveryChargeErrorMessage: action.payload?.delivery_charge_mile
					? action.payload?.delivery_charge_mile[0]
					: '',
				perDayErrorMessage: action.payload?.per_day_price
					? action.payload?.per_day_price[0]
					: '',
				perWeekErrorMessage: action.payload?.per_week_price
					? action.payload?.per_week_price[0]
					: '',
				forSaleErrorMessage: action.payload?.selling_price
					? action.payload?.selling_price[0]
					: '',
			};

		case ADVERT_LIST_GET_API_REQUEST:
			return {
				...state,
			};

		case ADVERT_LIST_GET_API_SUCCESS:
			return {
				...state,
				advertMeta: action.payload.meta,
				advertLinks: action.payload.links,
				advertList:
					action.payload.meta.current_page === 1
						? action.payload.data
						: [...state.advertList, ...action.payload.data],
				advertOnProfileVisible: action.payload.advertOnProfileVisible,
			};

		case ADVERT_LIST_GET_API_FAILURE:
			return {
				...state,
			};

		case ADVERT_BY_ID_GET_API_REQUEST:
			return {
				...state,
			};

		case ADVERT_BY_ID_GET_API_SUCCESS:
			return {
				...state,
				singleAdvert: action.payload,
			};

		case ADVERT_BY_ID_GET_API_FAILURE:
			return {
				...state,
			};

		case PAUSE_RESUME_POST_API_REQUEST:
			return {
				...state,
			};

		case PAUSE_RESUME_POST_API_SUCCESS:
			return {
				...state,
			};

		case PAUSE_RESUME_POST_API_FAILURE:
			return {
				...state,
			};

		case PRESENT_ADVERT_SCREEN_MODAL:
			return {
				...state,
				presentAdvertScreenModal: true,
			};

		case HIDE_ADVERT_SCREEN_MODAL:
			return {
				...state,
				presentAdvertScreenModal: false,
			};

		case ADVERT_DELETE_SUCCESS:
			return {
				...state,
				deleteAdvertSuccess: action.payload,
			};

		case ADVERT_DELETING_OBJECT:
			return {
				...state,
				deletingAdvertObject: action.payload,
			};

		case ADVERT_BY_ID_DELETE_API_REQUEST:
			return {
				...state,
			};

		case ADVERT_BY_ID_DELETE_API_SUCCESS:
			return {
				...state,
			};

		case ADVERT_BY_ID_DELETE_API_FAILURE:
			return {
				...state,
			};

		case STORE_PHOTOS_POST_API_REQUEST:
			return {
				...state,
			};

		case STORE_PHOTOS_POST_API_SUCCESS:
			return {
				...state,
			};

		case STORE_PHOTOS_POST_API_FAILURE:
			return {
				...state,
			};

		case DELETE_PHOTO_SUCCESS:
			return {
				...state,
				deletePhotoSuccess: action.payload,
			};

		case PHOTO_DELETE_API_REQUEST:
			return {
				...state,
			};

		case PHOTO_DELETE_API_SUCCESS:
			return {
				...state,
			};

		case PHOTO_DELETE_API_FAILURE:
			return {
				...state,
			};

		case MAKE_CALENDAR_UNAVAILABLE_DATE_POST_API_REQUEST:
			return {
				...state,
			};

		case MAKE_CALENDAR_UNAVAILABLE_DATE_POST_API_SUCCESS:
			return {
				...state,
			};

		case MAKE_CALENDAR_UNAVAILABLE_DATE_POST_API_FAILURE:
			return {
				...state,
			};

		case CALENDAR_UNAVAILABLE_DATE_LIST_GET_API_REQUEST:
			return {
				...state,
			};

		case CALENDAR_UNAVAILABLE_DATE_LIST_GET_API_SUCCESS:
			return {
				...state,
				calendarUnavailableDateList:
					action.payload.length > 0 ? action.payload : [],
			};

		case CALENDAR_UNAVAILABLE_DATE_LIST_GET_API_FAILURE:
			return {
				...state,
			};

		case CALENDAR_DATE_BY_ID_DELETE_API_REQUEST:
			return {
				...state,
			};

		case CALENDAR_DATE_BY_ID_DELETE_API_SUCCESS:
			return {
				...state,
			};

		case CALENDAR_DATE_BY_ID_DELETE_API_FAILURE:
			return {
				...state,
			};

		case RESET_ONLY_CALENDAR_FROM_STORE:
			return {
				...state,
				calendarUnavailableDateList: [],
			};

		case RESET_STORE:
			return {
				...state,
				advertList: [],
				advertMeta: {},
				advertLinks: {},
				advertOnProfileVisible: true,
				singleAdvert: {},
				mainImageErrorMessage: '',
				photosErrorMessage: '',
				lengthErrorMessage: '',
				widthErrorMessage: '',
				depthErrorMessage: '',
				// deliveryAvailableErrorMessage: '',
				subCategoryErrorMessage: '',
				deliveryChargeErrorMessage: '',
				perDayErrorMessage: '',
				perWeekErrorMessage: '',
				forSaleErrorMessage: '',
				deletePhotoSuccess: false,
				deleteAdvertSuccess: false,
				deletingAdvertObject: {},
				calendarUnavailableDateList: [],
				presentPhotosScreenModal: false,
				presentAdvertScreenModal: false,
			};

		default:
			return state;
	}
};

export default AdvertsReducer;
