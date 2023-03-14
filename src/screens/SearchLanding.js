import React, { useState, useEffect, useRef } from 'react';
import {
	View,
	Image,
	Alert,
	StyleSheet,
	TouchableOpacity,
	PermissionsAndroid,
} from 'react-native';

import Geocoder from 'react-native-geocoding';
import { useFocusEffect } from '@react-navigation/native';
import analytics from '@react-native-firebase/analytics';
import { useKeyboard } from '@react-native-community/hooks';
import Geolocation from 'react-native-geolocation-service';
import {
	heightPercentageToDP as hp,
	widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {
	check,
	request,
	RESULTS,
	PERMISSIONS,
	openSettings,
	checkMultiple,
	requestMultiple,
} from 'react-native-permissions';

import { _ENV_CONFIG } from '../config';
import { IOS, ANDROID } from '../helper';
import { Distance } from '../constants/Constant';
import { GlobalTheme } from '../components/theme';
// import {findLatLong} from '../services/axios/Api';
import { CreateItemConditionCheck } from '../models';
import { findAddressFromPostcode } from '../services/axios/Api';
import {
	SelectedSearchSchema,
	PostcodeSchema,
	LatitudeSchema,
	LongitudeSchema,
	MilesSchema,
} from '../models/validations/SearchLanding';
import {
	GenericView,
	TextField,
	Divider,
	HTTextInput,
	Button,
	HTPicker,
	AutoCompleteTextInput,
} from '../components/common';

import { useSelector, useDispatch } from 'react-redux';
import { presentAlert } from '../store/actions/Alert';
import { addCardApi } from '../store/actions/UserCard';
import { stripeConnectGetApi } from '../store/actions/Settings';
import { presentLoader, hideLoader } from '../store/actions/Loader';
import {
	nearMeHireApi,
	nearMeBuyApi,
	searchItemHireApi,
	searchItemBuyApi,
	resetFilterSearchData,
} from '../store/actions/SearchLanding';

const SearchLanding = (props) => {
	const userEmail = useSelector((state) => state.auth.user.email);
	const textInputClear = useSelector(
		(state) => state.clearTextInput.textInputClear,
	);
	const completedStripeOnboarding = useSelector(
		(state) => state.auth.user.completed_stripe_onboarding,
	);
	const hasPrimaryAddress = useSelector(
		(state) => state.auth.user.has_primary_address,
	);
	const hasPrimaryCard = useSelector(
		(state) => state.auth.user.has_primary_card,
	);
	const hasBusinessProfile = useSelector(
		(state) => state.auth.user.has_business_profile,
	);

	// const [data, setData] = useState(SubCategories);
	// const [filterData, setFilterData] = useState([]);
	// const [showFlatList, setShowFlatList] = useState(false);
	const [selectedSearch, setSelectedSearch] = useState('');
	const [selectedSearchValidate, setSelectedSearchValidate] = useState(false);
	const [queryLength, setQueryLength] = useState('');

	const [postcode, setPostcode] = useState('');
	const [postcodeValidate, setPostcodeValidate] = useState(false);

	const [SLTypedPostcode, setSLTypedPostcode] = useState(false);

	const [latitude, setLatitude] = useState('');
	const [latitudeValidate, setLatitudeValidate] = useState(false);
	const [longitude, setLongitude] = useState('');
	const [longitudeValidate, setLongitudeValidate] = useState(false);

	const [miles, setMiles] = useState('');
	const [milesValidate, setMilesValidate] = useState(false);

	const dispatch = useDispatch();

	const keyboard = useKeyboard();
	const isKeyboardShowing = keyboard.keyboardShown;

	const postcodeRef = useRef();

	useFocusEffect(
		React.useCallback(() => {
			dispatch(resetFilterSearchData());
		}, []),
	);

	useEffect(() => {
		if (completedStripeOnboarding !== 1) {
			dispatch(stripeConnectGetApi());
		}
	}, [completedStripeOnboarding]);

	useEffect(() => {
		if (hasPrimaryCard !== 1) {
			dispatch(addCardApi());
		}
	}, [hasPrimaryCard]);

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
			{ cancelable: false },
		);
	};

	useEffect(() => {
		async function checkPermission(permission) {
			// console.warn('I M ON SEARCHLANDING GALLERY PERMISSION');
			const result = await check(permission);
			switch (result) {
				case RESULTS.GRANTED:
					console.log('The permission is granted');
					break;

				case RESULTS.DENIED:
					// openAppSetting(
					// 	'Gallery Permission',
					// 	'App needs access to your gallery.',
					// );
					console.log(
						'The permission has not been requested / is denied but requestable',
					);
					break;

				case RESULTS.BLOCKED:
					openAppSetting(
						'Gallery Permission',
						'App needs access to your gallery.',
					);
					console.log('The permission is denied and not requestable anymore');

					break;

				case RESULTS.UNAVAILABLE:
					console.log(
						'This feature is not available (on this device / in this context)',
					);
					break;
			}
		}

		checkPermission(PERMISSIONS.ANDROID.CAMERA);
	}, []);

	const locationPermissionIOSHandler = async (from = '') => {
		try {
			// console.log('==near me analytics==');
			await analytics().logEvent('near_me', {});

			const iosLocationPermission = await Geolocation.requestAuthorization(
				'whenInUse',
			);
			// console.log('iosLocationPermission ==> ', iosLocationPermission);

			if (iosLocationPermission === 'granted') {
				dispatch(presentLoader());
				Geolocation.getCurrentPosition(
					(position) => {
						// console.log('position ==> ', position);

						if (from === 'nearMeHandler') {
							// console.log('latitude ==> ', position.coords.latitude);
							// console.log('longitude ==> ', position.coords.longitude);

							let obj = {
								// latitude: 50.695874,
								// longitude: -3.537021,
								// latitude: 50.70038,
								// longitude: -3.4822,
								// latitude: 50.700367,
								// longitude: -3.482253,
								latitude: position.coords.latitude,
								longitude: position.coords.longitude,
							};

							dispatch(nearMeHireApi(1, obj, props.navigation));
							dispatch(nearMeBuyApi(1, obj, props.navigation));

							return;
						}

						setLatitude(position.coords.latitude);
						setLongitude(position.coords.longitude);

						Geocoder.init(_ENV_CONFIG.GOOGLE_KEY);
						// Geocoder.from(53.483002, -2.2931)
						Geocoder.from(position.coords.latitude, position.coords.longitude)
							.then((json) => {
								// console.log('json ==> ', json);
								let addressComponent = json.results[0].address_components;
								// console.log('addressComponent ==> ', addressComponent);

								addressComponent.filter((obj) => {
									if (obj?.types) {
										setPostcode('');
										if (obj.types[0] === 'postal_code') {
											setPostcode(obj.long_name);
											setPostcodeValidate(false);
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
					{ enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
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
	};

	const locationPermissionAndroidHandler = async (from = '') => {
		try {
			// console.log('==near me analytics==');
			await analytics().logEvent('near_me', {});

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

						if (from === 'nearMeHandler') {
							// console.log('latitude ==> ', position.coords.latitude);
							// console.log('longitude ==> ', position.coords.longitude);

							let obj = {
								// latitude: 50.695874,
								// longitude: -3.537021,
								// latitude: 50.70038,
								// longitude: -3.4822,
								// latitude: 50.700367,
								// longitude: -3.482253,
								latitude: position.coords.latitude,
								longitude: position.coords.longitude,
							};

							dispatch(nearMeHireApi(1, obj, props.navigation));
							dispatch(nearMeBuyApi(1, obj, props.navigation));

							return;
						}

						setLatitude(position.coords.latitude);
						setLongitude(position.coords.longitude);

						Geocoder.init(_ENV_CONFIG.GOOGLE_KEY);
						// Geocoder.from(53.483002, -2.2931)
						Geocoder.from(position.coords.latitude, position.coords.longitude)
							.then((json) => {
								// console.log('json ==> ', json);
								let addressComponent = json.results[0].address_components;
								// console.log('addressComponent ==> ', addressComponent);

								addressComponent.filter((obj) => {
									if (obj?.types) {
										setPostcode('');
										if (obj.types[0] === 'postal_code') {
											setPostcode(obj.long_name);
											setPostcodeValidate(false);
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
					{ enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
				);
			} else if (granted === PermissionsAndroid.RESULTS.DENIED) {
				openAppSetting(
					'Location Permission',
					'App needs access to your location.',
				);
			}
		} catch (err) {
			console.warn(err);
		}
	};

	// const dismissHandler = () => {
	// 	setShowFlatList(false);
	// };

	// const searchDataFromJSON = (query) => {
	// 	if (query) {
	// 		//Making the Search as Case Insensitive.
	// 		const regex = new RegExp(`${query.trim()}`, 'i');

	// 		const filteredData = data.filter((obj) => obj.label.search(regex) >= 0);

	// 		let rawQueryLength = query.length;
	// 		// console.log('rawQueryLength ==> ', rawQueryLength);
	// 		if (filteredData.length > 0) {
	// 			if (filteredData.length === 1) {
	// 				if (queryLength.toString() != '' && rawQueryLength > queryLength) {
	// 					setShowFlatList(false);
	// 					setFilterData([]);
	// 					return;
	// 				}
	// 				// console.log('state queryLength ==> ', queryLength);
	// 				setQueryLength(query.length);
	// 			}
	// 			setShowFlatList(true);
	// 			setFilterData(filteredData);
	// 		}
	// 	} else {
	// 		setShowFlatList(false);
	// 		setFilterData([]);
	// 	}
	// };

	// const closeFlatListHandler = () => {
	// 	setShowFlatList(false);
	// };

	useEffect(() => {
		if (miles === '') {
			setMiles('Unlimited');
		}
	}, [miles]);

	useEffect(() => {
		if (SLTypedPostcode) {
			setSLTypedPostcode(false);
			if (postcode.length >= 6 && postcode.length < 9) {
				// findLatLong(postcode)
				findAddressFromPostcode(postcode)
					.then((response) => {
						// console.log(`response ==> `, response);
						// if (response.data.status === 200 && response.data.result != null) {
						if (response?.status === 200) {
							// console.log('res ==> ', response.data.result[0]);
							setLatitude(response.data.latitude);
							setLongitude(response.data.longitude);
						} else {
							setLatitude('');
							setLongitude('');
						}
					})
					.catch((error) => {
						console.log('error ==> ', error);
					});
			}
		}
	}, [SLTypedPostcode]);

	const searchHiresHandler = async () => {
		const validSelectedSearch = await SelectedSearchSchema.isValid({
			selectedSearch: selectedSearch,
		});
		validSelectedSearch
			? setSelectedSearchValidate(false)
			: setSelectedSearchValidate(true);

		// const validPostcode = await PostcodeSchema.isValid({postcode: postcode});
		// validPostcode ? setPostcodeValidate(false) : setPostcodeValidate(true);

		const validLatitude = await LatitudeSchema.isValid({ latitude: latitude });
		validLatitude ? setLatitudeValidate(false) : setLatitudeValidate(true);

		const validLongitude = await LongitudeSchema.isValid({
			longitude: longitude,
		});
		validLongitude ? setLongitudeValidate(false) : setLongitudeValidate(true);

		const validMiles = await MilesSchema.isValid({ miles: miles });
		validMiles ? setMilesValidate(false) : setMilesValidate(true);

		if (postcode.length < 6 || postcode.length > 8) {
			setPostcodeValidate(true);
		}

		if (selectedSearch.trim() === '') {
			setSelectedSearchValidate(true);
			return;
		}

		if (
			postcode.length >= 6 &&
			postcode.length < 9 &&
			!validLatitude &&
			!validLongitude
		) {
			let alertConfig = {
				title: 'Oops!',
				message: 'Please try again.',
			};

			dispatch(presentAlert(alertConfig));
		}

		if (
			validSelectedSearch &&
			postcode.length >= 6 &&
			postcode.length < 9 &&
			validLatitude &&
			validLongitude &&
			validMiles
		) {
			let obj = {
				keyword: selectedSearch.trim(),
				post_code: postcode,
				latitude: latitude,
				longitude: longitude,
				distance: miles === 'Unlimited' ? null : parseInt(miles),
			};

			// console.log('search landing obj ==> ', obj);
			dispatch(searchItemHireApi(1, obj, props.navigation));
			dispatch(searchItemBuyApi(1, obj, props.navigation));
		}
	};

	const nearMeHandler = () => {
		if (IOS) {
			locationPermissionIOSHandler('nearMeHandler');
		}

		if (ANDROID) {
			locationPermissionAndroidHandler('nearMeHandler');
		}
	};

	const haveItemToHireOutHandler = () => {
		// console.log('==have item hire out analytics==');
		analytics().logEvent('have_item_hire_out', {});

		CreateItemConditionCheck(
			userEmail,
			// completedStripeOnboarding,
			hasPrimaryAddress,
			// hasPrimaryCard,
			hasBusinessProfile,
			props.navigation,
		);
	};

	useEffect(() => {
		if (textInputClear) {
			setSelectedSearch('');
			// setPostcode('');
			// setMiles('');
		}
	}, [textInputClear]);

	return (
		<GenericView
		// dismiss={dismissHandler}
		>
			<View style={styles.mainView(isKeyboardShowing)}>
				<Image
					source={require('../assets/image/arrow.png')}
					style={styles.searchLogoStyle}
				/>

				<TextField
					xxHuge
					// xxHuge
					center
					isRLH
					lineHeight={7.6}
					letterSpacing={-1.91}
					fontFamily={GlobalTheme.fontBlack}
					color={GlobalTheme.white}
					style={styles.marginTopMinus16}>
					SEARCH
				</TextField>

				<Divider xMedium />

				<AutoCompleteTextInput
					// showFlatList={showFlatList}
					// data={filterData}
					// closeFlatList={closeFlatListHandler}
					placeholder="Enter a term, example 'digger'"
					value={selectedSearch}
					returnKeyType="next"
					hasError={selectedSearchValidate}
					onChangeText={(selectedSearch) => {
						analytics().logEvent('search_item_query', {
							searchItemQuery: selectedSearch,
						});
						// searchDataFromJSON(selectedSearch);
						setSelectedSearch(selectedSearch);
						setSelectedSearchValidate(false);
					}}
					onSubmitEditing={(event) => postcodeRef.current.focus()}
					blurOnSubmit={false}
				/>

				<Divider xMedium />

				<View style={styles.twoInputsStyle}>
					<HTTextInput
						// textInputWidth={140}
						textInputWidth={'55%'}
						placeholder="Postcode"
						iconName="location-searching"
						iconLibrary="MaterialIcons"
						locationPermissionStatus={
							IOS
								? locationPermissionIOSHandler
								: locationPermissionAndroidHandler
						}
						value={postcode}
						returnKeyType="done"
						inputRef={postcodeRef}
						hasError={postcodeValidate}
						onChangeText={(postcode) => {
							setPostcode(postcode);
							setPostcodeValidate(false);
							setSLTypedPostcode(true);
						}}
						onSubmitEditing={(event) => console.log('search landing finally!!')}
					/>

					{/* <HTTextInput
						// textInputWidth={112}
						textInputWidth={'35%'}
						placeholder="Within 25 mi"
						value={miles}
						hasError={milesValidate}
						onChangeText={(miles) => {
							setMiles(miles);
							setMilesValidate(false);
						}}
					/> */}

					<View style={styles.distancePickerWidth}>
						<HTPicker
							placeholder="Select distance"
							hasError={milesValidate}
							defaultValue="Unlimited"
							onValueChange={(milesValue, milesSelectedId) => {
								// console.log('milesValue ==> ', milesValue, milesSelectedId);
								setMiles(milesValue);
								setMilesValidate(false);
								// console.log('==radius selected==');
								analytics().logEvent('radius_selected', {
									searchItemRadiusSelected: milesValue,
								});
							}}
							value={miles}
							data={Distance.length > 0 ? Distance : []}
						/>
					</View>
				</View>

				<Divider xLarge />

				<Button title="SEARCH HIRES" blackButton onPress={searchHiresHandler} />

				<Divider />

				<Button
					title="NEAR ME"
					iconName="location-outline"
					iconLibrary="Ionicons"
					onPress={nearMeHandler}
				/>

				<Divider xxxHuge />

				<TouchableOpacity onPress={haveItemToHireOutHandler}>
					<TextField
						regular
						center
						isRLH
						lineHeight={2.1}
						fontFamily={GlobalTheme.fontRegular}
						color={GlobalTheme.white}>
						Have an item to hire out?
					</TextField>
				</TouchableOpacity>
			</View>
		</GenericView>
	);
};

const styles = StyleSheet.create({
	mainView: (isKeyboardShowing) => ({
		flex: 1,
		// paddingHorizontal: 54,
		paddingHorizontal: hp('5.8%'),
		justifyContent: 'center',
		paddingBottom: isKeyboardShowing ? hp('10.5%') : null,
		// borderWidth: 1,
		// borderColor: 'red',
	}),
	searchLogoStyle: {
		// width: '90%',
		// height: 123,
		width: wp('90.0%'),
		height: hp('13.2%'),
		alignSelf: 'center',
		resizeMode: 'contain',
		// borderWidth: 1,
		// borderColor: 'green',
	},
	marginTopMinus16: {
		// marginTop: -16,
		marginTop: hp('-1.7%'),
		// borderWidth: 1,
	},
	twoInputsStyle: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		// borderWidth: 1,
	},
	distancePickerWidth: {
		width: '40%',
	},
});

export { SearchLanding };
