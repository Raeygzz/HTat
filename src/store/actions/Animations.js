import {
	ANIMATION_VALIDATE,
	BACK_BUTTON_ANIMATION,
	RESET_STORE,
} from './constant/ActionTypes';

export const animationValidate = (validate) => {
	return {
		type: ANIMATION_VALIDATE,
		payload: validate,
	};
};

export const backButtonWelcomScreenAnimation = (data) => {
	return {
		type: BACK_BUTTON_ANIMATION,
		payload: data,
	};
};

export const resetStore = () => {
	return {
		type: RESET_STORE,
	};
};
