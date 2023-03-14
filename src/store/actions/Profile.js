import {
	PRESENT_ADDRESS_SCREEN_MODAL,
	HIDE_ADDRESS_SCREEN_MODAL,
	//
	ADDRESS_ADD_SUCCESS,
	//
	CREATE_ADDRESS_POST_API_REQUEST,
	CREATE_ADDRESS_POST_API_SUCCESS,
	CREATE_ADDRESS_POST_API_FAILURE,
	//
	USER_ONBOARDING_ADDRESS_POST_API_REQUEST,
	USER_ONBOARDING_ADDRESS_POST_API_SUCCESS,
	USER_ONBOARDING_ADDRESS_POST_API_FAILURE,
	//
	ADDRESS_PUT_API_REQUEST,
	ADDRESS_PUT_API_SUCCESS,
	ADDRESS_PUT_API_FAILURE,
	//
	ADDRESS_BY_ID_GET_API_REQUEST,
	ADDRESS_BY_ID_GET_API_SUCCESS,
	ADDRESS_BY_ID_GET_API_FAILURE,
	//
	ADDRESS_LIST_GET_API_REQUEST,
	ADDRESS_LIST_GET_API_SUCCESS,
	ADDRESS_LIST_GET_API_FAILURE,
	//
	ADDRESS_BY_ID_DELETE_API_REQUEST,
	ADDRESS_BY_ID_DELETE_API_SUCCESS,
	ADDRESS_BY_ID_DELETE_API_FAILURE,
	//
	ADDRESS_RESPONSE_MESSAGE,
	//
	RESET_STORE,
} from './constant/ActionTypes';

import {presentAlert} from './Alert';
import {setUser, showUserOnboarding} from './Auth';
import {presentLoader, hideLoader} from './Loader';
import {presentModalLoader, hideModalLoader} from './ModalLoader';

import analytics from '@react-native-firebase/analytics';
import AsyncStorage from '@react-native-community/async-storage';

import * as api from '../../services/axios/Api';

// Reset store
export const resetStore = () => {
	return {
		type: RESET_STORE,
	};
};

// Address screen modal
export const presentAddressScreenModal = () => {
	return {
		type: PRESENT_ADDRESS_SCREEN_MODAL,
	};
};

export const hideAddressScreenModal = () => {
	return {
		type: HIDE_ADDRESS_SCREEN_MODAL,
	};
};

// address add success
export const addressAddSuccess = (addSuccess) => {
	return {
		type: ADDRESS_ADD_SUCCESS,
		payload: addSuccess,
	};
};

// address message from api response
export const addressResponseMessage = () => {
	return {
		type: ADDRESS_RESPONSE_MESSAGE,
	};
};

// POST / PUT / GET / DELETE  addresses api
const addressesApiRequestAction = (type, modalLoader) => (dispatch) => {
	dispatch({
		type: type,
	});

	if (type !== 'ADDRESS_LIST_GET_API_REQUEST') {
		modalLoader ? dispatch(presentModalLoader()) : dispatch(presentLoader());
	}
};

const addressesApiSuccessAction = (
	type,
	addressesSuccess,
	navigation,
	onboardingAddress,
	modalLoader,
) => (dispatch, getState) => {
	const userData = getState().auth.user;
	const hasPrimaryCard = getState().auth.user.has_primary_card;
	const showUserOnboardingScreen = getState().auth.showUserOnboardingScreen;

	// console.log('type ==> ', type);
	// console.log('addressesSuccess ==> ', addressesSuccess);
	// console.log('navigation ==> ', navigation);
	// console.log('onboardingAddress ==> ', onboardingAddress);
	// console.log('modalLoader ==> ', modalLoader);

	dispatch({
		type: type,
		payload: addressesSuccess,
	});

	if (type === 'USER_ONBOARDING_ADDRESS_POST_API_SUCCESS') {
		modalLoader ? dispatch(hideModalLoader()) : dispatch(hideLoader());

		let user = {
			id: userData.id,
			first_name: userData.first_name,
			last_name: userData.last_name,
			email: userData.email,
			login_with: userData.login_with,
			completed_stripe_onboarding: userData.completed_stripe_onboarding,
			has_primary_card: userData.has_primary_card,
			has_primary_address: 1,
			has_business_profile: userData.has_business_profile,
		};

		dispatch(
			setUser({
				user: user,
			}),
		);
		AsyncStorage.setItem('user', JSON.stringify(user));

		dispatch(showUserOnboarding(false));

		// if (hasPrimaryCard !== 1) {
		// 	dispatch(showUserOnboarding(false));
		// 	setTimeout(() => {
		// 		navigation.navigate('ManagePayments');
		// 	}, 0);
		// } else {
		// 	if (!showUserOnboardingScreen) {
		// 		navigation.goBack();
		// 	} else {
		// 		dispatch(showUserOnboarding(false));
		// 	}
		// }
	}

	if (type === 'CREATE_ADDRESS_POST_API_SUCCESS') {
		dispatch(addressAddSuccess(true));
		modalLoader ? dispatch(hideModalLoader()) : dispatch(hideLoader());
		dispatch(addressResponseMessage());
		dispatch(hideAddressScreenModal());

		if (onboardingAddress) {
			let user = {
				id: userData.id,
				first_name: userData.first_name,
				last_name: userData.last_name,
				email: userData.email,
				login_with: userData.login_with,
				completed_stripe_onboarding: userData.completed_stripe_onboarding,
				has_primary_card: userData.has_primary_card,
				has_primary_address: 1,
				has_business_profile: userData.has_business_profile,
			};

			dispatch(
				setUser({
					user: user,
				}),
			);

			AsyncStorage.setItem('user', JSON.stringify(user));
		}
	}

	if (type === 'ADDRESS_PUT_API_SUCCESS') {
		dispatch(addressAddSuccess(true));
		modalLoader ? dispatch(hideModalLoader()) : dispatch(hideLoader());
		dispatch(addressResponseMessage());
		dispatch(hideAddressScreenModal());
	}

	if (type === 'ADDRESS_BY_ID_GET_API_SUCCESS') {
		modalLoader ? dispatch(hideModalLoader()) : dispatch(hideLoader());
	}

	if (type === 'ADDRESS_BY_ID_DELETE_API_SUCCESS') {
		dispatch(addressAddSuccess(true));
		modalLoader ? dispatch(hideModalLoader()) : dispatch(hideLoader());
		dispatch(addressResponseMessage());
		dispatch(hideAddressScreenModal());
	}
};

const addressesApiFailureAction = (type, addressesFailure) => (dispatch) => {
	dispatch({
		type: type,
		payload: addressesFailure,
	});

	if (addressesFailure !== undefined) {
		dispatch(hideLoader());
		dispatch(hideModalLoader());

		if (type !== 'ADDRESS_BY_ID_DELETE_API_FAILURE') {
			let alertConfig = {
				title: 'Sorry!',
				message: addressesFailure,
			};

			dispatch(presentAlert(alertConfig));
		}
	}
};

// POST create address
export const createAddressApi = (
	data,
	navigation = '',
	onboardingAddress = false,
	modalLoader = false,
) => (dispatch) => {
	dispatch(
		addressesApiRequestAction(CREATE_ADDRESS_POST_API_REQUEST, modalLoader),
	);

	api
		.createAddress(data)
		.then((response) => {
			if (response.data.code === 200) {
				dispatch(
					addressesApiSuccessAction(
						CREATE_ADDRESS_POST_API_SUCCESS,
						response.data.message,
						navigation,
						onboardingAddress,
						modalLoader,
					),
				);

				analytics().logEvent('add_address_success', {
					name: data.name,
					address_line_1: data.address_line_1,
					address_line_2: data.address_line_2,
					city: data.city,
					country: data.country,
					post_code: data.post_code,
					is_primary: data.is_primary,
				});
				//
			} else {
				dispatch(
					addressesApiFailureAction(
						CREATE_ADDRESS_POST_API_FAILURE,
						response.data.message,
					),
				);
			}
		})
		.catch((error) => {
			dispatch(
				addressesApiFailureAction(
					CREATE_ADDRESS_POST_API_FAILURE,
					`Some thing went wrong. Please try again`,
					// error.response.data.message,
				),
			);
		});
};

// POST add user address while on-boarding
export const userOnboardingAddressApi = (
	data,
	navigation = '',
	onboardingAddress = false,
	modalLoader = false,
) => (dispatch) => {
	dispatch(
		addressesApiRequestAction(
			USER_ONBOARDING_ADDRESS_POST_API_REQUEST,
			modalLoader,
		),
	);

	api
		.createAddress(data)
		.then((response) => {
			if (response.data.code === 200) {
				dispatch(
					addressesApiSuccessAction(
						USER_ONBOARDING_ADDRESS_POST_API_SUCCESS,
						response.data.message,
						navigation,
						onboardingAddress,
						modalLoader,
					),
				);
			} else {
				dispatch(
					addressesApiFailureAction(
						USER_ONBOARDING_ADDRESS_POST_API_FAILURE,
						response.data.message,
					),
				);
			}
		})
		.catch((error) => {
			dispatch(
				addressesApiFailureAction(
					USER_ONBOARDING_ADDRESS_POST_API_FAILURE,
					error.response.data.message,
				),
			);
		});
};

// PUT update address
export const updateAddressApi = (
	data,
	param,
	navigation = '',
	onboardingAddress = false,
	modalLoader = false,
) => (dispatch) => {
	dispatch(addressesApiRequestAction(ADDRESS_PUT_API_REQUEST, modalLoader));

	api
		.updateAddress(data, param)
		.then((response) => {
			if (response.data.code === 200) {
				dispatch(
					addressesApiSuccessAction(
						ADDRESS_PUT_API_SUCCESS,
						response.data.message,
						navigation,
						onboardingAddress,
						modalLoader,
					),
				);
			} else {
				dispatch(
					addressesApiFailureAction(
						ADDRESS_PUT_API_FAILURE,
						response.data.message,
					),
				);
			}
		})
		.catch((error) => {
			dispatch(
				addressesApiFailureAction(
					ADDRESS_PUT_API_FAILURE,
					`Some thing went wrong. Please try again`,
					// error.response.data.message
				),
			);
		});
};

// GET addresses list
export const addressListApi = () => (dispatch) => {
	dispatch(addressesApiRequestAction(ADDRESS_LIST_GET_API_REQUEST));

	api
		.addressList()
		.then((response) => {
			if (response.data.code === 200) {
				let addressPickerList = [];
				for (let i = 0; i < response.data.data.length; i++) {
					addressPickerList.push({
						id: response.data.data[i].id.toString(),
						label: response.data.data[i].name,
						value: response.data.data[i].name,
						// value: response.data.data[i].id.toString(),
						postcode: response.data.data[i].post_code,
						lat: response.data.data[i].latitude,
						lon: response.data.data[i].longitude,
					});
				}

				let addressList = response.data.data;
				let addressesLength = {id: response.data.data.length + 100};

				addressList.push(addressesLength);

				let addressesResponse = {
					addressList: addressList,
					addressPickerList: addressPickerList,
				};
				dispatch(
					addressesApiSuccessAction(
						ADDRESS_LIST_GET_API_SUCCESS,
						addressesResponse,
					),
				);
			} else {
				dispatch(
					addressesApiFailureAction(
						ADDRESS_LIST_GET_API_FAILURE,
						response.data.message,
					),
				);
			}
		})
		.catch((error) => {
			dispatch(
				addressesApiFailureAction(
					ADDRESS_LIST_GET_API_FAILURE,
					`Some thing went wrong. Please try again!`,
					// error.response.data.message
				),
			);
		});
};

// GET address by id
export const addressByIdApi = (
	data,
	navigation = '',
	onboardingAddress = false,
	modalLoader = false,
) => (dispatch) => {
	dispatch(
		addressesApiRequestAction(ADDRESS_BY_ID_GET_API_REQUEST, modalLoader),
	);

	api
		.addressById(data)
		.then((response) => {
			if (response.data.code === 200) {
				dispatch(
					addressesApiSuccessAction(
						ADDRESS_BY_ID_GET_API_SUCCESS,
						response.data.data,
						navigation,
						onboardingAddress,
						modalLoader,
					),
				);
			} else {
				dispatch(
					addressesApiFailureAction(
						ADDRESS_BY_ID_GET_API_FAILURE,
						response.data.message,
					),
				);
			}
		})
		.catch((error) => {
			dispatch(
				addressesApiFailureAction(
					ADDRESS_BY_ID_GET_API_FAILURE,
					`Some thing went wrong. Please try again!`,
					// error.response.data.message,
				),
			);
		});
};

// DELETE address by id
export const deleteAddressApi = (
	data,
	navigation = '',
	onboardingAddress = false,
	modalLoader = false,
) => (dispatch) => {
	dispatch(
		addressesApiRequestAction(ADDRESS_BY_ID_DELETE_API_REQUEST, modalLoader),
	);

	api
		.deleteAddressById(data)
		.then((response) => {
			if (response.data.code === 200) {
				dispatch(
					addressesApiSuccessAction(
						ADDRESS_BY_ID_DELETE_API_SUCCESS,
						response.data.message,
						navigation,
						onboardingAddress,
						modalLoader,
					),
				);
			} else {
				dispatch(
					addressesApiFailureAction(
						ADDRESS_BY_ID_DELETE_API_FAILURE,
						response.data.message,
					),
				);
			}
		})
		.catch((error) => {
			dispatch(
				addressesApiFailureAction(
					ADDRESS_BY_ID_DELETE_API_FAILURE,
					error.response.data.message,
				),
			);
		});
};
