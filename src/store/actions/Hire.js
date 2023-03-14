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
} from './constant/ActionTypes';

import {setError} from './Error';
import {presentAlert} from './Alert';
import {presentLoader, hideLoader} from './Loader';
import {hideSavedCardPaymentScreenModal} from './UserCard';

import * as api from '../../services/axios/Api';

import {CommonActions} from '@react-navigation/native';
import analytics from '@react-native-firebase/analytics';

// reset only hire and buy store
export const resetOnlyHireBuyStore = () => {
	return {
		type: RESET_ONLY_HIRE_BUY_STORE,
	};
};

export const resetStore = () => {
	return {
		type: RESET_STORE,
	};
};

// hire item payment success
export const hireItemPaymentSuccess = (paySuccess) => {
	return {
		type: HIRE_ITEM_PAYMENT_SUCCESS,
		payload: paySuccess,
	};
};

// hire item stripe payment success
export const hireItemStripePaymentSuccess = (stripePaySuccess) => {
	return {
		type: HIRE_ITEM_STRIPE_PAYMENT_SUCCESS,
		payload: stripePaySuccess,
	};
};

// clear hire calculated distance
// export const clearHireCalculatedDistance = () => {
// 	return {
// 		type: CLEAR_HIRE_CALCULATED_DISTANCE,
// 	};
// };

//clear collection type picker default value
// export const clearCollectionTypePickerDefaultValue = (value) => {
// 	return {
// 		type: CLEAR_COLLECTIONTYPE_PICKER_DEFAULT_VALUE,
// 		payload: value,
// 	};
// };

// hire filter screen modal
export const presentHireFilterScreenModal = () => {
	return {
		type: PRESENT_HIRE_FILTER_SCREEN_MODAL,
	};
};

export const hideHireFilterScreenModal = () => {
	return {
		type: HIDE_HIRE_FILTER_SCREEN_MODAL,
	};
};

// screen hire make payment modal
// export const presentHireMakePaymentScreenModal = () => {
// 	return {
// 		type: PRESENT_HIRE_MAKE_PAYMENT_SCREEN_MODAL,
// 	};
// };

// export const hideHireMakePaymentScreenModal = () => {
// 	return {
// 		type: HIDE_HIRE_MAKE_PAYMENT_SCREEN_MODAL,
// 	};
// };

export const shouldRunFunctionFromAlert = (runFunction) => {
	return {
		type: SHOULD_RUN_FUNCTION,
		payload: runFunction,
	};
};

export const calendarHeaderTitle = (title) => {
	return {
		type: CALENDAR_HEADER_TITLE,
		payload: title,
	};
};

// POST / PUT / GET / DELETE  hire  api
const hireItemApiRequestAction = (type) => (dispatch, getState) => {
	dispatch({
		type: type,
	});

	if (
		type !== 'HIRING_LIST_GET_API_REQUEST' &&
		type !== 'FIND_DISTANCE_GET_API_REQUEST' &&
		type !== 'HIRING_OUT_LIST_GET_API_REQUEST' &&
		type !== 'DAY_TO_PRICE_POST_API_REQUEST'
		// type !== 'HIRE_ITEM_PAYMENT_POST_API_REQUEST'
	) {
		dispatch(presentLoader());
	}
};

const hireItemApiSuccessAction = (
	type,
	hireItemSuccess,
	navigation,
	param = '',
) => (dispatch) => {
	dispatch({
		type: type,
		payload: hireItemSuccess,
	});

	// if (type === 'FIND_DISTANCE_GET_API_SUCCESS') {
	// 	dispatch(hideLoader());
	// }

	if (type === 'HIRE_ITEM_BY_ID_GET_API_SUCCESS') {
		dispatch(hideLoader());
		// 	if (navigation != null) {
		// 		navigation.navigate('HireItemDetail', {
		// 			hireItemId: param,
		// 		});
		// 	}
	}

	if (type === 'HIRE_ITEM_POST_API_SUCCESS') {
		dispatch(hideLoader());
		dispatch(hireItemPaymentSuccess(true));
		// if (navigation != null) {
		// 	navigation.navigate('BottomTabBar', {screen: 'Profile'});
		// }
	}

	// if(type === 'HIRING_LIST_GET_API_SUCCESS') {
	// 	dispatch(hideLoader());
	// }

	if (type === 'HIRING_OUT_LIST_GET_API_SUCCESS') {
		// dispatch(hideLoader());
		analytics().logEvent('hiring_out_post_list', {
			hiringOutPostListTotal: hireItemSuccess.meta.total,
		});
	}

	if (type === 'HIRING_BY_ID_GET_API_SUCCESS') {
		dispatch(hideLoader());
		if (navigation != null) {
			navigation.navigate('ViewHire', {
				hiringInItem: param,
			});
		}
	}

	if (type === 'HIRE_ITEM_PAYMENT_POST_API_SUCCESS') {
		dispatch(hideLoader());
		dispatch(hireItemStripePaymentSuccess(true));
		// navigation.dispatch({
		// 	...CommonActions.reset({
		// 		index: 0,
		// 		routes: [
		// 			{
		// 				name: 'BottomTabBar',
		// 				state: {
		// 					routes: [{name: 'Profile'}],
		// 				},
		// 			},
		// 		],
		// 	}),
		// });
	}

	if (type === 'CANCEL_HIRING_POST_API_SUCCESS') {
		dispatch(hideLoader());
		navigation.dispatch({
			...CommonActions.reset({
				index: 0,
				routes: [
					{
						name: 'BottomTabBar',
						state: {
							routes: [{name: 'Profile'}],
						},
					},
				],
			}),
		});
	}

	if (type === 'DAY_TO_PRICE_POST_API_SUCCESS') {
		let errorMessageConfig = {
			message: '',
			showError: false,
		};

		dispatch(setError(errorMessageConfig));
	}
};

const hireItemApiFailureAction = (type, hireItemFailure) => (dispatch) => {
	dispatch({
		type: type,
		payload: hireItemFailure,
	});

	// console.log('hireItemFailure ==> ', hireItemFailure);

	if (hireItemFailure !== undefined) {
		if (type === 'HIRE_ITEM_POST_API_FAILURE') {
			// 	let dateValidations = [];
			// 	let errorMessage = '';
			// 	if (Array.isArray(hireItemFailure) && hireItemFailure.length > 0) {
			// 		for (var key in hireItemFailure) {
			// 			if (hireItemFailure.hasOwnProperty(key)) {
			// 				dateValidations.push(key.substr(key.indexOf('.') + 1));
			// 			}
			// 		}
			// 	} else {
			// 		errorMessage = hireItemFailure;
			// 	}

			let alertConfig = {
				title: 'Sorry!',
				shouldRunFunction: true,
				functionHandler: 'clearCalendarDatesHandler',
				message: hireItemFailure,
				// message:
				// 	Array.isArray(hireItemFailure) && hireItemFailure.length > 0
				// 		? `The dates positioned ${dateValidations} has already been taken.`
				// 		: errorMessage,
			};

			dispatch(hideLoader());
			dispatch(presentAlert(alertConfig));
			//
		} else if (type === 'HIRE_ITEM_PAYMENT_POST_API_FAILURE') {
			dispatch(hideSavedCardPaymentScreenModal());

			let alertConfig = {
				title: 'Sorry!',
				message: hireItemFailure,
			};

			dispatch(hideLoader());
			dispatch(presentAlert(alertConfig));
			//
		} else if (type === 'FIND_DISTANCE_GET_API_FAILURE') {
			let alertConfig = {
				title: 'Sorry!',
				message:
					'There was a problem while fetching delivery distance. Please try again.',
			};

			dispatch(hideLoader());
			dispatch(presentAlert(alertConfig));
			//
		} else if (type === 'DAY_TO_PRICE_POST_API_FAILURE') {
			let errorConfig = {
				message: hireItemFailure,
				showError: true,
			};

			dispatch(setError(errorConfig));
			//
		} else {
			let alertConfig = {
				title: 'Sorry!',
				message: hireItemFailure,
			};

			dispatch(hideLoader());
			dispatch(presentAlert(alertConfig));
		}
	}
};

// GET hire item by id
export const hireItemByIdApi = (param, navigation) => (dispatch, getState) => {
	dispatch(hireItemApiRequestAction(HIRE_ITEM_BY_ID_GET_API_REQUEST));

	api
		.advertById(param)
		.then((response) => {
			if (response.data.code === 200) {
				dispatch(
					hireItemApiSuccessAction(
						HIRE_ITEM_BY_ID_GET_API_SUCCESS,
						response.data.data,
						navigation,
						param,
					),
				);
			} else {
				dispatch(
					hireItemApiFailureAction(
						HIRE_ITEM_BY_ID_GET_API_FAILURE,
						response.data.message,
					),
				);
			}
		})
		.catch((error) => {
			dispatch(
				hireItemApiFailureAction(
					HIRE_ITEM_BY_ID_GET_API_FAILURE,
					`Some thing went wrong. Please try again!`,
					// error.response.data.message,
				),
			);
		});
};

// POST hire item
export const itemHireApi = (data, navigation) => (dispatch, getState) => {
	dispatch(hireItemApiRequestAction(HIRE_ITEM_POST_API_REQUEST));

	api
		.itemHire(data)
		.then((response) => {
			if (response.data.code === 200) {
				dispatch(
					hireItemApiSuccessAction(
						HIRE_ITEM_POST_API_SUCCESS,
						response.data.data,
						navigation,
					),
				);
			} else {
				// console.log('response ==> ', response);
				// console.log('response.data ==> ', response.data);
				// console.log('response.data?.errors ==> ', response.data?.errors);
				// console.log('response.data?.message ==> ', response.data?.message);

				// let finalErrorMessage = '';
				// let errors = response.data?.errors;
				// let errorMessage = response.data?.message;

				// if (errorMessage === 'The Amount paid mismatched') {
				// 	finalErrorMessage =
				// 		'The amount paid mismatched, please try again selecting new dates';
				// 	//
				// } else if (errors?.delivery_distance[0] != '') {
				// 	finalErrorMessage = errors?.delivery_distance[0];
				// 	//
				// } else {
				// 	finalErrorMessage = 'Something went wrong please try again';
				// }

				dispatch(
					hireItemApiFailureAction(
						HIRE_ITEM_POST_API_FAILURE,
						// finalErrorMessage,
						response.data.message,
					),
				);
			}
		})
		.catch((error) => {
			console.log('error.response ==> ', error.response);
			// console.log('error.response.data ==> ', error.response.data);
			// console.log('error.response.data?.errors ==> ',error.response.data?.errors);
			// console.log('error.response.data?.message ==> ', error.response.data?.message);

			let finalErrorMessage = '';
			let errors = error.response.data?.errors;
			let errorMessage = error.response.data?.message;

			if (errorMessage === 'The Amount paid mismatched') {
				finalErrorMessage =
					'The amount paid mismatched, please try again selecting new dates';
				//
			} else if (errors?.delivery_distance[0] != '') {
				finalErrorMessage = errors?.delivery_distance[0];
				//
			} else {
				finalErrorMessage = 'Something went wrong please try again';
			}

			dispatch(
				hireItemApiFailureAction(
					HIRE_ITEM_POST_API_FAILURE,
					finalErrorMessage,

					// errorMessage === 'The Amount paid mismatched'
					// 	? 'The amount paid mismatched, please try again selecting new dates'
					// 	: errors?.delivery_distance[0],
				),
			);

			// let errors = error.response.data?.errors;
			// let errorMessage = error.response.data?.message;
			// dispatch(
			// 	hireItemApiFailureAction(
			// 		HIRE_ITEM_POST_API_FAILURE,
			// 		errorMessage === 'The Amount paid mismatched'
			// 			? 'The amount paid mismatched, please try again selecting new dates'
			// 			: errors,
			// 	),
			// );
		});
};

// GET find distance
export const findDistanceApi = (
	latitude1,
	longitude1,
	latitude2,
	longitude2,
) => (dispatch) => {
	dispatch(hireItemApiRequestAction(FIND_DISTANCE_GET_API_REQUEST));

	api
		.findDistance(latitude1, longitude1, latitude2, longitude2)
		.then((response) => {
			console.log('response ==> ', response.data);
			// console.log('status ==> ', response.data.status);
			// console.log('rows[0].elements[0].status ==> ', response.data.rows[0].elements[0].status);
			// console.log('rows[0].elements[0].distance.value ==> ', response.data.rows[0].elements[0].distance.value);

			let resStatus = response?.data?.status;
			let resRowStatus = response?.data?.rows[0]?.elements[0]?.status;
			if (resStatus === 'OK' && resRowStatus === 'OK') {
				let distance = response.data?.rows[0]?.elements[0]?.distance?.value;
				let distance_miles = (distance * 0.621371192) / 1000;

				console.log('DM ==> ', distance_miles.toFixed(2).toString());

				dispatch(
					hireItemApiSuccessAction(
						FIND_DISTANCE_GET_API_SUCCESS,
						distance_miles.toFixed(2).toString(),
						// response.data.data.distance.toString(),
					),
				);
			} else {
				dispatch(
					hireItemApiFailureAction(
						FIND_DISTANCE_GET_API_FAILURE,
						response.data.message,
					),
				);
			}
		})
		.catch((error) => {
			dispatch(
				hireItemApiFailureAction(
					FIND_DISTANCE_GET_API_FAILURE,
					error.response.data.message,
				),
			);
		});
};

// GET hiring list
export const hiringListApi = (hiringPageNumber) => (dispatch) => {
	dispatch(hireItemApiRequestAction(HIRING_LIST_GET_API_REQUEST));

	api
		.hiringList(hiringPageNumber)
		.then((response) => {
			if (response.data.code === 200) {
				let hiringResData = {};
				hiringResData.data = response.data.data;
				hiringResData.links = response.data.links;
				hiringResData.meta = response.data.meta;
				hiringResData.hiringOnProfileVisible =
					response.data.data.length > 0 ? true : false;
				dispatch(
					hireItemApiSuccessAction(HIRING_LIST_GET_API_SUCCESS, hiringResData),
				);
			} else {
				dispatch(
					hireItemApiFailureAction(
						HIRING_LIST_GET_API_FAILURE,
						response.data.message,
					),
				);
			}
		})
		.catch((error) => {
			dispatch(
				hireItemApiFailureAction(
					HIRING_LIST_GET_API_FAILURE,
					`Some thing went wrong. Please try again!`,
					// error.response.data.message,
				),
			);
		});
};

// GET hiring item by id
export const hiringByIdApi = (param, navigation) => (dispatch, getState) => {
	dispatch(hireItemApiRequestAction(HIRING_BY_ID_GET_API_REQUEST));

	api
		.hiringById(param.id)
		.then((response) => {
			if (response.data.code === 200) {
				dispatch(
					hireItemApiSuccessAction(
						HIRING_BY_ID_GET_API_SUCCESS,
						response.data.data,
						navigation,
						param,
					),
				);
			} else {
				dispatch(
					hireItemApiFailureAction(
						HIRING_BY_ID_GET_API_FAILURE,
						response.data.message,
					),
				);
			}
		})
		.catch((error) => {
			dispatch(
				hireItemApiFailureAction(
					HIRING_BY_ID_GET_API_FAILURE,
					`Some thing went wrong. Please try again!`,
					// error.response.data.message,
				),
			);
		});
};

// GET hiring out list
export const hiringOutListApi = (hiringOutPageNumber) => (dispatch) => {
	dispatch(hireItemApiRequestAction(HIRING_OUT_LIST_GET_API_REQUEST));

	api
		.hiringOutList(hiringOutPageNumber)
		.then((response) => {
			if (response.data.code === 200) {
				let hiringOutResData = {};
				hiringOutResData.data = response.data.data;
				hiringOutResData.links = response.data.links;
				hiringOutResData.meta = response.data.meta;
				dispatch(
					hireItemApiSuccessAction(
						HIRING_OUT_LIST_GET_API_SUCCESS,
						hiringOutResData,
					),
				);
			} else {
				dispatch(
					hireItemApiFailureAction(
						HIRING_OUT_LIST_GET_API_FAILURE,
						response.data.message,
					),
				);
			}
		})
		.catch((error) => {
			dispatch(
				hireItemApiFailureAction(
					HIRING_OUT_LIST_GET_API_FAILURE,
					`Some thing went wrong. Please try again!`,
					// error.response.data.message,
				),
			);
		});
};

// GET hiring out list
export const hireItemPaymentApi = (body, navigation) => (dispatch) => {
	dispatch(hireItemApiRequestAction(HIRE_ITEM_PAYMENT_POST_API_REQUEST));

	api
		.hireItemPayment(body)
		.then((response) => {
			if (response.data.code === 200) {
				dispatch(
					hireItemApiSuccessAction(
						HIRE_ITEM_PAYMENT_POST_API_SUCCESS,
						response.data.data,
						navigation,
					),
				);

				analytics().logEvent('hire_item_pay', {
					item_id: body.item_hire_id,
					hire_price: response.data.data.hire_price,
					delivery_price: response.data.data.delivery_price,
					admin_fee_stripe: response.data.data.admin_fee_stripe,
					vat: response.data.data.vat,
					total_paid: response.data.data.total_paid,
				});
				//
			} else {
				dispatch(
					hireItemApiFailureAction(
						HIRE_ITEM_PAYMENT_POST_API_FAILURE,
						response.data.message,
					),
				);
			}
		})
		.catch((error) => {
			dispatch(
				hireItemApiFailureAction(
					HIRE_ITEM_PAYMENT_POST_API_FAILURE,
					error.response.data.message,
				),
			);
		});
};

// POST cancel hiring by id
export const cancelHiringApi = (param, navigation) => (dispatch) => {
	dispatch(hireItemApiRequestAction(CANCEL_HIRING_POST_API_REQUEST));

	api
		.cancelHiring(param)
		.then((response) => {
			if (response.data.code === 200) {
				dispatch(
					hireItemApiSuccessAction(
						CANCEL_HIRING_POST_API_SUCCESS,
						response.data.message,
						navigation,
					),
				);
			} else {
				dispatch(
					hireItemApiFailureAction(
						CANCEL_HIRING_POST_API_FAILURE,
						response.data.message,
					),
				);
			}
		})
		.catch((error) => {
			dispatch(
				hireItemApiFailureAction(
					CANCEL_HIRING_POST_API_FAILURE,
					`Some thing went wrong. Please try again!`,
					// error.response.data.message,
				),
			);
		});
};

// POST day to price
export const dayToPriceApi = (param, navigation) => (dispatch) => {
	dispatch(hireItemApiRequestAction(DAY_TO_PRICE_POST_API_REQUEST));

	api
		.dayToPrice(param)
		.then((response) => {
			if (response.data.code === 200) {
				// console.log('data ==> ', response.data.data.price);
				dispatch(
					hireItemApiSuccessAction(
						DAY_TO_PRICE_POST_API_SUCCESS,
						response.data.data.price,
						navigation,
					),
				);
			} else {
				dispatch(
					hireItemApiFailureAction(
						DAY_TO_PRICE_POST_API_FAILURE,
						response.data.message,
					),
				);
			}
		})
		.catch((error) => {
			dispatch(
				hireItemApiFailureAction(
					DAY_TO_PRICE_POST_API_FAILURE,
					error.response.data.message,
				),
			);
		});
};
