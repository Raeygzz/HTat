import {
	RESET_NAVIGATION_ROUTES,
	RESET_STORE,
} from '../actions/constant/ActionTypes';

const INITIAL_STATE = {
	resetNavigationRoutes: false,
};

const ResetNavigationReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case RESET_NAVIGATION_ROUTES:
			return {
				...state,
				resetNavigationRoutes: action.payload,
			};

		case RESET_STORE:
			return {
				...state,
				resetNavigationRoutes: false,
			};

		default:
			return state;
	}
};

export default ResetNavigationReducer;
