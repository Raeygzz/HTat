import React from 'react';
import {View, Modal, StyleSheet} from 'react-native';

import {CommonActions} from '@react-navigation/native';
import ShadowView from 'react-native-simple-shadow-view';
import analytics from '@react-native-firebase/analytics';
import AsyncStorage from '@react-native-community/async-storage';

import {Button} from './Button';
import {GlobalTheme} from '../theme';
import {TextField} from './TextField';
import {ParsedText} from './ParsedText';

import {useSelector, useDispatch} from 'react-redux';
import {hideLoader} from '../../store/actions/Loader';
import {shouldRunFunctionFromAlert} from '../../store/actions/Hire';
import {hideModal, resetOnlyAlertFromStore} from '../../store/actions/Alert';
import {
	setUser,
	setToken,
	setUserOnboarding,
	resetStore,
	showUserOnboarding,
	userAccountDeleteApi,
} from '../../store/actions/Auth';

const HTAlert = (props) => {
	const userId = useSelector((state) => state.auth.id);
	const navigateTo = useSelector((state) => state.alert.navigateTo);
	const navigation = useSelector((state) => state.alert.navigation);
	const modalData = useSelector((state) => state.alert.data);
	const modalTitle = useSelector((state) => state.alert.modalTitle);
	const okButtonText = useSelector((state) => state.alert.okButtonText);
	const shouldLogout = useSelector((state) => state.alert.shouldLogout);
	const modalMessage = useSelector((state) => state.alert.modalMessage);
	const callback = useSelector((state) => state.alert.shouldCallback);
	const cancelCallback = useSelector((state) => state.alert.shouldCallback_2);
	const shouldNavigate = useSelector((state) => state.alert.shouldNavigate);
	const functionHandler = useSelector((state) => state.alert.functionHandler);
	const cancelButtonFunctionHandler = useSelector(
		(state) => state.alert.cancelButtonFunctionHandler,
	);
	const cancelButtonText = useSelector((state) => state.alert.cancelButtonText);
	const showCancelButton = useSelector((state) => state.alert.showCancelButton);
	const shouldRunFunction = useSelector(
		(state) => state.alert.shouldRunFunction,
	);

	const dispatch = useDispatch();

	const cancelButtonHandler = () => {
		// if (shouldRunFunction) {
		// if (cancelButtonFunctionHandler === 'cancelForceUpdateOperationHandler') {
		// 	cancelCallback != null ? cancelCallback() : null;
		// }

		// dispatch(hideModal());
		//
		// } else {
		dispatch(hideModal());
		// }
	};

	const okButtonHandler = async () => {
		if (shouldLogout) {
			const keys = ['user', 'accessToken', 'userId', 'searchData', 'loginWith'];
			try {
				await AsyncStorage.multiRemove(keys);
			} catch (e) {
				console.log('Error in should logout ==> ', e);
			}
			dispatch(resetStore());

			analytics().logEvent('logout_success');
			//
		} else if (shouldNavigate) {
			dispatch(hideModal());
			dispatch(hideLoader());

			navigation.navigate(navigateTo);
			//
		} else if (shouldRunFunction) {
			if (functionHandler === 'performForceUpdateOperationHandler') {
				callback != null ? callback() : null;
				//
			} else if (functionHandler === 'registrationSuccessHandler') {
				dispatch(
					setUserOnboarding({
						showUserOnboardingScreen:
							modalData.user.has_primary_address != 1 ? true : false,
					}),
				);

				dispatch(
					setUser({
						user: modalData.user,
					}),
				);

				dispatch(
					setToken({
						accessToken: modalData.access_token,
					}),
				);

				dispatch(resetOnlyAlertFromStore());
				//
			} else if (functionHandler === 'clearCalendarDatesHandler') {
				dispatch(shouldRunFunctionFromAlert(true));
				//
			} else if (functionHandler === 'removeAccountHandler') {
				dispatch(userAccountDeleteApi(userId));
				//
			} else if (functionHandler === 'resetRoute&NavigateToSettingScreen') {
				navigation.dispatch({
					...CommonActions.reset({
						index: 0,
						routes: [
							{
								name: 'BottomTabBar',
								state: {
									routes: [{name: 'Settings'}],
								},
							},
						],
					}),
				});
				// navigation.dispatch({
				// 	...CommonActions.reset({
				// 		index: 0,
				// 		routes: [{name: 'Settings'}],
				// 	}),
				// });
				//
			} else if (functionHandler === 'deleteCardHandler') {
				callback != null ? callback() : null;
				//
			} else if (functionHandler === 'userOnboardDetailWebViewFailure') {
				dispatch(showUserOnboarding(false));
				//
			} else if (functionHandler === 'webViewFailureResponseHandler') {
				navigation.goBack();
				//
			} else if (functionHandler === 'cancelHiringHandler') {
				callback != null ? callback() : null;
				//
			} else if (functionHandler === 'hireConfirmHandler') {
				callback != null ? callback() : null;
				//
			} else if (functionHandler === 'stripeConnectFillUpHandler') {
				callback != null ? callback() : null;
				//
			}
			// else if (functionHandler === 'buyConfirmHandler') {
			// 	callback != null ? callback() : null;
			// }

			dispatch(hideModal());
			//
		} else {
			dispatch(hideModal());
		}
	};

	return (
		<Modal
			statusBarTranslucent
			animationType="fade"
			transparent={true}
			visible={true}>
			<View style={styles.mainView}>
				<ShadowView style={styles.modalContainerStyle}>
					<View style={styles.headerStyle}>
						<View style={styles.headerBarStyle} />

						<View style={styles.headerContentStyle}>
							<TextField
								huge
								isRLH
								lineHeight={3.4}
								fontFamily={GlobalTheme.fontBold}
								color={GlobalTheme.black}>
								{modalTitle}
							</TextField>
						</View>

						<View style={styles.horizontalLineStyle} />
					</View>
					<View style={styles.bodyStyle}>
						{modalMessage !== 'RegistrationSuccess' && (
							<TextField
								regular
								fontFamily={GlobalTheme.fontRegular}
								color={GlobalTheme.black}
								style={styles.bodyContentStyle}>
								&nbsp;{modalMessage}
							</TextField>
						)}

						{modalMessage === 'RegistrationSuccess' && (
							<TextField
								regular
								fontFamily={GlobalTheme.fontRegular}
								color={GlobalTheme.black}
								style={styles.bodyContentStyle}>
								&nbsp;A welcome email has been sent to{' '}
								<ParsedText color={GlobalTheme.textHyperLinkColor}>
									{modalData?.user?.email}
								</ParsedText>
								. Please check your inbox.
							</TextField>
						)}
					</View>

					<View style={styles.horizontalLineStyle} />

					<View style={styles.footerStyle}>
						<View style={styles.footerLeftContentStyle}>
							{showCancelButton ? (
								<Button
									title={cancelButtonText}
									blackButton
									onPress={cancelButtonHandler}
								/>
							) : null}
						</View>

						<View style={styles.footerRightContentStyle}>
							<Button
								title={okButtonText}
								primaryButton
								onPress={okButtonHandler}
							/>
						</View>
					</View>
				</ShadowView>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	mainView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0,0,0,0.14)',
		// borderWidth: 1,
		// borderColor: 'blue',
	},
	modalContainerStyle: {
		width: '85%',
		height: '27%',
		shadowRadius: GlobalTheme.shadowRadius,
		shadowColor: GlobalTheme.black,
		shadowOpacity: 0.28,
		borderWidth: 0.1,
		borderRadius: GlobalTheme.viewRadius,
		borderColor: 'transparent',
		backgroundColor: GlobalTheme.white,
		shadowOffset: {width: 0, height: 0},
	},
	headerStyle: {
		minHeight: '8%',
		// borderWidth: 1,
	},
	headerBarStyle: {
		width: '100%',
		height: 12,
		borderTopLeftRadius: GlobalTheme.viewRadius,
		borderTopRightRadius: GlobalTheme.viewRadius,
		backgroundColor: '#FFCC00',
	},
	headerContentStyle: {
		flex: 1,
		marginLeft: 10,
		textAlignVertical: 'center',
		justifyContent: 'center',
		// borderWidth: 1
	},
	horizontalLineStyle: {
		marginHorizontal: 10,
		borderTopWidth: 0.5,
		color: GlobalTheme.horizontalLineColor,
	},
	bodyStyle: {
		flex: 1,
		minHeight: '11%',
		// borderWidth: 1,
	},
	bodyContentStyle: {
		flex: 1,
		marginHorizontal: 10,
		marginTop: 10,
		marginBottom: 5,
		// borderWidth: 1,
	},
	footerStyle: {
		width: '100%',
		minHeight: '8%',
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
		// borderWidth: 1,
	},
	footerLeftContentStyle: {
		width: '45%',
		// borderWidth: 1,
	},
	footerRightContentStyle: {
		width: '45%',
		// borderWidth: 1,
	},
});

export {HTAlert};
