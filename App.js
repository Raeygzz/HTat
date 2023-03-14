/**
 * Outsource Array React Native App
 * https://gitlab.com/outsourcearray/hirethat
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect, useRef} from 'react';
import {
	StatusBar,
	StyleSheet,
	// BackHandler,
	// Linking
} from 'react-native';

import FlashMessage from 'react-native-flash-message';
import SplashScreen from 'react-native-splash-screen';
// import {checkVersion} from 'react-native-check-version';
import analytics from '@react-native-firebase/analytics';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-community/async-storage';

import {GlobalTheme} from './src/components/theme';
import {Loader, HTAlert} from './src/components/common';

import RoutesStackScreen from './src/routes';
import AuthStackScreen from './src/routes/stacks/Auth';
import UserOnboardingDetailStackScreen from './src/routes/stacks/UserOnboardingDetail';

import {useSelector, useDispatch} from 'react-redux';
// import {presentAlert} from './src/store/actions/Alert';
import {userDetailGETApi} from './src/store/actions/UserDetail';
import {
	// forceUpdateApi,
	setUser,
	setToken,
	resetStore,
	setUserOnboarding,
} from './src/store/actions/Auth';

const App = () => {
	// const isforceUpdate = useSelector((state) => state.auth.forceUpdateFlag);
	const userId = useSelector((state) => state.auth.id);
	const token = useSelector((state) => state.auth.accessToken);
	const showModal = useSelector((state) => state.alert.presentAlert);
	const isLoading = useSelector((state) => state.loader.presentLoader);
	const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
	const showUserOnboardingScreen = useSelector(
		(state) => state.auth.showUserOnboardingScreen,
	);
	// const activateCheckUpdateNeededFunction = useSelector(
	// 	(state) => state.auth.activateCheckUpdateNeededFunction,
	// );

	const [isAuthLoading, setIsAuthLoading] = useState(true);
	// const [versionCheckShouldRunFirst, setVersionCheckShouldRunFirst] = useState(true);

	const routeNameRef = useRef();
	const navigationRef = useRef();
	const dispatch = useDispatch();

	console.log('isLoading ==> ', isLoading);

	// force update flag api
	// useEffect(() => {
	// 	console.log('== 0 ==');
	// 	dispatch(forceUpdateApi());
	// }, []);

	// check wether app update is needed
	// useEffect(() => {
	// 	async function checkUpdateNeeded() {
	// 		console.log('== 1 ==');
	// 		try {
	// 			const version = await checkVersion({country: 'gb'});
	// 			console.log('Got version info: ==> ', version);

	// 			if (version.needsUpdate) {
	// 				setIsAuthLoading(false);

	// 				let alertConfig = {
	// 					title: 'Update Required!',
	// 					message:
	// 						'Please update your app to the latest version to continue using.',
	// 					showCancelButton: false,
	// 					// showCancelButton: isforceUpdate ? false : true,
	// 					shouldRunFunction: true,
	// 					functionHandler: 'performForceUpdateOperationHandler',
	// 					// cancelButtonFunctionHandler: 'cancelForceUpdateOperationHandler',
	// 					shouldCallback: () =>
	// 						performForceUpdateOperationHandler(version.url),
	// 					// shouldCallback_2: () => cancelForceUpdateOperationHandler(),
	// 				};

	// 				dispatch(presentAlert(alertConfig));
	// 				//
	// 			} else {
	// 				setVersionCheckShouldRunFirst(false);
	// 			}
	// 		} catch (err) {
	// 			console.log('check version error ==> ', err);
	// 			setVersionCheckShouldRunFirst(false);
	// 		}
	// 	}

	// if (activateCheckUpdateNeededFunction) {
	// checkUpdateNeeded();
	// }
	// }, [activateCheckUpdateNeededFunction]);
	// }, []);

	// cancel force update operation
	// const cancelForceUpdateOperationHandler = () => {
	// 	console.log('== 2 ==');
	// 	setVersionCheckShouldRunFirst(false);
	// };

	// perform force update operation
	// const performForceUpdateOperationHandler = (storeUrl) => {
	// 	console.log('== 3 ==');
	// 	setVersionCheckShouldRunFirst(false);

	// 	BackHandler.exitApp();
	// 	Linking.openURL(storeUrl);
	// };

	// fetch token from async storage
	useEffect(() => {
		async function fetchToken() {
			console.log('== 4 ==');
			try {
				const user = await AsyncStorage.getItem('user');
				const accessToken = await AsyncStorage.getItem('accessToken');

				if (accessToken && user) {
					dispatch(
						setUserOnboarding({
							showUserOnboardingScreen:
								JSON.parse(user).has_primary_address != 1 ? true : false,
						}),
					);

					dispatch(
						setUser({
							user: JSON.parse(user),
						}),
					);

					dispatch(
						setToken({
							accessToken: accessToken,
						}),
					);

					setIsAuthLoading(false);
					//
				} else {
					setIsAuthLoading(false);
				}
			} catch (e) {
				dispatch(resetStore());
				setIsAuthLoading(false);
			}
		}

		// if (!versionCheckShouldRunFirst) {
		fetchToken();
		// }
		// }, [versionCheckShouldRunFirst]);
	}, []);

	// call user detail api
	useEffect(() => {
		if (token !== '' && userId !== '') {
			console.log('== 5 ==');
			dispatch(userDetailGETApi({userId: userId}, false));
		}
	}, [token, userId]);

	// close splash screen
	useEffect(() => {
		if (!isAuthLoading) {
			console.log('== 6 ==');
			SplashScreen.hide();
		}
	}, [isAuthLoading]);

	return (
		<>
			<StatusBar
				translucent
				backgroundColor={GlobalTheme.primaryColor}
				barStyle="light-content"
			/>

			<SafeAreaProvider>
				<NavigationContainer
					ref={navigationRef}
					onReady={() => {
						routeNameRef.current = navigationRef.current.getCurrentRoute().name;
					}}
					onStateChange={async () => {
						const previousRouteName = routeNameRef.current;
						const currentRouteName = navigationRef.current.getCurrentRoute()
							.name;

						if (previousRouteName !== currentRouteName) {
							await analytics().logScreenView({
								screen_name: currentRouteName,
								screen_class: currentRouteName,
							});
						}
						// Save the current route name for later comparison
						routeNameRef.current = currentRouteName;
					}}>
					{isAuthenticated ? (
						<>
							{showUserOnboardingScreen ? (
								<UserOnboardingDetailStackScreen />
							) : (
								<RoutesStackScreen />
							)}
						</>
					) : (
						<AuthStackScreen />
					)}

					{isLoading ? <Loader /> : null}
					{showModal ? <HTAlert /> : null}
					<FlashMessage />
				</NavigationContainer>
			</SafeAreaProvider>
		</>
	);
};

const styles = StyleSheet.create({});

export default App;
