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
} from '../actions/constant/ActionTypes';

const INITIAL_STATE = {
	categoriesList: [],
	categoriesPickerList: [],
	categoriesHirePickerList: [],
	categoriesSalePickerList: [],
	categoriesForBothPickerList: [],
	filterSearchCategoriesPickerList: [],
	subCategoriesList: [],
	subCategoriesPickerList: [],
	filterSearchSubCategoriesPickerList: [],
};

const CategoriesReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case CATEGORIES_GET_API_REQUEST:
			return {
				...state,
			};

		case CATEGORIES_GET_API_SUCCESS:
			return {
				...state,
				categoriesList:
					action.payload.data.length > 0 ? action.payload.data : [],

				categoriesPickerList:
					action.payload.categoriesPickerList.length > 0
						? action.payload.categoriesPickerList
						: [],

				categoriesHirePickerList:
					action.payload.categoriesHirePickerList.length > 0
						? action.payload.categoriesHirePickerList
						: [],

				categoriesSalePickerList:
					action.payload.categoriesSalePickerList.length > 0
						? action.payload.categoriesSalePickerList
						: [],

				categoriesForBothPickerList:
					action.payload.categoriesForBothPickerList.length > 0
						? action.payload.categoriesForBothPickerList
						: [],

				filterSearchCategoriesPickerList:
					action.payload.filterSearchCategoriesPickerList.length > 0
						? action.payload.filterSearchCategoriesPickerList
						: [],
			};

		case CATEGORIES_GET_API_FAILURE:
			return {
				...state,
			};

		case SUB_CATEGORIES_GET_API_REQUEST:
			return {
				...state,
			};

		case SUB_CATEGORIES_GET_API_SUCCESS:
			return {
				...state,
				subCategoriesList:
					action.payload.data.length > 0 ? action.payload.data : [],

				subCategoriesPickerList:
					action.payload.subCategoriesPickerList.length > 0
						? action.payload.subCategoriesPickerList
						: [],

				filterSearchSubCategoriesPickerList:
					action.payload.filterSearchSubCategoriesPickerList.length > 0
						? action.payload.filterSearchSubCategoriesPickerList
						: [],
			};

		case SUB_CATEGORIES_GET_API_FAILURE:
			return {
				...state,
			};

		case RESET_STORE:
			return {
				...state,
				categoriesList: [],
				categoriesPickerList: [],
				categoriesHirePickerList: [],
				categoriesSalePickerList: [],
				categoriesForBothPickerList: [],
				filterSearchCategoriesPickerList: [],
				subCategoriesList: [],
				subCategoriesPickerList: [],
				filterSearchSubCategoriesPickerList: [],
			};

		default:
			return state;
	}
};

export default CategoriesReducer;
