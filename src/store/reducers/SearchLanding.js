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
} from '../actions/constant/ActionTypes';

const INITIAL_STATE = {
	materialTopTabFocusedScreen: '',
	hireLinks: {},
	hireMeta: {},
	isHireSearchItem: [],
	FSIHireApiLoaded: false,
	filterSearchHireData: {},
	filterSearchHireApiPaginationEnabled: false,
	saleLinks: {},
	saleMeta: {},
	isSaleSearchItem: [],
	FSIBuyApiLoaded: false,
	filterSearchBuyData: {},
	showFilterNSort: true,
	nearMeHireApiPaginationEnabled: false,
	nearMeBuyApiPaginationEnabled: false,
	filterSearchSaleApiPaginationEnabled: false,
	presentFilterHireSearchItemScreenModal: false,
	presentFilterBuySearchItemScreenModal: false,
	presentSearchItemSortScreenModal: false,
	presentDetailFinanceScreenModal: false,
	postAdvertFromSearchLandingScreen: false,
};

const ScreenLandingReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case SEARCH_ITEM_HIRE_POST_API_REQUEST:
			return {
				...state,
			};

		case SEARCH_ITEM_HIRE_POST_API_SUCCESS:
			return {
				...state,
				hireLinks: action.payload.links
					? !state.FSIHireApiLoaded
						? action.payload.links
						: state.hireLinks
					: {},
				hireMeta: action.payload.meta
					? !state.FSIHireApiLoaded
						? action.payload.meta
						: state.hireMeta
					: {},
				isHireSearchItem:
					action.payload?.isHireSearchItem?.length > 0
						? action.payload.meta.current_page === 1
							? action.payload.isHireSearchItem
							: [...state.isHireSearchItem, ...action.payload.isHireSearchItem]
						: action.payload?.meta?.current_page === 1
						? []
						: state.isHireSearchItem,
			};

		case SEARCH_ITEM_HIRE_POST_API_FAILURE:
			return {
				...state,
			};

		case SEARCH_ITEM_BUY_POST_API_REQUEST:
			return {
				...state,
			};

		case SEARCH_ITEM_BUY_POST_API_SUCCESS:
			return {
				...state,
				saleLinks: action.payload.links
					? !state.FSIBuyApiLoaded
						? action.payload.links
						: state.saleLinks
					: {},
				saleMeta: action.payload.meta
					? !state.FSIBuyApiLoaded
						? action.payload.meta
						: state.saleMeta
					: {},
				isSaleSearchItem:
					action.payload?.isSaleSearchItem?.length > 0
						? action.payload.meta.current_page === 1
							? action.payload.isSaleSearchItem
							: [...state.isSaleSearchItem, ...action.payload.isSaleSearchItem]
						: action.payload?.meta?.current_page === 1
						? []
						: state.isSaleSearchItem,
			};

		case SEARCH_ITEM_BUY_POST_API_FAILURE:
			return {
				...state,
			};

		case NEAR_ME_HIRE_POST_API_REQUEST:
			return {
				...state,
			};

		case NEAR_ME_HIRE_POST_API_SUCCESS:
			return {
				...state,
				hireLinks: action.payload.links
					? !state.FSIHireApiLoaded
						? action.payload.links
						: state.hireLinks
					: {},
				hireMeta: action.payload.meta
					? !state.FSIHireApiLoaded
						? action.payload.meta
						: state.hireMeta
					: {},
				isHireSearchItem:
					action.payload?.isHireSearchItem?.length > 0
						? action.payload.meta.current_page === 1
							? action.payload.isHireSearchItem
							: [...state.isHireSearchItem, ...action.payload.isHireSearchItem]
						: action.payload?.meta?.current_page === 1
						? []
						: state.isHireSearchItem,
				showFilterNSort: false,
				nearMeHireApiPaginationEnabled:
					action.payload.nearMeHireApiPaginationEnabled,
			};

		case NEAR_ME_HIRE_POST_API_FAILURE:
			return {
				...state,
			};

		case NEAR_ME_BUY_POST_API_REQUEST:
			return {
				...state,
			};

		case NEAR_ME_BUY_POST_API_SUCCESS:
			return {
				...state,
				saleLinks: action.payload.links
					? !state.FSIBuyApiLoaded
						? action.payload.links
						: state.saleLinks
					: {},
				saleMeta: action.payload.meta
					? !state.FSIBuyApiLoaded
						? action.payload.meta
						: state.saleMeta
					: {},
				isSaleSearchItem:
					action.payload?.isSaleSearchItem?.length > 0
						? action.payload.meta.current_page === 1
							? action.payload.isSaleSearchItem
							: [...state.isSaleSearchItem, ...action.payload.isSaleSearchItem]
						: action.payload?.meta?.current_page === 1
						? []
						: state.isSaleSearchItem,
				showFilterNSort: false,
				nearMeBuyApiPaginationEnabled:
					action.payload.nearMeBuyApiPaginationEnabled,
			};

		case NEAR_ME_BUY_POST_API_FAILURE:
			return {
				...state,
			};

		case MATERIAL_TOP_TAB_FOCUSED_SCREEN:
			return {
				...state,
				materialTopTabFocusedScreen: action.payload,
			};

		case PRESENT_FILTER_HIRE_SEARCH_ITEM_SCREEN_MODAL:
			return {
				...state,
				presentFilterHireSearchItemScreenModal: true,
			};

		case HIDE_FILTER_HIRE_SEARCH_ITEM_SCREEN_MODAL:
			return {
				...state,
				presentFilterHireSearchItemScreenModal: false,
			};

		case PRESENT_FILTER_BUY_SEARCH_ITEM_SCREEN_MODAL:
			return {
				...state,
				presentFilterBuySearchItemScreenModal: true,
			};

		case HIDE_FILTER_BUY_SEARCH_ITEM_SCREEN_MODAL:
			return {
				...state,
				presentFilterBuySearchItemScreenModal: false,
			};

		case PRESENT_SEARCH_ITEM_SORT_SCREEN_MODAL:
			return {
				...state,
				presentSearchItemSortScreenModal: true,
			};

		case HIDE_SEARCH_ITEM_SORT_SCREEN_MODAL:
			return {
				...state,
				presentSearchItemSortScreenModal: false,
			};

		case POST_ADVERT_FROM_SEARCH_LANDING_SCREEN:
			return {
				...state,
				postAdvertFromSearchLandingScreen: action.payload,
			};

		case FILTER_SEARCH_ITEM_POST_API_REQUEST:
			return {
				...state,
			};

		case FILTER_SEARCH_ITEM_POST_API_SUCCESS:
			return {
				...state,
				hireLinks: action.payload.hireLinks ? action.payload.hireLinks : {},
				hireMeta: action.payload.hireMeta ? action.payload.hireMeta : {},
				isHireSearchItem:
					action.payload.data.length > 0
						? action.payload.hireMeta.current_page === 1
							? action.payload.data
							: [...state.isHireSearchItem, ...action.payload.data]
						: action.payload.hireMeta.current_page === 1
						? []
						: state.isHireSearchItem,
				filterSearchHireData: action.payload.hireBody,
				filterSearchHireApiPaginationEnabled:
					action.payload.filterSearchHireApiPaginationEnabled,
				FSIHireApiLoaded: true,
			};

		case FILTER_SEARCH_ITEM_POST_API_FAILURE:
			return {
				...state,
			};

		case FILTER_SEARCH_ITEM_BUY_POST_API_REQUEST:
			return {
				...state,
			};

		case FILTER_SEARCH_ITEM_BUY_POST_API_SUCCESS:
			return {
				...state,
				saleLinks: action.payload.saleLinks ? action.payload.saleLinks : {},
				saleMeta: action.payload.saleMeta ? action.payload.saleMeta : {},
				isSaleSearchItem:
					action.payload.data.length > 0
						? action.payload.saleMeta.current_page === 1
							? action.payload.data
							: [...state.isSaleSearchItem, ...action.payload.data]
						: action.payload.saleMeta.current_page === 1
						? []
						: state.isSaleSearchItem,
				filterSearchBuyData: action.payload.buyBody,
				filterSearchSaleApiPaginationEnabled:
					action.payload.filterSearchSaleApiPaginationEnabled,
				FSIBuyApiLoaded: true,
			};

		case FILTER_SEARCH_ITEM_BUY_POST_API_FAILURE:
			return {
				...state,
			};

		case RESET_FILTER_SEARCH_DATA:
			return {
				...state,
				filterSearchHireData: {},
				filterSearchBuyData: {},
				FSIHireApiLoaded: false,
				FSIBuyApiLoaded: false,
				showFilterNSort: true,
				filterSearchHireApiPaginationEnabled: false,
				filterSearchSaleApiPaginationEnabled: false,
			};

		case PRESENT_DETAIL_FINANCE_SCREEN_MODAL:
			return {
				...state,
				presentDetailFinanceScreenModal: true,
			};

		case HIDE_DETAIL_FINANCE_SCREEN_MODAL:
			return {
				...state,
				presentDetailFinanceScreenModal: false,
			};

		case RESET_STORE:
			return {
				...state,
				materialTopTabFocusedScreen: '',
				hireLinks: {},
				hireMeta: {},
				isHireSearchItem: [],
				FSIHireApiLoaded: false,
				filterSearchHireData: {},
				filterSearchHireApiPaginationEnabled: false,
				saleLinks: {},
				saleMeta: {},
				isSaleSearchItem: [],
				FSIBuyApiLoaded: false,
				filterSearchBuyData: {},
				showFilterNSort: true,
				nearMeHireApiPaginationEnabled: false,
				nearMeBuyApiPaginationEnabled: false,
				filterSearchSaleApiPaginationEnabled: false,
				presentFilterHireSearchItemScreenModal: false,
				presentFilterBuySearchItemScreenModal: false,
				presentSearchItemSortScreenModal: false,
				presentDetailFinanceScreenModal: false,
				postAdvertFromSearchLandingScreen: false,
			};

		default:
			return state;
	}
};

export default ScreenLandingReducer;
