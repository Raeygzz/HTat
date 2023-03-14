import {HEADER_TITLE, RESET_STORE} from '../actions/constant/ActionTypes';

const INITIAL_STATE = {
	isBackArrow: false,
	leftTitle: '',
	isRightContent: false,
	rightTitle: '',
	navParam: '',
};

const HeaderReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case HEADER_TITLE:
			return {
				...state,
				isBackArrow: action.payload.isBackArrow
					? action.payload.isBackArrow
					: false,
				leftTitle:
					action.payload.leftTitle != '' ? action.payload.leftTitle : '',
				isRightContent: action.payload.isRightContent
					? action.payload.isRightContent
					: false,
				rightTitle:
					action.payload.rightTitle != '' ? action.payload.rightTitle : '',
				navParam: action.payload.navParam != '' ? action.payload.navParam : '',
			};

		case RESET_STORE:
			return {
				...state,
				isBackArrow: false,
				leftTitle: '',
				isRightContent: false,
				rightTitle: '',
				navParam: '',
			};

		default:
			return state;
	}
};

export default HeaderReducer;
