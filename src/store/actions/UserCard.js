import {
	ADD_CARD_WEBVIEW_GET_API_REQUEST,
	ADD_CARD_WEBVIEW_GET_API_SUCCESS,
	ADD_CARD_WEBVIEW_GET_API_FAILURE,
	//
	CLEAR_ADD_CARD_HTML,
	//
	LIST_USER_CARD_GET_API_REQUEST,
	LIST_USER_CARD_GET_API_SUCCESS,
	LIST_USER_CARD_GET_API_FAILURE,
	//
	DEFAULT_CARD_POST_API_REQUEST,
	DEFAULT_CARD_POST_API_SUCCESS,
	DEFAULT_CARD_POST_API_FAILURE,
	//
	CARD_DELETE_API_REQUEST,
	CARD_DELETE_API_SUCCESS,
	CARD_DELETE_API_FAILURE,
	//
	CARD_DELETE_DEFAULT_SUCCESS,
	//
	PRESENT_SAVED_CARD_SCREEN_MODAL,
	HIDE_SAVED_CARD_SCREEN_MODAL,
	//
	RESET_STORE,
} from './constant/ActionTypes';

import {presentAlert} from './Alert';
import {presentLoader, hideLoader} from './Loader';

import * as api from '../../services/axios/Api';

// reset store
export const resetStore = () => {
	return {
		type: RESET_STORE,
	};
};

// clear add card html
export const clearAddCardHtml = () => {
	return {
		type: CLEAR_ADD_CARD_HTML,
	};
};

// default card success
export const deleteDefaultCardSuccess = (val) => {
	return {
		type: CARD_DELETE_DEFAULT_SUCCESS,
		payload: val,
	};
};

// saved card payment modal
export const presentSavedCardPaymentScreenModal = () => {
	return {
		type: PRESENT_SAVED_CARD_SCREEN_MODAL,
	};
};

export const hideSavedCardPaymentScreenModal = () => {
	return {
		type: HIDE_SAVED_CARD_SCREEN_MODAL,
	};
};

// GET / POST user card
const userCardRequestAction = (type) => (dispatch) => {
	dispatch({
		type: type,
	});

	// if (
	// 	type !== 'ADD_CARD_WEBVIEW_GET_API_REQUEST' &&
	// 	type !== 'DEFAULT_CARD_POST_API_REQUEST' &&
	// 	type !== 'CARD_DELETE_API_REQUEST'
	// ) {
	// 	dispatch(presentLoader());
	// }
};

const userCardSuccessAction = (type, userCardSuccess) => (dispatch) => {
	dispatch({
		type: type,
		payload: userCardSuccess,
	});

	if (
		type === 'DEFAULT_CARD_POST_API_SUCCESS' ||
		type === 'CARD_DELETE_API_SUCCESS'
	) {
		dispatch(deleteDefaultCardSuccess(true));
	}

	// if (
	// 	type !== 'ADD_CARD_WEBVIEW_GET_API_SUCCESS' &&
	// 	type !== 'DEFAULT_CARD_POST_API_SUCCESS' &&
	// 	type !== 'CARD_DELETE_API_SUCCESS'
	// ) {
	// 	dispatch(hideLoader());
	// }
};

const userCardFailureAction = (type, userCardFailure) => (dispatch) => {
	dispatch({
		type: type,
		payload: userCardFailure,
	});

	if (userCardFailure !== undefined) {
		dispatch(hideLoader());

		if (type === 'ADD_CARD_WEBVIEW_GET_API_FAILURE') {
			let alertConfig = {
				title: 'Sorry!',
				message:
					'There was a problem while loading the add card web view. Please try again.',
			};

			dispatch(presentAlert(alertConfig));
			//
		} else if (type === 'LIST_USER_CARD_GET_API_FAILURE') {
			let alertConfig = {
				title: 'Sorry!',
				message:
					'There was a problem while fetching card list. Please try again.',
			};

			dispatch(presentAlert(alertConfig));
			//
		} else if (type === 'DEFAULT_CARD_POST_API_FAILURE') {
			let alertConfig = {
				title: 'Sorry!',
				message:
					'There was a problem while making selected card default. Please try again.',
			};

			dispatch(presentAlert(alertConfig));
			//
		} else if (type === 'CARD_DELETE_API_FAILURE') {
			let alertConfig = {
				title: 'Sorry!',
				message:
					'There was a problem while deleting selected card. Please try again.',
			};

			dispatch(presentAlert(alertConfig));
			//
		}
	}
};

// GET add card in web view
export const addCardApi = () => (dispatch) => {
	dispatch(userCardRequestAction(ADD_CARD_WEBVIEW_GET_API_REQUEST));

	api
		.addCard()
		.then((response) => {
			dispatch(
				userCardSuccessAction(ADD_CARD_WEBVIEW_GET_API_SUCCESS, response.data),
			);
		})
		.catch((error) => {
			dispatch(
				userCardFailureAction(
					ADD_CARD_WEBVIEW_GET_API_FAILURE,
					error.response.data.message,
				),
			);
		});
};

// GET list user cards
export const listUserCardsApi = () => (dispatch) => {
	dispatch(userCardRequestAction(LIST_USER_CARD_GET_API_REQUEST));

	api
		.listUserCards()
		.then((response) => {
			if (response.data.code === 200) {
				let finalResponse = {};
				let apiResponse = response.data.data;
				// console.log('apiResponse ==> ', apiResponse);

				if (apiResponse.data.length > 0) {
					let defaultCard = {};
					let filteredCardList = [];

					for (let i = 0; i < apiResponse.data.length; i++) {
						filteredCardList.push({
							id: apiResponse.data[i].id,
							defaultCard:
								apiResponse.default_card === apiResponse.data[i].id
									? true
									: false,
							cardNumber: apiResponse.data[i].card.last4,
							cardBrand: apiResponse.data[i].card.brand,
							expiryMonth:
								apiResponse.data[i].card.exp_month > 9
									? apiResponse.data[i].card.exp_month
									: `0${apiResponse.data[i].card.exp_month}`,
							expiryYear: apiResponse.data[i].card.exp_year,
						});
					}

					for (var i = 0; i < filteredCardList.length; i++) {
						if (filteredCardList[i].defaultCard) {
							defaultCard = filteredCardList[i];
							filteredCardList.splice(i, 1);
						}
					}

					if (Object.keys(defaultCard).length != 0) {
						filteredCardList.unshift(defaultCard);
					}

					filteredCardList.push({id: response.data.data.data.length + 100});
					// console.warn('filteredCardList ==> ', filteredCardList);

					finalResponse = {
						filteredCardList: filteredCardList,
						cardList: response.data.data.data,
						cardDetails: {
							defaultCard: response.data.data.default_card,
							hasMore: response.data.data.has_more,
							object: response.data.data.object,
							url: response.data.data.url,
						},
					};
				}

				dispatch(
					userCardSuccessAction(LIST_USER_CARD_GET_API_SUCCESS, finalResponse),
				);
			} else {
				dispatch(
					userCardFailureAction(
						LIST_USER_CARD_GET_API_FAILURE,
						response.data.message,
					),
				);
			}
		})
		.catch((error) => {
			dispatch(
				userCardFailureAction(
					LIST_USER_CARD_GET_API_FAILURE,
					error.response.data.message,
				),
			);
		});
};

// POST make card default
export const defaultCardApi = (cardID) => (dispatch) => {
	dispatch(userCardRequestAction(DEFAULT_CARD_POST_API_REQUEST));

	api
		.defaultCard(cardID)
		.then((response) => {
			if (response.data.code === 200) {
				dispatch(
					userCardSuccessAction(
						DEFAULT_CARD_POST_API_SUCCESS,
						response.data.message,
					),
				);
			} else {
				dispatch(
					userCardFailureAction(
						DEFAULT_CARD_POST_API_FAILURE,
						response.data.error,
					),
				);
			}
		})
		.catch((error) => {
			dispatch(
				userCardFailureAction(
					DEFAULT_CARD_POST_API_FAILURE,
					error.response.data.message,
				),
			);
		});
};

// DELETE card
export const deleteCardApi = (cardID) => (dispatch) => {
	dispatch(userCardRequestAction(CARD_DELETE_API_REQUEST));

	api
		.deleteCard(cardID)
		.then((response) => {
			if (response.data.code === 200) {
				dispatch(
					userCardSuccessAction(CARD_DELETE_API_SUCCESS, response.data.message),
				);
			} else {
				dispatch(
					userCardFailureAction(CARD_DELETE_API_FAILURE, response.data.error),
				);
			}
		})
		.catch((error) => {
			dispatch(
				userCardFailureAction(
					CARD_DELETE_API_FAILURE,
					error.response.data.message,
				),
			);
		});
};
