import React, {useState, useEffect} from 'react';
import {
	View,
	Image,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
} from 'react-native';

import {isTablet} from 'react-native-device-info';
import {useFocusEffect} from '@react-navigation/native';
import analytics from '@react-native-firebase/analytics';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AsyncStorage from '@react-native-community/async-storage';
import {
	heightPercentageToDP as hp,
	widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {IOS} from '../helper';
import {GlobalTheme} from '../components/theme';
import {EditDetails} from './modals/EditDetails';
import {StripeReviewDetails} from './modals/StripeReviewDetailModal';
import {
	GenericView,
	Header,
	TextField,
	Divider,
	Button,
} from '../components/common';

import {useSelector, useDispatch} from 'react-redux';
import {headerTitle} from '../store/actions/Header';
import {presentAlert} from '../store/actions/Alert';
import {addCardApi} from '../store/actions/UserCard';
import {showUserOnboarding} from '../store/actions/Auth';
import {
	stripeConnectGetApi,
	userBusinessProfileGETApi,
	presentStripeReviewDetailScreenModal,
	stripeBalanceGetApi,
} from '../store/actions/Settings';
import {
	userDetailGETApi,
	presentUserDetailScreenModal,
} from '../store/actions/UserDetail';

const Settings = (props) => {
	const userId = useSelector((state) => state.auth.id);
	// const completedStripeOnboardingFromSettings = useSelector(
	// 	(state) => state.userDetail.completedStripeOnboarding,
	// );
	const completedStripeOnboardingFromSettings = useSelector(
		(state) => state.auth.user.completed_stripe_onboarding,
	);
	const UserDetailScreenModal = useSelector(
		(state) => state.userDetail.presentUserDetailScreenModal,
	);
	const stripeReviewDetail = useSelector(
		(state) => state.settings.presentStripeReviewDetail,
	);
	const email = useSelector((state) => state.auth.user.email);
	const ccEmailsFromUserDetail = useSelector(
		(state) => state.userDetail.cc_emails,
	);
	const firstNameFromStore = useSelector((state) => state.auth.user.first_name);
	const lastNameFromStore = useSelector((state) => state.auth.user.last_name);
	const cardList = useSelector((state) => state.userCard.cardList);
	const stripeConnectOrLoginStatus = useSelector(
		(state) => state.settings.stripeConnectOrLoginStatus,
	);
	const hasPrimaryAddress = useSelector(
		(state) => state.auth.user.has_primary_address,
	);
	const hasPrimaryCard = useSelector(
		(state) => state.auth.user.has_primary_card,
	);
	const removeMyAccountButtonDisabled = useSelector(
		(state) => state.auth.removeMyAccountButtonDisabled,
	);

	const halfValue = IOS ? 1.4 : 1.5;
	const deviceHalfWidth = useState(GlobalTheme.deviceWidth / halfValue)[0];
	const [ccEmails, setCCEmails] = useState('');
	const [loginWith, setLoginWith] = useState('');

	const dispatch = useDispatch();

	useFocusEffect(
		React.useCallback(() => {
			let headerConfig = {
				isBackArrow: false,
				leftTitle: '',
				isRightContent: false,
				rightTitle: '',
				navParam: '',
			};

			dispatch(addCardApi());
			dispatch(userDetailGETApi({userId: userId}, false));
			dispatch(headerTitle(headerConfig));
			dispatch(stripeConnectGetApi());
		}, []),
	);

	useEffect(() => {
		if (ccEmailsFromUserDetail != '') {
			setCCEmails(ccEmailsFromUserDetail);
		}
	}, [ccEmailsFromUserDetail]);

	useEffect(() => {
		async function fetchloginWith() {
			let loginWith = await AsyncStorage.getItem('loginWith');

			if (loginWith != '') {
				setLoginWith(loginWith);
			}
		}

		fetchloginWith();
	}, []);

	const editDetailsHandler = () => {
		dispatch(presentUserDetailScreenModal());
	};

	const signOutHandler = () => {
		let alertConfig = {
			title: 'Wait!!!',
			message: 'Are you sure, you want to logout?',
			shouldLogout: true,
			showCancelButton: true,
		};
		dispatch(presentAlert(alertConfig));
	};

	const openUserOnboardingHandler = () => {
		if (hasPrimaryAddress === 0) {
			dispatch(showUserOnboarding(true));
			// props.navigation.navigate('UserOnboardingDetail');
		} else {
			props.navigation.navigate('ManagePayments');
		}
	};

	const openWebViewHandler = () => {
		if (completedStripeOnboardingFromSettings !== 1) {
			analytics().logEvent('stripe_connect_start');
			props.navigation.navigate('WebView');
			return;
		}

		if (completedStripeOnboardingFromSettings === 1) {
			dispatch(stripeBalanceGetApi());
			dispatch(presentStripeReviewDetailScreenModal());
			return;
		}
	};

	const managePaymentsHandler = () => {
		analytics().logEvent('manage_payments_pressed');

		props.navigation.navigate(
			'ManagePayments',
			// {
			// 	fromSettingsScreen: 'Settings',
			// }
		);
	};

	const tradingAccountHandler = () => {
		analytics().logEvent('manage_trading_details_pressed');

		dispatch(userBusinessProfileGETApi());
		props.navigation.navigate('TradingAccount');
	};

	const removeAccountHandler = () => {
		let alertConfig = {
			title: 'Wait!!!',
			message: 'Are you sure, you want to remove your account?',
			shouldRunFunction: true,
			functionHandler: 'removeAccountHandler',
			showCancelButton: true,
		};
		dispatch(presentAlert(alertConfig));
	};

	// const listOfEmails =
	// 	ccEmails != ''
	// 		? ccEmails.split(',').map((obj, index) => {
	// 				let totalCCEmails = ccEmails.split(',').length;

	// 				return (
	// 					<View key={index} style={styles.flxRow}>
	// 						<TextField
	// 							xThin
	// 							isRLH
	// 							lineHeight={1.8}
	// 							letterSpacing={-0.07}
	// 							fontFamily={GlobalTheme.fontRegular}
	// 							color={GlobalTheme.black}>
	// 							{`${obj.trim()}`}
	// 						</TextField>

	// 						{totalCCEmails != index + 1 && (
	// 							<TextField
	// 								xThin
	// 								isRLH
	// 								lineHeight={1.8}
	// 								letterSpacing={-0.07}
	// 								fontFamily={GlobalTheme.fontRegular}
	// 								color={GlobalTheme.black}>
	// 								,{' '}
	// 							</TextField>
	// 						)}
	// 					</View>
	// 				);
	// 		  })
	// 		: null;

	const firstName = firstNameFromStore ?? '_';
	const lastName = lastNameFromStore ?? '_';
	return (
		<GenericView isBackgroundColor>
			<>
				<Header />
				<ScrollView style={styles.mainView}>
					<Divider xxxHuge />

					{/* <Divider xxMedium /> */}

					<TextField
						title
						letterSpacing={-0.32}
						isRLH
						lineHeight={2.6}
						fontFamily={GlobalTheme.fontBlack}
						color={GlobalTheme.primaryColor}
						style={styles.mh10}>
						APP SETTINGS
					</TextField>

					<Divider xMedium />

					<TextField
						medium
						isRLH
						lineHeight={2.3}
						fontFamily={GlobalTheme.fontBold}
						color={GlobalTheme.black}
						style={styles.mh10}>
						SIGNED IN AS
					</TextField>

					<Divider medium />

					<Divider
						borderTopWidth={0.5}
						color={GlobalTheme.horizontalLineColor}
					/>

					<TextField
						xSmall
						center
						letterSpacing={-0.09}
						isRLH
						lineHeight={2.1}
						fontFamily={GlobalTheme.fontBold}
						color={GlobalTheme.black}>
						{firstName + ' ' + lastName}
					</TextField>

					{IOS && isTablet() ? (
						<View style={styles.wrapperAroundStyle}>
							<View style={styles.firstWrapperAroundStyle} />

							<View style={styles.secondWrapperAroundStyle}>
								<TextField
									xThin
									letterSpacing={-0.07}
									isRLH
									lineHeight={1.8}
									numberOfLines={1}
									fontFamily={GlobalTheme.fontRegular}
									color={GlobalTheme.black}
									style={styles.wrapperAroundEmailStyle}>
									{email}
								</TextField>

								{ccEmails.length > 0 && (
									<View style={styles.wrapperAroundCCMarqueeWrapperStyle}>
										<TextField
											xThin
											left
											letterSpacing={-0.07}
											isRLH
											lineHeight={2.5}
											fontFamily={GlobalTheme.fontMedium}
											color={GlobalTheme.black}
											style={styles.wrapperAroundCCTextStyle}>
											Cc:
										</TextField>

										{/* <ScrollView
										horizontal
										showsHorizontalScrollIndicator={false}
										style={styles.ccMarqueeContentStyle}>
										{listOfEmails}
									</ScrollView> */}

										<View style={styles.flxRow}>
											<TextField
												xThin
												isRLH
												lineHeight={2.5}
												letterSpacing={-0.07}
												fontFamily={GlobalTheme.fontRegular}
												color={GlobalTheme.black}>
												{ccEmails[0]}
											</TextField>

											{ccEmails.length > 1 && (
												<TextField
													xThin
													isRLH
													lineHeight={2.5}
													letterSpacing={-0.07}
													fontFamily={GlobalTheme.fontRegular}
													color={GlobalTheme.black}>
													,...
												</TextField>
											)}
										</View>
									</View>
								)}
							</View>

							<View style={styles.thirdWrapperAroundStyle} />
						</View>
					) : (
						<View style={styles.ccEmailsWrapperStyle(deviceHalfWidth)}>
							<TextField
								xThin
								letterSpacing={-0.07}
								isRLH
								lineHeight={1.8}
								fontFamily={GlobalTheme.fontRegular}
								color={GlobalTheme.black}>
								{email}
							</TextField>

							{ccEmails.length > 0 && (
								<View style={styles.ccMarqueeWrapperStyle}>
									<TextField
										xThin
										left
										letterSpacing={-0.07}
										isRLH
										lineHeight={2.5}
										fontFamily={GlobalTheme.fontMedium}
										color={GlobalTheme.black}
										style={styles.ccTextStyle}>
										Cc:
									</TextField>

									<View style={styles.flxRow}>
										<TextField
											xThin
											isRLH
											lineHeight={2.5}
											letterSpacing={-0.07}
											fontFamily={GlobalTheme.fontRegular}
											color={GlobalTheme.black}>
											{ccEmails[0]}
										</TextField>

										{ccEmails.length > 1 && (
											<TextField
												xThin
												isRLH
												lineHeight={2.5}
												letterSpacing={-0.07}
												fontFamily={GlobalTheme.fontRegular}
												color={GlobalTheme.black}>
												,...
											</TextField>
										)}
									</View>
								</View>
							)}
						</View>
					)}

					<TextField
						thin
						center
						letterSpacing={-0.06}
						isRLH
						lineHeight={1.8}
						fontFamily={GlobalTheme.fontRegular}
						color={GlobalTheme.textColor}>
						Signed in with {loginWith}
					</TextField>

					<Divider />

					<View style={styles.rowStyle}>
						<TouchableOpacity
							// disabled={
							// 	loginWith === 'facebook' || loginWith === 'apple' ? true : false
							// }
							style={styles.flexStartRowStyle}
							onPress={editDetailsHandler}>
							<Ionicons
								name="pencil"
								size={16}
								color={GlobalTheme.primaryColor}
							/>

							<Divider horizontal small />

							<TextField
								xSmall
								letterSpacing={-0.09}
								isRLH
								lineHeight={1.9}
								fontFamily={GlobalTheme.fontRegular}
								color={GlobalTheme.primaryColor}>
								Edit details
							</TextField>
						</TouchableOpacity>

						<Divider horizontal xxxMedium />

						<TouchableOpacity
							style={styles.flexStartRowStyle}
							onPress={signOutHandler}>
							<Image
								source={require('../assets/image/icon/upload.png')}
								style={styles.signOutImageStyle}
							/>

							<Divider horizontal small />

							<TextField
								xSmall
								letterSpacing={-0.09}
								isRLH
								lineHeight={1.9}
								fontFamily={GlobalTheme.fontRegular}
								color={GlobalTheme.primaryColor}>
								Sign out
							</TextField>
						</TouchableOpacity>
					</View>

					<Divider xxxMedium />

					<Divider
						medium
						borderTopWidth={0.5}
						color={GlobalTheme.horizontalLineColor}
					/>

					<View style={styles.mh10}>
						{hasPrimaryAddress !== 1 || hasPrimaryCard !== 1 ? (
							<>
								<TextField
									medium
									isRLH
									lineHeight={2.3}
									fontFamily={GlobalTheme.fontBold}
									color={GlobalTheme.black}>
									USER ONBOARD
								</TextField>

								<Divider medium />

								<Divider
									borderTopWidth={0.5}
									color={GlobalTheme.horizontalLineColor}
								/>

								<TouchableOpacity
									onPress={openUserOnboardingHandler}
									style={styles.managementPaymentStyle}>
									<View style={styles.managementPaymentInnerStyle}>
										<Image
											source={require('../assets/image/icon/payment.png')}
											style={styles.paymentImageStyle}
										/>

										<Divider horizontal medium />

										<TextField
											xSmall
											letterSpacing={-0.09}
											isRLH
											lineHeight={2.1}
											fontFamily={GlobalTheme.fontRegular}
											color={GlobalTheme.black}>
											{`User  ${
												hasPrimaryAddress === 0 ? 'address' : 'card'
											} onboard`}
										</TextField>
									</View>

									<View style={styles.chevronRightWrapperStyle}>
										<EvilIcons
											name="chevron-right"
											size={20}
											color={GlobalTheme.black}
										/>
									</View>
								</TouchableOpacity>

								<Divider />

								<Divider
									borderTopWidth={0.5}
									color={GlobalTheme.horizontalLineColor}
								/>
							</>
						) : null}

						<TextField
							medium
							isRLH
							lineHeight={2.3}
							fontFamily={GlobalTheme.fontBold}
							color={GlobalTheme.black}>
							STRIPE CONNECT
						</TextField>

						<Divider medium />

						<Divider
							borderTopWidth={0.5}
							color={GlobalTheme.horizontalLineColor}
						/>

						<TouchableOpacity
							onPress={openWebViewHandler}
							style={styles.managementPaymentStyle}>
							<View style={styles.managementPaymentInnerStyle}>
								<Image
									source={require('../assets/image/icon/payment.png')}
									style={styles.paymentImageStyle}
								/>

								<Divider horizontal medium />

								{stripeConnectOrLoginStatus ? (
									<Image
										source={require('../assets/image/gif/singlelineShimmer.gif')}
										style={styles.singleShimmerStyle}
									/>
								) : (
									<TextField
										xSmall
										letterSpacing={-0.09}
										isRLH
										lineHeight={2.1}
										fontFamily={GlobalTheme.fontRegular}
										color={GlobalTheme.black}>
										{completedStripeOnboardingFromSettings === 0
											? 'Stripe connect'
											: 'Review your details'}
									</TextField>
								)}
							</View>

							<View style={styles.chevronRightWrapperStyle}>
								<EvilIcons
									name="chevron-right"
									size={20}
									color={GlobalTheme.black}
								/>
							</View>
						</TouchableOpacity>

						<Divider />

						<Divider
							borderTopWidth={0.5}
							color={GlobalTheme.horizontalLineColor}
						/>

						<TextField
							medium
							isRLH
							lineHeight={2.3}
							fontFamily={GlobalTheme.fontBold}
							color={GlobalTheme.black}>
							PAYMENT METHODS
						</TextField>

						<Divider medium />

						<Divider
							borderTopWidth={0.5}
							color={GlobalTheme.horizontalLineColor}
						/>

						<TouchableOpacity
							style={styles.managementPaymentStyle}
							onPress={managePaymentsHandler}>
							<View style={styles.managementPaymentInnerStyle}>
								<Image
									source={require('../assets/image/icon/payment.png')}
									style={styles.paymentImageStyle}
								/>

								<Divider horizontal medium />

								<TextField
									xSmall
									letterSpacing={-0.09}
									isRLH
									lineHeight={2.1}
									fontFamily={GlobalTheme.fontRegular}
									color={GlobalTheme.black}>
									Manage payments
								</TextField>
							</View>

							<View style={styles.chevronRightWrapperStyle}>
								<View style={styles.paymentTotalNumberStyle}>
									<TextField
										xThin
										center
										letterSpacing={-0.07}
										isRLH
										lineHeight={2.2}
										fontFamily={GlobalTheme.fontRegular}
										color={GlobalTheme.white}>
										{cardList.length}
									</TextField>
								</View>

								<EvilIcons
									name="chevron-right"
									size={hp('2.0%')}
									color={GlobalTheme.black}
								/>
							</View>
						</TouchableOpacity>

						<Divider />

						<Divider
							medium
							borderTopWidth={0.5}
							color={GlobalTheme.horizontalLineColor}
						/>

						<TextField
							medium
							isRLH
							lineHeight={2.3}
							fontFamily={GlobalTheme.fontBold}
							color={GlobalTheme.black}>
							TRADING ACCOUNT
						</TextField>

						<Divider medium />

						<Divider
							borderTopWidth={0.5}
							color={GlobalTheme.horizontalLineColor}
						/>

						<TouchableOpacity
							style={styles.manageTradingWrapperStyle}
							onPress={tradingAccountHandler}>
							<View style={styles.manageTradingInnerStyle}>
								<Image
									source={require('../assets/image/icon/trading.png')}
									style={styles.tradingImageStyle}
								/>

								<Divider horizontal medium />

								<TextField
									xSmall
									letterSpacing={-0.09}
									isRLH
									lineHeight={2.1}
									fontFamily={GlobalTheme.fontRegular}
									color={GlobalTheme.black}>
									Manage trading details
								</TextField>
							</View>

							<View style={styles.chevronIconStyle}>
								<EvilIcons
									name="chevron-right"
									size={20}
									color={GlobalTheme.black}
								/>
							</View>
						</TouchableOpacity>

						<Divider />
						<Divider
							borderTopWidth={0.5}
							color={GlobalTheme.horizontalLineColor}
						/>

						<TextField
							medium
							isRLH
							lineHeight={2.3}
							fontFamily={GlobalTheme.fontBold}
							color={GlobalTheme.black}>
							REMOVE ACCOUNT
						</TextField>

						<Divider medium />

						<TextField
							xThin
							letterSpacing={-0.07}
							isRLH
							lineHeight={1.8}
							fontFamily={GlobalTheme.fontRegular}
							color={GlobalTheme.black}>
							If you would like to remove your account and all associated data
							please use the button below. Note this operation cannot be
							reversed, so please only use this option if you are sure you no
							longer need your account and the associated data.
						</TextField>

						<Divider xMedium />

						<Button
							title="REMOVE MY ACCOUNT"
							disabled={removeMyAccountButtonDisabled ? true : false}
							redButton={!removeMyAccountButtonDisabled ? true : false}
							onPress={removeAccountHandler}
						/>

						<Divider />
					</View>

					<EditDetails
						loginWith={loginWith}
						ccEmailsToSettingsScreen={(val) => setCCEmails(val)}
						navigation={props.navigation}
						showEditDetailsModal={UserDetailScreenModal}
					/>

					<StripeReviewDetails
						navigation={props.navigation}
						showStripeReviewDetailsModal={stripeReviewDetail}
					/>

					<Divider xLarge />
				</ScrollView>
			</>
		</GenericView>
	);
};

const styles = StyleSheet.create({
	flxRow: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	mainView: {
		flex: 1,
		// borderWidth: 1,
		// borderColor: 'red',
	},
	mh10: {
		marginHorizontal: hp('1.0%'),
	},
	wrapperAroundStyle: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		// borderWidth: 1,
	},
	firstWrapperAroundStyle: {
		width: '33%',
		// borderWidth: 1,
		// borderColor: 'red',
	},
	secondWrapperAroundStyle: {
		width: '33%',
		// borderWidth: 1,
		// borderColor: 'blue',
	},
	wrapperAroundEmailStyle: {
		width: '90%',
		alignSelf: 'flex-end',
		// borderWidth: 1,
	},
	wrapperAroundCCMarqueeWrapperStyle: {
		width: '90%',
		alignSelf: 'flex-end',
		height: hp(2.5),
		// borderWidth: 1,
	},
	wrapperAroundCCTextStyle: {
		position: 'absolute',
		left: hp(-2.5),
		// top: hp(0.3),
		// borderWidth: 1,
		// borderColor: 'red',
	},
	thirdWrapperAroundStyle: {
		width: '33%',
		// borderWidth: 1,
		// borderColor: 'green',
	},
	ccEmailsWrapperStyle: (deviceHalfWidth) => ({
		width: deviceHalfWidth,
		alignSelf: 'flex-end',
		// borderWidth: 1,
		// borderColor: 'red',
	}),
	ccMarqueeWrapperStyle: {
		width: '72%',
		height: hp(2.5),
		// borderWidth: 1,
		// borderColor: 'blue',
	},
	ccTextStyle: {
		position: 'absolute',
		left: hp(-3.0),
		// top: hp(0.3),
		// borderWidth: 1,
		// borderColor: 'red',
	},
	rowStyle: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	flexStartRowStyle: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	signOutImageStyle: {
		width: hp('1.8%'),
		height: hp('1.8%'),
		resizeMode: 'cover',
	},
	managementPaymentStyle: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		// paddingVertical: 10,
		// borderWidth: 1,
	},
	managementPaymentInnerStyle: {
		width: '50%',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		// borderWidth: 1,
	},
	paymentImageStyle: {
		width: hp('1.8'),
		height: hp('1.8'),
		resizeMode: 'cover',
	},
	singleShimmerStyle: {
		alignSelf: 'center',
		width: wp('48%'),
		height: hp('2.0%'),
		// borderWidth: 1,
	},
	chevronRightWrapperStyle: {
		width: '50%',
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
		// borderWidth: 1,
	},
	paymentTotalNumberStyle: {
		width: '12.5%',
		borderRadius: hp('1.2%'),
		// borderTopLeftRadius: hp('1.2%'),
		// borderTopRightRadius: hp('1.2%'),
		backgroundColor: GlobalTheme.primaryColor,
		// borderWidth: 1,
		// borderColor: 'blue',
	},
	manageTradingWrapperStyle: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		// borderWidth: 1,
	},
	manageTradingInnerStyle: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		// borderWidth: 1,
	},
	tradingImageStyle: {
		width: hp('1.8%'),
		height: hp('1.8%'),
		resizeMode: 'cover',
	},
	chevronIconStyle: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
		// borderWidth: 1,
	},
});

export {Settings};
