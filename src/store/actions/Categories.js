import {
	CATEGORIES_GET_API_REQUEST,
	CATEGORIES_GET_API_SUCCESS,
	CATEGORIES_GET_API_FAILURE,
	//
	SUB_CATEGORIES_GET_API_REQUEST,
	SUB_CATEGORIES_GET_API_SUCCESS,
	SUB_CATEGORIES_GET_API_FAILURE,
	//
	RESET_STORE,
} from './constant/ActionTypes';

import {presentAlert} from './Alert';
import {presentLoader, hideLoader} from './Loader';
import {presentModalLoader, hideModalLoader} from './ModalLoader';

import * as api from '../../services/axios/Api';

export const resetStore = () => {
	return {
		type: RESET_STORE,
	};
};

// Get categories / sub categories
const categoriesGetApiRequestAction = (type, modalLoader) => (dispatch) => {
	dispatch({
		type: type,
	});

	// modalLoader ? dispatch(presentModalLoader()) : dispatch(presentLoader());
};

const categoriesGetApiSuccessAction = (
	type,
	categoriesSuccess,
	modalLoader,
) => (dispatch) => {
	dispatch({
		type: type,
		payload: categoriesSuccess,
	});

	// modalLoader ? dispatch(hideModalLoader()) : dispatch(hideLoader());
};

const categoriesGetApiFailureAction = (
	type,
	categoriesFailure,
	modalLoader,
) => (dispatch) => {
	dispatch({
		type: type,
		payload: categoriesFailure,
	});

	if (categoriesFailure !== undefined) {
		let alertConfig = {
			title: 'Sorry!',
			message: categoriesFailure,
		};

		dispatch(hideLoader());
		dispatch(hideModalLoader());
		dispatch(presentAlert(alertConfig));
	}
};

// GET categories
export const categoriesApi = (modalLoader = false) => (dispatch) => {
	dispatch(
		categoriesGetApiRequestAction(CATEGORIES_GET_API_REQUEST, modalLoader),
	);

	api
		.categories()
		.then((response) => {
			if (response.data.code === 200) {
				let categoriesPickerList = [];
				let categoriesHirePickerList = [];
				let categoriesSalePickerList = [];
				let categoriesForBothPickerList = [];
				let filterSearchCategoriesPickerList = [];
				for (let i = 0; i < response.data.data.length; i++) {
					// categoriesHirePickerList
					if (response.data.data[i].is_for_hire === 1) {
						categoriesHirePickerList.push({
							id: response.data.data[i].id.toString(),
							label: response.data.data[i].name,
							value: response.data.data[i].id.toString(),
						});
					}

					// categoriesSalePickerList
					if (response.data.data[i].is_for_sale === 1) {
						categoriesSalePickerList.push({
							id: response.data.data[i].id.toString(),
							label: response.data.data[i].name,
							value: response.data.data[i].id.toString(),
						});
					}

					// categoriesForBothPickerList
					if (
						response.data.data[i].is_for_hire === 1 &&
						response.data.data[i].is_for_sale === 1
					) {
						categoriesForBothPickerList.push({
							id: response.data.data[i].id.toString(),
							label: response.data.data[i].name,
							value: response.data.data[i].id.toString(),
						});
					}

					// categoriesPickerList
					categoriesPickerList.push({
						id: response.data.data[i].id.toString(),
						label: response.data.data[i].name,
						value: response.data.data[i].id.toString(),
					});

					// filterSearchCategoriesPickerList
					filterSearchCategoriesPickerList.push({
						id: response.data.data[i].id.toString(),
						label: response.data.data[i].name,
						value: response.data.data[i].id.toString(),
					});
				}

				// if (categoriesHirePickerList.length > 0) {
				// 	categoriesHirePickerList.unshift({
				// 		id: '-1',
				// 		label: '--Select--',
				// 		value: '--Select--',
				// 	});
				// }

				// if (categoriesSalePickerList.length > 0) {
				// 	categoriesSalePickerList.unshift({
				// 		id: '-1',
				// 		label: '--Select--',
				// 		value: '--Select--',
				// 	});
				// }

				// if (categoriesForBothPickerList.length > 0) {
				// 	categoriesForBothPickerList.unshift({
				// 		id: '-1',
				// 		label: '--Select--',
				// 		value: '--Select--',
				// 	});
				// }

				filterSearchCategoriesPickerList.unshift({
					id: '-1',
					label: '--Select--',
					value: '--Select--',
				});

				let categoriesResData = {
					data: response.data.data,
					categoriesPickerList: categoriesPickerList,
					categoriesHirePickerList: categoriesHirePickerList,
					categoriesSalePickerList: categoriesSalePickerList,
					categoriesForBothPickerList: categoriesForBothPickerList,
					filterSearchCategoriesPickerList: filterSearchCategoriesPickerList,
				};
				dispatch(
					categoriesGetApiSuccessAction(
						CATEGORIES_GET_API_SUCCESS,
						categoriesResData,
						modalLoader,
					),
				);
			} else {
				dispatch(
					categoriesGetApiFailureAction(
						CATEGORIES_GET_API_FAILURE,
						response.data.message,
						modalLoader,
					),
				);
			}
		})
		.catch((error) => {
			dispatch(
				categoriesGetApiFailureAction(
					CATEGORIES_GET_API_FAILURE,
					`Some thing went wrong. Please try again!`,
					// error.response.data.message,
					modalLoader,
				),
			);
		});
};

// GET sub categories
export const subCategoriesApi = (categoryId, modalLoader = false) => (
	dispatch,
) => {
	dispatch(
		categoriesGetApiRequestAction(SUB_CATEGORIES_GET_API_REQUEST, modalLoader),
	);

	api
		.subCategories(categoryId)
		.then((response) => {
			if (response.data.code === 200) {
				let subCategoriesPickerList = [];
				let filterSearchSubCategoriesPickerList = [];
				for (let i = 0; i < response.data.data.length; i++) {
					subCategoriesPickerList.push({
						id: response.data.data[i].id.toString(),
						label: response.data.data[i].name,
						value: response.data.data[i].id.toString(),
					});

					filterSearchSubCategoriesPickerList.push({
						id: response.data.data[i].id.toString(),
						label: response.data.data[i].name,
						value: response.data.data[i].id.toString(),
					});
				}

				filterSearchSubCategoriesPickerList.unshift({
					id: '-1',
					label: '--Select--',
					value: '--Select--',
				});

				let subCategoriesResData = {
					data: response.data.data,
					subCategoriesPickerList: subCategoriesPickerList,
					filterSearchSubCategoriesPickerList: filterSearchSubCategoriesPickerList,
				};

				dispatch(
					categoriesGetApiSuccessAction(
						SUB_CATEGORIES_GET_API_SUCCESS,
						subCategoriesResData,
						modalLoader,
					),
				);
			} else {
				dispatch(
					categoriesGetApiFailureAction(
						SUB_CATEGORIES_GET_API_FAILURE,
						response.data.message,
						modalLoader,
					),
				);
			}
		})
		.catch((error) => {
			dispatch(
				categoriesGetApiFailureAction(
					SUB_CATEGORIES_GET_API_FAILURE,
					`Some thing went wrong. Please try again!`,
					// error.response.data.message,
					modalLoader,
				),
			);
		});
};
