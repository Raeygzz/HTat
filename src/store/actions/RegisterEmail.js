import {
	APPLE_REGISTRATION_POST_API_REQUEST,
	APPLE_REGISTRATION_POST_API_SUCCESS,
	APPLE_REGISTRATION_POST_API_FAILURE,
	//
	FACEBOOK_REGISTRATION_POST_API_REQUEST,
	FACEBOOK_REGISTRATION_POST_API_SUCCESS,
	FACEBOOK_REGISTRATION_POST_API_FAILURE,
	//
	REGISTER_POST_API_REQUEST,
	REGISTER_POST_API_SUCCESS,
	REGISTER_POST_API_FAILURE,
	//
	PRESENT_SOCIAL_MEDIA_TERMS_POLICIES,
	HIDE_SOCIAL_MEDIA_TERMS_POLICIES,
	//
	RESET_STORE,
} from './constant/ActionTypes';

// import {Analytics} from '../../services/analytics';
import analytics from '@react-native-firebase/analytics';
import AsyncStorage from '@react-native-community/async-storage';

import {setError} from './Error';
import {presentAlert} from './Alert';
import {presentLoader, hideLoader} from './Loader';
import {setUser, setToken, setUserOnboarding} from './Auth';

import * as api from '../../services/axios/Api';

// reset store
export const resetStore = () => {
	return {
		type: RESET_STORE,
	};
};

// social media terms policies modal
export const presentSocialMediaTermsPolicies = () => {
	return {
		type: PRESENT_SOCIAL_MEDIA_TERMS_POLICIES,
	};
};

export const hideSocialMediaTermsPolicies = () => {
	return {
		type: HIDE_SOCIAL_MEDIA_TERMS_POLICIES,
	};
};

// SOCIAL MEDIA user registration
const socialMediaApiRequestAction = (type) => (dispatch) => {
	dispatch({
		type: type,
	});

	dispatch(presentLoader());
};

const socialMediaApiSuccessAction = (type, socialMediaSuccess) => (
	dispatch,
) => {
	dispatch({
		type: type,
		payload: socialMediaSuccess,
	});

	dispatch(
		setUserOnboarding({
			showUserOnboardingScreen:
				socialMediaSuccess.user.has_primary_address != 1 ? true : false,
		}),
	);

	dispatch(
		setUser({
			user: socialMediaSuccess.user,
		}),
	);

	dispatch(
		setToken({
			accessToken: socialMediaSuccess.access_token,
		}),
	);

	dispatch(hideLoader());
};

const socialMediaApiFailureAction = (type, socialMediaFailure) => (
	dispatch,
) => {
	dispatch({
		type: type,
		payload: socialMediaFailure,
	});

	if (socialMediaFailure !== undefined) {
		let alertConfig = {
			title: 'Sorry!',
			message: socialMediaFailure,
			showCancelButton: false,
		};

		dispatch(hideLoader());
		dispatch(presentAlert(alertConfig));
	}
};

// USER REGISTRATION through email and password
const registerEmailApiRequestAction = (type) => (dispatch, getState) => {
	dispatch({
		type: type,
	});

	dispatch(presentLoader());
};

const registerEmailApiSuccessAction = (
	type,
	registerEmailSuccess,
	// navigation,
) => (dispatch) => {
	dispatch({
		type: type,
		payload: registerEmailSuccess,
	});

	let alertConfig = {
		data: registerEmailSuccess,
		title: 'Registration Success',
		showCancelButton: false,
		shouldRunFunction: true,
		functionHandler: 'registrationSuccessHandler',
		message: 'RegistrationSuccess',
	};

	dispatch(hideLoader());
	dispatch(presentAlert(alertConfig));

	// dispatch(
	// 	setUserOnboarding({
	// 		showUserOnboardingScreen:
	// 			registerEmailSuccess.user.has_primary_address != 1 ? true : false,
	// 	}),
	// );

	// dispatch(
	// 	setUser({
	// 		user: registerEmailSuccess.user,
	// 	}),
	// );

	// dispatch(
	// 	setToken({
	// 		accessToken: registerEmailSuccess.access_token,
	// 	}),
	// );

	// console.log('==registration=analytics==');
	// Analytics('register_email_success', {
	// 	id: JSON.stringify(registerEmailSuccess.user.id),
	// });

	analytics().logEvent('register_through_email_success', {
		registeredUserId: JSON.stringify(registerEmailSuccess.user.id),
	});
	analytics().setUserId(JSON.stringify(registerEmailSuccess.user.id));
	analytics().setUserProperties({
		['registeredUsername']:
			registerEmailSuccess.user.first_name +
			' ' +
			registerEmailSuccess.user.last_name,
	});

	// navigation.navigate('Welcome');
};

const registerEmailApiFailureAction = (type, registerEmailFailure) => (
	dispatch,
) => {
	dispatch({
		type: type,
		payload: registerEmailFailure,
	});

	if (registerEmailFailure !== undefined) {
		let errorConfig = {
			showError: true,
			message: 'The email has already been taken.',
		};

		dispatch(hideLoader());
		dispatch(setError(errorConfig));
	}
};

// SOCIAL MEDIA APPLE user registration
export const appleRegistrationApi = (body) => (dispatch) => {
	dispatch(socialMediaApiRequestAction(APPLE_REGISTRATION_POST_API_REQUEST));

	api
		.appleRegistration(body)
		.then((response) => {
			if (response.data.code === 200) {
				AsyncStorage.setItem(
					'userId',
					JSON.stringify(response.data.data.user.id),
				);
				AsyncStorage.setItem('accessToken', response.data.data.access_token);
				AsyncStorage.setItem('user', JSON.stringify(response.data.data.user));
				AsyncStorage.setItem('loginWith', response.data.data.user.login_with);
				dispatch(
					socialMediaApiSuccessAction(
						APPLE_REGISTRATION_POST_API_SUCCESS,
						response.data.data,
					),
				);
			} else {
				dispatch(
					socialMediaApiFailureAction(
						APPLE_REGISTRATION_POST_API_FAILURE,
						response.data.message,
					),
				);
			}
		})
		.catch((error) => {
			dispatch(
				socialMediaApiFailureAction(
					APPLE_REGISTRATION_POST_API_FAILURE,
					`Some thing went wrong. Please try again!`,
					// error.response.data.errors,
				),
			);
		});
};

// SOCIAL MEDIA FACEBOOK user registration
export const facebookRegistrationApi = (body) => (dispatch) => {
	dispatch(socialMediaApiRequestAction(FACEBOOK_REGISTRATION_POST_API_REQUEST));

	api
		.facebookRegistration(body)
		.then((response) => {
			if (response.data.code === 200) {
				AsyncStorage.setItem(
					'userId',
					JSON.stringify(response.data.data.user.id),
				);
				AsyncStorage.setItem('accessToken', response.data.data.access_token);
				AsyncStorage.setItem('user', JSON.stringify(response.data.data.user));
				AsyncStorage.setItem('loginWith', response.data.data.user.login_with);
				dispatch(
					socialMediaApiSuccessAction(
						FACEBOOK_REGISTRATION_POST_API_SUCCESS,
						response.data.data,
					),
				);
			} else {
				dispatch(
					socialMediaApiFailureAction(
						FACEBOOK_REGISTRATION_POST_API_FAILURE,
						response.data.message,
					),
				);
			}
		})
		.catch((error) => {
			dispatch(
				socialMediaApiFailureAction(
					FACEBOOK_REGISTRATION_POST_API_FAILURE,
					`Some thing went wrong. Please try again!`,
					// error.response.data.errors,
				),
			);
		});
};

// POST email registration
export const registerEmailApi = (
	data,
	// navigation
) => (dispatch, getState) => {
	dispatch(registerEmailApiRequestAction(REGISTER_POST_API_REQUEST));

	api
		.registerEmail(data)
		.then((response) => {
			if (
				response.data.code === 200 &&
				response.data.message ===
					'Congratulations You are Registered Successfully'
			) {
				AsyncStorage.setItem(
					'userId',
					JSON.stringify(response.data.data.user.id),
				);
				AsyncStorage.setItem('accessToken', response.data.data.access_token);
				AsyncStorage.setItem('user', JSON.stringify(response.data.data.user));
				AsyncStorage.setItem('loginWith', response.data.data.user.login_with);

				dispatch(
					registerEmailApiSuccessAction(
						REGISTER_POST_API_SUCCESS,
						response.data.data,
						// navigation,
					),
				);
			} else {
				dispatch(
					registerEmailApiFailureAction(
						REGISTER_POST_API_FAILURE,
						response.data.message,
					),
				);
			}
		})
		.catch((error) => {
			dispatch(
				registerEmailApiFailureAction(
					REGISTER_POST_API_FAILURE,
					error.response.data.message,
				),
			);
		});
};
