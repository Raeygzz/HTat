import {
	PRESENT_ALERT,
	HIDE_ALERT,
	RESET_ONLY_ALERT_FROM_STORE,
	RESET_STORE,
} from './constant/ActionTypes';

export const presentAlert = (modalPayload) => {
	return {
		type: PRESENT_ALERT,
		payload: modalPayload,
	};
};

export const hideModal = () => {
	return {
		type: HIDE_ALERT,
	};
};

export const resetOnlyAlertFromStore = () => {
	return {
		type: RESET_ONLY_ALERT_FROM_STORE,
	};
};

export const resetStore = () => {
	return {
		type: RESET_STORE,
	};
};
