import {
	SEARCH_ITEM_HIRE_POST_API_REQUEST,
	SEARCH_ITEM_HIRE_POST_API_SUCCESS,
	SEARCH_ITEM_HIRE_POST_API_FAILURE,
	//
	SEARCH_ITEM_BUY_POST_API_REQUEST,
	SEARCH_ITEM_BUY_POST_API_SUCCESS,
	SEARCH_ITEM_BUY_POST_API_FAILURE,
	//
	MATERIAL_TOP_TAB_FOCUSED_SCREEN,
	//
	PRESENT_FILTER_HIRE_SEARCH_ITEM_SCREEN_MODAL,
	HIDE_FILTER_HIRE_SEARCH_ITEM_SCREEN_MODAL,
	//
	PRESENT_FILTER_BUY_SEARCH_ITEM_SCREEN_MODAL,
	HIDE_FILTER_BUY_SEARCH_ITEM_SCREEN_MODAL,
	//
	PRESENT_SEARCH_ITEM_SORT_SCREEN_MODAL,
	HIDE_SEARCH_ITEM_SORT_SCREEN_MODAL,
	//
	FILTER_SEARCH_ITEM_POST_API_REQUEST,
	FILTER_SEARCH_ITEM_POST_API_SUCCESS,
	FILTER_SEARCH_ITEM_POST_API_FAILURE,
	//
	FILTER_SEARCH_ITEM_BUY_POST_API_REQUEST,
	FILTER_SEARCH_ITEM_BUY_POST_API_SUCCESS,
	FILTER_SEARCH_ITEM_BUY_POST_API_FAILURE,
	//
	RESET_FILTER_SEARCH_DATA,
	//
	PRESENT_DETAIL_FINANCE_SCREEN_MODAL,
	HIDE_DETAIL_FINANCE_SCREEN_MODAL,
	//
	POST_ADVERT_FROM_SEARCH_LANDING_SCREEN,
	//
	NEAR_ME_HIRE_POST_API_REQUEST,
	NEAR_ME_HIRE_POST_API_SUCCESS,
	NEAR_ME_HIRE_POST_API_FAILURE,
	//
	NEAR_ME_BUY_POST_API_REQUEST,
	NEAR_ME_BUY_POST_API_SUCCESS,
	NEAR_ME_BUY_POST_API_FAILURE,
	//
	RESET_STORE,
} from './constant/ActionTypes';

import analytics from '@react-native-firebase/analytics';
import AsyncStorage from '@react-native-community/async-storage';

import {presentAlert} from './Alert';
import {clearTextInputReq} from './ClearTextInput';
import {presentLoader, hideLoader} from './Loader';
import {presentModalLoader, hideModalLoader} from './ModalLoader';

import * as api from '../../services/axios/Api';

export const resetStore = () => {
	return {
		type: RESET_STORE,
	};
};

// material top tab focused screen
export const materialTopTabFocusedScreen = (focused) => {
	return {
		type: MATERIAL_TOP_TAB_FOCUSED_SCREEN,
		payload: focused,
	};
};

// filter search item HIRE screen modal
export const presentFilterHireSearchItemScreenModal = () => {
	return {
		type: PRESENT_FILTER_HIRE_SEARCH_ITEM_SCREEN_MODAL,
	};
};

export const hideFilterHireSearchItemScreenModal = () => {
	return {
		type: HIDE_FILTER_HIRE_SEARCH_ITEM_SCREEN_MODAL,
	};
};

// filter search item BUY screen modal
export const presentFilterBuySearchItemScreenModal = () => {
	return {
		type: PRESENT_FILTER_BUY_SEARCH_ITEM_SCREEN_MODAL,
	};
};

export const hideFilterBuySearchItemScreenModal = () => {
	return {
		type: HIDE_FILTER_BUY_SEARCH_ITEM_SCREEN_MODAL,
	};
};

// search item sort screen modal
export const presentSearchItemSortScreenModal = () => {
	return {
		type: PRESENT_SEARCH_ITEM_SORT_SCREEN_MODAL,
	};
};

export const hideSearchItemSortScreenModal = () => {
	return {
		type: HIDE_SEARCH_ITEM_SORT_SCREEN_MODAL,
	};
};

// reset filter search data
export const resetFilterSearchData = () => {
	return {
		type: RESET_FILTER_SEARCH_DATA,
	};
};

// detail finance screen modal
export const presentDetailFinanceScreenModal = () => {
	return {
		type: PRESENT_DETAIL_FINANCE_SCREEN_MODAL,
	};
};

export const hideDetailFinanceScreenModal = () => {
	return {
		type: HIDE_DETAIL_FINANCE_SCREEN_MODAL,
	};
};

// post advert from seach landing screen
export const postAdvertFromSearchLandingScreen = (val) => {
	return {
		type: POST_ADVERT_FROM_SEARCH_LANDING_SCREEN,
		payload: val,
	};
};

// POST search item HIRE
const searchItemHireApiRequestAction = (modalLoader) => (dispatch) => {
	dispatch({
		type: SEARCH_ITEM_HIRE_POST_API_REQUEST,
	});

	modalLoader ? dispatch(presentModalLoader()) : dispatch(presentLoader());
};

const searchItemHireApiSuccessAction = (
	searchItemHireSuccess,
	searchData,
	navigation,
	modalLoader,
) => (dispatch) => {
	dispatch({
		type: SEARCH_ITEM_HIRE_POST_API_SUCCESS,
		payload: searchItemHireSuccess,
	});

	modalLoader ? dispatch(hideModalLoader()) : dispatch(hideLoader());

	console.log('== 4 ==');
	dispatch(clearTextInputReq(true));

	if (searchData != '') {
		AsyncStorage.setItem('searchData', JSON.stringify(searchData));
	}

	if (navigation != '') {
		navigation.navigate('SearchResults');

		// if (IOS) {
		// 	dispatch(clearSearchLandingPickerValue(true));
		// }
	} else {
		dispatch(hideFilterHireSearchItemScreenModal());
		// dispatch(hideFilterBuySearchItemScreenModal());
	}
};

const searchItemHireApiFailureAction = (searchItemHireFailure, modalLoader) => (
	dispatch,
) => {
	dispatch({
		type: SEARCH_ITEM_HIRE_POST_API_FAILURE,
		payload: searchItemHireFailure,
	});

	if (searchItemHireFailure !== undefined) {
		let alertConfig = {
			title: 'Sorry!',
			message: searchItemHireFailure,
			showCancelButton: false,
		};

		dispatch(hideLoader());
		dispatch(hideModalLoader());
		dispatch(presentAlert(alertConfig));
	}
};

// POST search item BUY
const searchItemBuyApiRequestAction = (modalLoader) => (dispatch) => {
	dispatch({
		type: SEARCH_ITEM_BUY_POST_API_REQUEST,
	});

	modalLoader ? dispatch(presentModalLoader()) : dispatch(presentLoader());
};

const searchItemBuyApiSuccessAction = (
	searchItemBuySuccess,
	searchData,
	navigation,
	modalLoader,
) => (dispatch) => {
	dispatch({
		type: SEARCH_ITEM_BUY_POST_API_SUCCESS,
		payload: searchItemBuySuccess,
	});

	modalLoader ? dispatch(hideModalLoader()) : dispatch(hideLoader());

	// console.log('== 4 ==');
	// dispatch(clearTextInputReq(true));

	// if (searchData != '') {
	// 	AsyncStorage.setItem('searchData', JSON.stringify(searchData));
	// }

	// if (navigation != '') {
	// 	navigation.navigate('SearchResults');

	// 	// if (IOS) {
	// 	// 	dispatch(clearSearchLandingPickerValue(true));
	// 	// }
	// } else {
	// 	dispatch(hideFilterHireSearchItemScreenModal());
	dispatch(hideFilterBuySearchItemScreenModal());
	// }
};

const searchItemBuyApiFailureAction = (searchItemBuyFailure, modalLoader) => (
	dispatch,
) => {
	dispatch({
		type: SEARCH_ITEM_BUY_POST_API_FAILURE,
		payload: searchItemBuyFailure,
	});

	if (searchItemBuyFailure !== undefined) {
		let alertConfig = {
			title: 'Sorry!',
			message: searchItemBuyFailure,
			showCancelButton: false,
		};

		dispatch(hideLoader());
		dispatch(hideModalLoader());
		dispatch(presentAlert(alertConfig));
	}
};

// POST near-me item HIRE
const nearMeHireApiRequestAction = () => (dispatch) => {
	dispatch({
		type: NEAR_ME_HIRE_POST_API_REQUEST,
	});

	// dispatch(presentLoader());
};

const nearMeHireApiSuccessAction = (
	nearMeHireSuccess,
	searchData,
	navigation,
) => (dispatch) => {
	dispatch({
		type: NEAR_ME_HIRE_POST_API_SUCCESS,
		payload: nearMeHireSuccess,
	});

	dispatch(hideLoader());

	// dispatch(clearTextInputReq(true));

	if (searchData != '') {
		AsyncStorage.setItem('searchData', JSON.stringify(searchData));
	}

	if (navigation != '') {
		navigation.navigate('SearchResults');
	}
};

const nearMeHireApiFailureAction = (nearMeHireFailure) => (dispatch) => {
	dispatch({
		type: NEAR_ME_HIRE_POST_API_FAILURE,
		payload: nearMeHireFailure,
	});

	if (nearMeHireFailure !== undefined) {
		let alertConfig = {
			title: 'Sorry!',
			message: nearMeHireFailure,
			showCancelButton: false,
		};

		dispatch(hideLoader());
		dispatch(presentAlert(alertConfig));
	}
};

// POST near-me item BUY
const nearMeBuyApiRequestAction = () => (dispatch) => {
	dispatch({
		type: NEAR_ME_BUY_POST_API_REQUEST,
	});

	// dispatch(presentLoader());
};

const nearMeBuyApiSuccessAction = (
	nearMeBuySuccess,
	searchData,
	navigation,
) => (dispatch) => {
	dispatch({
		type: NEAR_ME_BUY_POST_API_SUCCESS,
		payload: nearMeBuySuccess,
	});

	// dispatch(hideLoader());

	// dispatch(clearTextInputReq(true));

	// if (searchData != '') {
	// 	AsyncStorage.setItem('searchData', JSON.stringify(searchData));
	// }

	// if (navigation != '') {
	// 	navigation.navigate('SearchResults');
	// }
	// else {
	// 	dispatch(hideFilterHireSearchItemScreenModal());
	// 	dispatch(hideFilterBuySearchItemScreenModal());
	// }
};

const nearMeBuyApiFailureAction = (nearMeBuyFailure) => (dispatch) => {
	dispatch({
		type: NEAR_ME_BUY_POST_API_FAILURE,
		payload: nearMeBuyFailure,
	});

	if (nearMeBuyFailure !== undefined) {
		let alertConfig = {
			title: 'Sorry!',
			message: nearMeBuyFailure,
			showCancelButton: false,
		};

		dispatch(hideLoader());
		dispatch(presentAlert(alertConfig));
	}
};

// POST filter search HIRE item
const filterSearchItemHireApiRequestAction = (modalLoader) => (dispatch) => {
	dispatch({
		type: FILTER_SEARCH_ITEM_POST_API_REQUEST,
	});

	modalLoader ? dispatch(presentModalLoader()) : dispatch(presentLoader());
};

const filterSearchItemHireApiSuccessAction = (
	filterSearchItemHireSuccess,
	modalLoader,
) => (dispatch) => {
	dispatch({
		type: FILTER_SEARCH_ITEM_POST_API_SUCCESS,
		payload: filterSearchItemHireSuccess,
	});

	modalLoader ? dispatch(hideModalLoader()) : dispatch(hideLoader());

	dispatch(hideFilterHireSearchItemScreenModal());
	dispatch(hideSearchItemSortScreenModal());
	console.log('== 5 ==');
	dispatch(clearTextInputReq(true));
};

const filterSearchItemHireApiFailureAction = (
	filterSearchItemHireFailure,
	modalLoader,
) => (dispatch) => {
	dispatch({
		type: FILTER_SEARCH_ITEM_POST_API_FAILURE,
		payload: filterSearchItemHireFailure,
	});

	if (filterSearchItemHireFailure !== undefined) {
		let alertConfig = {
			title: 'Sorry!',
			message: filterSearchItemHireFailure,
			showCancelButton: false,
		};

		dispatch(hideLoader());
		dispatch(hideModalLoader());
		dispatch(presentAlert(alertConfig));
	}
};

// POST filter search BUY item
const filterSearchItemBuyApiRequestAction = (modalLoader) => (dispatch) => {
	dispatch({
		type: FILTER_SEARCH_ITEM_BUY_POST_API_REQUEST,
	});

	modalLoader ? dispatch(presentModalLoader()) : dispatch(presentLoader());
};

const filterSearchItemBuyApiSuccessAction = (
	filterSearchItemBuySuccess,
	modalLoader,
) => (dispatch) => {
	dispatch({
		type: FILTER_SEARCH_ITEM_BUY_POST_API_SUCCESS,
		payload: filterSearchItemBuySuccess,
	});

	modalLoader ? dispatch(hideModalLoader()) : dispatch(hideLoader());

	dispatch(hideFilterBuySearchItemScreenModal());
	dispatch(hideSearchItemSortScreenModal());
	console.log('== 5 ==');
	dispatch(clearTextInputReq(true));
};

const filterSearchItemBuyApiFailureAction = (
	filterSearchItemBuyFailure,
	modalLoader,
) => (dispatch) => {
	dispatch({
		type: FILTER_SEARCH_ITEM_BUY_POST_API_FAILURE,
		payload: filterSearchItemBuyFailure,
	});

	if (filterSearchItemBuyFailure !== undefined) {
		let alertConfig = {
			title: 'Sorry!',
			message: filterSearchItemBuyFailure,
			showCancelButton: false,
		};

		dispatch(hideLoader());
		dispatch(hideModalLoader());
		dispatch(presentAlert(alertConfig));
	}
};

// POST search item HIRE
export const searchItemHireApi = (
	searchItemHirePageNumber,
	body,
	navigation = '',
	modalLoader = false,
) => (dispatch, getState) => {
	// console.log('dddd ==> ', searchItemHirePageNumber, body, navigation);
	dispatch(searchItemHireApiRequestAction(modalLoader));

	api
		.searchItemHire(searchItemHirePageNumber, {
			keyword: body.keyword,
			latitude: body.latitude,
			longitude: body.longitude,
			distance: body.distance,
		})
		.then((response) => {
			if (response.data.code === 200) {
				let userId = getState().auth.id;
				let username =
					getState().auth.user.first_name +
					' ' +
					getState().auth.user.last_name;
				let FSIHireApiLoaded = getState().searchLanding.FSIHireApiLoaded;
				let resData = {};
				if (!FSIHireApiLoaded) {
					resData.isHireSearchItem = response.data.data.filter((item, id) => {
						if (item.is_for_hire == 1) {
							return item;
						}
					});
				}

				resData.links = response.data.links;
				resData.meta = response.data.meta;
				// console.log('resData ==> ', resData);
				dispatch(
					searchItemHireApiSuccessAction(
						resData,
						body,
						navigation,
						modalLoader,
					),
				);

				// console.log('==search=analytics==');
				analytics().logEvent('search_item_success', {
					searchItemKeyword: body.keyword,
				});
				analytics().logEvent('search_item_hire_results_count', {
					searchItemHireResultCount: response.data.meta.total,
				});
				if (response.data.data.length === 0) {
					analytics().logEvent('no_data_message_on_search_results');
				}
				analytics().setUserId(JSON.stringify(userId));
				analytics().setUserProperties({['searchItemByUsername']: username});
				if (resData.isHireSearchItem.length > 0) {
					analytics().logEvent('successful_item_listing_in_hire_tab');
				}
				//
			} else {
				dispatch(
					searchItemHireApiFailureAction(response.data.message, modalLoader),
				);
			}
		})
		.catch((error) => {
			dispatch(
				searchItemHireApiFailureAction(
					// error.response.data.message,
					`Some thing went wrong. Please try again!`,
					modalLoader,
				),
			);
		});
};

// POST search item BUY
export const searchItemBuyApi = (
	searchItemBuyPageNumber,
	body,
	navigation = '',
	modalLoader = false,
) => (dispatch, getState) => {
	// console.log('dddd ==> ', searchItemBuyPageNumber, body, navigation);
	dispatch(searchItemBuyApiRequestAction(modalLoader));

	api
		.searchItemBuy(searchItemBuyPageNumber, {
			keyword: body.keyword,
			latitude: body.latitude,
			longitude: body.longitude,
			distance: body.distance,
		})
		.then((response) => {
			if (response.data.code === 200) {
				// let userId = getState().auth.id;
				// let username = getState().auth.user.first_name + ' ' + getState().auth.user.last_name;
				let FSIBuyApiLoaded = getState().searchLanding.FSIBuyApiLoaded;
				let resData = {};
				if (!FSIBuyApiLoaded) {
					resData.isSaleSearchItem = response.data.data.filter((item, id) => {
						if (item.is_for_sale == 1) {
							return item;
						}
					});
				}

				resData.links = response.data.links;
				resData.meta = response.data.meta;
				// console.log('resData ==> ', resData);
				dispatch(
					searchItemBuyApiSuccessAction(resData, body, navigation, modalLoader),
				);

				// console.log('==search=analytics==');
				analytics().logEvent('search_item_buy_results_count', {
					searchItemBuyResultCount: response.data.meta.total,
				});
				if (response.data.data.length === 0) {
					analytics().logEvent('no_data_message_on_search_results');
				}
				// analytics().setUserId(JSON.stringify(userId));
				// analytics().setUserProperties({['searchItemByUsername']: username});
				if (resData.isSaleSearchItem.length > 0) {
					analytics().logEvent('successful_item_listing_in_buy_tab');
				}
				//
			} else {
				dispatch(
					searchItemBuyApiFailureAction(response.data.message, modalLoader),
				);
			}
		})
		.catch((error) => {
			dispatch(
				searchItemBuyApiFailureAction(
					// error.response.data.message,
					`Some thing went wrong. Please try again!`,
					modalLoader,
				),
			);
		});
};

// POST filter search HIRE item
export const filterSearchItemHireApi = (
	filterSearchItemHirePageNumber,
	body,
	modalLoader = false,
) => (dispatch) => {
	dispatch(filterSearchItemHireApiRequestAction(modalLoader));

	api
		.filterSearchItemHire(filterSearchItemHirePageNumber, body)
		.then((response) => {
			if (response.data.code === 200) {
				let resData = {};
				resData.data = response.data.data;
				resData.hireLinks = response.data.links;
				resData.hireMeta = response.data.meta;
				resData.hireBody = body;
				resData.filterSearchHireApiPaginationEnabled =
					response.data.meta.current_page < response.data.meta.last_page
						? true
						: false;

				dispatch(filterSearchItemHireApiSuccessAction(resData, modalLoader));

				// console.log('==search filter hire analytics==');
				analytics().logEvent('search_item_hire_filter', {
					keyword: body.keyword,
					category_id: body.category_id,
					sub_category_id: body.sub_category_id,
					distance: body.distance != null ? body.distance : 'Unlimited',
					min_price: body.min_price,
					max_price: body.max_price,
					sort_by: body.sort_by,
				});

				if (response.data.data.length === 0) {
					analytics().logEvent('no_data_message_on_search_results');
				}

				analytics().logEvent('successful_item_listing_in_hire_tab');
				//
			} else {
				dispatch(
					filterSearchItemHireApiFailureAction(
						response.data.message,
						modalLoader,
					),
				);
			}
		})
		.catch((error) => {
			// console.log('error.response.data ==> ', error.response.data);
			dispatch(
				filterSearchItemHireApiFailureAction(
					// error.response.data.message,
					`Some thing went wrong. Please try again!`,
					modalLoader,
				),
			);
		});
};

// POST filter search BUY item
export const filterSearchItemBuyApi = (
	filterSearchItemBuyPageNumber,
	body,
	modalLoader = false,
) => (dispatch) => {
	dispatch(filterSearchItemBuyApiRequestAction(modalLoader));

	api
		.filterSearchItemBuy(filterSearchItemBuyPageNumber, body)
		.then((response) => {
			if (response.data.code === 200) {
				let resData = {};
				resData.data = response.data.data;
				resData.saleLinks = response.data.links;
				resData.saleMeta = response.data.meta;
				resData.buyBody = body;
				resData.filterSearchSaleApiPaginationEnabled =
					response.data.meta.current_page < response.data.meta.last_page
						? true
						: false;

				dispatch(filterSearchItemBuyApiSuccessAction(resData, modalLoader));

				// console.log('==search filter buy analytics==');
				analytics().logEvent('search_item_buy_filter', {
					keyword: body.keyword,
					category_id: body.category_id,
					sub_category_id: body.sub_category_id,
					distance: body.distance != null ? body.distance : 'Unlimited',
					min_price: body.min_price,
					max_price: body.max_price,
					sort_by: body.sort_by,
				});

				if (response.data.data.length === 0) {
					analytics().logEvent('no_data_message_on_search_results');
				}

				analytics().logEvent('successful_item_listing_in_buy_tab');
				//
			} else {
				dispatch(
					filterSearchItemBuyApiFailureAction(
						response.data.message,
						modalLoader,
					),
				);
			}
		})
		.catch((error) => {
			// console.log('error.response.data ==> ', error.response.data);
			dispatch(
				filterSearchItemBuyApiFailureAction(
					// error.response.data.message,
					`Some thing went wrong. Please try again!`,
					modalLoader,
				),
			);
		});
};

// POST near-me item HIRE
export const nearMeHireApi = (nearMeHirePageNumber, body, navigation = '') => (
	dispatch,
) => {
	// console.log('dddd ==> ', body, navigation);

	dispatch(nearMeHireApiRequestAction());

	api
		.nearMeHire(nearMeHirePageNumber, body)
		.then((response) => {
			if (response.data.code === 200) {
				let resData = {};
				resData.isHireSearchItem = response.data.data.filter((item, id) => {
					if (item.is_for_hire == 1) {
						return item;
					}
				});

				resData.links = response.data.links;
				resData.meta = response.data.meta;
				resData.nearMeHireApiPaginationEnabled =
					response.data.meta.current_page < response.data.meta.last_page
						? true
						: false;

				// console.log('resData ==> ', resData);

				dispatch(nearMeHireApiSuccessAction(resData, body, navigation));

				if (response.data.data.length === 0) {
					analytics().logEvent('no_data_message_on_search_results');
				}
				if (resData.isHireSearchItem.length > 0) {
					analytics().logEvent('successful_item_listing_in_hire_tab');
				}
				//
			} else {
				dispatch(nearMeHireApiFailureAction(response.data.message));
			}
		})
		.catch((error) => {
			dispatch(nearMeHireApiFailureAction(error.response.data.message));
		});
};

// POST near-me item BUY
export const nearMeBuyApi = (nearMeBuyPageNumber, body, navigation = '') => (
	dispatch,
) => {
	// console.log('dddd ==> ', body, navigation);

	dispatch(nearMeBuyApiRequestAction());

	api
		.nearMeBuy(nearMeBuyPageNumber, body)
		.then((response) => {
			if (response.data.code === 200) {
				let resData = {};
				resData.isSaleSearchItem = response.data.data.filter((item, id) => {
					if (item.is_for_sale == 1) {
						return item;
					}
				});

				resData.links = response.data.links;
				resData.meta = response.data.meta;
				resData.nearMeBuyApiPaginationEnabled =
					response.data.meta.current_page < response.data.meta.last_page
						? true
						: false;

				// console.log('resData ==> ', resData);

				dispatch(nearMeBuyApiSuccessAction(resData, body, navigation));

				if (response.data.data.length === 0) {
					analytics().logEvent('no_data_message_on_search_results');
				}
				if (resData.isSaleSearchItem.length > 0) {
					analytics().logEvent('successful_item_listing_in_buy_tab');
				}
				//
			} else {
				dispatch(nearMeBuyApiFailureAction(response.data.message));
			}
		})
		.catch((error) => {
			dispatch(nearMeBuyApiFailureAction(error.response.data.message));
		});
};
