import {
	PRESENT_MODAL_LOADER,
	HIDE_MODAL_LOADER,
	RESET_STORE,
} from './constant/ActionTypes';

export const presentModalLoader = () => {
	return {
		type: PRESENT_MODAL_LOADER,
	};
};

export const hideModalLoader = () => {
	return {
		type: HIDE_MODAL_LOADER,
	};
};

export const resetStore = () => {
	return {
		type: RESET_STORE,
	};
};
