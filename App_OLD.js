/**
 * Outsource Array React Native App
 * https://gitlab.com/outsourcearray/hirethat
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect, useRef} from 'react';
import {View, StatusBar, StyleSheet} from 'react-native';

import FlashMessage from 'react-native-flash-message';
import SplashScreen from 'react-native-splash-screen';
import {checkVersion} from 'react-native-check-version';
import analytics from '@react-native-firebase/analytics';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-community/async-storage';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

import {IOS} from './src/helper';
import {GlobalTheme} from './src/components/theme';
import {Loader, HTAlert} from './src/components/common';

import RoutesStackScreen from './src/routes';
import AuthStackScreen from './src/routes/stacks/Auth';
import UserOnboardingDetailStackScreen from './src/routes/stacks/UserOnboardingDetail';

import {useSelector, useDispatch} from 'react-redux';
import {addCardApi} from './src/store/actions/UserCard';
import {userDetailGETApi} from './src/store/actions/UserDetail';
import {
	// setSplash,
	setUser,
	setToken,
	resetStore,
	setUserOnboarding,
} from './src/store/actions/Auth';

const App = () => {
	const userId = useSelector((state) => state.auth.id);
	const token = useSelector((state) => state.auth.accessToken);
	const showModal = useSelector((state) => state.alert.presentAlert);
	const isLoading = useSelector((state) => state.loader.presentLoader);
	const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
	const hasPrimaryCard = useSelector(
		(state) => state.auth.user.has_primary_card,
	);
	const showUserOnboardingScreen = useSelector(
		(state) => state.auth.showUserOnboardingScreen,
	);

	const [isAuthLoading, setIsAuthLoading] = useState(true);
	const [versionCheckShouldRunFirst, setVersionCheckShouldRunFirst] = useState(
		true,
	);

	const navigationRef = useRef();
	const routeNameRef = useRef();

	const dispatch = useDispatch();

	console.log('isLoading ==> ', isLoading);

	useEffect(() => {
		async function checkUpdateNeeded() {
			const version = await checkVersion({country: 'gb'});
			console.log('Got version info:', version);

			if (version.needsUpdate) {
				console.log(`App has a ${version.updateType} update pending.`);
				setVersionCheckShouldRunFirst(false);
			}
		}

		checkUpdateNeeded();
	}, []);

	useEffect(() => {
		console.log('== 1 ==');
		async function fetchToken() {
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
					//
				} else {
					setIsAuthLoading(false);
					// dispatch(resetStore());
				}
				// setIsAuthLoading(false);
			} catch (e) {
				dispatch(resetStore());
				setIsAuthLoading(false);
			}
		}

		fetchToken();
	}, []);

	useEffect(() => {
		console.log('== 2 ==');
		if (hasPrimaryCard !== 1) {
			dispatch(addCardApi());
		}
	}, [hasPrimaryCard]);

	useEffect(() => {
		console.log('== 3 ==');
		if (token !== '' && userId !== '') {
			dispatch(userDetailGETApi({userId: userId}, false));
		}
	}, [token, userId]);

	useEffect(() => {
		console.log('== 4 ==');
		if (!isNaN(hasPrimaryCard)) {
			setIsAuthLoading(false);
		}
	}, [hasPrimaryCard]);

	useEffect(() => {
		console.log('== 5 ==');
		if (!isAuthLoading) {
			SplashScreen.hide();
			// dispatch(setSplash(false));
		}
	}, [isAuthLoading]);

	return (
		<>
			{/* {IOS ? ( // changed & commented on 19 aug
				<View style={styles.statusBarStyle}>
					<StatusBar translucent backgroundColor="" barStyle="light-content" />
				</View>
			) : ( */}
			<StatusBar
				translucent
				backgroundColor={GlobalTheme.primaryColor}
				barStyle="light-content"
			/>
			{/* )} */}

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

const styles = StyleSheet.create({
	// statusBarStyle: {  // commented on 19 aug
	// 	height: hp(3.5),
	// 	backgroundColor: GlobalTheme.primaryColor,
	// },
});

export default App;
