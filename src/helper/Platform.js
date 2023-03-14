import {Platform} from 'react-native';

const IOS = Platform.OS === 'ios';
const ANDROID = Platform.OS === 'android';

const isIpad = Platform.isPad; // works only if ipad is checked on xCode

const findPlatform = () => {
	return Platform.OS === 'ios' ? 'ios' : 'android';
};

export {IOS, ANDROID, findPlatform, isIpad};
