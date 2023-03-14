import React, {useEffect, useState} from 'react';
import {
	View,
	Image,
	Alert,
	Modal,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	PermissionsAndroid,
	TouchableWithoutFeedback,
} from 'react-native';

import moment from 'moment';
import Geocoder from 'react-native-geocoding';
import {Calendar} from 'react-native-calendars';
import {isTablet} from 'react-native-device-info';
import Icon from 'react-native-vector-icons/Ionicons';
import {openSettings} from 'react-native-permissions';
import {showMessage} from 'react-native-flash-message';
import {CommonActions} from '@react-navigation/native';
import {useFocusEffect} from '@react-navigation/native';
import ShadowView from 'react-native-simple-shadow-view';
import analytics from '@react-native-firebase/analytics';
// import {useKeyboard} from '@react-native-community/hooks';
import Geolocation from 'react-native-geolocation-service';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
	heightPercentageToDP as hp,
	widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {_ENV_CONFIG} from '../config';
import {IOS, ANDROID} from '../helper';
import {SavedCardsModal} from './modals';
// import {findLatLong} from '../services/axios/Api';
import {findAddressFromPostcode} from '../services/axios/Api';
import {Arrow} from '../components/calendar/Arrow';
import {GlobalTheme} from '../components/theme/GlobalTheme';
import {MonthShortcut, CollectionType} from '../constants/Constant';
import {
	// RegExp,
	calendarMonthyear,
	// weekDiffNRemainingDays,
	getObjectLength,
} from '../utils';
import {
	GenericView,
	Header,
	TextField,
	Divider,
	HTPicker,
	HTTextInput,
	Button,
	OnlyCheckBox,
	ParsedLinkText,
} from '../components/common';

import {useSelector, useDispatch} from 'react-redux';
import {setError} from '../store/actions/Error';
import {headerTitle} from '../store/actions/Header';
import {presentAlert} from '../store/actions/Alert';
import {calendarHeaderTitle} from '../store/actions/Hire';
import {listUserCardsApi} from '../store/actions/UserCard';
import {presentLoader, hideLoader} from '../store/actions/Loader';
import {
	presentSavedCardPaymentScreenModal,
	hideSavedCardPaymentScreenModal,
} from '../store/actions/UserCard';
import {
	// presentHireMakePaymentScreenModal,
	itemHireApi,
	shouldRunFunctionFromAlert,
	findDistanceApi,
	hireItemPaymentSuccess,
	hireItemPaymentApi,
	hireItemStripePaymentSuccess,
	dayToPriceApi,
	// clearHireCalculatedDistance,
	// clearCollectionTypePickerDefaultValue,
} from '../store/actions/Hire';

const HireConfirm = (props) => {
	// const presentHirePaymentScreenModal = useSelector(
	// 	(state) => state.hire.presentHireMakePaymentScreenModal,
	// );
	const hasPrimaryCard = useSelector(
		(state) => state.auth.user.has_primary_card,
	);
	const shouldRunFunction = useSelector(
		(state) => state.hire.shouldRunFunction,
	);
	const hire_item_error_message = useSelector(
		(state) => state.hire.hireItemErrorMessage,
	);
	const addressPickerList = useSelector(
		(state) => state.profile.addressPickerList,
	);
	const hireItmPaymentSuccess = useSelector(
		(state) => state.hire.hireItemPaymentSuccess,
	);
	const hireCalculatedDistance = useSelector(
		(state) => state.hire.hireCalculatedDistance,
	);
	const itemHireId = useSelector((state) => state.hire.itemHireId);
	const calendarHTitle = useSelector((state) => state.hire.calendarHeaderTitle);
	const showSavedCardsModal = useSelector(
		(state) => state.userCard.presentSavedCardPaymentScreenModal,
	);
	const hireItmStripePaymentSuccess = useSelector(
		(state) => state.hire.hireItemStripePaymentSuccess,
	);
	const hireItemStripeCostDetail = useSelector(
		(state) => state.hire.hireItemStripeCostDetail,
	);

	// const clearPickerDefaultValue = useSelector(
	// 	(state) => state.hire.clearCollectionTypePickerDefaultValue,
	// );

	const showError = useSelector((state) => state.error.showError);
	const errorMessage = useSelector((state) => state.error.message);

	const numberOfDaysToPrice = useSelector(
		(state) => state.hire.numberOfDaysToPrice,
	);

	const [savedAddress, setSavedAddress] = useState(true);
	const [manualAddress, setManualAddress] = useState(false);

	const [location, setLocation] = useState('');
	const [typedPostcode, setTypedPostcode] = useState(false);
	const [locationValidate, setLocationValidate] = useState(false);

	const [latLongFetchedAddresses, setLatLongFetchedAddresses] = useState([]);
	const [
		addressPickerListFromPostcode,
		setAddressPickerListFromPostcode,
	] = useState([]);

	const [fromGeoLocation, setFromGeoLocation] = useState(false);

	const [addressFromPostcode, setAddressFromPostcode] = useState('');
	const [
		addressFromPostcodeValidate,
		setAddressFromPostcodeValidate,
	] = useState(false);

	const selectedHireItem = useState(
		props.route.params.hireConfirmData.singleHireItem,
	)[0];

	const [confirmationModal, setConfirmationModal] = useState(false);
	const [addressPickerVisible, setAddressPickerVisible] = useState(false);
	const [pickerSavedAddress, setPickerSavedAddress] = useState('');
	const [pickerSavedAddressValidate, setPickerSavedAddressValidate] = useState(
		false,
	);
	// const [
	// 	hireDeliveryAddressValidate,
	// 	setHireDeliveryAddressValidate,
	// ] = useState(false);

	const [isStartDatePicked, setIsStartDatePicked] = useState(false);
	// const [isEndDatePicked, setIsEndDatePicked] = useState(false);
	const [stateStartDate, setStateStartDate] = useState('');
	const [
		numberOfSelectedCalendarDates,
		setNumberOfSelectedCalendarDates,
	] = useState([]);
	const [readyForMarkedDates, setReadyForMarkedDates] = useState([]);
	const [confirmDatesDisplay, setConfirmDatesDisplay] = useState(
		props.route.params.hireConfirmData.unavailableDates,
	);
	const [selectedDates, setSelectedDates] = useState([]);
	const [confirmDatesValidate, setConfirmDatesValidate] = useState(false);
	const [deliveryDistance, setDeliveryDistance] = useState('');
	const [collectionType, setCollectionType] = useState('');
	const [collectionTypeValidate, setCollectionTypeValidate] = useState(false);
	const [hireRate, setHireRate] = useState('');
	const [monthSD, setMonthSD] = useState('');
	const [monthED, setMonthED] = useState('');
	const [datesTH, setDatesTH] = useState('');
	const [filteredDatesTH, setFilteredDatesTH] = useState('');
	const [hireDurationPrice, setHireDurationPrice] = useState('');
	const [hireDeliveryPrice, setHireDeliveryPrice] = useState('');
	const [hireDelivery, setHireDelivery] = useState('');
	// const [hireDeliveryValidate, setHireDeliveryValidate] = useState(false);
	const [totalHireCost, setTotalHireCost] = useState('');
	const [hireItemErrorMessage, setHireItemErrorMessage] = useState('');

	const [pressedArrow, setPressedArrow] = useState('');
	// const [monthChangeValue, setMonthChangeValue] = useState('');
	const [
		deliveryPostcodeFromSavedAddressPicker,
		setDeliveryPostcodeFromSavedAddressPicker,
	] = useState('');

	const [deliverySavedLatitude, setDeliverySavedLatitude] = useState('');
	const [deliverySavedLongitude, setDeliverySavedLongitude] = useState('');

	const [deliveryManualLatitude, setDeliveryManualLatitude] = useState('');
	const [deliveryManualLongitude, setDeliveryManualLongitude] = useState('');

	const [checkBox, setCheckBox] = useState(false);

	// const [selectedCard, setSelectedCard] = useState({});

	const dispatch = useDispatch();

	// const keyboard = useKeyboard();
	// const keyboardHeight = keyboard.keyboardHeight;
	// const isKeyboardShowing = keyboard.keyboardShown;

	useFocusEffect(
		React.useCallback(() => {
			let headerConfig = {
				isBackArrow: true,
				leftTitle: 'Back',
				isRightContent: false,
				rightTitle: '',
				navParam: '',
			};

			setCheckBox(false);
			dispatch(listUserCardsApi());
			// dispatch(hireItemPaymentSuccess(false));
			dispatch(headerTitle(headerConfig));
		}, []),
	);

	useEffect(() => {
		return () => {
			if (!hireItmPaymentSuccess) {
				let headerConfig = {
					isBackArrow: true,
					leftTitle: 'Search',
					isRightContent: false,
					rightTitle: '',
					navParam: 'replace',
				};

				dispatch(headerTitle(headerConfig));
			}
		};
	}, [hireItmPaymentSuccess]);

	useEffect(() => {
		return () => {
			dispatch(calendarHeaderTitle(''));
		};
	}, []);

	const openAppSetting = (title, message) => {
		Alert.alert(
			`${title} is required`,
			`${message}`,
			[
				{
					text: 'Cancel',
					onPress: () => console.log('Cancel Pressed'),
				},
				{
					text: 'OK',
					onPress: () => openSettings(),
				},
			],
			{cancelable: false},
		);
	};

	useEffect(() => {
		if (fromGeoLocation) {
			setFromGeoLocation(false);

			let latLong_postcode = latLongFetchedAddresses[0].formatted_address.split(
				',',
			)[1];
			// console.log('latLong_postcode ==> ', latLong_postcode);

			let addressArr1 = [];
			latLongFetchedAddresses.filter((obj, index) => {
				setAddressPickerListFromPostcode([]);
				let obj_postcode = obj.formatted_address.split(',')[1];
				// console.log('obj_postcode ==> ', obj_postcode);

				if (obj_postcode !== undefined && latLong_postcode === obj_postcode) {
					addressArr1.push({
						id: index,
						label: obj.formatted_address.split(',')[0],
						value: obj.formatted_address.split(',')[0],
					});
				}
			});

			setAddressPickerListFromPostcode(addressArr1);
		}
	}, [fromGeoLocation]);

	useEffect(() => {
		if (typedPostcode) {
			setTypedPostcode(false);
			setAddressFromPostcodeValidate(false);

			if (location.length >= 6 && location.length < 9) {
				// findLatLong(location)
				findAddressFromPostcode(location)
					.then((res) => {
						if (res?.status === 200) {
							// console.log('res ==> ', res.data);

							// let primaryOutCode = res.data.result[0].outcode;
							// let primaryInCode = res.data.result[0].incode;

							// Geocoder.init(_ENV_CONFIG.GOOGLE_KEY);
							// Geocoder.from(
							// 	res.data.result[0].latitude,
							// 	res.data.result[0].longitude,
							// )
							// .then((json) => {
							// console.log('json ==> ', json.results);
							// setLatLongFetchedAddresses(json.results);

							setDeliveryManualLatitude(res.data.latitude);
							setDeliveryManualLongitude(res.data.longitude);

							let addressArr2 = [];
							res.data.addresses.filter((obj, index) => {
								setAddressFromPostcode('');
								setAddressPickerListFromPostcode([]);
								addressArr2.push({
									id: index,
									label: obj.split(',')[0],
									value: obj.split(',')[0],
								});
							});

							// json.results.filter((obj, index) => {
							// 	let formattedAddress = obj.formatted_address.split(',')[1];
							// 	// console.log('formattedAddress ==> ', formattedAddress);
							// 	if (RegExp.MatchWhiteSpaceChar.test(formattedAddress)) {
							// 		let trimmedAndSplitted = formattedAddress.split(' ');
							// 		if (trimmedAndSplitted.length >= 3) {
							// 			// console.log('trimmedAndSplitted ==> ', trimmedAndSplitted);
							// 			if (
							// 				trimmedAndSplitted[2] == primaryOutCode &&
							// 				trimmedAndSplitted[3] == primaryInCode
							// 			) {
							// 				// console.log('obj ==> ', obj);
							// 				setAddressFromPostcode('');
							// 				setAddressPickerListFromPostcode([]);
							// 				addressArr2.push({
							// 					id: index,
							// 					label: obj.formatted_address.split(',')[0],
							// 					value: obj.formatted_address.split(',')[0],
							// 				});
							// 			}
							// 		}
							// 	}
							// });

							console.log('addressArr2 ==> ', addressArr2);
							setAddressPickerListFromPostcode(addressArr2);
							// })
							// .catch((error) =>
							// 	console.log('Typed Postcode Geocoder error ==> ', error),
							// );
						} else {
							setDeliveryManualLatitude('');
							setDeliveryManualLongitude('');
						}
					})
					.catch((error) => {
						console.log('error ==> ', error.response);
					});
			} else {
				setAddressFromPostcode('');
				setAddressPickerListFromPostcode([]);
			}
		}
	}, [typedPostcode]);

	const hireConfirmLocationPermissionHandler = async () => {
		if (IOS) {
			try {
				let iosLocationPermission = await Geolocation.requestAuthorization(
					'whenInUse',
				);
				// console.log('iosLocationPermission ==> ', iosLocationPermission);

				if (iosLocationPermission === 'granted') {
					dispatch(presentLoader());
					Geolocation.getCurrentPosition(
						(position) => {
							// console.log('position ==> ', position);

							setDeliveryManualLatitude(position.coords.latitude);
							setDeliveryManualLongitude(position.coords.longitude);

							Geocoder.init(_ENV_CONFIG.GOOGLE_KEY);
							// Geocoder.from(53.483002, -2.2931)
							Geocoder.from(position.coords.latitude, position.coords.longitude)
								.then((json) => {
									// console.log('json ==> ', json);
									setLatLongFetchedAddresses(json.results);
									let addressComponent = json.results[0].address_components;
									// console.log('addressComponent ==> ', addressComponent);
									addressComponent.filter((obj) => {
										if (obj?.types) {
											// console.log('==2==');
											setLocation('');
											if (obj.types[0] === 'postal_code') {
												setFromGeoLocation(true);
												setLocation(obj.long_name);
												setLocationValidate(false);
												// setHireDeliveryAddressValidate(false);
											}
										}
									});
									dispatch(hideLoader());
								})
								.catch((error) => {
									dispatch(hideLoader());
									console.log('Geocoder error ==> ', error);
								});
						},
						(error) => {
							dispatch(hideLoader());
							console.log('error ==> ', error);
						},
						{enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
					);
				} else if (iosLocationPermission === 'denied') {
					openAppSetting(
						'Location Permission',
						'App needs access to your location.',
					);
				}
			} catch (err) {
				console.warn(err);
			}
		} else {
			try {
				const granted = await PermissionsAndroid.request(
					PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
					{
						title: 'Location Permission',
						message: 'App needs access to your location.',
						buttonNeutral: 'Ask Me Later',
						buttonNegative: 'Cancel',
						buttonPositive: 'OK',
					},
				);
				if (granted === PermissionsAndroid.RESULTS.GRANTED) {
					dispatch(presentLoader());
					Geolocation.getCurrentPosition(
						(position) => {
							// console.log('position ==> ', position);

							Geocoder.init(_ENV_CONFIG.GOOGLE_KEY);
							// Geocoder.from(53.483002, -2.2931)

							setDeliveryManualLatitude(position.coords.latitude);
							setDeliveryManualLongitude(position.coords.longitude);

							Geocoder.from(position.coords.latitude, position.coords.longitude)
								.then((json) => {
									// console.log('json ==> ', json);
									setLatLongFetchedAddresses(json.results);
									let addressComponent = json.results[0].address_components;
									// console.log('addressComponent ==> ', addressComponent);
									addressComponent.filter((obj) => {
										if (obj?.types) {
											// console.log('==3==');
											setLocation('');
											if (obj.types[0] === 'postal_code') {
												setFromGeoLocation(true);
												setLocation(obj.long_name);
												setLocationValidate(false);
												// setHireDeliveryAddressValidate(false);
											}
										}
									});
									dispatch(hideLoader());
								})
								.catch((error) => {
									dispatch(hideLoader());
									console.log('Geocoder error ==> ', error);
								});
						},
						(error) => {
							dispatch(hideLoader());
							console.log('error ==> ', error);
						},
						{enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
					);
				} else {
					// openAppSetting(
					// 	'Location Permission',
					// 	'App needs access to your location.',
					// );
					console.log('location permission denied');
				}
			} catch (err) {
				console.warn(err);
			}
		}
	};

	useEffect(() => {
		if (getObjectLength(selectedHireItem) != 0) {
			setCollectionType(
				selectedHireItem.is_for_collection === 1 &&
					selectedHireItem.is_for_delivery === 1
					? '1'
					: selectedHireItem.is_for_collection === 1
					? '1'
					: selectedHireItem.is_for_delivery === 1
					? '0'
					: null,
			);
		}
	}, [selectedHireItem]);

	const hireDeliveryPickerText = (text) => {
		if (collectionType == '0') {
			// if (selectedHireItem.is_for_delivery == 1) {

			addressPickerList.filter((obj) => {
				if (obj.value === text) {
					// console.log('obj ==> ', obj);
					setDeliverySavedLatitude(obj.lat);
					setDeliverySavedLongitude(obj.lon);
				}
			});

			setHireDelivery(text);
		}
	};

	useEffect(() => {
		if (savedAddress && !manualAddress) {
			setAddressPickerVisible(true);
			// setHireDeliveryValidate(false);
			if (collectionType == '' || collectionType == '1') {
				// if (selectedHireItem.is_for_delivery == 0) {
				setHireDelivery(selectedHireItem.location);
			} else if (savedAddress && collectionType == '0') {
				// else if (savedAddress && selectedHireItem.is_for_delivery == 1) {
				setHireDelivery(
					pickerSavedAddress != ''
						? pickerSavedAddress
						: addressPickerList.length > 0
						? addressPickerList[0].value
						: '',
				);
			}
		} else if (!savedAddress && manualAddress) {
			setAddressPickerVisible(false);
			if (collectionType == '' || collectionType == '1') {
				// if (selectedHireItem.is_for_delivery == 0) {
				setHireDelivery(selectedHireItem.location);
			} else if (manualAddress && collectionType == '0') {
				// else if (manualAddress && selectedHireItem.is_for_delivery == 1) {
				setHireDelivery(
					addressFromPostcode != ''
						? addressFromPostcode
						: addressPickerListFromPostcode.length > 0
						? addressPickerListFromPostcode[0].value
						: '',
				);
			}
		}
	}, [savedAddress, manualAddress]);

	const selectAddressFromPostcodeHandler = (address) => {
		if (address != '') {
			if (collectionType === '1') {
				// if (selectedHireItem.is_for_delivery === 0) {
				setHireDelivery(selectedHireItem.location);
			} else if (collectionType === '0') {
				// else if (selectedHireItem.is_for_delivery === 1) {
				setHireDelivery(address);
			}
		}
	};

	const selectCollectionTypeHandler = (collectionType) => {
		if (collectionType != '') {
			if (collectionType === '1') {
				setHireDelivery(selectedHireItem.location);
			} else if (collectionType === '0') {
				if (savedAddress) {
					setHireDelivery(
						pickerSavedAddress != ''
							? pickerSavedAddress
							: addressPickerList.length > 0
							? addressPickerList[0].value
							: '',
					);
				} else {
					setHireDelivery(
						addressFromPostcode != ''
							? addressFromPostcode
							: addressPickerListFromPostcode.length > 0
							? addressPickerListFromPostcode[0].value
							: '',
					);
				}
			}
		}
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

	const readyForMarkedDatesHandler = (day) => {
		// console.log('day ==> ', day);
		setReadyForMarkedDates((prevArray) => [...prevArray, day]);

		// if (readyForMarkedDates.length < 9) {
		// 	setReadyForMarkedDates((prevArray) => [...prevArray, day]);
		// } else {
		// 	let alertConfig = {
		// 		title: 'Wait!!',
		// 		message: 'Only total of nine dates are allowed to select at a time.',
		// 	};

		// 	dispatch(presentAlert(alertConfig));
		// }
	};

	// console.log('pickerSavedAddress ==> ', pickerSavedAddress);

	useEffect(() => {
		if (savedAddress && addressPickerList.length > 0) {
			if (pickerSavedAddress === '' || pickerSavedAddress != '') {
				let tempPickerSavedAddress =
					pickerSavedAddress != ''
						? pickerSavedAddress
						: addressPickerList.length > 0
						? addressPickerList[0].value
						: '';
				addressPickerList.filter((obj) => {
					if (obj.value == tempPickerSavedAddress) {
						setDeliverySavedLatitude(obj.lat);
						setDeliverySavedLongitude(obj.lon);
						setDeliveryPostcodeFromSavedAddressPicker(obj.postcode);
						// dispatch(findDistanceApi(selectedHireItem.post_code, obj.postcode));
						dispatch(
							findDistanceApi(
								selectedHireItem.latitude,
								selectedHireItem.longitude,
								obj.lat,
								obj.lon,
							),
						);
					}
				});
			}
		}

		if (
			manualAddress &&
			// location.length >= 6 &&
			// location.length < 9 &&
			deliveryManualLatitude != '' &&
			deliveryManualLongitude != ''
		) {
			// dispatch(findDistanceApi(selectedHireItem.post_code, location));
			dispatch(
				findDistanceApi(
					selectedHireItem.latitude,
					selectedHireItem.longitude,
					deliveryManualLatitude,
					deliveryManualLongitude,
				),
			);
		}

		// if (
		// 	pickerSavedAddress == '' ||
		// 	pickerSavedAddress != '' ||
		// 	(location.length >= 6 && location.length < 9)
		// ) {
		// 	if (savedAddress && !manualAddress) {
		// 		let tempPickerSavedAddress =
		// 			pickerSavedAddress != ''
		// 				? pickerSavedAddress
		// 				: addressPickerList.length > 0
		// 				? addressPickerList[0].value
		// 				: '';
		// 		addressPickerList.filter((obj) => {
		// 			if (obj.value == tempPickerSavedAddress) {
		// 				setDeliveryPostcodeFromSavedAddressPicker(obj.postcode);
		// 				dispatch(findDistanceApi(selectedHireItem.post_code, obj.postcode));
		// 			}
		// 		});
		// 	} else if (!savedAddress && manualAddress && location != '') {
		// 		dispatch(findDistanceApi(selectedHireItem.post_code, location));
		// 	}
		// }
	}, [
		savedAddress,
		pickerSavedAddress,
		manualAddress,
		// location,
		deliveryManualLatitude,
		deliveryManualLongitude,
		addressPickerList,
	]);

	useEffect(() => {
		if (hireCalculatedDistance != '') {
			setDeliveryDistance(parseFloat(hireCalculatedDistance));
			setHireRate(
				(
					selectedHireItem.delivery_charge_mile *
					parseFloat(hireCalculatedDistance)
				).toFixed(2),
			);
			setHireDeliveryPrice(
				(
					selectedHireItem.delivery_charge_mile *
					parseFloat(hireCalculatedDistance)
				).toFixed(2),
			);
		}
	}, [hireCalculatedDistance]);

	useEffect(() => {
		if (readyForMarkedDates.length > 0) {
			setConfirmDatesValidate(false);
			setHireItemErrorMessage('');
			// let hireConfirmSelectedDates = [];
			// console.log('readyForMarkedDates ==> ', readyForMarkedDates);
			// for (let i = 0; i < readyForMarkedDates.length; i++) {
			// 	hireConfirmSelectedDates.push({
			// 		[readyForMarkedDates[i].dateString]: {
			// 			selected: true,
			// 			disableTouchEvent: true,
			// 			selectedColor: GlobalTheme.black,
			// 			selectedTextColor: GlobalTheme.textColor,
			// 		},
			// 	});
			// }

			// hireConfirmSelectedDates.push(confirmDatesDisplay);
			// hireConfirmSelectedDates = Object.assign({}, ...hireConfirmSelectedDates);
			// console.log('hireConfirmSelectedDates ==> ', hireConfirmSelectedDates);
			// setConfirmDatesDisplay(hireConfirmSelectedDates);

			// setDatesTH([]);
			// for (let i = 0; i < readyForMarkedDates.length > 0; i++) {
			// 	let day = [];
			// 	day = readyForMarkedDates[i].dateString.split('-')[2] + 'th';
			// 	setDatesTH((prevArray) => [...prevArray, day]);
			// }

			// setHireDurationPrice(
			// 	(readyForMarkedDates.length * selectedHireItem.per_day_price).toFixed(
			// 		2,
			// 	),
			// );

			if (isStartDatePicked == false) {
				let ifMarkedDates = confirmDatesDisplay;

				ifMarkedDates[readyForMarkedDates[0].dateString] = {
					startingDay: true,
					disableTouchEvent: true,
					color: GlobalTheme.black,
					textColor: GlobalTheme.textColor,
				};

				setNumberOfSelectedCalendarDates((prevArray) => [
					...prevArray,
					{id: 0, dateString: readyForMarkedDates[0].dateString},
				]);

				ifMarkedDates = Object.assign({}, ifMarkedDates);
				console.log('ifMarkedDates ==> ', ifMarkedDates);

				setConfirmDatesDisplay(ifMarkedDates);
				setIsStartDatePicked(true);
				// setIsEndDatePicked(false);
				setStateStartDate(readyForMarkedDates[0].dateString);
				//
			} else {
				let elseMarkedDates = confirmDatesDisplay;
				let startDate = moment(stateStartDate);
				// console.log('sd ==> ', startDate);
				let endDate = moment(readyForMarkedDates[1].dateString);
				// console.log('ed ==> ', endDate);
				let range = endDate.diff(startDate, 'days');
				// console.log('range ==> ', range);
				if (range > 0) {
					for (let i = 1; i <= range; i++) {
						let tempDate = startDate.add(1, 'day');
						// console.log('td1 ==> ', tempDate);
						tempDate = moment(tempDate).format('YYYY-MM-DD');
						// console.log('td2 ==> ', tempDate);

						for (const [key, value] of Object.entries(confirmDatesDisplay)) {
							if (tempDate === key) {
								let alertConfig = {
									title: 'Oops!',
									shouldRunFunction: true,
									functionHandler: 'clearCalendarDatesHandler',
									message:
										'One or more date among your selected dates have already been taken. Invalid operation.',
								};

								dispatch(presentAlert(alertConfig));
								return;
							}
						}

						setNumberOfSelectedCalendarDates((prevArray) => [
							...prevArray,
							{id: i, dateString: tempDate},
						]);

						if (i < range) {
							elseMarkedDates[tempDate] = {
								disableTouchEvent: true,
								color: GlobalTheme.black,
								textColor: GlobalTheme.textColor,
							};
							//
						} else {
							elseMarkedDates[tempDate] = {
								endingDay: true,
								disableTouchEvent: true,
								color: GlobalTheme.black,
								textColor: GlobalTheme.textColor,
							};
						}

						elseMarkedDates = Object.assign({}, elseMarkedDates);
						// console.log('elseMarkedDates ==> ', elseMarkedDates);

						setConfirmDatesDisplay(elseMarkedDates);
						setIsStartDatePicked(false);
						// setIsEndDatePicked(true);
						setStateStartDate('');
					}
				} else {
					let alertConfig = {
						title: 'Oops!',
						message: 'Please select an upcoming date.',
					};

					dispatch(presentAlert(alertConfig));
				}
			}
		}
	}, [readyForMarkedDates]);

	useEffect(() => {
		if (numberOfSelectedCalendarDates.length > 0) {
			console.log(
				'numberOfSelectedCalendarDates ==> ',
				numberOfSelectedCalendarDates,
			);

			let obj = {
				item_id: selectedHireItem.id,
				number_of_days: numberOfSelectedCalendarDates.length,
			};

			dispatch(dayToPriceApi(obj, props.navigation));

			// setHireDurationPrice(
			// 	(
			// 		numberOfSelectedCalendarDates.length * selectedHireItem.per_day_price
			// 	).toFixed(2),
			// );

			// setDatesTH([]);
			// for (let i = 0; i < numberOfSelectedCalendarDates.length > 0; i++) {
			// 	let day = [];
			// 	day = numberOfSelectedCalendarDates[i].dateString.split('-')[2] + 'th';

			// 	setDatesTH((prevArray) => [...prevArray, day]);
			// }

			setDatesTH('');
			// let numberOfWeeks = 0;
			// let numberOfDays = 0;
			let hireDurationStartDate = numberOfSelectedCalendarDates[0].dateString;
			// console.log('hireDurationStartDate ==> ', hireDurationStartDate);

			let start_date = hireDurationStartDate + ' ' + '00:00:00';
			let startDateParam = start_date.split(/[\s-:]/);
			startDateParam[1] = (parseInt(startDateParam[1], 10) - 1).toString();

			let startDateMonthNum = new Date(...startDateParam).getMonth();
			let monthSD = MonthShortcut[startDateMonthNum];

			let SDate = new Date(...startDateParam).getDate().toString();
			// console.log('SDate ==> ', SDate);

			// if (SDate === '1' || SDate === '01') {
			// 	SDate = SDate + 'st';
			// } else if (SDate === '2' || SDate === '02') {
			// 	SDate = SDate + 'nd';
			// } else if (SDate === '3' || SDate === '03') {
			// 	SDate = SDate + 'rd';
			// } else {
			// 	SDate = SDate + 'th';
			// }

			setDatesTH(SDate);
			setMonthSD(monthSD);

			if (numberOfSelectedCalendarDates.length > 1) {
				let hireDurationEndDate = numberOfSelectedCalendarDates.slice(-1)[0]
					.dateString;
				// console.log('hireDurationEndDate ==> ', hireDurationEndDate);

				if (hireDurationEndDate != '') {
					let end_date = hireDurationEndDate + ' ' + '00:00:00';

					let endDateParam = end_date.split(/[\s-:]/);
					endDateParam[1] = (parseInt(endDateParam[1], 10) - 1).toString();

					let endDateMonthNum = new Date(...endDateParam).getMonth();
					let monthED = MonthShortcut[endDateMonthNum];

					let EDate = new Date(...endDateParam).getDate().toString();
					// console.log('EDate ==> ', EDate);

					// if (EDate === '1' || EDate === '01') {
					// 	EDate = EDate + 'st';
					// } else if (EDate === '2' || EDate === '02') {
					// 	EDate = EDate + 'nd';
					// } else if (EDate === '3' || EDate === '03') {
					// 	EDate = EDate + 'rd';
					// } else {
					// 	EDate = EDate + 'th';
					// }

					setFilteredDatesTH(EDate);
					setMonthED(monthED);
				}

				// numberOfWeeks = weekDiffNRemainingDays(
				// 	hireDurationStartDate,
				// 	hireDurationEndDate,
				// ).numberOfWeeks;
				// console.log('numberOfWeeks ==> ', numberOfWeeks);

				// numberOfDays = weekDiffNRemainingDays(
				// 	hireDurationStartDate,
				// 	hireDurationEndDate,
				// ).numberOfDays;
				// console.log('numberOfDays ==> ', numberOfDays);

				// setHireDurationPrice(
				// 	(
				// 		numberOfWeeks * selectedHireItem.per_week_price +
				// 		numberOfDays * selectedHireItem.per_day_price
				// 	).toFixed(2),
				// );
			}

			// setHireDurationPrice(
			// 	(
			// 		numberOfWeeks * selectedHireItem.per_week_price +
			// 		numberOfDays * selectedHireItem.per_day_price
			// 	).toFixed(2),
			// );
		}
	}, [numberOfSelectedCalendarDates]);

	useEffect(() => {
		if (numberOfDaysToPrice > 0) {
			// console.log('numberOfDaysToPrice ==> ', numberOfDaysToPrice);

			setHireDurationPrice(numberOfDaysToPrice.toFixed(2));

			// setHireDurationPrice(
			// 	(
			// 		numberOfWeeks * selectedHireItem.per_week_price +
			// 		numberOfDays * selectedHireItem.per_day_price
			// 	).toFixed(2),
			// );
		}
	}, [numberOfDaysToPrice]);

	// useEffect(() => {
	// 	if (datesTH.length > 0) {
	// 		let sortedDate = datesTH.sort();

	// 		setFilteredDatesTH(sortedDate);
	// 	}
	// }, [datesTH]);

	const clearCalendarDatesHandler = () => {
		let confirmDatesDisplayObject = [];
		for (const [key, value] of Object.entries(confirmDatesDisplay)) {
			if (value.marked !== undefined) {
				confirmDatesDisplayObject.push({
					[key]: value,
				});
			}
		}

		confirmDatesDisplayObject = Object.assign({}, ...confirmDatesDisplayObject);
		// console.log('confirmDatesDisplayObject ==> ', confirmDatesDisplayObject);

		setConfirmDatesDisplay(confirmDatesDisplayObject);
		setIsStartDatePicked(false);
		// setIsEndDatePicked(false);
		setStateStartDate('');
		setNumberOfSelectedCalendarDates([]);
		// dispatch(clearHireCalculatedDistance());
		setReadyForMarkedDates([]);
		setDatesTH('');
		setFilteredDatesTH('');
		setMonthSD('');
		setMonthED('');
		setHireDurationPrice('');
		// setHireDeliveryPrice('');

		// if (IOS) {
		// setCollectionType('');
		// dispatch(clearCollectionTypePickerDefaultValue(true));
		// }

		if (ANDROID) {
			// setCollectionType(CollectionType[0].value);
			setCollectionType(
				selectedHireItem.is_for_collection === 1 &&
					selectedHireItem.is_for_delivery === 1
					? '1'
					: selectedHireItem.is_for_collection === 1
					? '1'
					: selectedHireItem.is_for_delivery === 1
					? '0'
					: null,
			);
		}
		setConfirmDatesValidate(false);
		setSelectedDates([]);

		let errorConfig = {
			message: '',
			showError: false,
		};

		dispatch(setError(errorConfig));
	};

	useEffect(() => {
		if (shouldRunFunction) {
			clearCalendarDatesHandler();

			dispatch(shouldRunFunctionFromAlert(false));
		}
	}, [shouldRunFunction]);

	const hireTermsAndConditionHandler = () => {
		props.navigation.navigate('TermsPolicies', {
			terms: {
				title: 'Hire terms and condition',
				link: 'https://hirethat.com/hire-terms-conditions/',
			},
		});
	};

	const confirmAndPayHandler = () => {
		// if (readyForMarkedDates.length > 0) {
		// 	readyForMarkedDates.map((item) => {
		// 		setSelectedDates((prevArray) => [...prevArray, item.dateString]);
		// 	});
		// }

		if (hasPrimaryCard !== 1) {
			props.navigation.navigate('AddPaymentCard');
			return;
		}

		let hireItemAddressDeliveryDistance =
			selectedHireItem.delivery_distance != null
				? selectedHireItem.delivery_distance
				: deliveryDistance * 2;

		// console.log('collectionType ==> ', collectionType);
		// console.log('deliveryDistance ==> ', deliveryDistance);
		// console.log(
		// 	'selectedHireItem.delivery_distance ==> ',
		// 	hireItemAddressDeliveryDistance,
		// );

		if (
			collectionType === '0' &&
			deliveryDistance > hireItemAddressDeliveryDistance
		) {
			let alertConfig = {
				title: 'Oops!',
				message: `Please select another address with delivery distance lesser then ${hireItemAddressDeliveryDistance} miles as specified by supplier or set the collection type to collecting.`,
			};

			dispatch(presentAlert(alertConfig));
			return;
		}

		let selectedDatesOnly = [];
		if (numberOfSelectedCalendarDates.length > 0) {
			selectedDatesOnly = numberOfSelectedCalendarDates.map((item) => {
				return item.dateString;
			});

			// console.log('selectedDatesOnly ==> ', selectedDatesOnly);
			setSelectedDates(selectedDatesOnly);
			//
		} else {
			setConfirmDatesValidate(true);
			return;
		}

		// if (!savedAddress && !manualAddress) {
		// 	console.log('====iiiii====');
		// 	setHireDeliveryAddressValidate(true);
		// 	return;
		// }

		if (
			!savedAddress &&
			manualAddress &&
			collectionType == '0' &&
			// selectedHireItem.is_for_delivery == 1 &&
			location === ''
		) {
			console.log('==0==');
			setLocationValidate(true);
			return;
		}

		if (IOS) {
			if (
				savedAddress &&
				!manualAddress &&
				collectionType == '0' &&
				// selectedHireItem.is_for_delivery == 1 &&
				pickerSavedAddress == ''
			) {
				console.log('==1==');
				setPickerSavedAddressValidate(true);
				return;
			}

			if (
				!savedAddress &&
				manualAddress &&
				addressPickerListFromPostcode.length > 0 &&
				addressFromPostcode == ''
			) {
				console.log('==2==');
				setAddressFromPostcodeValidate(true);
				return;
			}

			if (
				!savedAddress &&
				manualAddress &&
				addressPickerListFromPostcode.length < 1 &&
				addressFromPostcode == ''
			) {
				setAddressFromPostcodeValidate(true);
				return;
			}

			// if (selectedHireItem.is_for_delivery !== 0 && collectionType == '') {
			// 	console.log('==3==');
			// 	setCollectionTypeValidate(true);
			// 	return;
			// }
		}

		// if (hireDelivery === '') {
		// 	console.log('==4==');
		// 	setHireDeliveryValidate(true);
		// 	return;
		// }

		if (collectionType === '0') {
			// if (selectedHireItem.is_for_delivery === 1) {
			setTotalHireCost(
				(parseFloat(hireDurationPrice) + parseFloat(hireDeliveryPrice)).toFixed(
					2,
				),
			);
		} else {
			setTotalHireCost(hireDurationPrice);
			// setTotalHireCost(hireDurationPrice.toFixed(2));
		}

		if (showError) {
			let alertConfig = {
				title: 'Sorry!',
				message: errorMessage,
			};

			dispatch(presentAlert(alertConfig));
			return;
		}

		let obj = {
			item_id: selectedHireItem.id,
			dates: selectedDatesOnly,
			// collection_type: collectionType === '0' ? 'delivery' : 'collecting',
			collection_type:
				selectedHireItem.is_for_collection === 1 &&
				selectedHireItem.is_for_delivery === 1
					? collectionType === '0'
						? 'delivery'
						: 'collecting'
					: selectedHireItem.is_for_collection === 1
					? 'collecting'
					: selectedHireItem.is_for_delivery === 1
					? 'delivery'
					: null,
			payment_status: 'pending',
			delivery_distance: deliveryDistance,
			delivery_address: savedAddress ? hireDelivery : addressFromPostcode,
			delivery_post_code:
				collectionType === '' || collectionType === '1'
					? // selectedHireItem.is_for_delivery === 0
					  selectedHireItem.post_code
					: savedAddress
					? deliveryPostcodeFromSavedAddressPicker
					: manualAddress
					? location
					: null,
			delivery_latitude:
				collectionType === '' || collectionType === '1'
					? selectedHireItem.latitude
					: savedAddress
					? deliverySavedLatitude
					: manualAddress
					? deliveryManualLatitude
					: null,
			delivery_longitude:
				collectionType === '' || collectionType === '1'
					? selectedHireItem.longitude
					: savedAddress
					? deliverySavedLongitude
					: manualAddress
					? deliveryManualLongitude
					: null,
			accepted_terms_and_conditions: checkBox ? '1' : '0',
		};

		console.log('obj ==> ', obj);
		dispatch(itemHireApi(obj, props.navigation));

		analytics().logEvent('hire_confirm_and_pay', {
			item_id: obj.item_id,
			collection_type: obj.collection_type,
			delivery_distance: obj.delivery_distance,
			delivery_address: obj.delivery_address,
			delivery_post_code: obj.delivery_post_code,
		});
	};

	// const setModalCloseHandler = () => {
	// 	setConfirmationModal(false);
	// };

	// console.log('selectedDates ==> ', selectedDates);

	const doneHandler = () => {
		analytics().logEvent('hire_item_success_on_done_button');

		setConfirmationModal(false);

		props.navigation.dispatch({
			...CommonActions.reset({
				index: 0,
				routes: [
					{
						name: 'BottomTabBar',
						state: {
							routes: [{name: 'Profile'}],
						},
					},
				],
			}),
		});

		// let durationPrice = hireDurationPrice;
		// let deliveryAndDurationPrice = (
		// 	parseFloat(hireDurationPrice) + parseFloat(hireDeliveryPrice)
		// ).toFixed(2);
		// // let fd = new FormData();
		// // fd.append('item_id', selectedHireItem.id);
		// // selectedDates.map((item, id) => {
		// // 	fd.append('dates[]', item);
		// // });
		// // fd.append(
		// // 	'collection_type',
		// // 	collectionType === '0' ? 'delivery' : 'collecting',
		// // );
		// // fd.append('payment_status', 'paid');
		// // fd.append(
		// // 	'delivery_distance',
		// // 	deliveryDistance,
		// // );
		// // fd.append(
		// // 	'paid_amount',
		// // 	collectionType === '0'
		// // 		? deliveryAndDurationPrice.toString()
		// // 		: durationPrice.toString(),
		// // );
		// let obj = {
		// 	item_id: selectedHireItem.id,
		// 	dates: selectedDates,
		// 	collection_type: collectionType === '0' ? 'delivery' : 'collecting',
		// 	payment_status: 'pending',
		// 	delivery_distance: deliveryDistance,
		// 	// paid_amount:
		// 	// 	collectionType === '0'
		// 	// 		? deliveryAndDurationPrice.toString()
		// 	// 		: durationPrice.toString(),
		// 	// delivery_address:
		// 	// 	collectionType === '0'
		// 	// 		? savedAddress && !manualAddress
		// 	// 			? pickerSavedAddress != ''
		// 	// 				? pickerSavedAddress
		// 	// 				: addressPickerList[0].label
		// 	// 			: !savedAddress && manualAddress
		// 	// 			? hireDelivery
		// 	// 			: null
		// 	// 		: null,
		// 	delivery_address: hireDelivery,
		// 	// delivery_post_code:
		// 	// 	collectionType === '0'
		// 	// 		? savedAddress && !manualAddress
		// 	// 			? deliveryPostcodeFromSavedAddressPicker
		// 	// 			: !savedAddress && manualAddress
		// 	// 			? location
		// 	// 			: null
		// 	// 		: null,
		// 	delivery_post_code:
		// 		collectionType === '' || collectionType === '1'
		// 			? selectedHireItem.post_code
		// 			: savedAddress
		// 			? deliveryPostcodeFromSavedAddressPicker
		// 			: manualAddress
		// 			? location
		// 			: null,
		// };
		// console.log('obj ==> ', obj);
		// // setConfirmationModal(false);
		// dispatch(itemHireApi(obj, props.navigation));
		// // dispatch(itemHireApi(fd, props.navigation));
	};

	useEffect(() => {
		if (hireItmPaymentSuccess) {
			dispatch(presentSavedCardPaymentScreenModal());
			dispatch(hireItemPaymentSuccess(false));
		}
	}, [hireItmPaymentSuccess]);

	const payItemHireHandler = (card) => {
		// setSelectedCard(card);

		let obj = {
			item_hire_id: itemHireId,
			payment_method_id: card.id,
		};

		dispatch(hireItemPaymentApi(obj, props.navigation));
		dispatch(hideSavedCardPaymentScreenModal());
	};

	useEffect(() => {
		if (hireItmStripePaymentSuccess) {
			showMessage({
				message:
					'Items being delivered must be delivered prior to 9am on the agreed upon date (unless alternate arrangements are made between the hirer & hiree) and clear & adequate access shall be provided for delivery of item.',
				floating: true,
				position: {
					top: hp('20%'),
				},
				duration: 6500,
				type: 'default',
				backgroundColor: GlobalTheme.textColor,
				color: GlobalTheme.white,
			});

			dispatch(hireItemStripePaymentSuccess(false));
			setConfirmationModal(true);
		}
	}, [hireItmStripePaymentSuccess]);

	useEffect(() => {
		if (hire_item_error_message != '') {
			setHireItemErrorMessage(hire_item_error_message);
		}
	}, [hire_item_error_message]);

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
					{selectedHireItem[`price_day_${i + 1}`] != null
						? '£ ' + selectedHireItem[`price_day_${i + 1}`]
						: '  -'}
				</TextField>
			</View>,
		);
	}

	let hireConfirmProvidedByName =
		getObjectLength(selectedHireItem) != 0
			? selectedHireItem.owner.first_name != null
				? selectedHireItem.owner.first_name +
				  ' ' +
				  selectedHireItem.owner.last_name
				: 'NA'
			: null;
	return (
		<GenericView isBackgroundColor>
			<>
				<Header />
				<KeyboardAwareScrollView
					extraHeight={hp(20.0)}
					keyboardShouldPersistTaps="handled"
					// behavior="position"
					// alwaysBounceVertical={false}
					style={styles.mainView}>
					{/* <ScrollView style={styles.mainView}> */}

					<Divider xxxHuge />

					<View style={styles.topViewWrapper}>
						<TextField
							title
							letterSpacing={-0.32}
							isRLH
							lineHeight={2.6}
							fontFamily={GlobalTheme.fontBlack}
							color={GlobalTheme.primaryColor}>
							CONFIRM DETAILS OF HIRE
						</TextField>

						<Divider xxMedium />

						<View style={styles.topViewInnerStyle}>
							<View style={styles.topViewInnerLeftLayoutStyle}>
								<Image
									source={{uri: selectedHireItem.main_image}}
									style={styles.topViewInnerLeftImageStyle(isTablet())}
								/>
							</View>

							<View style={styles.topViewInnerRightLayoutStyle}>
								<TextField
									xThin
									letterSpacing={-0.07}
									isRLH
									lineHeight={1.8}
									fontFamily={GlobalTheme.fontRegular}
									color={GlobalTheme.textColor}>
									Your hire
								</TextField>

								<TextField
									xSmall
									letterSpacing={-0.36}
									isRLH
									lineHeight={2.2}
									fontFamily={GlobalTheme.fontBold}
									color={GlobalTheme.defaultBlack}>
									{selectedHireItem.name}
								</TextField>

								<View style={styles.providedByWrapperStyle}>
									<View style={styles.providedByImageStyle}>
										<ShadowView style={styles.shadowViewStyle}></ShadowView>
									</View>

									<View style={styles.providedByDetailStyle}>
										<TextField
											xThin
											letterSpacing={-0.07}
											isRLH
											lineHeight={1.8}
											fontFamily={GlobalTheme.fontRegular}
											color={GlobalTheme.textColor}>
											Provided by
										</TextField>

										<TextField
											small
											letterSpacing={-0.09}
											isRLH
											lineHeight={1.8}
											fontFamily={GlobalTheme.fontBold}
											color={GlobalTheme.black}>
											{hireConfirmProvidedByName}
										</TextField>
									</View>
								</View>
							</View>
						</View>
					</View>
					<Divider borderTopWidth={0.5} color="#707070" />

					<View style={styles.ph20}>
						<TextField
							xThin
							letterSpacing={-0.07}
							isRLH
							lineHeight={1.8}
							fontFamily={GlobalTheme.fontRegular}
							color={GlobalTheme.textColor}>
							Hire rates
						</TextField>

						<View style={styles.flexStartRowStyle}>
							<View
								style={{
									width: '58%',
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

							{/* <View style={styles.flexStartRowStyle}>
								<TextField
									title
									letterSpacing={-0.32}
									isRLH
									lineHeight={2.4}
									fontFamily={GlobalTheme.fontBold}
									color={GlobalTheme.black}>
									£{selectedHireItem.per_day_price}{' '}
								</TextField>
								<TextField
									xThin
									letterSpacing={-0.07}
									isRLH
									lineHeight={1.8}
									fontFamily={GlobalTheme.fontRegular}
									color={GlobalTheme.textColor}>
									per day
								</TextField>
							</View>

							<Divider horizontal large />

							<View style={styles.flexStartRowStyle}>
								<TextField
									title
									letterSpacing={-0.32}
									isRLH
									lineHeight={2.4}
									fontFamily={GlobalTheme.fontBold}
									color={GlobalTheme.black}>
									£{selectedHireItem.per_week_price}{' '}
								</TextField>
								<TextField
									xThin
									letterSpacing={-0.07}
									isRLH
									lineHeight={1.8}
									fontFamily={GlobalTheme.fontRegular}
									color={GlobalTheme.textColor}>
									per week (7 days)
								</TextField>
							</View> */}
						</View>

						{/* hire  from tabular rates */}
						{tabularPerDayPrice}

						<Divider />

						<View style={styles.hireDatesAndClearDatesFlexRowStyle}>
							<TextField
								xThin
								letterSpacing={-0.07}
								isRLH
								lineHeight={1.8}
								fontFamily={GlobalTheme.fontRegular}
								color={GlobalTheme.textColor}>
								Hire dates
							</TextField>

							<TouchableOpacity
								onPress={clearCalendarDatesHandler}
								style={styles.clearDatesStyle}>
								<Icon
									name="refresh"
									size={hp(1.6)}
									style={{top: -2}}
									color={GlobalTheme.primaryColor}
								/>
								<TextField
									small
									letterSpacing={-0.09}
									isRLH
									lineHeight={1.8}
									fontFamily={GlobalTheme.fontRegular}
									color={GlobalTheme.primaryColor}>
									Clear dates
								</TextField>
							</TouchableOpacity>
						</View>

						<Divider xxMedium />

						<ShadowView style={styles.shadowCalendarViewStyle}>
							<TextField
								center
								huge
								fontFamily={GlobalTheme.fontBold}
								color={GlobalTheme.black}
								style={styles.calendarTitleStyle}>
								{calendarHTitle != '' ? calendarHTitle : calendarMonthyear()}
							</TextField>

							<View style={styles.horizontalLineStyle} />

							<Calendar
								markingType={'period'}
								markedDates={confirmDatesDisplay}
								style={styles.calendarStyle}
								// Initially visible month. Default = Date()
								current={new Date()}
								// Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
								minDate={new Date()}
								// Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
								maxDate={''}
								// Handler which gets executed on day press. Default = undefined
								// onDayPress={(day) =>
								// 	setReadyForMarkedDates((prevArray) => [...prevArray, day])
								// }
								onDayPress={(day) => {
									// console.log('length ==> ', readyForMarkedDates.length);
									if (readyForMarkedDates.length < 2) {
										readyForMarkedDatesHandler(day);
									}
								}}
								// Handler which gets executed on day long press. Default = undefined
								onDayLongPress={(day) => {
									// console.log('selected day', day);
								}}
								// Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
								monthFormat={'yyyy MM'}
								// Handler which gets executed when visible month changes in calendar. Default = undefined
								onMonthChange={(month) => {
									// console.log('month changed', month);
									// setMonthChangeValue(month);
									onMonthChangeHandler(month);
								}}
								// Hide month navigation arrows. Default = false
								hideArrows={false}
								// Replace default arrows with custom ones (direction can be 'left' or 'right')
								// renderArrow={(direction) => <Arrow />}
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
									// 			{calendarMonthyear()}
									// 		</TextField>

									// 		<View style={styles.leftRightArrowIconWrapper}>
									// 			<TouchableOpacity
									// 				onPress={clearCalendarDatesHandler}
									// 				style={styles.clearDateStyle}>
									// 				<Icon
									// 					name="refresh"
									// 					size={hp(1.6)}
									// 					color={GlobalTheme.primaryColor}
									// 				/>
									// 				<TextField
									// 					small
									// 					letterSpacing={-0.09}
									// 					// lineHeight={18}
									// 					isRLH
									// 					lineHeight={1.8}
									// 					fontFamily={GlobalTheme.fontRegular}
									// 					color={GlobalTheme.primaryColor}>
									// 					Clear dates
									// 				</TextField>
									// 			</TouchableOpacity>

									// 			<Divider horizontal medium />

									// 			<TouchableOpacity
									// 				onPress={() => console.log('right!')}>
									// 				<Icon
									// 					name="ios-chevron-back-circle-sharp"
									// 					size={35}
									// 					color={GlobalTheme.primaryColor}
									// 				/>
									// 			</TouchableOpacity>

									// 			<TouchableOpacity
									// 				onPress={() => console.log('left!')}>
									// 				<Icon
									// 					name="ios-chevron-forward-circle-sharp"
									// 					size={35}
									// 					color={GlobalTheme.primaryColor}
									// 				/>
									// 			</TouchableOpacity>
									// 		</View>
									// 	</View>

									// 	<Divider small />
									// 	<Divider borderTopWidth={0.5} color="#707070" />
									// </View>
								}}
								// Enable the option to swipe between months. Default = false
								enableSwipeMonths={false}
							/>
						</ShadowView>

						<Divider large />

						{confirmDatesValidate ? (
							<>
								<TextField
									xTHin
									fontFamily={GlobalTheme.fontRegular}
									color={GlobalTheme.validationColor}>
									Please select at least one date
								</TextField>

								<Divider xxxMedium />
							</>
						) : null}

						<View
							style={{
								flexDirection: 'row',
								justifyContent: 'space-around',
								alignItems: 'center',
								// borderWidth: 1,
							}}>
							<View
								style={{
									flexDirection: 'row',
									justifyContent: 'flex-start',
									alignItems: 'center',
									// borderWidth: 1,
								}}>
								<View
									style={{
										height: hp('1.5%'),
										width: hp('2.0%'),
										borderTopLeftRadius: hp('5.0%'),
										borderBottomLeftRadius: hp('5.0%'),
										backgroundColor: GlobalTheme.black,
									}}
								/>

								<Divider horizontal />

								<TextField
									xThin
									letterSpacing={-0.07}
									isRLH
									lineHeight={1.8}
									fontFamily={GlobalTheme.fontRegular}
									color={GlobalTheme.textColor}>
									Start Date
								</TextField>
							</View>
							<View
								style={{
									flexDirection: 'row',
									justifyContent: 'flex-start',
									alignItems: 'center',
									// borderWidth: 1,
								}}>
								<View
									style={{
										height: hp('1.5%'),
										width: hp('2.0%'),
										borderTopRightRadius: hp('5.0%'),
										borderBottomRightRadius: hp('5.0%'),
										backgroundColor: GlobalTheme.black,
									}}
								/>

								<Divider horizontal />

								<TextField
									xThin
									letterSpacing={-0.07}
									isRLH
									lineHeight={1.8}
									fontFamily={GlobalTheme.fontRegular}
									color={GlobalTheme.textColor}>
									End Date
								</TextField>
							</View>
						</View>

						<Divider />

						<TextField
							xThin
							letterSpacing={-0.07}
							isRLH
							lineHeight={1.8}
							fontFamily={GlobalTheme.fontRegular}
							color={GlobalTheme.textColor}>
							Delivery / Collection
						</TextField>

						<Divider borderTopWidth={0.5} color="#707070" />

						{/* {selectedHireItem.is_for_delivery == 1 ? ( */}
						{collectionType == '0' ? (
							<>
								<View style={styles.spaceBetweenRowStyle}>
									<View style={styles.deliveryRowStyle}>
										<Image
											source={require('../assets/image/icon/tick.png')}
											style={styles.tickIconStyle}
										/>
										<TextField
											small
											isRLH
											lineHeight={4.4}
											fontFamily={GlobalTheme.fontMedium}
											color={GlobalTheme.black}>
											Delivery
										</TextField>
									</View>

									<TextField
										xThin
										letterSpacing={-0.07}
										isRLH
										lineHeight={1.8}
										fontFamily={GlobalTheme.fontRegular}
										color={GlobalTheme.textColor}>
										Charges apply
									</TextField>
								</View>

								<View style={styles.checkBoxesRowStyle}>
									<View style={styles.checkBoxStyle}>
										<TouchableWithoutFeedback
											onPress={() => {
												setSavedAddress(true);
												setManualAddress(false);
											}}>
											<View style={styles.checkboxWrapper}>
												<View style={styles.checkboxWidthStyle}>
													<ShadowView style={styles.checkbox}>
														{savedAddress ? (
															<View style={styles.selectedStyle} />
														) : null}
													</ShadowView>
												</View>

												<View style={styles.textStyle}>
													<TextField
														xThin
														letterSpacing={-0.07}
														isRLH
														lineHeight={1.8}
														color={GlobalTheme.black}
														fontFamily={GlobalTheme.fontSF}
														style={styles.textFieldMarginLeftStyle}>
														Saved Address
													</TextField>
												</View>
											</View>
										</TouchableWithoutFeedback>
									</View>

									<View style={styles.checkBoxStyle}>
										<TouchableWithoutFeedback
											onPress={() => {
												setSavedAddress(false);
												setManualAddress(true);
											}}>
											<View style={styles.checkboxWrapper}>
												<View style={styles.checkboxWidthStyle}>
													<ShadowView style={styles.checkbox}>
														{manualAddress ? (
															<View style={styles.selectedStyle} />
														) : null}
													</ShadowView>
												</View>

												<View style={styles.textStyle}>
													<TextField
														xThin
														letterSpacing={-0.07}
														isRLH
														lineHeight={1.8}
														color={GlobalTheme.black}
														fontFamily={GlobalTheme.fontSF}
														style={styles.textFieldMarginLeftStyle}>
														Manual Address
													</TextField>
												</View>
											</View>
										</TouchableWithoutFeedback>
									</View>
								</View>

								<Divider medium />

								{!addressPickerVisible ? (
									<View style={styles.textInputRowStyle}>
										<View style={styles.textInputStyle}>
											<HTTextInput
												placeholder="Post code"
												iconName="location-searching"
												iconLibrary="MaterialIcons"
												value={location}
												locationPermissionStatus={
													hireConfirmLocationPermissionHandler
												}
												hasError={locationValidate}
												onChangeText={(location) => {
													// console.log('==1==');
													setLocation(location);
													setLocationValidate(false);
													// setHireDeliveryAddressValidate(false);
													setTypedPostcode(true);
												}}
											/>
										</View>

										<View style={styles.textInputStyle}>
											{/* <HTTextInput
												placeholder="Select address"
												value={addressFromPostcode}
												// hasError={addressFromPostcodeValidate}
												onChangeText={(addressFromPostcode) =>
													setAddressFromPostcode(addressFromPostcode)
												}
											/> */}

											<HTPicker
												placeholder="Select address"
												enabled={
													location != '' &&
													addressPickerListFromPostcode.length > 0
														? false
														: true
												}
												hasError={addressFromPostcodeValidate}
												defaultValue={addressFromPostcode}
												onValueChange={(
													addressFromPostcodeValue,
													addressFromPostcodeSelectedId,
												) => {
													setAddressFromPostcode(addressFromPostcodeValue);
													setAddressFromPostcodeValidate(false);
													selectAddressFromPostcodeHandler(
														addressFromPostcodeValue,
													);
												}}
												value={addressFromPostcode}
												data={
													addressPickerListFromPostcode.length > 0
														? addressPickerListFromPostcode
														: []
												}
											/>
										</View>
									</View>
								) : (
									<HTPicker
										placeholder="Select saved address"
										hasError={pickerSavedAddressValidate}
										defaultValue={
											addressPickerList.length > 0
												? addressPickerList[0].value
												: ''
										}
										onValueChange={(
											pickerSavedAddressValue,
											pickerSavedAddressSelectedId,
										) => {
											setPickerSavedAddress(pickerSavedAddressValue);
											setPickerSavedAddressValidate(false);
											hireDeliveryPickerText(pickerSavedAddressValue);
										}}
										value={pickerSavedAddress}
										data={addressPickerList.length > 0 ? addressPickerList : []}
									/>
								)}
							</>
						) : null}

						<Divider xxMedium />

						<View style={styles.collectionTypeWrapperStyle}>
							<TextField
								small
								isRLH
								lineHeight={1.8}
								fontFamily={GlobalTheme.fontMedium}
								color={GlobalTheme.black}
								style={styles.collectionTypeTextStyle}>
								Collection type:
							</TextField>

							<View style={styles.collectionTypePickerStyle}>
								<HTPicker
									enabled={
										selectedHireItem.is_for_collection === 1 &&
										selectedHireItem.is_for_delivery === 1
											? false
											: true
									}
									// defaultValue={
									// 	selectedHireItem.is_for_delivery === 0 ? 'Collecting' : ''
									// }
									defaultValue={
										selectedHireItem.is_for_collection === 1 &&
										selectedHireItem.is_for_delivery === 1
											? 'Collecting'
											: selectedHireItem.is_for_collection === 1 &&
											  selectedHireItem.is_for_delivery === 0
											? 'Collecting'
											: selectedHireItem.is_for_collection === 0 &&
											  selectedHireItem.is_for_delivery === 1
											? 'Delivery'
											: null
									}
									placeholder="Select collection type"
									hasError={collectionTypeValidate}
									// pickerResetData={clearPickerDefaultValue}
									onValueChange={(
										collectionTypeValue,
										collectionTypeSelectedId,
									) => {
										// console.log(
										// 	'collectionTypeValue ==> ',
										// 	collectionTypeValue,
										// );
										setCollectionType(collectionTypeValue);
										setCollectionTypeValidate(false);
										selectCollectionTypeHandler(collectionTypeValue);
									}}
									value={collectionType}
									data={CollectionType}
								/>
							</View>
						</View>

						<Divider medium />

						<View style={styles.deliveryToRowStyle}>
							<TextField
								xThin
								letterSpacing={-0.07}
								isRLH
								lineHeight={1.8}
								fontFamily={GlobalTheme.fontRegular}
								color={GlobalTheme.textColor}
								style={styles.deliveryToStyle}>
								{collectionType === '0' ? 'Delivery to' : null}
								{/* {selectedHireItem.is_for_delivery === 1 ? 'Delivery to' : null} */}
							</TextField>

							<TextField
								xThin
								letterSpacing={-0.07}
								isRLH
								lineHeight={1.8}
								fontFamily={GlobalTheme.fontRegular}
								color={GlobalTheme.textColor}
								style={styles.deliveryToStyle}>
								Charge
							</TextField>
						</View>

						<Divider medium />

						<View style={styles.deliveryRowInnerStyle}>
							<TextField
								xThin
								letterSpacing={-0.07}
								isRLH
								lineHeight={1.8}
								fontFamily={GlobalTheme.fontRegular}
								color={GlobalTheme.black}
								style={styles.deliveryInnerStyle}>
								{/* {selectedHireItem.is_for_delivery === 1 ? ( */}
								{collectionType === '0' ? (
									<>
										{ANDROID
											? savedAddress && !manualAddress
												? pickerSavedAddress != ''
													? pickerSavedAddress
													: addressPickerList.length > 0
													? addressPickerList[0].value
													: ''
												: null
											: null}

										{ANDROID
											? !savedAddress && manualAddress
												? addressFromPostcode != ''
													? addressFromPostcode
													: addressPickerListFromPostcode.length > 0
													? addressPickerListFromPostcode[0].value
													: ''
												: null
											: null}

										{IOS
											? savedAddress && !manualAddress
												? pickerSavedAddress
												: !savedAddress && manualAddress
												? addressFromPostcode
												: null
											: null}
									</>
								) : null}
							</TextField>

							<View style={styles.deliveryInnerPerMileStyle}>
								<TextField
									medium
									letterSpacing={-0.1}
									isRLH
									lineHeight={2.4}
									fontFamily={GlobalTheme.fontBold}
									color={GlobalTheme.black}>
									{/* {selectedHireItem.is_for_delivery === 1 && */}
									{collectionType === '0' &&
									numberOfSelectedCalendarDates.length > 0
										? `£${hireRate}`
										: '£0'}
								</TextField>

								<Divider horizontal small />

								<TextField
									xThin
									letterSpacing={-0.07}
									isRLH
									lineHeight={2.1}
									fontFamily={GlobalTheme.fontRegular}
									color={GlobalTheme.textColor}>
									£{selectedHireItem.delivery_charge_mile} per mile
								</TextField>
							</View>
						</View>

						<Divider small />

						<Divider
							medium
							borderTopWidth={0.5}
							color={GlobalTheme.horizontalLineColor}
						/>

						<View style={styles.collectionStyle}>
							<TextField
								small
								isRLH
								lineHeight={4.4}
								fontFamily={GlobalTheme.fontMedium}
								color={GlobalTheme.black}>
								Collection in person
							</TextField>

							<TextField
								xThin
								letterSpacing={-0.07}
								isRLH
								lineHeight={1.8}
								fontFamily={GlobalTheme.fontRegular}
								color={GlobalTheme.textColor}>
								FREE
							</TextField>
						</View>

						<Divider small />

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
							HIRE SUMMARY
						</TextField>

						<Divider xxMedium />

						<TextField
							xThin
							letterSpacing={-0.07}
							isRLH
							lineHeight={1.8}
							fontFamily={GlobalTheme.fontRegular}
							color={GlobalTheme.textColor}>
							Hire Duration
						</TextField>

						<View style={styles.dateStyle}>
							<TextField
								xThin
								letterSpacing={-0.07}
								isRLH
								lineHeight={1.8}
								fontFamily={GlobalTheme.fontRegular}
								color={GlobalTheme.black}
								style={styles.numberOfDaysStyle}>
								{numberOfSelectedCalendarDates.length > 9
									? numberOfSelectedCalendarDates.length
									: '0' + numberOfSelectedCalendarDates.length}{' '}
								days{' '}
								{/* {filteredDatesTH.length > 0 ? `(${filteredDatesTH})` : null} */}
								{datesTH != '' || filteredDatesTH != ''
									? `(${datesTH}${
											monthSD != monthED ? ' ' + monthSD : ''
									  } - ${filteredDatesTH} ${monthED})`
									: null}
							</TextField>

							<TextField
								xThin
								letterSpacing={-0.07}
								isRLH
								lineHeight={1.8}
								fontFamily={GlobalTheme.fontBold}
								color={GlobalTheme.black}
								style={styles.totalDaysAmountStyle}>
								{hireDurationPrice != '' ? `£${hireDurationPrice}` : '£0'}
							</TextField>
						</View>

						<Divider
							borderTopWidth={0.5}
							color={GlobalTheme.horizontalLineColor}
						/>

						<TextField
							xThin
							letterSpacing={-0.07}
							isRLH
							lineHeight={1.8}
							fontFamily={GlobalTheme.fontRegular}
							color={GlobalTheme.textColor}>
							{/* {selectedHireItem.is_for_delivery == 1 */}
							{collectionType == '0' ? 'Hire Delivery' : 'Collecting Address'}
						</TextField>

						<View style={styles.milesStyle}>
							{/* <TextField
								xThin
								letterSpacing={-0.07}
								// lineHeight={18}
								isRLH
								lineHeight={1.8}
								fontFamily={GlobalTheme.fontRegular}
								color={GlobalTheme.black}>
								{ANDROID
									? savedAddress && !manualAddress
										? pickerSavedAddress === ''
											? addressPickerList[0].value
											: pickerSavedAddress
										: null
									: null}
								{!savedAddress && manualAddress ? location : null}

								{IOS
									? savedAddress && !manualAddress
										? pickerSavedAddress
										: !savedAddress && manualAddress
										? addressFromPostcode
										: null
									: null}
							</TextField> */}

							<TextField
								xThin
								letterSpacing={-0.07}
								isRLH
								lineHeight={1.8}
								fontFamily={GlobalTheme.fontRegular}
								color={GlobalTheme.black}>
								{hireDelivery != ''
									? `${hireDelivery},  ${
											collectionType === '' || collectionType === '1'
												? // selectedHireItem.is_for_delivery === 0
												  selectedHireItem.post_code
												: savedAddress
												? deliveryPostcodeFromSavedAddressPicker
												: manualAddress
												? location
												: null
									  }`
									: null}
							</TextField>

							{/* <HTMaterialTextInput
								placeholder="EX2 8FF (16 miles)"
								hasError={hireDeliveryValidate}
								validationMessage="Please enter hire delivery"
								onChangeText={(hireDelivery) => {
									setHireDelivery(hireDelivery);
									setHireDeliveryValidate(false);
								}}
								value={hireDelivery}
							/> */}

							<TextField
								xThin
								letterSpacing={-0.07}
								isRLH
								lineHeight={1.8}
								fontFamily={GlobalTheme.fontBold}
								color={GlobalTheme.black}
								style={styles.hireDeliveryPriceTextStyle}>
								{/* {selectedHireItem.is_for_delivery === 1 && */}
								{collectionType === '0' &&
								numberOfSelectedCalendarDates.length > 0
									? `£${hireDeliveryPrice}`
									: '£0'}
							</TextField>
						</View>

						<Divider
							borderTopWidth={0.5}
							color={GlobalTheme.horizontalLineColor}
						/>

						{/* {hireDeliveryAddressValidate ? (
							<>
								<TextField
									xTHin
									fontFamily={GlobalTheme.fontRegular}
									color={GlobalTheme.validationColor}>
									Hire delivery address is required, please select any one
									address above
								</TextField>

								<Divider medium />
							</>
						) : null} */}

						<View style={styles.totalHireCostStyle}>
							<TextField
								xThin
								letterSpacing={-0.07}
								isRLH
								lineHeight={1.8}
								fontFamily={GlobalTheme.fontBold}
								color={GlobalTheme.black}>
								TOTAL HIRE COST
							</TextField>

							<Divider horizontal xMedium />

							{hireDurationPrice != '' || hireDeliveryPrice != '' ? (
								<TextField
									medium
									letterSpacing={-0.1}
									isRLH
									lineHeight={2.4}
									fontFamily={GlobalTheme.fontBold}
									color={GlobalTheme.black}>
									{/* {selectedHireItem.is_for_delivery === 1 */}
									{collectionType === '0'
										? `£${(
												parseFloat(hireDurationPrice) +
												parseFloat(hireDeliveryPrice)
										  ).toFixed(2)}` === '£NaN'
											? `£0`
											: `£${(
													parseFloat(hireDurationPrice) +
													parseFloat(hireDeliveryPrice)
											  ).toFixed(2)}`
										: `£${hireDurationPrice}`}{' '}
								</TextField>
							) : (
								<TextField
									medium
									letterSpacing={-0.1}
									isRLH
									lineHeight={2.4}
									fontFamily={GlobalTheme.fontBold}
									color={GlobalTheme.black}>
									£0{' '}
								</TextField>
							)}

							{/* <TextField
								xThin
								letterSpacing={-0.07}
								isRLH
								lineHeight={1.8}
								fontFamily={GlobalTheme.fontRegular}
								color={GlobalTheme.textColor}>
								(Ex VAT)
							</TextField> */}
						</View>

						<TextField
							center
							xThin
							letterSpacing={-0.07}
							isRLH
							lineHeight={1.8}
							fontFamily={GlobalTheme.fontRegular}
							color={GlobalTheme.textColor}>
							(
							{selectedHireItem.vat_applicable === 1 ? 'Ex VAT 20% and ' : null}
							{selectedHireItem.vat_applicable === 1
								? 'Admin fee'
								: 'Ex Admin fee'}
							)
						</TextField>

						<Divider xxMedium />

						<View style={styles.termsOfUseWrapperStyle}>
							<OnlyCheckBox
								onPress={(val) => setCheckBox(val)}
								style={styles.onlyCheckBoxWrapperStyle}
							/>

							<TextField
								xThin
								isRLH
								lineHeight={1.8}
								letterSpacing={-0.09}
								color={GlobalTheme.black}
								fontFamily={GlobalTheme.fontRegular}
								style={styles.linkTextStyle}>
								{`I have read & agree to the`}
								<ParsedLinkText
									onPress={hireTermsAndConditionHandler}
									color={GlobalTheme.primaryColor}
									style={styles.linkTopStyle}>
									{` `}terms & conditions{` `}
								</ParsedLinkText>
							</TextField>
						</View>

						<TextField
							thin
							letterSpacing={-0.07}
							isRLH
							lineHeight={1.8}
							fontFamily={GlobalTheme.fontRegular}
							color={GlobalTheme.textColor}
							style={styles.continuingAgreementStyle}>
							By continuing you agree that you have read & agree to the hiring
							terms & conditions
						</TextField>

						<Divider xLarge />

						<Button
							title="CONFIRM & PAY"
							disabled={!checkBox ? true : false}
							blackButton={checkBox ? true : false}
							onPress={confirmAndPayHandler}
						/>

						<Divider xxLarge />
					</View>

					{/* <HireMakePayment
						navigation={props.navigation}
						show={presentHirePaymentScreenModal}
						totalHireCost={totalHireCost}
						setModalOpen={setModalOpen}
						addressPickerList={
							addressPickerList.length > 0 ? addressPickerList : []
						}
					/> */}

					{/* Hire Payment Confirmation modal */}
					<Modal
						animationType="fade"
						transparent={true}
						visible={confirmationModal}>
						<View style={styles.confirmationModal}>
							<View style={styles.confirmationModalShadowViewStyle}>
								<View style={styles.headerStyle}>
									{/* <TextField
										regular
										letterSpacing={-0.1}
										isRLH
										lineHeight={2.1}
										fontFamily={GlobalTheme.regular}
										color={GlobalTheme.white}
										onPress={setModalCloseHandler}
										style={styles.paymentConfirmationModalCancelStyle}>
										Close
									</TextField> */}

									<TextField
										center
										regular
										letterSpacing={-0.1}
										isRLH
										lineHeight={2.1}
										fontFamily={GlobalTheme.fontBold}
										color={GlobalTheme.white}
										style={styles.paymentConfirmationModalHeaderWrapperStyle}>
										Payment Confirmation
									</TextField>
								</View>

								<ScrollView
									showsVerticalScrollIndicator={false}
									contentContainerStyle={styles.modalInnerContent}>
									<Divider xLarge />

									<View style={styles.flexRowCenter}>
										<Image
											source={require('../assets/image/icon/tick.png')}
											style={styles.modalTickImage}
										/>

										<Divider horizontal small />

										<TextField
											regular
											letterSpacing={-0.32}
											isRLH
											lineHeight={2.6}
											fontFamily={GlobalTheme.fontBlack}
											color={GlobalTheme.black}>
											PAYMENT CONFIRMED
										</TextField>
									</View>

									<Divider xxxMedium />

									<TextField
										center
										xThin
										letterSpacing={-0.07}
										isRLH
										lineHeight={1.8}
										fontFamily={GlobalTheme.fontRegular}
										color={GlobalTheme.black}>
										You’ll receive a receipt for your purchase on email shortly.
										Charge will show on your account as HT Hire.
									</TextField>

									<Divider large />

									<View style={styles.totalPaidTextStyle}>
										<TextField
											left
											xThin
											letterSpacing={-0.36}
											isRLH
											lineHeight={2.2}
											fontFamily={GlobalTheme.fontRegular}
											color={GlobalTheme.defaultBlack}
											style={styles.leftTextLabelStyle}>
											{selectedHireItem.name}
										</TextField>

										<Divider horizontal small />

										<TextField
											left
											xThin
											letterSpacing={-0.07}
											isRLH
											lineHeight={1.8}
											fontFamily={GlobalTheme.fontRegular}
											color={GlobalTheme.textColor}
											style={styles.rightTextValueStyle}>
											{numberOfSelectedCalendarDates.length > 9
												? numberOfSelectedCalendarDates.length
												: '0' + numberOfSelectedCalendarDates.length}{' '}
											days{' '}
											{/* {datesTH != '' || filteredDatesTH != ''
											? `(${datesTH} - ${filteredDatesTH})`
											: null} */}
											{datesTH != '' || filteredDatesTH != ''
												? `(${datesTH}${
														monthSD != monthED ? ' ' + monthSD : ''
												  } - ${filteredDatesTH} ${monthED})`
												: null}
										</TextField>
									</View>

									<Divider small />

									<View style={styles.totalPaidTextStyle}>
										<TextField
											left
											xThin
											letterSpacing={-0.36}
											isRLH
											lineHeight={2.2}
											fontFamily={GlobalTheme.fontRegular}
											color={GlobalTheme.defaultBlack}
											style={styles.leftTextLabelStyle}>
											Hire Price
										</TextField>

										<Divider horizontal small />

										<TextField
											left
											xThin
											letterSpacing={-0.07}
											isRLH
											lineHeight={1.8}
											fontFamily={GlobalTheme.fontRegular}
											color={GlobalTheme.textColor}
											style={styles.rightTextValueStyle}>
											{hireItemStripeCostDetail.hire_price}
										</TextField>
									</View>

									<Divider small />

									<View style={styles.totalPaidTextStyle}>
										<TextField
											left
											xThin
											letterSpacing={-0.36}
											isRLH
											lineHeight={2.2}
											fontFamily={GlobalTheme.fontRegular}
											color={GlobalTheme.defaultBlack}
											style={styles.leftTextLabelStyle}>
											Delivery Price
										</TextField>

										<Divider horizontal small />

										<TextField
											left
											xThin
											letterSpacing={-0.07}
											isRLH
											lineHeight={1.8}
											fontFamily={GlobalTheme.fontRegular}
											color={GlobalTheme.textColor}
											style={styles.rightTextValueStyle}>
											{hireItemStripeCostDetail.delivery_price}
										</TextField>
									</View>

									<Divider small />

									<View style={styles.totalPaidTextStyle}>
										<TextField
											left
											xThin
											letterSpacing={-0.36}
											isRLH
											lineHeight={2.2}
											fontFamily={GlobalTheme.fontRegular}
											color={GlobalTheme.defaultBlack}
											style={styles.leftTextLabelStyle}>
											Admin fee
										</TextField>

										<Divider horizontal small />

										<TextField
											left
											xThin
											letterSpacing={-0.07}
											isRLH
											lineHeight={1.8}
											fontFamily={GlobalTheme.fontRegular}
											color={GlobalTheme.textColor}
											style={styles.rightTextValueStyle}>
											{`${hireItemStripeCostDetail.admin_fee_stripe}`}
										</TextField>
									</View>

									{hireItemStripeCostDetail.vat !== 0 ? (
										<>
											<Divider small />

											<View style={styles.totalPaidTextStyle}>
												<TextField
													left
													xThin
													letterSpacing={-0.36}
													isRLH
													lineHeight={2.2}
													fontFamily={GlobalTheme.fontRegular}
													color={GlobalTheme.defaultBlack}
													style={styles.leftTextLabelStyle}>
													VAT
												</TextField>

												<Divider horizontal small />

												<TextField
													left
													xThin
													letterSpacing={-0.07}
													isRLH
													lineHeight={1.8}
													fontFamily={GlobalTheme.fontRegular}
													color={GlobalTheme.textColor}
													style={styles.rightTextValueStyle}>
													{`${hireItemStripeCostDetail.vat}`}
												</TextField>
											</View>
										</>
									) : null}

									<Divider />

									<View style={styles.totalPaidTextStyle}>
										<TextField
											left
											xThin
											letterSpacing={-0.07}
											isRLH
											lineHeight={1.8}
											fontFamily={GlobalTheme.fontBold}
											color={GlobalTheme.black}
											style={styles.leftTextLabelStyle}>
											TOTAL PAID
										</TextField>

										<Divider horizontal small />

										<TextField
											left
											small
											letterSpacing={-0.1}
											isRLH
											lineHeight={1.8}
											fontFamily={GlobalTheme.fontBold}
											color={GlobalTheme.black}
											style={styles.rightTextValueStyle}>
											£{hireItemStripeCostDetail.total_paid} GBP
										</TextField>
									</View>

									<Image
										source={require('../assets/image/stripe.png')}
										style={styles.paymentMethodImageStyle}
									/>

									<Divider />

									<Button title="Done" blackButton onPress={doneHandler} />

									<Divider />

									{hireItemErrorMessage ? (
										<TextField
											xTHin
											fontFamily={GlobalTheme.fontRegular}
											color={GlobalTheme.validationColor}>
											Hire delivery address is required, please select any one
											address above
										</TextField>
									) : null}

									<Divider xxxHuge />
								</ScrollView>
							</View>
						</View>
					</Modal>
					{/* </ScrollView> */}

					<SavedCardsModal
						navigation={props.navigation}
						showSavedCardsModal={showSavedCardsModal}
						selectedCardForItem={(card) => payItemHireHandler(card)}
					/>
				</KeyboardAwareScrollView>
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
	topViewWrapper: {
		paddingTop: 15,
		paddingHorizontal: 10,
	},
	topViewInnerStyle: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		// borderWidth: 1,
	},
	topViewInnerLeftLayoutStyle: {
		flex: 1,
		width: '35%',
		// borderWidth: 1,
		// borderColor: 'red',
	},
	topViewInnerLeftImageStyle: (isTablet) => ({
		width: '90%',
		// height: 96,
		height: IOS && isTablet ? hp('15.0%') : hp('11.6%'),
		resizeMode: 'cover',
	}),
	topViewInnerRightLayoutStyle: {
		width: '65%',
		// borderWidth: 1,
	},
	providedByWrapperStyle: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		width: '100%',
		height: 56,
		paddingTop: 16,
		// borderWidth: 1,
	},
	providedByImageStyle: {
		width: '20%',
		height: 56,
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
		width: '80%',
		height: 56,
		// borderWidth: 1,
	},
	ph20: {
		paddingHorizontal: 20,
	},
	flexStartRowStyle: {
		width: '60%',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	hireDatesAndClearDatesFlexRowStyle: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		// borderWidth: 1,
	},
	shadowCalendarViewStyle: {
		width: '100%',
		// height: 360,
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
	calendarTitleStyle: {
		position: 'absolute',
		top: hp('2.5%'),
		alignSelf: 'center',
		zIndex: 999,
		elevation: 999,
		// borderWidth: 1,
	},
	horizontalLineStyle: {
		top: hp('8.0%'),
		zIndex: 999,
		elevation: 999,
		marginHorizontal: hp('2.0%'),
		borderTopWidth: 0.5,
		borderColor: GlobalTheme.horizontalLineColor,
	},
	calendarStyle: {
		borderRadius: GlobalTheme.viewRadius,
	},
	calendarHeaderStyle: {
		width: '100%',
		height: 50,
		// borderWidth: 1,
	},
	calendarHeaderInnerStyle: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		// paddingVertical: 10,
		// borderWidth: 1,
	},
	leftRightArrowIconWrapper: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	clearDatesStyle: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	spaceBetweenRowStyle: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		// borderWidth: 1,
	},
	deliveryRowStyle: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		// borderWidth: 1,
	},
	tickIconStyle: {
		width: 14,
		height: 14,
		resizeMode: 'cover',
		marginRight: 10,
	},
	checkBoxesRowStyle: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		// borderWidth: 1,
		// borderColor: 'magenta',
	},
	checkBoxStyle: {
		width: '45%',
		// borderWidth: 1,
		// borderColor: 'green',
	},
	checkboxWrapper: {
		flex: 1,
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderColor: GlobalTheme.validationColor,
		// borderWidth: 1,
		// borderColor: 'blue',
	},
	checkboxWidthStyle: {
		width: '20%',
		// borderWidth: 1,
		// borderColor: 'magenta',
	},
	checkbox: {
		// width: 28,
		// height: 28,
		width: hp('3.6%'),
		height: hp('3.6%'),
		borderWidth: 0.1,
		borderColor: 'transparent',
		shadowOpacity: 0.28,
		shadowColor: GlobalTheme.black,
		shadowRadius: GlobalTheme.shadowRadius,
		borderRadius: GlobalTheme.viewRadius,
		backgroundColor: GlobalTheme.white,
		shadowOffset: {width: 0, height: 6},
	},
	selectedStyle: {
		// width: 22,
		// height: 22,
		width: hp('2.8%'),
		height: hp('2.8%'),
		// marginTop: 3,
		marginTop: hp('0.4%'),
		alignSelf: 'center',
		borderRadius: GlobalTheme.viewRadius,
		backgroundColor: GlobalTheme.primaryColor,
	},
	textStyle: {
		width: '80%',
		// borderWidth: 1,
		// borderColor: 'red',
	},
	textFieldMarginLeftStyle: {
		marginLeft: 10,
	},
	textInputRowStyle: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		// borderWidth: 1,
	},
	textInputStyle: {
		width: '45%',
		// borderWidth: 1
	},
	collectionTypeWrapperStyle: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
		// borderWidth: 1,
	},
	collectionTypeTextStyle: {
		width: '30%',
		// borderWidth: 1,
		// borderColor: 'red',
	},
	collectionTypePickerStyle: {
		width: '70%',
		// borderWidth: 1,
		// borderColor: 'blue',
	},
	deliveryToRowStyle: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		// borderWidth: 1,
	},
	deliveryToStyle: {
		width: '45%',
		// borderWidth: 1
	},
	deliveryRowInnerStyle: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		// borderWidth: 1,
	},
	deliveryInnerStyle: {
		width: '45%',
		// borderWidth: 1
	},
	deliveryInnerPerMileStyle: {
		width: '45%',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		// borderWidth: 1,
	},
	collectionStyle: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	dateStyle: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		// borderWidth: 1,
	},
	numberOfDaysStyle: {
		width: '80%',
		// borderWidth: 1,
		// borderColor: 'red',
	},
	totalDaysAmountStyle: {
		width: '20%',
		// borderWidth: 1,
		// borderColor: 'red',
	},
	milesStyle: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		// borderWidth: 1,
	},
	hireDeliveryPriceTextStyle: {
		position: 'absolute',
		right: 0,
		// borderWidth: 1
	},
	totalHireCostStyle: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},

	// Hire Payment Confirmation
	confirmationModal: {
		flex: 1,
		top: hp('9.8%'),
		// borderWidth: 1,
		// borderColor: 'green',
		// backgroundColor: 'rgba(255,255,255,0.8)',
	},
	confirmationModalShadowViewStyle: {
		width: '95%',
		height: '50%',
		shadowRadius: GlobalTheme.shadowRadius,
		shadowColor: GlobalTheme.black,
		shadowOpacity: 0.28,
		borderWidth: 0.1,
		borderColor: 'transparent',
		position: 'absolute',
		// bottom: 78,
		bottom: hp('9.8%'),
		alignSelf: 'center',
		backgroundColor: GlobalTheme.white,
		borderRadius: GlobalTheme.viewRadius,
		shadowOffset: {width: 0, height: 6},
		elevation: 44,
		// borderWidth: 1,
		// borderColor: 'blue',
	},
	headerStyle: {
		width: '100%',
		height: hp('4.9%'),
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		backgroundColor: GlobalTheme.primaryColor,
		borderTopLeftRadius: GlobalTheme.viewRadius,
		borderTopRightRadius: GlobalTheme.viewRadius,
		// borderWidth: 1,
	},
	paymentConfirmationModalCancelStyle: {
		width: '35%',
		paddingLeft: hp('1.4%'),
		// borderWidth: 1,
	},
	paymentConfirmationModalHeaderWrapperStyle: {
		width: '100%',
		// borderWidth: 1,
	},
	modalInnerContent: {
		paddingHorizontal: 20,
		// borderWidth: 1,
	},
	flexRowCenter: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalTickImage: {
		width: hp('1.9%'),
		height: hp('1.9%'),
		// borderWidth: 1,
		// borderColor: 'blue',
	},
	totalPaidTextStyle: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		// borderWidth: 1,
	},
	leftTextLabelStyle: {
		width: '50%',
		paddingLeft: hp('4.0%'),
		// borderWidth: 1,
	},
	rightTextValueStyle: {
		width: '50%',
		// borderWidth: 1,
	},
	paymentMethodImageStyle: {
		alignSelf: 'center',
		width: wp('25%'),
		height: hp('10.0%'),
		resizeMode: 'cover',
		// borderWidth: 1,
		// borderColor: 'blue',
	},
	termsOfUseWrapperStyle: {
		width: wp('90%'),
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		// borderWidth: 1,
	},
	onlyCheckBoxWrapperStyle: {
		width: wp('25%'),
	},
	linkTextStyle: {
		width: wp('75%'),
		// borderWidth: 1,
	},
	linkTopStyle: {
		top: hp('0.3%'),
		// borderWidth: 1,
	},
	continuingAgreementStyle: {
		width: wp('75%'),
		alignSelf: 'flex-end',
		// borderWidth: 1,
	},
});

export {HireConfirm};
