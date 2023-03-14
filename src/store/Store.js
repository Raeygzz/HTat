import {createStore, combineReducers, applyMiddleware} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import Thunk from 'redux-thunk';
import Logger from 'redux-logger';

import AuthReducer from './reducers/Auth';
import HeaderReducer from './reducers/Header';
import FocusedScreenReducer from './reducers/FocusedScreen';
import LoaderReducer from './reducers/Loader';
import ModalLoaderReducer from './reducers/ModalLoader';
import LoginReducer from './reducers/Login';
import ALertReducer from './reducers/Alert';
import NetworkReducer from './reducers/Network';
import RegisterEmailReducer from './reducers/RegisterEmail';
import AnimationsReducer from './reducers/Animations';
import ErrorReducer from './reducers/Error';
import SuccessReducer from './reducers/Success';
import UserDetailReducer from './reducers/UserDetail';
import ClearTextInputReducer from './reducers/ClearTextInput';
import ScreenLandingReducer from './reducers/SearchLanding';
import CategoriesReducer from './reducers/Categories';
import AdvertsReducer from './reducers/Adverts';
import ProfileReducer from './reducers/Profile';
import HireReducer from './reducers/Hire';
import SettingsReducer from './reducers/Settings';
import ResetNavigationReducer from './reducers/ResetNavigation';
import UserCardReducer from './reducers/UserCard';
import BuyReducer from './reducers/Buy';

const rootReducer = combineReducers({
	auth: AuthReducer,
	header: HeaderReducer,
	focusedScreen: FocusedScreenReducer,
	loader: LoaderReducer,
	modalLoader: ModalLoaderReducer,
	login: LoginReducer,
	alert: ALertReducer,
	network: NetworkReducer,
	registerEmail: RegisterEmailReducer,
	animate: AnimationsReducer,
	error: ErrorReducer,
	success: SuccessReducer,
	userDetail: UserDetailReducer,
	clearTextInput: ClearTextInputReducer,
	searchLanding: ScreenLandingReducer,
	categories: CategoriesReducer,
	adverts: AdvertsReducer,
	profile: ProfileReducer,
	hire: HireReducer,
	settings: SettingsReducer,
	resetNavigation: ResetNavigationReducer,
	userCard: UserCardReducer,
	buy: BuyReducer,
});

const Store = createStore(
	rootReducer,
	composeWithDevTools(applyMiddleware(Thunk, Logger)),
);

export default Store;
