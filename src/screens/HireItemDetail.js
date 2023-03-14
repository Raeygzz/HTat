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
import {Calendar} from 'react-native-calendars';
import {isTablet} from 'react-native-device-info';
import {useFocusEffect} from '@react-navigation/native';
import ShadowView from 'react-native-simple-shadow-view';
import analytics from '@react-native-firebase/analytics';
import LinearGradient from 'react-native-linear-gradient';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

import {IOS, ANDROID} from '../helper';
import {ShareItem} from '../models';
import {GlobalTheme} from '../components/theme';
import {Arrow} from '../components/calendar/Arrow';
import {MonthShortcut} from '../constants/Constant';
import {Gallery} from '../components/buyItemDetail/Gallery';
import {getObjectLength, calendarMonthyear, imageResizer} from '../utils';
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
import {calendarHeaderTitle} from '../store/actions/Hire';
// import {listUserCardsApi} from '../store/actions/UserCard';
// import {userBusinessProfileGETApi} from '../store/actions/Settings';

const HireItemDetail = (props) => {
	const userEmail = useSelector((state) => state.auth.user.email);
	const singleHireItem = useSelector((state) => state.hire.singleHireItem);
	const calendarUnavailableDates = useSelector(
		(state) => state.adverts.calendarUnavailableDateList,
	);
	const calendarHTitle = useSelector((state) => state.hire.calendarHeaderTitle);
	const hasPrimaryCard = useSelector(
		(state) => state.auth.user.has_primary_card,
	);
	const hasBusinessProfile = useSelector(
		(state) => state.auth.user.has_business_profile,
	);

	const [unavailableDates, setUnavailableDates] = useState({});
	const [pressedArrow, setPressedArrow] = useState('');
	// const [calendarTitle, setCalendarTitle] = useState('');
	const [monthChangeValue, setMonthChangeValue] = useState('');

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

	useEffect(() => {
		return () => dispatch(calendarHeaderTitle(''));
	}, []);

	const shareContentHandler = () => {
		ShareItem(
			viewRef,
			`HT item - ${singleHireItem.name} hire for £${
				singleHireItem.per_day_price
			} per day which is provided by ${
				getObjectLength(singleHireItem) != 0
					? singleHireItem.owner.first_name != null
						? singleHireItem.owner.first_name +
						  ' ' +
						  singleHireItem.owner.last_name
						: 'NA'
					: null
			}`,
		);
	};

	const onMonthChangeHandler = (monthChange) => {
		// console.log('monthChange ==> ', monthChange);

		if (pressedArrow === 'left') {
			let yearLeft = monthChange.year;
			let monthNumLeft = monthChange.month - 1;
			let monthCharLeft = MonthShortcut[monthNumLeft];

			let calendarTitleLeft = monthCharLeft + ' ' + yearLeft;
			dispatch(calendarHeaderTitle(calendarTitleLeft));
		} else if (pressedArrow === 'right') {
			let yearRight = monthChange.year;
			let monthNumRight = monthChange.month - 1;
			let monthCharRight = MonthShortcut[monthNumRight];

			let calendarTitleRight = monthCharRight + ' ' + yearRight;
			dispatch(calendarHeaderTitle(calendarTitleRight));
		}

		// setCalendarTitle(monthChar + ' ' + year);
	};

	useEffect(() => {
		if (calendarUnavailableDates.length > 0) {
			let readyForMarkedDates = [];
			for (let i = 0; i < calendarUnavailableDates.length; i++) {
				readyForMarkedDates.push({
					[calendarUnavailableDates[i].date]: {
						// selected: true,
						// selectedColor: GlobalTheme.primaryColor,
						// selectedTextColor: GlobalTheme.black,
						marked: true,
						dotColor: GlobalTheme.black,
						disableTouchEvent: true,
						disabled: true,
						activeOpacity: 0,
					},
				});
			}
			readyForMarkedDates = Object.assign({}, ...readyForMarkedDates);
			// console.log('readyForMarkedDates ==> ', readyForMarkedDates);

			setUnavailableDates(readyForMarkedDates);
		}
	}, [calendarUnavailableDates]);

	const hireConfirmWithAlertHandler = () => {
		analytics().logEvent('hire_this_item_button_pressed');

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

		if (hasBusinessProfile === 1 && hasPrimaryCard === 1) {
			dispatch(addressListApi());
			// dispatch(listUserCardsApi());

			let hireConfirmData = {
				singleHireItem: singleHireItem,
				unavailableDates: unavailableDates,
			};

			dispatch(calendarHeaderTitle(''));
			props.navigation.navigate('HireConfirm', {
				hireConfirmData: hireConfirmData,
			});

			return;
		}

		if (hasBusinessProfile != 1 || hasPrimaryCard != 1) {
			analytics().logEvent('message_to_fill_account_details');

			let alertConfig = {
				title: 'Wait!',
				message:
					'Please take a moment to fill in your account details to complete your hire',
				shouldRunFunction: true,
				functionHandler: 'hireConfirmHandler',
				shouldCallback: () => hireConfirmHandler(),
			};

			dispatch(presentAlert(alertConfig));
		}
	};

	const hireConfirmHandler = () => {
		if (hasBusinessProfile != 1) {
			// dispatch(userBusinessProfileGETApi());
			props.navigation.navigate('TradingAccount', {
				collectInOneGo: hasPrimaryCard != 1 ? true : false,
			});

			// let alertConfig = {
			// 	title: 'Wait!',
			// 	message:
			// 		'Please update your business profile from Setting Screen under MANAGE TRADING DETAILS section',
			// 	shouldNavigate: true,
			// 	navigation: props.navigation,
			// 	navigateTo: 'TradingAccount',
			// };

			// dispatch(presentAlert(alertConfig));
			return;
		}

		if (hasPrimaryCard != 1) {
			props.navigation.navigate('AddPaymentCard');

			// let alertConfig = {
			// 	title: 'Oops!',
			// 	message:
			// 		'Please add at least one card from Setting Screen under MANAGE PAYMENT section',
			// 	shouldNavigate: true,
			// 	navigation: props.navigation,
			// 	navigateTo: 'ManagePayments',
			// };

			// dispatch(presentAlert(alertConfig));
			return;
		}
	};

	let tabularPerDayPrice = [];
	for (let i = 0; i <= 6; i++) {
		tabularPerDayPrice.push(
			<View
				key={i}
				style={{
					width: '35%',
					height: hp(2.0),
					flexDirection: 'row',
					justifyContent: 'flex-start',
					alignItems: 'center',
					// borderWidth: 1,
				}}>
				<TextField
					xThin
					isRLH
					lineHeight={2.0}
					letterSpacing={-0.07}
					fontFamily={GlobalTheme.fontBold}
					color={GlobalTheme.black}
					style={{
						width: '42%',
						height: hp(2.0),
						paddingLeft: hp(2.0),
						// borderWidth: hp(0.1),
						// borderColor: GlobalTheme.textColor,
					}}>
					{i + 1}
				</TextField>

				<TextField
					xThin
					isRLH
					lineHeight={2.0}
					letterSpacing={-0.07}
					fontFamily={GlobalTheme.fontRegular}
					color={GlobalTheme.black}
					style={{
						width: '58%',
						height: hp(2.0),
						paddingLeft: hp(1.0),
						// borderWidth: hp(0.1),
						// borderColor: GlobalTheme.textColor,
					}}>
					{singleHireItem[`price_day_${i + 1}`] != null
						? '£ ' + singleHireItem[`price_day_${i + 1}`]
						: '  -'}
				</TextField>
			</View>,
		);
	}

	let hireItemProvidedByName =
		getObjectLength(singleHireItem) != 0
			? singleHireItem.owner.first_name != null
				? singleHireItem.owner.first_name + ' ' + singleHireItem.owner.last_name
				: 'NA'
			: null;
	return (
		<>
			<ScrollView showsVerticalScrollIndicator={false} style={styles.mainView}>
				<ViewShot ref={viewRef} options={{format: 'png', quality: 0.7}}>
					<View style={{backgroundColor: GlobalTheme.white}}>
						<View style={styles.imageBackgroundStyle}>
							<ImageBackground
								source={{uri: singleHireItem.main_image}}
								// resizeMode="cover"
								style={styles.imageStyle(isTablet())}>
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
									lineHeight={2.4}
									fontFamily={GlobalTheme.fontBold}
									color={GlobalTheme.defaultBlack}>
									{singleHireItem.name}
								</TextField>

								<TouchableOpacity onPress={shareContentHandler}>
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
								Hire from
							</TextField>

							<Divider small />

							<View style={styles.pricingStyle}>
								<View style={styles.pricingInnerStyle}>
									<View
										style={{
											width: '70%',
											flexDirection: 'row',
											justifyContent: 'flex-start',
											alignItems: 'center',
											alignSelf: 'center',
											// borderWidth: 1,
										}}>
										<TextField
											regular
											isRLH
											lineHeight={3.0}
											letterSpacing={-0.07}
											fontFamily={GlobalTheme.fontBold}
											color={GlobalTheme.black}
											style={{
												width: '42%',
												paddingLeft: hp(1.0),
												// borderWidth: hp(0.1),
												// borderColor: GlobalTheme.textColor,
											}}>
											Days
										</TextField>

										<TextField
											regular
											isRLH
											lineHeight={3.0}
											letterSpacing={-0.07}
											fontFamily={GlobalTheme.fontBold}
											color={GlobalTheme.black}
											style={{
												width: '58%',
												paddingLeft: hp(1.0),
												// borderWidth: hp(0.1),
												// borderColor: GlobalTheme.textColor,
											}}>
											Price
										</TextField>
									</View>

									{/* <TextField
										title
										letterSpacing={-0.32}
										// lineHeight={20}
										isRLH
										lineHeight={2.4}
										fontFamily={GlobalTheme.fontBold}
										color={GlobalTheme.black}>
										£{singleHireItem.per_day_price}
									</TextField>

									<Divider horizontal small />

									<TextField
										xThin
										letterSpacing={-0.07}
										// lineHeight={18}
										isRLH
										lineHeight={1.8}
										fontFamily={GlobalTheme.fontRegular}
										color={GlobalTheme.textColor}>
										per day
									</TextField> */}
								</View>

								{singleHireItem.selling_price != null ? (
									<View style={styles.tagAndPricingStyle}>
										<Image
											source={require('../assets/image/icon/tag.png')}
											style={styles.tagIconStyle}
										/>

										<TextField
											xThin
											letterSpacing={-0.19}
											// lineHeight={20}
											isRLH
											lineHeight={2.0}
											fontFamily={GlobalTheme.fontBold}
											color={GlobalTheme.primaryColor}>
											Buy
										</TextField>

										<Divider horizontal small />

										<TextField
											small
											letterSpacing={-0.22}
											// lineHeight={20}
											isRLH
											lineHeight={2.0}
											fontFamily={GlobalTheme.fontBold}
											color={GlobalTheme.black}>
											{`£${singleHireItem.selling_price}`}
										</TextField>

										{/* <Divider horizontal xMedium />

								<TextField
									xThin
									letterSpacing={-0.07}
									// lineHeight={18}
									isRLH
									lineHeight={1.8}
									fontFamily={GlobalTheme.fontRegular}
									color={GlobalTheme.primaryColor}>
									Need finance?
								</TextField> */}
									</View>
								) : null}
							</View>

							{/* hire  from tabular rates */}
							{tabularPerDayPrice}

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
											{hireItemProvidedByName}
										</TextField>

										<TextField
											xThin
											letterSpacing={-0.06}
											// lineHeight={14}
											isRLH
											lineHeight={1.8}
											fontFamily={GlobalTheme.fontRegular}
											color={GlobalTheme.textColor}>
											Based on {singleHireItem.post_code}
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

							<TextField
								xThin
								letterSpacing={-0.07}
								isRLH
								lineHeight={1.8}
								fontFamily={GlobalTheme.fontRegular}
								color={GlobalTheme.textColor}>
								Gallery
							</TextField>

							<Divider small />

							<Gallery
								imageGallery={
									getObjectLength(singleHireItem) != 0
										? singleHireItem.photos
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
										{singleHireItem.make}
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
										{singleHireItem.model}
									</TextField>
								</View>
							</View>

							{singleHireItem.description != null ? (
								<>
									<Divider />

									<TextField
										xThin
										letterSpacing={-0.07}
										isRLH
										lineHeight={1.8}
										fontFamily={GlobalTheme.fontRegular}
										color={GlobalTheme.textColor}>
										Description
									</TextField>

									<Divider medium />

									<ItemDescription description={singleHireItem.description} />
								</>
							) : null}

							{singleHireItem.age != null ? (
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
										{singleHireItem.age}
									</TextField>
								</>
							) : null}

							{singleHireItem.mileage != null ||
							singleHireItem.hours_used != null ? (
								<Divider />
							) : null}

							<View style={styles.makeModelWrapper}>
								<View style={styles.makeModelInner1}>
									{singleHireItem.mileage != null ? (
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
												{`${singleHireItem.mileage} mi`}
											</TextField>
										</>
									) : null}
								</View>

								<View style={styles.makeModel2Wrapper}>
									{singleHireItem.hours_used != null ? (
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
												{`${singleHireItem.hours_used} hrs`}
											</TextField>
										</>
									) : null}
								</View>
							</View>

							{singleHireItem.length_mm != null &&
							singleHireItem.width_mm != null &&
							singleHireItem.height_mm != null ? (
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
												{singleHireItem.length_mm} cm
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
												{singleHireItem.width_mm} cm
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
												{singleHireItem.height_mm} cm
											</TextField>
										</View>
									</View>
								</>
							) : null}

							{singleHireItem.ean != null ? (
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
										{`${singleHireItem.ean}`}
									</TextField>
								</>
							) : null}

							{singleHireItem.weight != null ||
							singleHireItem.product_code != null ? (
								<Divider />
							) : null}

							<View style={styles.makeModelWrapper}>
								<View style={styles.makeModelInner1}>
									{singleHireItem.weight != null ? (
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
												{singleHireItem.weight}
											</TextField>
										</>
									) : null}
								</View>

								<View style={styles.makeModel2Wrapper}>
									{singleHireItem.product_code != null ? (
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
												{`${singleHireItem.product_code}`}
											</TextField>
										</>
									) : null}
								</View>
							</View>

							<Divider />

							<TextField
								xThin
								letterSpacing={-0.07}
								// lineHeight={18}
								isRLH
								lineHeight={1.8}
								fontFamily={GlobalTheme.fontRegular}
								color={GlobalTheme.textColor}>
								Delivery / Collection
							</TextField>

							<Divider small />

							<View style={styles.rowStyle}>
								<TextField
									regular
									letterSpacing={-0.07}
									// lineHeight={18}
									isRLH
									lineHeight={2.0}
									fontFamily={GlobalTheme.fontBold}
									color={GlobalTheme.black}>
									Delivery available
								</TextField>

								<TextField
									xThin
									letterSpacing={-0.07}
									// lineHeight={18}
									isRLH
									lineHeight={1.8}
									fontFamily={GlobalTheme.fontRegular}
									color={GlobalTheme.textColor}>
									Charges apply
								</TextField>
							</View>

							<Divider medium />

							<Divider borderTopWidth={1} color="#707070" />

							<View style={styles.rowStyle}>
								<TextField
									regular
									letterSpacing={-0.07}
									// lineHeight={18}
									isRLH
									lineHeight={2.0}
									fontFamily={GlobalTheme.fontBold}
									color={GlobalTheme.black}>
									Collection in person
								</TextField>

								<TextField
									xThin
									letterSpacing={-0.07}
									// lineHeight={18}
									isRLH
									lineHeight={1.8}
									fontFamily={GlobalTheme.fontRegular}
									color={GlobalTheme.textColor}>
									FREE
								</TextField>
							</View>

							<Divider medium />

							<Divider borderTopWidth={1} color="#707070" />

							<Divider />
						</View>
					</View>
				</ViewShot>

				<View style={styles.p17}>
					<TextField
						regular
						letterSpacing={-0.07}
						// lineHeight={18}
						isRLH
						lineHeight={2.0}
						fontFamily={GlobalTheme.fontRegular}
						color={GlobalTheme.textColor}>
						Availability calendar
					</TextField>

					<Divider xMedium />

					<ShadowView style={styles.shadowCalendarViewStyle}>
						<TextField
							center
							huge
							fontFamily={GlobalTheme.fontBold}
							color={GlobalTheme.black}
							style={{
								position: 'absolute',
								top: hp('2.5%'),
								alignSelf: 'center',
								zIndex: 999,
								elevation: 999,
								// borderWidth: 1,
							}}>
							{calendarHTitle != '' ? calendarHTitle : calendarMonthyear()}
						</TextField>

						<View
							style={{
								top: hp('8.0%'),
								zIndex: 999,
								elevation: 999,
								marginHorizontal: hp('2.0%'),
								borderTopWidth: 0.5,
								borderColor: GlobalTheme.horizontalLineColor,
							}}
						/>

						<Calendar
							// markingType="period"
							markedDates={unavailableDates}
							style={styles.calendarStyle}
							// Initially visible month. Default = Date()
							current={new Date()}
							// Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
							minDate={new Date()}
							// Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
							maxDate={''}
							// Handler which gets executed on day press. Default = undefined
							onDayPress={(day) => {
								console.log('selected day', day);
							}}
							// Handler which gets executed on day long press. Default = undefined
							onDayLongPress={(day) => {
								console.log('selected day', day);
							}}
							// Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
							monthFormat={'yyyy MM'}
							// Handler which gets executed when visible month changes in calendar. Default = undefined
							onMonthChange={(month) => {
								setMonthChangeValue(month);
								onMonthChangeHandler(month);
							}}
							// Hide month navigation arrows. Default = false
							hideArrows={false}
							// Replace default arrows with custom ones (direction can be 'left' or 'right')
							renderArrow={(direction) => <Arrow direction={direction} />}
							// Do not show days of other months in month page. Default = false
							hideExtraDays={true}
							// If hideArrows=false and hideExtraDays=false do not switch month when tapping on greyed out
							// day from another month that is visible in calendar page. Default = false
							disableMonthChange={false}
							// If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
							firstDay={1}
							// Hide day names. Default = false
							hideDayNames={false}
							// Show week numbers to the left. Default = false
							showWeekNumbers={false}
							// Handler which gets executed when press arrow icon left. It receive a callback can go back month
							onPressArrowLeft={(subtractMonth) => {
								setPressedArrow('left');
								subtractMonth();
							}}
							// Handler which gets executed when press arrow icon right. It receive a callback can go next month
							onPressArrowRight={(addMonth) => {
								setPressedArrow('right');
								addMonth();
							}}
							// Disable left arrow. Default = false
							disableArrowLeft={false}
							// Disable right arrow. Default = false
							disableArrowRight={false}
							// Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates
							disableAllTouchEventsForDisabledDays={true}
							// Replace default month and year title with custom one. the function receive a date as parameter.
							renderHeader={(date) => {
								/*Return JSX*/
								return null;
								// <View style={styles.calendarHeaderStyle}>
								// 	<View style={styles.calendarHeaderInnerStyle}>
								// 		<TextField
								// 			huge
								// 			fontFamily={GlobalTheme.fontBold}
								// 			color={GlobalTheme.black}>
								// 			{calendarHTitle != ''
								// 				? calendarHTitle
								// 				: calendarMonthyear()}
								// 		</TextField>

								// 		{/* <View style={styles.leftRightArrowIconWrapper}>
								// 			<TouchableOpacity onPress={() => console.log('right!')}>
								// 				<Icon
								// 					name="ios-chevron-back-circle-sharp"
								// 					size={35}
								// 					color={GlobalTheme.primaryColor}
								// 				/>
								// 			</TouchableOpacity>

								// 			<TouchableOpacity onPress={() => console.log('left!')}>
								// 				<Icon
								// 					name="ios-chevron-forward-circle-sharp"
								// 					size={35}
								// 					color={GlobalTheme.primaryColor}
								// 				/>
								// 			</TouchableOpacity>
								// 		</View> */}
								// 	</View>

								// 	{/* <Divider small /> */}
								// 	{/* <Divider borderTopWidth={1} color="#707070" /> */}
								// </View>
							}}
							// Enable the option to swipe between months. Default = false
							enableSwipeMonths={false}
						/>
					</ShadowView>

					<Divider large />

					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'flex-start',
							alignItems: 'center',
							paddingLeft: hp('2.0%'),
							// borderWidth: 1,
						}}>
						<View
							style={{
								height: hp('1.0%'),
								width: hp('1.0%'),
								borderRadius: hp('5.0%'),
								backgroundColor: GlobalTheme.black,
							}}
						/>

						<Divider horizontal small />

						<TextField
							xThin
							letterSpacing={-0.07}
							isRLH
							lineHeight={1.8}
							fontFamily={GlobalTheme.fontRegular}
							color={GlobalTheme.textColor}>
							Bookings
						</TextField>
					</View>

					<Divider xxxHuge />
				</View>
			</ScrollView>

			<ShadowView style={styles.buttonBackgroundShadowView(isTablet())}>
				<Divider small />

				<Button
					buttonWidth={268}
					title="HIRE THIS ITEM"
					blackButton
					onPress={hireConfirmWithAlertHandler}
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
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	pricingInnerStyle: {
		width: '50%',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	tagAndPricingStyle: {
		width: '50%',
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
	},
	tagIconStyle: {
		width: 17,
		height: 15,
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
	rowStyle: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	shadowCalendarViewStyle: {
		width: '100%',
		height: hp('54.0%'),
		shadowRadius: GlobalTheme.shadowRadius,
		shadowColor: GlobalTheme.black,
		shadowOpacity: 0.28,
		borderWidth: 0.1,
		alignSelf: 'center',
		borderColor: 'transparent',
		backgroundColor: GlobalTheme.white,
		borderRadius: GlobalTheme.viewRadius,
		shadowOffset: {width: 0, height: 6},
	},
	calendarStyle: {
		borderRadius: GlobalTheme.viewRadius,
	},
	calendarHeaderStyle: {
		// width: '100%',
		// width: '75%',
		// height: 50,
		// borderWidth: 1,
	},
	calendarHeaderInnerStyle: {
		// width: '100%',
		// flexDirection: 'row',
		// justifyContent: 'space-between',
		// alignItems: 'center',
		// paddingVertical: 10,
		// borderWidth: 1,
		// borderColor: 'blue',
	},
	leftRightArrowIconWrapper: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	buttonBackgroundShadowView: (isTablet) => {
		// console.log('Hire isTablet ==> ', isTablet);
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

export {HireItemDetail};
