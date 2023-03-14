import {
	// FORCE_UPDATE_GET_API_REQUEST,
	// FORCE_UPDATE_GET_API_SUCCESS,
	// FORCE_UPDATE_GET_API_FAILURE,
	//
	SET_SPLASH,
	//
	SET_USER,
	//
	SET_TOKEN,
	//
	SET_USER_ONBOARDING_SCREEN,
	//
	SHOW_USER_ONBOARDING_SCREEN,
	//
	ACCOUNT_DELETE_API_REQUEST,
	ACCOUNT_DELETE_API_SUCCESS,
	ACCOUNT_DELETE_API_FAILURE,
	//
	RESET_STORE,
} from './constant/ActionTypes';

import analytics from '@react-native-firebase/analytics';
import AsyncStorage from '@react-native-community/async-storage';

import {presentAlert} from './Alert';
// import {presentLoader, hideLoader} from './Loader';

import * as api from '../../services/axios/Api';

export const setSplash = (splashData) => {
	return {
		type: SET_SPLASH,
		payload: splashData,
	};
};

export const setUser = (user) => (dispatch) => {
	dispatch({
		type: SET_USER,
		payload: user,
	});
};

// set user on-boarding screen
export const setUserOnboarding = (onboarding) => (dispatch) => {
	dispatch({
		type: SET_USER_ONBOARDING_SCREEN,
		payload: onboarding,
	});
};

// show user on-boarding screen
export const showUserOnboarding = (val) => (dispatch) => {
	dispatch({
		type: SHOW_USER_ONBOARDING_SCREEN,
		payload: val,
	});
};

export const setToken = (tokenData) => (dispatch) => {
	dispatch({
		type: SET_TOKEN,
		payload: tokenData.accessToken,
	});
};

// GET force update app
// const forceUpdateApiRequestAction = () => (dispatch) => {
// 	dispatch({
// 		type: FORCE_UPDATE_GET_API_REQUEST,
// 	});
// };

// const forceUpdateApiSuccessAction = (forceUpdateSuccess) => (dispatch) => {
// 	dispatch({
// 		type: FORCE_UPDATE_GET_API_SUCCESS,
// 		payload: forceUpdateSuccess,
// 	});
// };

// const forceUpdateApiFailureAction = (forceUpdateFailure) => (dispatch) => {
// 	dispatch({
// 		type: FORCE_UPDATE_GET_API_FAILURE,
// 		payload: forceUpdateFailure,
// 	});

// 	// if (forceUpdateFailure !== undefined) {
// 	// let alertConfig = {
// 	// 	title: 'Oops!',
// 	// 	message: forceUpdateFailure,
// 	// 	showCancelButton: false,
// 	// };
// 	// dispatch(presentAlert(alertConfig));
// 	// }
// };

// DELETE user account
const userAccountDeleteApiRequestAction = () => (dispatch, getState) => {
	dispatch({
		type: ACCOUNT_DELETE_API_REQUEST,
	});

	// dispatch(presentLoader());
};

const userAccountDeleteApiSuccessAction = (userAccountDeleteSuccess) => (
	dispatch,
) => {
	dispatch({
		type: ACCOUNT_DELETE_API_SUCCESS,
		payload: userAccountDeleteSuccess,
	});

	// dispatch(hideLoader());
};

const userAccountDeleteApiFailureAction = (userAccountDeleteFailure) => (
	dispatch,
) => {
	dispatch({
		type: ACCOUNT_DELETE_API_FAILURE,
		payload: userAccountDeleteFailure,
	});

	if (userAccountDeleteFailure !== undefined) {
		let alertConfig = {
			title: 'Oops!',
			message: userAccountDeleteFailure,
			showCancelButton: false,
		};

		// dispatch(hideLoader());
		dispatch(presentAlert(alertConfig));
	}
};

// GET force update app
// export const forceUpdateApi = () => (dispatch) => {
// 	dispatch(forceUpdateApiRequestAction());

// 	api
// 		.forceUpdate()
// 		.then((response) => {
// 			if (response.data.code === 200) {
// 				dispatch(forceUpdateApiSuccessAction(response.data.data.force));
// 				//
// 			} else {
// 				dispatch(forceUpdateApiFailureAction(response.data.message));
// 			}
// 		})
// 		.catch((error) => {
// 			dispatch(forceUpdateApiFailureAction(error.response.data.message));
// 		});
// };

// DELETE user account
export const userAccountDeleteApi = (body) => (dispatch, getState) => {
	dispatch(userAccountDeleteApiRequestAction());

	api
		.userAccountDelete(body)
		.then(async (response) => {
			if (response.data.code === 200) {
				const keys = [
					'user',
					'accessToken',
					'userId',
					'searchData',
					'loginWith',
				];
				try {
					await AsyncStorage.multiRemove(keys);
				} catch (e) {
					console.log('Error in user account delete ==> ', e);
				}

				dispatch(resetStore());
				dispatch(userAccountDeleteApiSuccessAction(response.data.message));

				analytics().logEvent('remove_account_success');
				//
			} else {
				dispatch(userAccountDeleteApiFailureAction(response.data.message));
			}
		})
		.catch((error) => {
			analytics().logEvent('remove_account_failure');
			dispatch(userAccountDeleteApiFailureAction(error.response.data.message));
		});
};

export const resetStore = () => {
	return {
		type: RESET_STORE,
	};
};
