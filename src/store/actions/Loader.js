import {PRESENT_LOADER, HIDE_LOADER, RESET_STORE} from './constant/ActionTypes';

export const presentLoader = () => {
	return {
		type: PRESENT_LOADER,
	};
};

export const hideLoader = () => {
	return {
		type: HIDE_LOADER,
	};
};

export const resetStore = () => {
	return {
		type: RESET_STORE,
	};
};
