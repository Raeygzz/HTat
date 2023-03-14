import {RESET_NAVIGATION_ROUTES, RESET_STORE} from './constant/ActionTypes';

// Reset store
export const resetStore = () => {
	return {
		type: RESET_STORE,
	};
};

// Reset navigation routes
export const resetNavigationRoutes = (reset) => {
	return {
		type: RESET_NAVIGATION_ROUTES,
		payload: reset,
	};
};
