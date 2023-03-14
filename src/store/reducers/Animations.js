import {
	ANIMATION_VALIDATE,
	BACK_BUTTON_ANIMATION,
	RESET_STORE,
} from '../actions/constant/ActionTypes';

const INITIAL_STATE = {
	startAnimation: false,
	animationValidate: false,
};

const AnimationsReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ANIMATION_VALIDATE:
			return {
				...state,
				animationValidate: action.payload ? action.payload : false,
			};

		case BACK_BUTTON_ANIMATION:
			return {
				...state,
				startAnimation: action.payload ? action.payload : false,
			};

		case RESET_STORE:
			return {
				...state,
				startAnimation: false,
				animationValidate: false,
			};

		default:
			return state;
	}
};

export default AnimationsReducer;
