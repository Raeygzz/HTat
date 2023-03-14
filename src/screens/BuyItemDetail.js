import React, {useState, useEffect, useRef} from 'react';
import {
	View,
	Image,
	ImageBackground,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
} from 'react-native';

import {Rating} from 'react-native-ratings';
import ViewShot from 'react-native-view-shot';
import {isTablet} from 'react-native-device-info';
import {useFocusEffect} from '@react-navigation/native';
import ShadowView from 'react-native-simple-shadow-view';
import analytics from '@react-native-firebase/analytics';
import LinearGradient from 'react-native-linear-gradient';
import {
	heightPercentageToDP as hp,
	widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {IOS, ANDROID} from '../helper';
import {ShareItem} from '../models';
import {DetailFinanceModal} from './modals';
import {GlobalTheme} from '../components/theme';
import {getObjectLength, imageResizer} from '../utils';
import {Gallery} from '../components/buyItemDetail/Gallery';
import {
	Divider,
	TextField,
	Button,
	ItemDescription,
} from '../components/common';

import {useSelector, useDispatch} from 'react-redux';
import {headerTitle} from '../store/actions/Header';
import {presentAlert} from '../store/actions/Alert';
import {addressListApi} from '../store/actions/Profile';
import {listUserCardsApi} from '../store/actions/UserCard';
import {presentDetailFinanceScreenModal} from '../store/actions/SearchLanding';

const BuyItemDetail = (props) => {
	const userEmail = useSelector((state) => state.auth.user.email);
	const detailFinanceScreenModal = useSelector(
		(state) => state.searchLanding.presentDetailFinanceScreenModal,
	);
	const singleBuyItem = useSelector((state) => state.hire.singleHireItem);
	const hasPrimaryCard = useSelector(
		(state) => state.auth.user.has_primary_card,
	);
	const hasBusinessProfile = useSelector(
		(state) => state.auth.user.has_business_profile,
	);

	const viewRef = useRef();
	const dispatch = useDispatch();

	useFocusEffect(
		React.useCallback(() => {
			let headerConfig = {
				isBackArrow: true,
				leftTitle: 'Back',
				isRightContent: false,
				rightTitle: '',
				navParam: 'replace',
			};

			dispatch(headerTitle(headerConfig));
		}, []),
	);

	const shareBuyContentHandler = () => {
		ShareItem(
			viewRef,
			`HT item - ${singleBuyItem.name} buy for £${
				singleBuyItem.selling_price
			} which is provided by ${
				getObjectLength(singleBuyItem) != 0
					? singleBuyItem.owner.first_name != null
						? singleBuyItem.owner.first_name +
						  ' ' +
						  singleBuyItem.owner.last_name
						: 'NA'
					: null
			}`,
		);
	};

	const needFinanceHandler = () => {
		dispatch(presentDetailFinanceScreenModal());
	};

	const buyConfirmWithAlertHandler = () => {
		analytics().logEvent('enquire_to_buy_button_pressed');

		if (userEmail === null) {
			let alertConfig = {
				title: 'Wait!',
				shouldRunFunction: true,
				navigation: props.navigation,
				functionHandler: 'resetRoute&NavigateToSettingScreen',
				message: `Please fill in the email address first from Setting Screen under Edit details.`,
			};

			dispatch(presentAlert(alertConfig));

			return;
		}

		props.navigation.navigate('BuyConfirm', {
			buyConfirmData: {
				itemId: singleBuyItem.id,
				itemName: singleBuyItem.name,
			},
		});

		// if (hasBusinessProfile === 1 && hasPrimaryCard === 1) {
		// 	props.navigation.navigate('BuyConfirm', {
		// 		buyConfirmData: {
		// 			itemId: singleBuyItem.id,
		// 			itemName: singleBuyItem.name,
		// 		},
		// 	});

		// 	return;
		// }

		// if (hasBusinessProfile != 1 || hasPrimaryCard != 1) {
		// 	let alertConfig = {
		// 		title: 'Wait!',
		// 		message:
		// 			'Please take a moment to fill in your account details to complete your enquiry to buy',
		// 		shouldRunFunction: true,
		// 		functionHandler: 'buyConfirmHandler',
		// 		shouldCallback: () => buyConfirmHandler(),
		// 	};

		// 	dispatch(presentAlert(alertConfig));
		// }
	};

	// const buyConfirmHandler = () => {
	// 	if (hasBusinessProfile != 1) {
	// 		props.navigation.navigate('TradingAccount', {
	// 			collectInOneGo: hasPrimaryCard != 1 ? true : false,
	// 		});

	// 		return;
	// 	}

	// 	if (hasPrimaryCard != 1) {
	// 		props.navigation.navigate('AddPaymentCard');

	// 		return;
	// 	}
	// };

	let totalPhotos =
		getObjectLength(singleBuyItem) != 0
			? singleBuyItem.photos.length.toString().length > 1
				? singleBuyItem.photos.length
				: '0' + singleBuyItem.photos.length
			: '00';

	let buyItemProvidedByName =
		getObjectLength(singleBuyItem) != 0
			? singleBuyItem.owner.first_name != null
				? singleBuyItem.owner.first_name + ' ' + singleBuyItem.owner.last_name
				: 'NA'
			: null;
	return (
		<>
			<ScrollView showsVerticalScrollIndicator={false} style={styles.mainView}>
				<ViewShot ref={viewRef} options={{format: 'png', quality: 0.7}}>
					<View style={{backgroundColor: GlobalTheme.white}}>
						<View style={styles.imageBackgroundStyle}>
							<ImageBackground
								source={{uri: singleBuyItem.main_image}}
								// resizeMode="cover"
								style={styles.imageStyle(isTablet())}>
								<View style={styles.numberOfImageWrapperStyle}>
									<Image
										source={require('../assets/image/icon/images.png')}
										style={styles.imagesGalleryIconStyle}
									/>

									<TextField
										xThin
										center
										letterSpacing={-0.19}
										// lineHeight={20}
										isRLH
										lineHeight={2.0}
										fontFamily={GlobalTheme.fontRegular}
										color={GlobalTheme.white}>
										{`+${totalPhotos} images`}
									</TextField>
								</View>

								<LinearGradient
									colors={['#FFFFFF00', '#FFFFFF']}
									style={styles.linearGradient}
								/>
							</ImageBackground>
						</View>

						<View style={styles.p17}>
							<View style={styles.nameAndIconStyle}>
								<TextField
									title
									letterSpacing={-0.48}
									// lineHeight={22}
									isRLH
									lineHeight={2.6}
									fontFamily={GlobalTheme.fontBold}
									color={GlobalTheme.defaultBlack}>
									{singleBuyItem.name}
								</TextField>

								<TouchableOpacity onPress={shareBuyContentHandler}>
									<Image
										source={require('../assets/image/icon/upload.png')}
										style={styles.uploadIconStyle}
									/>
								</TouchableOpacity>
							</View>

							<Divider medium />

							<TextField
								xThin
								letterSpacing={-0.07}
								// lineHeight={18}
								isRLH
								lineHeight={1.8}
								fontFamily={GlobalTheme.fontRegular}
								color={GlobalTheme.textColor}>
								Buy this for
							</TextField>

							<Divider small />

							<View style={styles.pricingStyle}>
								<View
									style={{
										flexDirection: 'row',
										justifyContent: 'flex-start',
										alignItems: 'center',
										// borderWidth: 1,
									}}>
									<TextField
										title
										letterSpacing={-0.32}
										// lineHeight={20}
										isRLH
										lineHeight={2.6}
										fontFamily={GlobalTheme.fontBold}
										color={GlobalTheme.black}>
										{singleBuyItem.selling_price != null
											? `£${singleBuyItem.selling_price}`
											: null}
									</TextField>

									{singleBuyItem.vat != 0 ? (
										<>
											<Divider horizontal small />

											<TextField
												xThin
												letterSpacing={-0.07}
												// lineHeight={18}
												isRLH
												lineHeight={1.8}
												fontFamily={GlobalTheme.fontRegular}
												color={GlobalTheme.textColor}>
												plus VAT
											</TextField>
										</>
									) : null}
								</View>

								<TouchableOpacity onPress={needFinanceHandler}>
									<TextField
										xThin
										letterSpacing={-0.07}
										// lineHeight={18}
										isRLH
										lineHeight={1.8}
										fontFamily={GlobalTheme.fontRegular}
										color={GlobalTheme.primaryColor}>
										Need finance?
									</TextField>
								</TouchableOpacity>
							</View>

							<Divider xMedium />

							<Divider borderTopWidth={1} color="#707070" />

							<Divider xMedium />

							<View style={styles.providedByWrapperStyle}>
								<View style={styles.providedByImageStyle}>
									<ShadowView style={styles.shadowViewStyle}></ShadowView>
								</View>

								<View style={styles.providedByDetailStyle}>
									<View style={styles.providedByDetail1Style}>
										<TextField
											xThin
											letterSpacing={-0.07}
											// lineHeight={18}
											isRLH
											lineHeight={1.8}
											fontFamily={GlobalTheme.fontRegular}
											color={GlobalTheme.textColor}>
											Provided by
										</TextField>

										<View style={styles.providedByDetail1IconStyle}>
											<Image
												source={require('../assets/image/icon/location.png')}
												style={styles.locationStyle}
											/>

											<Divider horizontal small />

											<TextField
												xThin
												letterSpacing={-0.07}
												// lineHeight={18}
												isRLH
												lineHeight={1.8}
												fontFamily={GlobalTheme.fontRegular}
												color={GlobalTheme.textColor}>
												{props.route.params.distance} miles
											</TextField>
										</View>
									</View>

									<View style={styles.providedByDetail2Style}>
										<TextField
											small
											letterSpacing={-0.09}
											// lineHeight={18}
											isRLH
											lineHeight={1.8}
											fontFamily={GlobalTheme.fontBold}
											color={GlobalTheme.black}>
											{buyItemProvidedByName}
										</TextField>

										<TextField
											xThin
											letterSpacing={-0.06}
											// lineHeight={14}
											isRLH
											lineHeight={1.8}
											fontFamily={GlobalTheme.fontRegular}
											color={GlobalTheme.textColor}>
											Based on {singleBuyItem.post_code}
										</TextField>
									</View>

									<View style={styles.providedByDetail3Style}>
										<Rating
											type="star"
											ratingCount={5}
											imageSize={16}
											ratingColor="red"
											startingValue={4.5}
											ratingBackgroundColor="red"
										/>

										<Divider horizontal medium />

										<TextField
											xThin
											letterSpacing={-0.07}
											// lineHeight={18}
											isRLH
											lineHeight={1.8}
											fontFamily={GlobalTheme.fontRegular}
											color={GlobalTheme.textColor}>
											4.5 stars
										</TextField>
									</View>
								</View>
							</View>

							<Divider medium />

							<Divider borderTopWidth={1} color="#707070" />

							<Divider />

							<TextField
								xThin
								letterSpacing={-0.07}
								// lineHeight={18}
								isRLH
								lineHeight={1.8}
								fontFamily={GlobalTheme.fontRegular}
								color={GlobalTheme.textColor}>
								Gallery
							</TextField>

							<Divider small />

							<Gallery
								imageGallery={
									getObjectLength(singleBuyItem) != 0
										? singleBuyItem.photos
										: []
								}
							/>

							<Divider />

							<View style={styles.makeModelWrapper}>
								<View style={styles.makeModelInner1}>
									<TextField
										xThin
										letterSpacing={-0.07}
										// lineHeight={18}
										isRLH
										lineHeight={1.8}
										fontFamily={GlobalTheme.fontRegular}
										color={GlobalTheme.textColor}>
										Make
									</TextField>

									<TextField
										xSmall
										// lineHeight={44}
										isRLH
										lineHeight={4.4}
										fontFamily={GlobalTheme.fontMedium}
										color={GlobalTheme.black}>
										{singleBuyItem.make}
									</TextField>
								</View>

								<View style={styles.makeModel2Wrapper}>
									<TextField
										xThin
										letterSpacing={-0.07}
										// lineHeight={18}
										isRLH
										lineHeight={1.8}
										fontFamily={GlobalTheme.fontRegular}
										color={GlobalTheme.textColor}>
										Model
									</TextField>

									<TextField
										xSmall
										// lineHeight={44}
										isRLH
										lineHeight={4.4}
										fontFamily={GlobalTheme.fontMedium}
										color={GlobalTheme.black}>
										{singleBuyItem.model}
									</TextField>
								</View>
							</View>

							{singleBuyItem.description != null ? (
								<>
									<Divider />

									<TextField
										xThin
										letterSpacing={-0.07}
										// lineHeight={18}
										isRLH
										lineHeight={1.8}
										fontFamily={GlobalTheme.fontRegular}
										color={GlobalTheme.textColor}>
										Description
									</TextField>

									<Divider medium />

									<ItemDescription description={singleBuyItem.description} />
								</>
							) : null}

							{singleBuyItem.age != null ? (
								<>
									<Divider />

									<TextField
										xThin
										letterSpacing={-0.07}
										isRLH
										lineHeight={1.8}
										fontFamily={GlobalTheme.fontRegular}
										color={GlobalTheme.textColor}>
										Age (YOM)
									</TextField>

									<TextField
										xSmall
										isRLH
										lineHeight={4.4}
										fontFamily={GlobalTheme.fontMedium}
										color={GlobalTheme.black}>
										{singleBuyItem.age}
									</TextField>
								</>
							) : null}

							{singleBuyItem.mileage != null ||
							singleBuyItem.hours_used != null ? (
								<Divider />
							) : null}

							<View style={styles.makeModelWrapper}>
								<View style={styles.makeModelInner1}>
									{singleBuyItem.mileage != null ? (
										<>
											<TextField
												xThin
												letterSpacing={-0.07}
												isRLH
												lineHeight={1.8}
												fontFamily={GlobalTheme.fontRegular}
												color={GlobalTheme.textColor}>
												Mileage
											</TextField>

											<TextField
												xSmall
												isRLH
												lineHeight={4.4}
												fontFamily={GlobalTheme.fontMedium}
												color={GlobalTheme.black}>
												{`${singleBuyItem.mileage} mi`}
											</TextField>
										</>
									) : null}
								</View>

								<View style={styles.makeModel2Wrapper}>
									{singleBuyItem.hours_used != null ? (
										<>
											<TextField
												xThin
												letterSpacing={-0.07}
												isRLH
												lineHeight={1.8}
												fontFamily={GlobalTheme.fontRegular}
												color={GlobalTheme.textColor}>
												Hours
											</TextField>

											<TextField
												xSmall
												isRLH
												lineHeight={4.4}
												fontFamily={GlobalTheme.fontMedium}
												color={GlobalTheme.black}>
												{`${singleBuyItem.hours_used} hrs`}
											</TextField>
										</>
									) : null}
								</View>
							</View>

							{singleBuyItem.length_mm != null &&
							singleBuyItem.width_mm != null &&
							singleBuyItem.height_mm != null ? (
								<>
									<Divider />

									<TextField
										xThin
										letterSpacing={-0.07}
										// lineHeight={18}
										isRLH
										lineHeight={1.8}
										fontFamily={GlobalTheme.fontRegular}
										color={GlobalTheme.textColor}>
										Item dimensions
									</TextField>

									<View style={styles.lengthWidthDepthWrapper}>
										<View style={styles.lengthWidthDepthInner}>
											<TextField
												xThin
												letterSpacing={-0.07}
												// lineHeight={18}
												isRLH
												lineHeight={1.8}
												fontFamily={GlobalTheme.fontRegular}
												color={GlobalTheme.textColor}>
												Length
											</TextField>

											<Divider horizontal small />

											<TextField
												xThin
												letterSpacing={-0.07}
												// lineHeight={18}
												isRLH
												lineHeight={1.8}
												fontFamily={GlobalTheme.fontBold}
												color={GlobalTheme.black}>
												{singleBuyItem.length_mm} cm
											</TextField>
										</View>

										<View style={styles.lengthWidthDepthInner}>
											<TextField
												xThin
												letterSpacing={-0.07}
												// lineHeight={18}
												isRLH
												lineHeight={1.8}
												fontFamily={GlobalTheme.fontRegular}
												color={GlobalTheme.textColor}>
												Width
											</TextField>

											<Divider horizontal small />

											<TextField
												xThin
												letterSpacing={-0.07}
												// lineHeight={18}
												isRLH
												lineHeight={1.8}
												fontFamily={GlobalTheme.fontBold}
												color={GlobalTheme.black}>
												{singleBuyItem.width_mm} cm
											</TextField>
										</View>

										<View style={styles.lengthWidthDepthInner}>
											<TextField
												xThin
												letterSpacing={-0.07}
												// lineHeight={18}
												isRLH
												lineHeight={1.8}
												fontFamily={GlobalTheme.fontRegular}
												color={GlobalTheme.textColor}>
												Depth
											</TextField>

											<Divider horizontal small />

											<TextField
												xThin
												letterSpacing={-0.07}
												// lineHeight={18}
												isRLH
												lineHeight={1.8}
												fontFamily={GlobalTheme.fontBold}
												color={GlobalTheme.black}>
												{singleBuyItem.height_mm} cm
											</TextField>
										</View>
									</View>
								</>
							) : null}

							{singleBuyItem.ean != null ? (
								<>
									<Divider />

									<TextField
										xThin
										letterSpacing={-0.07}
										isRLH
										lineHeight={1.8}
										fontFamily={GlobalTheme.fontRegular}
										color={GlobalTheme.textColor}>
										EAN
									</TextField>

									<TextField
										xSmall
										isRLH
										lineHeight={4.4}
										fontFamily={GlobalTheme.fontMedium}
										color={GlobalTheme.black}>
										{`${singleBuyItem.ean}`}
									</TextField>
								</>
							) : null}

							{singleBuyItem.weight != null ||
							singleBuyItem.product_code != null ? (
								<Divider />
							) : null}

							<View style={styles.makeModelWrapper}>
								<View style={styles.makeModelInner1}>
									{singleBuyItem.weight != null ? (
										<>
											<TextField
												xThin
												letterSpacing={-0.07}
												isRLH
												lineHeight={1.8}
												fontFamily={GlobalTheme.fontRegular}
												color={GlobalTheme.textColor}>
												Weight (KG/TONNES)
											</TextField>

											<TextField
												xSmall
												isRLH
												lineHeight={4.4}
												fontFamily={GlobalTheme.fontMedium}
												color={GlobalTheme.black}>
												{singleBuyItem.weight}
											</TextField>
										</>
									) : null}
								</View>

								<View style={styles.makeModel2Wrapper}>
									{singleBuyItem.product_code != null ? (
										<>
											<TextField
												xThin
												letterSpacing={-0.07}
												isRLH
												lineHeight={1.8}
												fontFamily={GlobalTheme.fontRegular}
												color={GlobalTheme.textColor}>
												Product code
											</TextField>

											<TextField
												xSmall
												isRLH
												lineHeight={4.4}
												fontFamily={GlobalTheme.fontMedium}
												color={GlobalTheme.black}>
												{`${singleBuyItem.product_code}`}
											</TextField>
										</>
									) : null}
								</View>
							</View>

							<Divider />

							<DetailFinanceModal
								navigation={props.navigation}
								showDetailFinanceModal={detailFinanceScreenModal}
							/>
						</View>
					</View>
				</ViewShot>
			</ScrollView>

			<ShadowView style={styles.buttonBackgroundShadowView(isTablet())}>
				<Divider small />

				<Button
					buttonWidth={268}
					title="ENQUIRE TO BUY"
					blackButton
					onPress={buyConfirmWithAlertHandler}
				/>
			</ShadowView>
		</>
	);
};

const styles = StyleSheet.create({
	mainView: {
		flex: 1,
		backgroundColor: GlobalTheme.white,
		// borderWidth: 1,
		// borderColor: 'green'
	},
	imageBackgroundStyle: {
		paddingTop: 10,
		paddingHorizontal: 10,
		// paddingTop: hp('1.0%'),
		// paddingHorizontal: hp('1.0%'),
	},
	imageStyle: (isTablet) => ({
		width: '100%',
		// height: 220,
		height: IOS && isTablet ? imageResizer(210) : 220,
		resizeMode: 'cover',
		// borderWidth: 1,
	}),
	numberOfImageWrapperStyle: {
		// width: 85,
		// height: 22,
		width: wp('24%'),
		height: hp('2.4%'),
		borderRadius: 3,
		backgroundColor: GlobalTheme.primaryColor,
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		alignItems: 'center',
		position: 'absolute',
		left: 8,
		bottom: 10,
		elevation: 7,
	},
	imagesGalleryIconStyle: {
		width: hp('1.8%'),
		height: hp('1.8%'),
		resizeMode: 'stretch',
	},
	linearGradient: {
		width: '100%',
		height: 20,
		// width: wp('100%'),
		// height: hp('20%'),
		position: 'absolute',
		bottom: 0,
	},
	p17: {
		paddingHorizontal: 17,
		// borderWidth: 1,
	},
	nameAndIconStyle: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	uploadIconStyle: {
		width: 20,
		height: 20,
	},
	pricingStyle: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	providedByWrapperStyle: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		width: '100%',
		height: 56,
		// width: wp('100%'),
		// height: hp('10.5%'),
		// borderWidth: 1,
	},
	providedByImageStyle: {
		width: '13%',
		height: 56,
		// width: wp('13%'),
		// height: hp('10.5%'),
		paddingTop: 3,
		// borderWidth: 1,
	},
	shadowViewStyle: {
		width: 32,
		height: 32,
		shadowRadius: GlobalTheme.shadowRadius,
		shadowColor: GlobalTheme.black,
		shadowOpacity: 0.28,
		borderWidth: 0.1,
		borderColor: 'transparent',
		backgroundColor: '#00595D',
		borderRadius: 50,
		shadowOffset: {width: 0, height: 6},
	},
	providedByDetailStyle: {
		width: '87%',
		height: 56,
		// width: wp('87%'),
		// height: hp('10.5%'),
		// borderWidth: 1,
	},
	providedByDetail1Style: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	providedByDetail1IconStyle: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	locationStyle: {
		width: 14,
		height: 15,
	},
	providedByDetail2Style: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	providedByDetail3Style: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	makeModelWrapper: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		width: '100%',
		// borderWidth: 1,
	},
	makeModelInner1: {
		width: '50%',
		// borderWidth: 1,
	},
	makeModel2Wrapper: {
		width: '50%',
		// borderWidth: 1,
	},
	lengthWidthDepthWrapper: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		// borderWidth: 1,
	},
	lengthWidthDepthInner: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		width: '33%',
		// borderWidth: 1,
	},
	buttonBackgroundShadowView: (isTablet) => {
		// console.log(`Buy isTablet ==> `, isTablet);
		return {
			width: '100%',
			// height: hp(10.0), // added & commented on 19 aug
			height: ANDROID || isTablet ? hp(10.0) : hp(6.0), // commented & added on 9th Nov
			shadowRadius: GlobalTheme.shadowRadius,
			shadowColor: GlobalTheme.black,
			shadowOpacity: 0.28,
			borderWidth: 0.1,
			borderColor: 'transparent',
			backgroundColor: GlobalTheme.white,
			shadowOffset: {width: 0, height: 6},
		};
	},
});

export {BuyItemDetail};
