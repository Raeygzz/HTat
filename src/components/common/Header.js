import React from 'react';
import {View, Image, StyleSheet, TouchableOpacity} from 'react-native';

import {isTablet} from 'react-native-device-info';
import Icon from 'react-native-vector-icons/Ionicons';
import {CommonActions} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import analytics from '@react-native-firebase/analytics';
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {IOS} from '../../helper';
import {Divider} from '../common/Divider';
import {TextField} from '../common/TextField';
import {GlobalTheme} from '../theme/GlobalTheme';
import {CreateItemConditionCheck} from '../../models';
// import {ViewAdvertEditActionModal} from '../../screens/modals/ViewAdvertEditActionModal';

import {useSelector, useDispatch} from 'react-redux';
import {headerTitle} from '../../store/actions/Header';
import {presentAdvertScreenModal} from '../../store/actions/Adverts';
import {resetNavigationRoutes} from '../../store/actions/ResetNavigation';
import {postAdvertFromSearchLandingScreen} from '../../store/actions/SearchLanding';

const Header = (props) => {
	const {screenName = ''} = props;

	const userEmail = useSelector((state) => state.auth.user.email);
	const isBackArrow = useSelector((state) => state.header.isBackArrow);
	const leftTitle = useSelector((state) => state.header.leftTitle);
	const isRightContent = useSelector((state) => state.header.isRightContent);
	const rightTitle = useSelector((state) => state.header.rightTitle);
	const navParam = useSelector((state) => state.header.navParam);
	const ifResetNavigationRoutes = useSelector(
		(state) => state.resetNavigation.resetNavigationRoutes,
	);
	// const completedStripeOnboarding = useSelector(
	// 	(state) => state.auth.user.completed_stripe_onboarding,
	// );
	const hasPrimaryAddress = useSelector(
		(state) => state.auth.user.has_primary_address,
	);
	// const hasPrimaryCard = useSelector(
	// 	(state) => state.auth.user.has_primary_card,
	// );
	const hasBusinessProfile = useSelector(
		(state) => state.auth.user.has_business_profile,
	);

	// const presentAdvertScreenModal = useSelector(
	// 	(state) => state.header.presentAdvertScreenModal,
	// );

	const dispatch = useDispatch();

	const navigation = useNavigation();

	const _popScreen = () => {
		if (navParam === 'replace') {
			navigation.replace('SearchResults');
			//
		} else {
			if (ifResetNavigationRoutes && screenName === 'AllAdverts') {
				navigation.dispatch({
					...CommonActions.reset({
						index: 0,
						routes: [{name: 'Profile'}],
					}),
				});

				dispatch(resetNavigationRoutes(false));
				dispatch(postAdvertFromSearchLandingScreen(false));

				return;
				//
			} else if (ifResetNavigationRoutes) {
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

				dispatch(resetNavigationRoutes(false));

				return;
				//
			}

			navigation.goBack();
			// navigation.pop();
		}
	};

	const headerRightSectionHandler = () => {
		if (navParam === 'callback') {
			let headerConfig = {
				isBackArrow: true,
				leftTitle: 'Back',
				isRightContent: true,
				rightTitle: 'Cancel',
				navParam: '',
			};

			dispatch(headerTitle(headerConfig));
			dispatch(presentAdvertScreenModal());
			//
		} else if (navParam !== '') {
			if (navParam === 'PostAdvert') {
				analytics().logEvent('post_advert_pressed');

				CreateItemConditionCheck(
					userEmail,
					// completedStripeOnboarding,
					hasPrimaryAddress,
					// hasPrimaryCard,
					hasBusinessProfile,
					navigation,
				);

				return;
			}

			console.log('=====I M HERE=====');
			return navigation.navigate(navParam);
		}

		// if (navParam !== '') {
		// 	return navigation.navigate(navParam);
		// }

		// let headerConfig = {
		// 	isBackArrow: true,
		// 	leftTitle: 'Back',
		// 	isRightContent: true,
		// 	rightTitle: 'Cancel',
		// 	navParam: '',
		// };

		// dispatch(headerTitle(headerConfig));
		// dispatch(presentAdvertScreenModal());
	};

	return (
		<>
			<View style={styles.headerStyle}>
				<TouchableOpacity
					disabled={!isBackArrow}
					style={styles.title1Wrapper}
					onPress={() => _popScreen()}>
					{isBackArrow && (
						<View style={styles.title1WrapperContent}>
							<Icon
								name="chevron-back"
								// size={24}
								size={hp('3.4%')}
								color={GlobalTheme.black}
								style={styles.t8}
							/>

							<TextField
								xMedium
								center
								// lineHeight={44}
								isRLH
								lineHeight={4.4}
								fontFamily={GlobalTheme.fontSF}
								color={GlobalTheme.black}
								style={styles.textFieldStyle}>
								{leftTitle}
							</TextField>
						</View>
					)}
				</TouchableOpacity>

				<View style={styles.headerImageWrapper}>
					<Image
						source={require('../../assets/image/arrow.png')}
						style={styles.imageStyle}
					/>
				</View>

				<TouchableOpacity
					disabled={!isRightContent}
					style={styles.title2Wrapper}
					onPress={headerRightSectionHandler}>
					{isRightContent && (
						<TextField
							xMedium
							// lineHeight={44}
							isRLH
							lineHeight={4.4}
							fontFamily={GlobalTheme.fontSF}
							color={GlobalTheme.black}>
							{rightTitle}
						</TextField>
					)}
				</TouchableOpacity>

				{/* <ViewAdvertEditActionModal show={presentAdvertScreenModal} /> */}
			</View>

			{IOS && isTablet() && <Divider xLarge />}
		</>
	);
};

const styles = StyleSheet.create({
	headerStyle: {
		width: wp('100%'),
		height: IOS
			? hp(GlobalTheme.headerIOSHeight)
			: hp(GlobalTheme.headerHeight),
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-end',
		backgroundColor: GlobalTheme.primaryColor,
		position: 'absolute', // added on 19 aug
		top: 0,
		left: 0,
		right: 0,
		zIndex: 999,
		elevation: 4,
		// top: IOS ? hp('-7.4%') : null,
		// borderWidth: 1,
		// borderColor: 'magenta',
	},
	title1Wrapper: {
		width: wp('47%'),
		height: IOS
			? hp(GlobalTheme.headerIOSHeight)
			: hp(GlobalTheme.headerHeight),
		paddingLeft: hp('1.7%'),
		// borderWidth: 1,
		// borderColor: 'blue',
	},
	title1WrapperContent: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	t8: {
		top: IOS ? hp('7.1%') : hp('5.4%'),
		// top: hp('5.4%'),
		// borderWidth: 1,
	},
	textFieldStyle: {
		top: IOS ? hp('7.1%') : hp('5.4%'),
		// top: hp('5.4%'),
		// borderWidth: 1,
	},
	headerImageWrapper: {
		width: wp('6%'),
		height: IOS
			? hp(GlobalTheme.headerIOSHeight)
			: hp(GlobalTheme.headerHeight),
		justifyContent: 'flex-end',
		alignItems: 'center',
		// borderWidth: 1,
		// borderColor: 'yellow',
	},
	imageStyle: {
		width: wp('6.3%'),
		height: hp('4.1%'),
		resizeMode: 'contain',
	},
	title2Wrapper: {
		width: wp('47%'),
		height: IOS
			? hp(GlobalTheme.headerIOSHeight)
			: hp(GlobalTheme.headerHeight),
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'flex-end',
		paddingRight: hp('1.7%'),
		// borderWidth: 1,
		// borderColor: 'green',
	},
});

export {Header};
