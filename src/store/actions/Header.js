import {HEADER_TITLE, RESET_STORE} from './constant/ActionTypes';

export const headerTitle = (leftTitle) => {
	return {
		type: HEADER_TITLE,
		payload: leftTitle,
	};
};

export const resetStore = () => {
	return {
		type: RESET_STORE,
	};
};
