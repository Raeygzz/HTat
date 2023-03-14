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
} from './constant/ActionTypes';

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

// buy item payment success
export const buyItemPaymentSuccess = (buySuccess) => {
	return {
		type: BUY_ITEM_PAYMENT_SUCCESS,
		payload: buySuccess,
	};
};

// POST / PUT / GET / DELETE  buy  api
const buyItemApiRequestAction = (type) => (dispatch) => {
	dispatch({
		type: type,
	});

	// if (
	// 	// type !== 'BUY_ITEM_POST_API_REQUEST' &&
	// 	type !== 'BUY_ITEM_PAYMENT_POST_API_REQUEST'
	// ) {
	dispatch(presentLoader());
	// }
};

const buyItemApiSuccessAction = (type, buyItemSuccess, navigation) => (
	dispatch,
) => {
	dispatch({
		type: type,
		payload: buyItemSuccess,
	});

	if (type === 'BUY_ITEM_POST_API_SUCCESS') {
		dispatch(hideLoader());
		dispatch(buyItemPaymentSuccess(true));
	}

	if (type === 'BUY_ITEM_PAYMENT_POST_API_SUCCESS') {
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

	if (type === 'SEND_EMAIL_POST_API_SUCCESS') {
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
};

const buyItemApiFailureAction = (type, buyItemFailure) => (dispatch) => {
	dispatch({
		type: type,
		payload: buyItemFailure,
	});

	if (buyItemFailure !== undefined) {
		if (type === 'BUY_ITEM_POST_API_FAILURE') {
			let alertConfig = {
				title: 'Sorry!',
				message: buyItemFailure,
			};

			dispatch(hideLoader());
			dispatch(presentAlert(alertConfig));
			//
		} else if (type === 'BUY_ITEM_PAYMENT_POST_API_FAILURE') {
			dispatch(hideSavedCardPaymentScreenModal());

			let alertConfig = {
				title: 'Sorry!',
				message: buyItemFailure,
			};

			dispatch(hideLoader());
			dispatch(presentAlert(alertConfig));
			//
		} else if (type === 'SEND_EMAIL_POST_API_FAILURE') {
			let alertConfig = {
				title: 'Sorry!',
				message:
					'There was a problem while sending email for item enquiry. Please try again.',
			};

			dispatch(hideLoader());
			dispatch(presentAlert(alertConfig));
			//
		} else {
			let alertConfig = {
				title: 'Sorry!',
				message: 'There was a problem while buying the item. Please try again.',
			};

			dispatch(hideLoader());
			dispatch(presentAlert(alertConfig));
		}
	}
};

// POST buy item
export const buyItemApi = (body, navigation) => (dispatch) => {
	dispatch(buyItemApiRequestAction(BUY_ITEM_POST_API_REQUEST));

	api
		.buyItem(body)
		.then((response) => {
			if (response.data.code === 200) {
				dispatch(
					buyItemApiSuccessAction(
						BUY_ITEM_POST_API_SUCCESS,
						response.data.data,
						navigation,
					),
				);
			} else {
				dispatch(
					buyItemApiFailureAction(
						BUY_ITEM_POST_API_FAILURE,
						response.data.message,
					),
				);
			}
		})
		.catch((error) => {
			let errors = error.response.data?.errors?.delivery_distance;
			dispatch(
				buyItemApiFailureAction(
					BUY_ITEM_POST_API_FAILURE,
					Array.isArray(errors) && errors.length > 0
						? errors[0]
						: 'There was a problem while buying the item. Please try again.',
				),
			);
		});
};

// POST buy item payment
export const buyItemPaymentApi = (body, navigation) => (dispatch) => {
	dispatch(buyItemApiRequestAction(BUY_ITEM_PAYMENT_POST_API_REQUEST));

	api
		.buyItemPayment(body)
		.then((response) => {
			if (response.data.code === 200) {
				dispatch(
					buyItemApiSuccessAction(
						BUY_ITEM_PAYMENT_POST_API_SUCCESS,
						response.data.data,
						navigation,
					),
				);
			} else {
				dispatch(
					buyItemApiFailureAction(
						BUY_ITEM_PAYMENT_POST_API_FAILURE,
						response.data.message,
					),
				);
			}
		})
		.catch((error) => {
			dispatch(
				buyItemApiFailureAction(
					BUY_ITEM_PAYMENT_POST_API_FAILURE,
					`Some thing went wrong. Please try again!`,
					// error.response.data.message,
				),
			);
		});
};

// POST send email for buy enquiry
export const sendEmailApi = (body, navigation) => (dispatch) => {
	dispatch(buyItemApiRequestAction(SEND_EMAIL_POST_API_REQUEST));

	api
		.sendEmail(body)
		.then((response) => {
			if (response.data.code === 200) {
				analytics().logEvent('send_email_to_enquire_success');

				dispatch(
					buyItemApiSuccessAction(
						SEND_EMAIL_POST_API_SUCCESS,
						response.data.message,
						navigation,
					),
				);
			} else {
				dispatch(
					buyItemApiFailureAction(
						SEND_EMAIL_POST_API_FAILURE,
						response.data.message,
					),
				);
			}
		})
		.catch((error) => {
			dispatch(
				buyItemApiFailureAction(
					SEND_EMAIL_POST_API_FAILURE,
					error.response.data.message,
				),
			);
		});
};
