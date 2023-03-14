import {
	USER_DETAIL_GET_API_REQUEST,
	USER_DETAIL_GET_API_SUCCESS,
	USER_DETAIL_GET_API_FAILURE,
	//
	PRESENT_USER_DETAIL_SCREEN_MODAL,
	HIDE_USER_DETAIL_SCREEN_MODAL,
	//
	USER_DETAIL_PUT_API_REQUEST,
	USER_DETAIL_PUT_API_SUCCESS,
	USER_DETAIL_PUT_API_FAILURE,
	//
	RESET_STORE,
} from './constant/ActionTypes';

import AsyncStorage from '@react-native-community/async-storage';

import {setUser} from './Auth';
import {setError} from './Error';
import {presentAlert} from './Alert';
import {clearTextInputReq} from './ClearTextInput';
import {presentModalLoader, hideModalLoader} from './ModalLoader';

import * as api from '../../services/axios/Api';

// reset store
export const resetStore = () => {
	return {
		type: RESET_STORE,
	};
};

// screen modal
export const presentUserDetailScreenModal = () => {
	return {
		type: PRESENT_USER_DETAIL_SCREEN_MODAL,
	};
};

export const hideUserDetailScreenModal = () => {
	return {
		type: HIDE_USER_DETAIL_SCREEN_MODAL,
	};
};

// user detail api GET/PUT
const userDetailApiRequestAction = (type, showModalLoader) => (dispatch) => {
	dispatch({
		type: type,
	});

	showModalLoader ? dispatch(presentModalLoader()) : null;
};

const userDetailApiSuccessAction = (
	type,
	userDetailSuccess,
	userData,
	showModalLoader,
) => (dispatch, getState) => {
	dispatch({
		type: type,
		payload: userDetailSuccess,
	});

	showModalLoader ? dispatch(hideModalLoader()) : null;

	if (type === 'USER_DETAIL_GET_API_SUCCESS') {
		let user = {
			id: userDetailSuccess.id,
			first_name: userDetailSuccess.first_name,
			last_name: userDetailSuccess.last_name,
			email: userDetailSuccess.email,
			login_with: userDetailSuccess.login_with,
			completed_stripe_onboarding:
				userDetailSuccess.completed_stripe_onboarding,
			has_primary_card: userDetailSuccess.has_primary_card,
			has_primary_address: userDetailSuccess.has_primary_address,
			has_business_profile: userDetailSuccess.has_business_profile,
		};

		dispatch(setUser({user: user}));
		AsyncStorage.setItem('user', JSON.stringify(user));
	}

	if (type === 'USER_DETAIL_PUT_API_SUCCESS') {
		let userStoreData = getState().auth.user;

		let user = {
			id: userStoreData.id,
			first_name: userData.first_name,
			last_name: userData.last_name,
			email: userData.email,
			login_with: userStoreData.login_with,
			completed_stripe_onboarding: userStoreData.completed_stripe_onboarding,
			has_primary_card: userStoreData.has_primary_card,
			has_primary_address: userStoreData.has_primary_address,
			has_business_profile: userStoreData.has_business_profile,
		};

		dispatch(setUser({user: user}));
		AsyncStorage.setItem('user', JSON.stringify(user));

		dispatch(hideUserDetailScreenModal());
		dispatch(clearTextInputReq(true));
	}
};

const userDetailApiFailureAction = (type, userDetailFailure) => (dispatch) => {
	dispatch({
		type: type,
		payload: userDetailFailure,
	});

	if (userDetailFailure !== undefined) {
		if (type === 'USER_DETAIL_PUT_API_FAILURE') {
			dispatch(hideModalLoader());

			let errorConfig = {
				showError: true,
				message: userDetailFailure,
			};
			dispatch(setError(errorConfig));
		} else {
			let alertConfig = {
				title: 'Sorry!',
				message: userDetailFailure,
				showCancelButton: false,
			};

			dispatch(hideModalLoader());
			dispatch(presentAlert(alertConfig));
		}
	}
};

// GET user detail
export const userDetailGETApi = (param, showModalLoader = true) => (
	dispatch,
) => {
	dispatch(
		userDetailApiRequestAction(USER_DETAIL_GET_API_REQUEST, showModalLoader),
	);

	api
		.userDetailGET(param)
		.then((response) => {
			if (response.data.code === 200) {
				dispatch(
					userDetailApiSuccessAction(
						USER_DETAIL_GET_API_SUCCESS,
						response.data.data,
						showModalLoader,
					),
				);
			} else {
				dispatch(
					userDetailApiFailureAction(
						USER_DETAIL_GET_API_FAILURE,
						response.data.message,
					),
				);
			}
		})
		.catch((error) => {
			dispatch(
				userDetailApiFailureAction(
					USER_DETAIL_GET_API_FAILURE,
					`Some thing went wrong. Please try again!`,
					// error?.response?.data?.message,
				),
			);
		});
};

// PUT user detail
export const userDetailPUTApi = (data, userData, showModalLoader = true) => (
	dispatch,
	getState,
) => {
	const userId = getState().auth.id;

	dispatch(
		userDetailApiRequestAction(USER_DETAIL_PUT_API_REQUEST, showModalLoader),
	);

	api
		.userDetailPUT(userId, data)
		.then((response) => {
			if (response.data.code === 200) {
				dispatch(
					userDetailApiSuccessAction(
						USER_DETAIL_PUT_API_SUCCESS,
						response.data,
						userData,
						showModalLoader,
					),
				);
			} else {
				console.log('response.data ==> ', response.data);

				let emailError = response?.data?.errors?.email[0];
				console.log('emailError ==> ', emailError);

				let userDetailEmailUpdateError =
					emailError != undefined && emailError != null
						? emailError
						: 'Something went wrong while updating user detail. Please try again';

				dispatch(
					userDetailApiFailureAction(
						USER_DETAIL_PUT_API_FAILURE,
						// response.data.message,
						userDetailEmailUpdateError,
					),
				);
			}
		})
		.catch((error) => {
			console.log('error ==> ', error?.response?.data);

			let emailError = error?.response?.data?.errors?.email[0];
			console.log('emailError ==> ', emailError);

			let userDetailUpdateError =
				emailError != undefined && emailError != null
					? emailError
					: 'Something went wrong while updating user detail. Please try again';
			dispatch(
				userDetailApiFailureAction(
					USER_DETAIL_PUT_API_FAILURE,
					userDetailUpdateError,
				),
			);
		});
};
