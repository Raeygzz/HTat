import {
	LOGIN_POST_API_REQUEST,
	LOGIN_POST_API_SUCCESS,
	LOGIN_POST_API_FAILURE,
	FORGOT_PASSWORD_POST_API_REQUEST,
	FORGOT_PASSWORD_POST_API_SUCCESS,
	FORGOT_PASSWORD_POST_API_FAILURE,
} from './constant/ActionTypes';

// import {Analytics} from '../../services/analytics';
import analytics from '@react-native-firebase/analytics';
import AsyncStorage from '@react-native-community/async-storage';

import {setError} from './Error';
import {setSuccess} from './Success';
import {presentLoader, hideLoader} from './Loader';
import {setUser, setToken, setUserOnboarding} from './Auth';

import * as api from '../../services/axios/Api';

// POST login & forgot password
const loginApiRequestAction = (type) => (dispatch, getState) => {
	dispatch({
		type: type,
	});

	dispatch(presentLoader());
};

const loginApiSuccessAction = (type, loginSuccess) => (dispatch) => {
	dispatch({
		type: type,
		payload: loginSuccess,
	});

	if (type === 'LOGIN_POST_API_SUCCESS') {
		dispatch(
			setUserOnboarding({
				showUserOnboardingScreen:
					loginSuccess.user.has_primary_address != 1 ? true : false,
			}),
		);

		dispatch(
			setUser({
				user: loginSuccess.user,
			}),
		);

		dispatch(
			setToken({
				accessToken: loginSuccess.access_token,
			}),
		);

		// console.log('==login=analytics==');
		// Analytics('login_email_success', {
		// 	id: JSON.stringify(loginSuccess.user.id),
		// });

		analytics().logEvent('login_through_email_success', {
			loggedInUserId: JSON.stringify(loginSuccess.user.id),
		});
		analytics().setUserId(JSON.stringify(loginSuccess.user.id));
		analytics().setUserProperties({
			['loggedInUsername']:
				loginSuccess.user.first_name + ' ' + loginSuccess.user.last_name,
		});
	}

	if (type === 'FORGOT_PASSWORD_POST_API_SUCCESS') {
		// if (loginSuccess === 'passwords.sent') {
		let successConfig = {
			showSuccess: true,
			message: 'Successful. Password reset link has been send to your email.',
		};

		dispatch(setSuccess(successConfig));
		// }
	}

	dispatch(hideLoader());
};

const loginApiFailureAction = (type, loginFailure) => (dispatch) => {
	dispatch({
		type: type,
		payload: loginFailure,
	});

	if (loginFailure !== undefined) {
		if (type === 'LOGIN_POST_API_FAILURE') {
			analytics().logEvent('login_through_email_failure');

			let errorConfig = {
				showError: true,
				message: 'Sorry the email or password you entered is incorrect.',
			};

			dispatch(setError(errorConfig));
			//
		} else if (type === 'FORGOT_PASSWORD_POST_API_FAILURE') {
			let errorConfig = {
				showError: true,
				message: 'Please enter the valid email for password reset.',
			};

			dispatch(setError(errorConfig));
		}

		dispatch(hideLoader());
	}
};

// POST login
export const loginApi = (data) => (dispatch, getState) => {
	dispatch(loginApiRequestAction(LOGIN_POST_API_REQUEST));

	api
		.login(data)
		.then((response) => {
			if (
				response.data.code === 200 &&
				response.data.message !== 'Invalid login credentials'
			) {
				AsyncStorage.setItem(
					'userId',
					JSON.stringify(response.data.data.user.id),
				);
				AsyncStorage.setItem('accessToken', response.data.data.access_token);
				AsyncStorage.setItem('user', JSON.stringify(response.data.data.user));
				AsyncStorage.setItem('loginWith', response.data.data.user.login_with);
				dispatch(
					loginApiSuccessAction(LOGIN_POST_API_SUCCESS, response.data.data),
				);
			} else {
				dispatch(
					loginApiFailureAction(LOGIN_POST_API_FAILURE, response.data.message),
				);
			}
		})
		.catch((error) => {
			dispatch(
				loginApiFailureAction(
					LOGIN_POST_API_FAILURE,
					error.response.data.message,
				),
			);
		});
};

// POST forgot password
export const forgotPasswordApi = (data) => (dispatch, getState) => {
	dispatch(loginApiRequestAction(FORGOT_PASSWORD_POST_API_REQUEST));

	api
		.forgotPassword(data)
		.then((response) => {
			if (response?.status === 200) {
				dispatch(
					loginApiSuccessAction(
						FORGOT_PASSWORD_POST_API_SUCCESS,
						response.data.message,
					),
				);
			}
			// else {
			// 	dispatch(
			// 		loginApiFailureAction(
			// 			FORGOT_PASSWORD_POST_API_FAILURE,
			// 			response.data.message,
			// 		),
			// 	);
			// }
		})
		.catch((error) => {
			dispatch(
				loginApiFailureAction(
					FORGOT_PASSWORD_POST_API_FAILURE,
					error.response.data?.errors?.email[0],
				),
			);
		});
};
