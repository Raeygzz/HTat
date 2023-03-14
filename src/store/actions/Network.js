import {SET_NET_INFO, RESET_STORE} from './constant/ActionTypes';

import {presentAlert} from './Alert';

export const showNetInfo = () => (dispatch) => {
	dispatch({
		type: SET_NET_INFO,
		payload: false,
	});

	netInfoData = {
		title: 'Oops!',
		message:
			'Looks like your device is not connected to internet. Please try again.',
		showCancelButton: false,
	};

	dispatch(presentAlert(netInfoData));
};

export const resetStore = () => {
	return {
		type: RESET_STORE,
	};
};
