import {
	BUSINESS_PROFILE_GET_API_REQUEST,
	BUSINESS_PROFILE_GET_API_SUCCESS,
	BUSINESS_PROFILE_GET_API_FAILURE,
	//
	BUSINESS_PROFILE_POST_API_REQUEST,
	BUSINESS_PROFILE_POST_API_SUCCESS,
	BUSINESS_PROFILE_POST_API_FAILURE,
	//
	STRIPE_CONNECT_GET_API_REQUEST,
	STRIPE_CONNECT_GET_API_SUCCESS,
	STRIPE_CONNECT_GET_API_FAILURE,
	//
	PRESENT_STRIPE_REVIEW_DETAIL_SCREEN_MODAL,
	HIDE_STRIPE_REVIEW_DETAIL_SCREEN_MODAL,
	//
	STRIPE_BALANCE_GET_API_REQUEST,
	STRIPE_BALANCE_GET_API_SUCCESS,
	STRIPE_BALANCE_GET_API_FAILURE,
	//
	RESET_STORE,
} from './constant/ActionTypes';

import {setUser} from './Auth';
import {presentAlert} from './Alert';
import {presentLoader, hideLoader} from './Loader';

import analytics from '@react-native-firebase/analytics';
import AsyncStorage from '@react-native-community/async-storage';

import * as api from '../../services/axios/Api';

export const resetStore = () => {
	return {
		type: RESET_STORE,
	};
};

// stripe review details screen modal
export const presentStripeReviewDetailScreenModal = () => {
	return {
		type: PRESENT_STRIPE_REVIEW_DETAIL_SCREEN_MODAL,
	};
};

export const hideStripeReviewDetailScreenModal = () => {
	return {
		type: HIDE_STRIPE_REVIEW_DETAIL_SCREEN_MODAL,
	};
};

// POST / GET user business profile
const userBusinessProfileApiRequestAction = (type) => (dispatch, getState) => {
	dispatch({
		type: type,
	});

	dispatch(presentLoader());
};

const userBusinessProfileApiSuccessAction = (
	type,
	userBusinessProfileSuccess,
	navigation,
	collectInOneGo,
) => (dispatch, getState) => {
	dispatch({
		type: type,
		payload: userBusinessProfileSuccess,
	});

	dispatch(hideLoader());

	if (type === 'BUSINESS_PROFILE_POST_API_SUCCESS') {
		const userData = getState().auth.user;

		let user = {
			id: userData.id,
			first_name: userData.first_name,
			last_name: userData.last_name,
			email: userData.email,
			login_with: userData.login_with,
			completed_stripe_onboarding: userData.completed_stripe_onboarding,
			has_primary_card: userData.has_primary_card,
			has_primary_address: userData.has_primary_address,
			has_business_profile: 1,
		};

		dispatch(
			setUser({
				user: user,
			}),
		);

		AsyncStorage.setItem('user', JSON.stringify(user));

		if (collectInOneGo === undefined) {
			navigation.navigate('Settings');
		}

		if (collectInOneGo === true) {
			navigation.goBack();

			setTimeout(() => {
				navigation.navigate('AddPaymentCard');
			}, 300);
		}

		if (collectInOneGo === false) {
			// mandatory to code this way.
			navigation.goBack();
		}
	}
};

const userBusinessProfileApiFailureAction = (
	type,
	userBusinessProfileFailure,
) => (dispatch) => {
	dispatch({
		type: type,
		payload: userBusinessProfileFailure,
	});

	if (userBusinessProfileFailure !== undefined) {
		let alertConfig = {
			title: 'Sorry!',
			message: userBusinessProfileFailure,
			showCancelButton: false,
		};

		dispatch(hideLoader());
		dispatch(presentAlert(alertConfig));
	}
};

// GET stripe connect
const stripeConnectApiRequestAction = (type) => (dispatch) => {
	dispatch({
		type: type,
	});

	// dispatch(presentLoader());
};

const stripeConnectApiSuccessAction = (type, stripeConnectSuccess) => (
	dispatch,
) => {
	dispatch({
		type: type,
		payload: stripeConnectSuccess,
	});

	// dispatch(hideLoader());
};

const stripeConnectApiFailureAction = (type, stripeConnectFailure) => (
	dispatch,
) => {
	dispatch({
		type: type,
		payload: stripeConnectFailure,
	});

	if (stripeConnectFailure !== undefined) {
		// let alertConfig = {
		// 	title: 'Sorry!',
		// 	message: userBusinessProfileFailure,
		// 	showCancelButton: false,
		// };
		// dispatch(hideLoader());
		// dispatch(presentAlert(alertConfig));
	}
};

// GET user business profile
export const userBusinessProfileGETApi = () => (dispatch, getState) => {
	dispatch(
		userBusinessProfileApiRequestAction(BUSINESS_PROFILE_GET_API_REQUEST),
	);

	api
		.userBusinessProfile('get')
		.then((response) => {
			if (response.data.code === 200) {
				dispatch(
					userBusinessProfileApiSuccessAction(
						BUSINESS_PROFILE_GET_API_SUCCESS,
						response.data.data,
					),
				);
			} else {
				dispatch(
					userBusinessProfileApiFailureAction(
						BUSINESS_PROFILE_GET_API_FAILURE,
						response.data.message,
					),
				);
			}
		})
		.catch((error) => {
			dispatch(
				userBusinessProfileApiFailureAction(
					BUSINESS_PROFILE_GET_API_FAILURE,
					`Some thing went wrong. Please try again!`,
					// error.response.data.error,
				),
			);
		});
};

// POST user business profile
export const userBusinessProfilePOSTApi = (
	body,
	navigation,
	collectInOneGo,
) => (dispatch) => {
	dispatch(
		userBusinessProfileApiRequestAction(BUSINESS_PROFILE_POST_API_REQUEST),
	);

	api
		.userBusinessProfile('post', body)
		.then((response) => {
			if (response.data.code === 200) {
				dispatch(
					userBusinessProfileApiSuccessAction(
						BUSINESS_PROFILE_POST_API_SUCCESS,
						response.data.message,
						navigation,
						collectInOneGo,
					),
				);

				analytics().logEvent('business_profile_success', {
					trading_name: body.trading_name,
					address_line_1: body.address_line_1,
					address_line_2: body.address_line_2,
					city: body.city,
					country: body.country,
					post_code: body.post_code,
					phone_number: body.phone_number,
					company_registation_number: body.company_registation_number,
					vat_registration_number: body.vat_registration_number,
				});
				//
			} else {
				dispatch(
					userBusinessProfileApiFailureAction(
						BUSINESS_PROFILE_POST_API_FAILURE,
						response.data.message,
					),
				);
			}
		})
		.catch((error) => {
			dispatch(
				userBusinessProfileApiFailureAction(
					BUSINESS_PROFILE_POST_API_FAILURE,
					`Some thing went wrong. Please try again!`,
					// error.response.data.errors,
				),
			);

			analytics().logEvent('business_profile_failure');
		});
};

// GET stripe WebView
export const stripeConnectGetApi = () => (dispatch) => {
	dispatch(stripeConnectApiRequestAction(STRIPE_CONNECT_GET_API_REQUEST));

	api
		.stripeConnectGet()
		.then((response) => {
			if (response.data.code === 200) {
				dispatch(
					stripeConnectApiSuccessAction(
						STRIPE_CONNECT_GET_API_SUCCESS,
						response.data.data,
					),
				);
			} else {
				dispatch(
					stripeConnectApiFailureAction(
						STRIPE_CONNECT_GET_API_FAILURE,
						response.data.message,
					),
				);
			}
		})
		.catch((error) => {
			dispatch(
				stripeConnectApiFailureAction(
					STRIPE_CONNECT_GET_API_FAILURE,
					error.response.data.errors,
				),
			);
		});
};

// GET stripe balance
export const stripeBalanceGetApi = () => (dispatch) => {
	dispatch(stripeConnectApiRequestAction(STRIPE_BALANCE_GET_API_REQUEST));

	api
		.stripeBalance()
		.then((response) => {
			if (response.data.code === 200) {
				dispatch(
					stripeConnectApiSuccessAction(
						STRIPE_BALANCE_GET_API_SUCCESS,
						response.data.data,
					),
				);
			} else {
				dispatch(
					stripeConnectApiFailureAction(
						STRIPE_BALANCE_GET_API_FAILURE,
						response.data.message,
					),
				);
			}
		})
		.catch((error) => {
			dispatch(
				stripeConnectApiFailureAction(
					STRIPE_BALANCE_GET_API_FAILURE,
					error.response.data.error,
				),
			);
		});
};
