import {
	PRESENT_MODAL_LOADER,
	HIDE_MODAL_LOADER,
	RESET_STORE,
} from '../actions/constant/ActionTypes';

const INITIAL_STATE = {
	presentModalLoader: false,
};

const ModalLoaderReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case PRESENT_MODAL_LOADER:
			return {
				...state,
				presentModalLoader: true,
			};

		case HIDE_MODAL_LOADER:
			return {
				...state,
				presentModalLoader: false,
			};

		case RESET_STORE:
			return {
				...state,
				presentModalLoader: false,
			};

		default:
			return state;
	}
};

export default ModalLoaderReducer;
