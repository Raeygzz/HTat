import React, {useState, useEffect} from 'react';
import {
	View,
	Image,
	ScrollView,
	StyleSheet,
	ImageBackground,
} from 'react-native';

import {Rating} from 'react-native-ratings';
import {Calendar} from 'react-native-calendars';
import {isTablet} from 'react-native-device-info';
import {useFocusEffect} from '@react-navigation/native';
import ShadowView from 'react-native-simple-shadow-view';
import LinearGradient from 'react-native-linear-gradient';
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {IOS} from '../helper';
import {GlobalTheme} from '../components/theme';
import {Arrow} from '../components/calendar/Arrow';
import {MonthShortcut} from '../constants/Constant';
import {Gallery} from '../components/buyItemDetail/Gallery';
import {calendarMonthyear, getObjectLength, imageResizer} from '../utils/Utils';
import {
	GenericView,
	Header,
	Divider,
	TextField,
	ItemDescription,
} from '../components/common';
import {ViewAdvertEditActionModal} from './modals/ViewAdvertEditActionModal';

import {useSelector, useDispatch} from 'react-redux';
import {headerTitle} from '../store/actions/Header';
import {calendarHeaderTitle} from '../store/actions/Hire';

const ViewHire = (props) => {
	const singleHiring = useSelector((state) => state.hire.singleHiringItem);
	const calendarUnavailableDates = useSelector(
		(state) => state.adverts.calendarUnavailableDateList,
	);
	const calendarHTitle = useSelector((state) => state.hire.calendarHeaderTitle);
	const presentAdvertScreenModal = useSelector(
		(state) => state.adverts.presentAdvertScreenModal,
	);

	const [hiringInItem, setHiringInItem] = useState(
		props.route.params.hiringInItem,
	);
	const [pressedArrow, setPressedArrow] = useState('');
	const [unavailableDates, setUnavailableDates] = useState({});
	const [monthChangeValue, setMonthChangeValue] = useState('');

	const dispatch = useDispatch();

	useFocusEffect(
		React.useCallback(() => {
			let headerConfig = {
				isBackArrow: true,
				leftTitle: 'Back',
				isRightContent: true,
				rightTitle: 'Edit',
				navParam: 'callback',
			};

			dispatch(headerTitle(headerConfig));
		}, []),
	);

	useEffect(() => {
		return () => dispatch(calendarHeaderTitle(''));
	}, []);

	useEffect(() => {
		if (calendarUnavailableDates.length > 0) {
			let readyForMarkedDates = [];
			for (let i = 0; i < calendarUnavailableDates.length; i++) {
				readyForMarkedDates.push({
					[calendarUnavailableDates[i].date]: {
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
					{singleHiring.item[`price_day_${i + 1}`] != null
						? '£ ' + singleHiring.item[`price_day_${i + 1}`]
						: '  -'}
				</TextField>
			</View>,
		);
	}

	let totalPhotosLength =
		singleHiring.item.photos.length > 9
			? singleHiring.item.photos.length
			: '0' + singleHiring.item.photos.length;
	return (
		<GenericView isBackgroundColor>
			<>
				<Header />
				<ScrollView style={styles.mainView}>
					{/* <Divider xxMedium /> */}

					<Divider xxxHuge />

					<TextField
						title
						letterSpacing={-0.32}
						// lineHeight={26}
						isRLH
						lineHeight={2.6}
						fontFamily={GlobalTheme.fontBlack}
						color={GlobalTheme.primaryColor}
						style={styles.mh10}>
						VIEW HIRE
					</TextField>

					<Divider />

					<View style={styles.imageBackgroundStyle}>
						<ImageBackground
							source={{uri: singleHiring.item.main_image}}
							// resizeMode="cover"
							style={styles.imageStyle(isTablet())}>
							<View style={styles.numberOfImageWrapperStyle}>
								<Image
									source={require('../assets/image/icon/images.png')}
									style={styles.imagesGalleryIconStyle}
								/>

								<TextField
									xThin
									letterSpacing={-0.19}
									// lineHeight={20}
									isRLH
									lineHeight={2.0}
									fontFamily={GlobalTheme.fontRegular}
									color={GlobalTheme.white}>
									+{totalPhotosLength} images
								</TextField>
							</View>

							<LinearGradient
								colors={['#FFFFFF00', '#FFFFFF']}
								style={styles.linearGradient}
							/>
						</ImageBackground>
					</View>

					<View style={styles.p20}>
						<TextField
							title
							letterSpacing={-0.48}
							// lineHeight={22}
							isRLH
							lineHeight={2.4}
							fontFamily={GlobalTheme.fontBold}
							color={GlobalTheme.defaultBlack}>
							{singleHiring.item.name}
						</TextField>

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
									£{singleHiring.item.per_day_price}
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

							{singleHiring.item.selling_price != null ? (
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
										£{singleHiring.item.selling_price}
									</TextField>

									{/* {singleHiring.item.vat != 0 ? (
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
									) : null} */}
								</View>
							) : null}
						</View>

						{/* hire  from tabular rates */}
						{tabularPerDayPrice}

						<Divider xMedium />

						<Divider borderTopWidth={1} color="#707070" />

						<View style={styles.providedByWrapperStyle}>
							<View style={styles.providedByImageStyle}>
								<ShadowView style={styles.shadowViewStyle}></ShadowView>
							</View>

							<View style={styles.providedByDetailStyle}>
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

								<TextField
									small
									letterSpacing={-0.09}
									// lineHeight={18}
									isRLH
									lineHeight={1.8}
									fontFamily={GlobalTheme.fontBold}
									color={GlobalTheme.black}>
									{singleHiring.item.owner.first_name != null
										? singleHiring.item.owner.first_name +
										  ' ' +
										  singleHiring.item.owner.last_name
										: 'NA'}
								</TextField>

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
								getObjectLength(singleHiring) != 0
									? singleHiring.item.photos
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
									{singleHiring.item.make}
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
									{singleHiring.item.model}
								</TextField>
							</View>
						</View>

						{singleHiring.item.description != null ? (
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

								<ItemDescription description={singleHiring.item.description} />
							</>
						) : null}

						{singleHiring.item.age != null ? (
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
									{singleHiring.item.age}
								</TextField>
							</>
						) : null}

						{singleHiring.item.mileage != null ||
						singleHiring.item.hours_used != null ? (
							<Divider />
						) : null}

						<View style={styles.makeModelWrapper}>
							<View style={styles.makeModelInner1}>
								{singleHiring.item.mileage != null ? (
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
											{`${singleHiring.item.mileage} mi`}
										</TextField>
									</>
								) : null}
							</View>

							<View style={styles.makeModel2Wrapper}>
								{singleHiring.item.hours_used != null ? (
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
											{`${singleHiring.item.hours_used} hrs`}
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
							Dates
						</TextField>

						<Divider medium />

						<View
							style={{
								width: '100%',
								flexDirection: 'row',
								justifyContent: 'space-between',
								alignItems: 'center',
								// borderWidth: 1,
							}}>
							<View
								style={{
									width: '45%',
									flexDirection: 'row',
									justifyContent: 'space-between',
									alignItems: 'center',
									// borderWidth: 1,
								}}>
								<TextField
									regular
									letterSpacing={-0.07}
									// lineHeight={18}
									isRLH
									lineHeight={2.0}
									fontFamily={GlobalTheme.fontBold}
									color={GlobalTheme.black}>
									From
								</TextField>

								<TextField
									xThin
									letterSpacing={-0.07}
									// lineHeight={18}
									isRLH
									lineHeight={1.8}
									fontFamily={GlobalTheme.fontRegular}
									color={GlobalTheme.textColor}>
									{singleHiring.start_date}
								</TextField>
							</View>

							<View
								style={{
									width: '45%',
									flexDirection: 'row',
									justifyContent: 'space-between',
									alignItems: 'center',
									// borderWidth: 1,
								}}>
								<TextField
									regular
									letterSpacing={-0.07}
									// lineHeight={18}
									isRLH
									lineHeight={2.0}
									fontFamily={GlobalTheme.fontBold}
									color={GlobalTheme.black}>
									To
								</TextField>

								<TextField
									xThin
									letterSpacing={-0.07}
									// lineHeight={18}
									isRLH
									lineHeight={1.8}
									fontFamily={GlobalTheme.fontRegular}
									color={GlobalTheme.textColor}>
									{singleHiring.end_date}
								</TextField>
							</View>
						</View>

						<Divider medium />

						<Divider borderTopWidth={1} color="#707070" />

						{singleHiring.item.length_mm != null &&
						singleHiring.item.width_mm != null &&
						singleHiring.item.height_mm != null ? (
							<>
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

								<Divider small />

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
											{singleHiring.item.length_mm} cm
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
											{singleHiring.item.width_mm} cm
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
											{singleHiring.item.height_mm} cm
										</TextField>
									</View>
								</View>
							</>
						) : null}

						{singleHiring.item.ean != null ? (
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
									{`${singleHiring.item.ean}`}
								</TextField>
							</>
						) : null}

						{singleHiring.item.weight != null ||
						singleHiring.item.product_code != null ? (
							<Divider />
						) : null}

						<View style={styles.makeModelWrapper}>
							<View style={styles.makeModelInner1}>
								{singleHiring.item.weight != null ? (
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
											{singleHiring.item.weight}
										</TextField>
									</>
								) : null}
							</View>

							<View style={styles.makeModel2Wrapper}>
								{singleHiring.item.product_code != null ? (
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
											{`${singleHiring.item.product_code}`}
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

						<Divider medium />

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
									console.log('month changed', month);
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
									/* Return JSX */
									return null;
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
						<Divider xxxHuge />

						<ViewAdvertEditActionModal
							hideAdvertButtons={true}
							// hiring in id
							item={hiringInItem}
							show={presentAdvertScreenModal}
						/>
					</View>
				</ScrollView>
			</>
		</GenericView>
	);
};

const styles = StyleSheet.create({
	mainView: {
		flex: 1,
		// borderWidth: 1,
		// borderColor: 'red',
	},
	mh10: {
		marginHorizontal: 10,
	},
	imageBackgroundStyle: {
		paddingHorizontal: 10,
		// paddingTop: hp('1.0%'),
		// paddingHorizontal: hp('1.0%'),
		// borderWidth: 1,
	},
	imageStyle: (isTablet) => ({
		width: '100%',
		// height: 220,
		height: IOS && isTablet ? imageResizer(210) : 220,
		resizeMode: 'cover',
		// borderWidth: 1,
	}),
	numberOfImageWrapperStyle: {
		width: 85,
		height: 22,
		borderRadius: 3,
		backgroundColor: GlobalTheme.primaryColor,
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		alignItems: 'center',
		position: 'absolute',
		left: 8,
		bottom: 10,
		elevation: 7,
		// borderWidth: 1,
	},
	imagesGalleryIconStyle: {
		width: 16,
		height: 16,
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
	p20: {
		paddingHorizontal: 20,
		// borderWidth: 1,
	},

	pricingStyle: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
		// borderWidth: 1,
		// borderColor: 'blue',
	},
	pricingInnerStyle: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		width: '50%',
		// borderWidth: 1,
		// borderColor: 'green',
	},
	tagAndPricingStyle: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
		width: '50%',
		// borderWidth: 1,
		// borderColor: 'red',
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
		// borderColor: 'blue',
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
		backgroundColor: GlobalTheme.primaryColor,
		borderRadius: 50,
		shadowOffset: {width: 0, height: 6},
	},
	providedByDetailStyle: {
		width: '87%',
		height: 56,
		// width: wp('87%'),
		// height: hp('10.5%'),
		// borderWidth: 1,
		// borderColor: 'red',
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
		// height: 360,
		// height: hp('47.0%'),
		height: hp('57%'),
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
		width: '100%',
		// height: 50,
		height: hp('6.5%'),
		// borderWidth: 1,
	},
	calendarHeaderInnerStyle: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		// paddingVertical: 10,
	},
	leftRightArrowIconWrapper: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
});

export {ViewHire};
