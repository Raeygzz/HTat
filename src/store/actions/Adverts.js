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
} from './constant/ActionTypes';

import analytics from '@react-native-firebase/analytics';

import {presentAlert} from './Alert';
import {clearTextInputReq} from './ClearTextInput';
import {presentLoader, hideLoader} from './Loader';
import {resetNavigationRoutes} from './ResetNavigation';

import * as api from '../../services/axios/Api';

// Reset only calendar from store
export const resetOnlyCalendarFromStore = () => {
	return {
		type: RESET_ONLY_CALENDAR_FROM_STORE,
	};
};

// Reset store
export const resetStore = () => {
	return {
		type: RESET_STORE,
	};
};

// Advert screen modal
export const presentAdvertScreenModal = () => {
	return {
		type: PRESENT_ADVERT_SCREEN_MODAL,
	};
};

export const hideAdvertScreenModal = () => {
	return {
		type: HIDE_ADVERT_SCREEN_MODAL,
	};
};

// Photos screen modal
export const presentPhotosScreenModal = () => {
	return {
		type: PRESENT_PHOTOS_SCREEN_MODAL,
	};
};

export const hidePhotosScreenModal = () => {
	return {
		type: HIDE_PHOTOS_SCREEN_MODAL,
	};
};

// remove advert error message
export const removeAdvertErrorMessage = () => {
	return {
		type: REMOVE_ADVERT_ERROR_MESSAGE,
	};
};

// advert delete success
export const advertDeleteSuccess = (deleteAdvert) => {
	return {
		type: ADVERT_DELETE_SUCCESS,
		payload: deleteAdvert,
	};
};

// advert deleting object
export const advertDeletingObject = (deleteAdvertObj) => {
	return {
		type: ADVERT_DELETING_OBJECT,
		payload: deleteAdvertObj,
	};
};

// photo delete success
export const photoDeleteSuccess = (photoDelete) => {
	return {
		type: DELETE_PHOTO_SUCCESS,
		payload: photoDelete,
	};
};

// POST / PUT / GET / DELETE  adverts api
const advertsApiRequestAction = (type) => (dispatch) => {
	dispatch({
		type: type,
	});

	if (
		// type !== 'CREATE_ADVERT_POST_API_REQUEST' &&
		// type !== 'UPDATE_ADVERT_POST_API_REQUEST' &&
		type !== 'MAKE_CALENDAR_UNAVAILABLE_DATE_POST_API_REQUEST' &&
		type !== 'CALENDAR_DATE_BY_ID_DELETE_API_REQUEST' &&
		type !== 'ADVERT_LIST_GET_API_REQUEST' &&
		type !== 'PAUSE_RESUME_POST_API_REQUEST' &&
		type !== 'ADVERT_BY_ID_DELETE_API_REQUEST'
	) {
		dispatch(presentLoader());
	}
};

const advertsApiSuccessAction = (
	type,
	advertsSuccess,
	navigation,
	param,
	prevScreen,
) => (dispatch, getState) => {
	dispatch({
		type: type,
		payload: advertsSuccess,
	});

	if (type === 'CREATE_ADVERT_POST_API_SUCCESS') {
		let ifPostAdvertFromSearchLandingScreen = getState().searchLanding
			.postAdvertFromSearchLandingScreen;
		// console.log(
		// 	'ifPostAdvertFromSearchLandingScreen ==> ',
		// 	ifPostAdvertFromSearchLandingScreen,
		// );

		if (ifPostAdvertFromSearchLandingScreen) {
			dispatch(resetNavigationRoutes(true));
		}

		dispatch(clearTextInputReq(true));
		dispatch(hideLoader());
		// navigation.navigate('AllAdverts');
		navigation.navigate('Profile', {screen: 'AllAdverts'});
	}

	if (type === 'UPDATE_ADVERT_POST_API_SUCCESS') {
		dispatch(clearTextInputReq(true));
		dispatch(hideLoader());
		// navigation.navigate('AllAdverts');
		navigation.navigate('Profile', {screen: 'AllAdverts'});
	}

	// if (type === 'ADVERT_LIST_GET_API_SUCCESS') {
	// 	dispatch(hideLoader());
	// }

	if (type === 'ADVERT_BY_ID_DELETE_API_SUCCESS') {
		// dispatch(clearTextInputReq(true));
		dispatch(advertDeleteSuccess(true));
		// dispatch(hideLoader());
		navigation.navigate('AllAdverts');
	}

	if (type === 'ADVERT_BY_ID_GET_API_SUCCESS') {
		if (navigation != null) {
			dispatch(hideLoader());
			navigation.navigate('ViewAdvert', {
				hiringOutItem: param,
				prevScreen: prevScreen,
			});
		}
	}

	if (type === 'PAUSE_RESUME_POST_API_SUCCESS') {
		// dispatch(hideAdvertScreenModal());
		// dispatch(hideLoader());
		navigation.navigate('AllAdverts');
	}

	// if (
	// 	type === 'MAKE_CALENDAR_UNAVAILABLE_DATE_POST_API_SUCCESS'
	// ) {
	// 	// dispatch(hideLoader());
	// }

	if (
		type === 'CALENDAR_UNAVAILABLE_DATE_LIST_GET_API_SUCCESS'
		// || type === 'CALENDAR_DATE_BY_ID_DELETE_API_SUCCESS'
	) {
		dispatch(hideLoader());
	}
};

const advertsApiFailureAction = (type, advertsFailure) => (dispatch) => {
	dispatch({
		type: type,
		payload: advertsFailure,
	});

	if (advertsFailure !== undefined) {
		dispatch(hideLoader());

		if (
			type !== 'CREATE_ADVERT_POST_API_FAILURE'
			// && type !== 'UPDATE_ADVERT_POST_API_FAILURE'
		) {
			let alertConfig = {
				title: 'Sorry!',
				message: advertsFailure,
			};

			dispatch(presentAlert(alertConfig));
		}
	}
};

// POST / DELETE  photos api
const photosApiRequestAction = (type) => (dispatch, getState) => {
	dispatch({
		type: type,
	});

	// dispatch(presentLoader());
};

const photosApiSuccessAction = (type, photosSuccess) => (dispatch) => {
	dispatch({
		type: type,
		payload: photosSuccess,
	});

	// dispatch(hideLoader());

	if (type === 'STORE_PHOTOS_POST_API_SUCCESS') {
		dispatch(hidePhotosScreenModal());
	}

	if (type === 'PHOTO_DELETE_API_SUCCESS') {
		dispatch(photoDeleteSuccess(true));
	}
};

const photosApiFailureAction = (type, photosFailure) => (dispatch) => {
	dispatch({
		type: type,
		payload: photosFailure,
	});

	if (photosFailure !== undefined) {
		dispatch(hideLoader());

		let alertConfig = {
			title: 'Sorry!',
			message: photosFailure,
		};

		dispatch(presentAlert(alertConfig));
	}
};

// POST create advert
export const createAdvertApi = (data, navigation) => (dispatch, getState) => {
	dispatch(advertsApiRequestAction(CREATE_ADVERT_POST_API_REQUEST));

	api
		.createAdvert(data)
		.then((response) => {
			// console.warn('response ==> ', response);
			// let parsedResposne = JSON.parse(response.data);
			// console.warn('parsedResposne ==> ', parsedResposne);
			// console.warn('parsedResposne.code ==> ', parsedResposne.code);
			// console.warn('parsedResposne.message ==> ', parsedResposne.message);
			// if (parsedResposne.code === 200) {
			if (response.data.code === 200) {
				analytics().logEvent('post_advert_success', {
					name: data.name,
					is_for_hire: data.is_for_hire,
					is_for_sale: data.is_for_sale,
					category_id: data.category_id,
					sub_category_id: data.sub_category_id,
					make: data.make,
					model: data.model,
					// description: data.description,
					// age: data.age,
					// mileage: data.mileage,
					// hours_used: data.hours_used,
					// length_mm: data.length_mm,
					// width_mm: data.width_mm,
					// height_mm: data.height_mm,
					post_code: data.post_code,
					is_for_collection: data.is_for_collection,
					is_for_delivery: data.is_for_delivery,
					delivery_distance: data.delivery_distance,
					delivery_charge_mile: data.delivery_charge_mile,
					per_day_price: data.per_day_price,
					per_week_price: data.per_week_price,
					// weight: data.weight,
					// product_code: data.product_code,
					// ean: data.ean,
					vat: data.vat,
					selling_price: data.selling_price,
					offers_accepted: data.offers_accepted,
				});

				dispatch(
					advertsApiSuccessAction(
						CREATE_ADVERT_POST_API_SUCCESS,
						// parsedResposne.message,
						response.data.message,
						navigation,
					),
				);
				//
			} else {
				dispatch(
					advertsApiFailureAction(
						CREATE_ADVERT_POST_API_FAILURE,
						// parsedResposne.errors,
						response.data.errors,
					),
				);
			}
		})
		.catch((error) => {
			// console.log('error ==> ', error.response.data.errors);
			dispatch(
				advertsApiFailureAction(
					CREATE_ADVERT_POST_API_FAILURE,
					error.response.data.errors,
				),
			);

			analytics().logEvent('post_advert_failure');
		});
};

// POST update advert
export const updateAdvertApi = (
	data,
	advertId,
	navigation,
	// rnFetchBlobApi
) => (dispatch, getState) => {
	dispatch(advertsApiRequestAction(UPDATE_ADVERT_POST_API_REQUEST));

	api
		.updateAdvert(
			data,
			advertId,
			// rnFetchBlobApi
		)
		.then((response) => {
			// console.log('response ==> ', response);
			// if (rnFetchBlobApi) {
			// 	let parsedResposne = JSON.parse(response.data);
			// 	if (parsedResposne.code === 200) {
			// 		dispatch(
			// 			advertsApiSuccessAction(
			// 				UPDATE_ADVERT_POST_API_SUCCESS,
			// 				parsedResposne.message,
			// 				navigation,
			// 			),
			// 		);
			// 	} else {
			// 		dispatch(
			// 			advertsApiFailureAction(
			// 				UPDATE_ADVERT_POST_API_FAILURE,
			// 				parsedResposne.errors,
			// 			),
			// 		);
			// 	}
			// } else {
			if (response.data.code === 200) {
				dispatch(
					advertsApiSuccessAction(
						UPDATE_ADVERT_POST_API_SUCCESS,
						response.data.message,
						navigation,
					),
				);
			} else {
				dispatch(
					advertsApiFailureAction(
						UPDATE_ADVERT_POST_API_FAILURE,
						response.data.message,
						// response.data.errors,
						// error.response.data.message,
					),
				);
			}
			// }
		})
		.catch((error) => {
			console.log('advert api failure ==> ', error.response.data);
			// if (rnFetchBlobApi) {
			// 	dispatch(
			// 		advertsApiFailureAction(
			// 			UPDATE_ADVERT_POST_API_FAILURE,
			// 			error.response.data.errors,
			// 		),
			// 	);
			// } else {
			dispatch(
				advertsApiFailureAction(
					UPDATE_ADVERT_POST_API_FAILURE,
					error.response.data.errors,
				),
			);
			// }
		});
};

// GET advert list
export const advertListApi = (pageNumber) => (dispatch) => {
	dispatch(advertsApiRequestAction(ADVERT_LIST_GET_API_REQUEST));

	api
		.advertList(pageNumber)
		.then((response) => {
			if (response.data.code === 200) {
				let resData = {};
				resData.data = response.data.data;
				resData.links = response.data.links;
				resData.meta = response.data.meta;
				resData.advertOnProfileVisible =
					response.data.data.length > 0 ? true : false;

				dispatch(advertsApiSuccessAction(ADVERT_LIST_GET_API_SUCCESS, resData));
			} else {
				dispatch(
					advertsApiFailureAction(
						ADVERT_LIST_GET_API_FAILURE,
						response.data.message,
					),
				);
			}
		})
		.catch((error) => {
			dispatch(
				advertsApiFailureAction(ADVERT_LIST_GET_API_FAILURE, error.response),
			);
		});
};

// GET advert by id
export const advertByIdApi = (param, navigation, prevScreen = '') => (
	dispatch,
) => {
	dispatch(advertsApiRequestAction(ADVERT_BY_ID_GET_API_REQUEST));

	api
		.advertById(param)
		.then((response) => {
			if (response.data.code === 200) {
				dispatch(
					advertsApiSuccessAction(
						ADVERT_BY_ID_GET_API_SUCCESS,
						response.data.data,
						navigation,
						param,
						prevScreen,
					),
				);
			} else {
				dispatch(
					advertsApiFailureAction(
						ADVERT_BY_ID_GET_API_FAILURE,
						response.data.message,
					),
				);
			}
		})
		.catch((error) => {
			dispatch(
				advertsApiFailureAction(ADVERT_BY_ID_GET_API_FAILURE, error.response),
			);
		});
};

// GET advert by id from hiring out
export const advertByIdFromHiringOutApi = (
	param,
	navigation,
	prevScreen = '',
) => (dispatch) => {
	dispatch(advertsApiRequestAction(ADVERT_BY_ID_GET_API_REQUEST));

	api
		.advertById(param.item.id)
		.then((response) => {
			if (response.data.code === 200) {
				dispatch(
					advertsApiSuccessAction(
						ADVERT_BY_ID_GET_API_SUCCESS,
						response.data.data,
						navigation,
						param,
						prevScreen,
					),
				);
			} else {
				dispatch(
					advertsApiFailureAction(
						ADVERT_BY_ID_GET_API_FAILURE,
						response.data.message,
					),
				);
			}
		})
		.catch((error) => {
			dispatch(
				advertsApiFailureAction(ADVERT_BY_ID_GET_API_FAILURE, error.response),
			);
		});
};

// DELETE advert by id
export const deleteAdvertByIdApi = (param, navigation) => (
	dispatch,
	getState,
) => {
	dispatch(advertsApiRequestAction(ADVERT_BY_ID_DELETE_API_REQUEST));

	api
		.deleteAdvertById(param)
		.then((response) => {
			if (response.data.code === 200) {
				dispatch(
					advertsApiSuccessAction(
						ADVERT_BY_ID_DELETE_API_SUCCESS,
						response.data.data,
						navigation,
					),
				);
			} else {
				dispatch(
					advertsApiFailureAction(
						ADVERT_BY_ID_DELETE_API_FAILURE,
						response.data.message,
					),
				);
			}
		})
		.catch((error) => {
			dispatch(
				advertsApiFailureAction(
					ADVERT_BY_ID_DELETE_API_FAILURE,
					error.response.data.message,
				),
			);
		});
};

// PAUSE RESUME advert by id
export const pauseResumeAdvertApi = (advertId, advertStatus, navigation) => (
	dispatch,
	getState,
) => {
	dispatch(advertsApiRequestAction(PAUSE_RESUME_POST_API_REQUEST));

	api
		.pauseResumeAdvert(advertId, advertStatus)
		.then((response) => {
			if (response.data.code === 200) {
				dispatch(
					advertsApiSuccessAction(
						PAUSE_RESUME_POST_API_SUCCESS,
						response.data.message,
						navigation,
					),
				);
			} else {
				dispatch(
					advertsApiFailureAction(
						PAUSE_RESUME_POST_API_FAILURE,
						response.data.message,
					),
				);
			}
		})
		.catch((error) => {
			dispatch(
				advertsApiFailureAction(
					PAUSE_RESUME_POST_API_FAILURE,
					error.response.data.message,
				),
			);
		});
};

// POST calendar dates make unavailable
export const calendarDatesMakingUnavailableApi = (advertId, dates) => (
	dispatch,
) => {
	dispatch(
		advertsApiRequestAction(MAKE_CALENDAR_UNAVAILABLE_DATE_POST_API_REQUEST),
	);

	api
		.calendarDatesMakingUnavailable(advertId, dates)
		.then((response) => {
			if (response.data.code === 200) {
				dispatch(
					advertsApiSuccessAction(
						MAKE_CALENDAR_UNAVAILABLE_DATE_POST_API_SUCCESS,
						response.data.message,
					),
				);
			} else {
				dispatch(
					advertsApiFailureAction(
						MAKE_CALENDAR_UNAVAILABLE_DATE_POST_API_FAILURE,
						// response.data.message,
						error.response.data.message,
					),
				);
			}
		})
		.catch((error) => {
			dispatch(
				advertsApiFailureAction(
					MAKE_CALENDAR_UNAVAILABLE_DATE_POST_API_FAILURE,
					// error.response.data,
					error.response.data.message,
				),
			);
		});
};

// GET calendar unavailable date list
export const calendarUnavailableDateListApi = (param) => (
	dispatch,
	getState,
) => {
	dispatch(
		advertsApiRequestAction(CALENDAR_UNAVAILABLE_DATE_LIST_GET_API_REQUEST),
	);

	api
		.calendarUnavailableDateList(param)
		.then((response) => {
			if (response.data.code === 200) {
				dispatch(
					advertsApiSuccessAction(
						CALENDAR_UNAVAILABLE_DATE_LIST_GET_API_SUCCESS,
						response.data.data,
					),
				);
			} else {
				dispatch(
					advertsApiFailureAction(
						CALENDAR_UNAVAILABLE_DATE_LIST_GET_API_FAILURE,
						response.data.message,
					),
				);
			}
		})
		.catch((error) => {
			dispatch(
				advertsApiFailureAction(
					CALENDAR_UNAVAILABLE_DATE_LIST_GET_API_FAILURE,
					error.response,
				),
			);
		});
};

// DELETE calendar date by id
export const calendarDateDeleteByIdApi = (advertId, dates) => (dispatch) => {
	dispatch(advertsApiRequestAction(CALENDAR_DATE_BY_ID_DELETE_API_REQUEST));

	api
		.calendarDateDeleteById(advertId, dates)
		.then((response) => {
			if (response.data.code === 200) {
				dispatch(
					advertsApiSuccessAction(
						CALENDAR_DATE_BY_ID_DELETE_API_SUCCESS,
						response.data.message,
					),
				);
			} else {
				dispatch(
					advertsApiFailureAction(
						CALENDAR_DATE_BY_ID_DELETE_API_FAILURE,
						response.data.message,
					),
				);
			}
		})
		.catch((error) => {
			dispatch(
				advertsApiFailureAction(
					CALENDAR_DATE_BY_ID_DELETE_API_FAILURE,
					error.response.data,
				),
			);
		});
};

// POST store photos
export const storePhotosApi = (data, advertId) => (dispatch) => {
	dispatch(photosApiRequestAction(STORE_PHOTOS_POST_API_REQUEST));

	api
		.storePhotos(data, advertId)
		.then((response) => {
			// let parsedResposne = JSON.parse(response.data);
			// console.log('parsedResposne ==> ', parsedResposne);
			// if (parsedResposne.code === 200) {
			if (response.data.code === 200) {
				dispatch(
					photosApiSuccessAction(
						STORE_PHOTOS_POST_API_SUCCESS,
						// parsedResposne.message,
						response.data.message,
					),
				);
			} else {
				dispatch(
					photosApiFailureAction(
						STORE_PHOTOS_POST_API_FAILURE,
						// parsedResposne.message,
						response.data.message,
					),
				);
			}
		})
		.catch((error) => {
			dispatch(
				photosApiFailureAction(
					STORE_PHOTOS_POST_API_FAILURE,
					// error.response.data.errors,
					`Some thing went wrong. Please try again!`,
				),
			);
		});
};

// DELETE photo by id
export const deletePhotoByIdApi = (advertId, photoId) => (dispatch) => {
	dispatch(photosApiRequestAction(PHOTO_DELETE_API_REQUEST));

	api
		.deletePhotoById(advertId, photoId)
		.then((response) => {
			if (response.data.code === 200) {
				dispatch(
					photosApiSuccessAction(
						PHOTO_DELETE_API_SUCCESS,
						response.data.message,
					),
				);
			} else {
				dispatch(
					photosApiFailureAction(
						PHOTO_DELETE_API_FAILURE,
						response.data.message,
					),
				);
			}
		})
		.catch((error) => {
			dispatch(
				photosApiFailureAction(
					PHOTO_DELETE_API_FAILURE,
					// error.response.data.errors
					`Some thing went wrong. Please try again!`,
				),
			);
		});
};
