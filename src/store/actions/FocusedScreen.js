import {FOCUSED_SCREEN, RESET_STORE} from './constant/ActionTypes';

export const focusedScreen = (isFocused) => {
	return {
		type: FOCUSED_SCREEN,
		payload: isFocused,
	};
};

export const resetStore = () => {
	return {
		type: RESET_STORE,
	};
};
