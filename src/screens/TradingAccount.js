import React, {useState, useEffect, useRef} from 'react';
import {
	View,
	Image,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	TouchableWithoutFeedback,
} from 'react-native';

import Icon from 'react-native-vector-icons/Feather';
import {useFocusEffect} from '@react-navigation/native';
import ShadowView from 'react-native-simple-shadow-view';
import ImagePicker from 'react-native-image-crop-picker';
import PhoneInput from 'react-native-phone-number-input';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {_ENV_CONFIG} from '../config';
import {GlobalTheme} from '../components/theme';
// import {findLatLong} from '../services/axios/Api';
import {findAddressFromPostcode} from '../services/axios/Api';
import {
	TradingNameSchema,
	LabelSchema,
	Address1Schema,
	// Address2Schema,
	CitySchema,
	CountrySchema,
	PostcodeSchema,
	VATNumberSchema,
} from '../models/validations/TradingAccountAddress';
import {
	GenericView,
	Header,
	Divider,
	TextField,
	Button,
	OnlyCheckBox,
	HTMaterialTextInput,
} from '../components/common';
import {SelectiveLocation} from '../components/tradingAccount/SelectiveLocation';

import {useSelector, useDispatch} from 'react-redux';
import {presentAlert} from '../store/actions/Alert';
import {headerTitle} from '../store/actions/Header';
import {addressListApi} from '../store/actions/Profile';
import {userBusinessProfilePOSTApi} from '../store/actions/Settings';

const TradingAccount = (props) => {
	const addressList = useSelector((state) => state.profile.addressList);
	const addressPickerList = useSelector(
		(state) => state.profile.addressPickerList,
	);
	const businessProfileDetails = useSelector(
		(state) => state.settings.businessProfileDetails,
	);

	const [businessProfileImage, setBusinessProfileImage] = useState('');
	const [
		displayBusinessProfileImage,
		setDisplayBusinessProfileImage,
	] = useState('');

	const [tradingName, setTradingName] = useState('');
	const [tradingNameValidate, setTradingNameValidate] = useState(false);

	const [savedAddress, setSavedAddress] = useState(true);
	const [manualAddress, setManualAddress] = useState(false);

	const [savedLabelName, setSavedLabelName] = useState('');
	const [savedAddressLine1, setSavedAddressLine1] = useState('');
	const [savedAddressLine2, setSavedAddressLine2] = useState('');
	const [savedCity, setSavedCity] = useState('');
	const [savedCountry, setSavedCountry] = useState('');
	const [savedPostcode, setSavedPostcode] = useState('');
	const [savedLatitude, setSavedLatitude] = useState('');
	const [savedLongitude, setSavedLongitude] = useState('');
	const [addressPickerVisible, setAddressPickerVisible] = useState(false);

	const [manualLabelName, setManualLabelName] = useState('');
	const [manualLabelNameValidate, setManualLabelNameValidate] = useState(false);
	const [manualAddressLine1, setManualAddressLine1] = useState('');
	const [manualAddressLine1Validate, setManualAddressLine1Validate] = useState(
		false,
	);
	const [manualAddressLine2, setManualAddressLine2] = useState('');
	// const [manualaddressLine2Validate, setManualAddressLine2Validate] = useState('');
	const [manualCity, setManualCity] = useState('');
	const [manualCityValidate, setManualCityValidate] = useState(false);
	const [manualCountry, setManualCountry] = useState('');
	const [manualCountryValidate, setManualCountryValidate] = useState(false);
	const [manualPostcode, setManualPostcode] = useState('');
	const [manualPostcodeValidate, setManualPostcodeValidate] = useState(false);
	const [typedPostcode, setTypedPostcode] = useState(false);
	const [manualLatitude, setManualLatitude] = useState('');
	const [manualLongitude, setManualLongitude] = useState('');
	const [manualLatLonValidate, setManualLatLonValidate] = useState(false);
	const [saveThisAddress, setSaveThisAddress] = useState('0');

	const [contactNumber, setContactNumber] = useState('');
	const [formattedContactNumber, setFormattedContactNumber] = useState('');
	const [countryCode, setCountryCode] = useState('');
	const [disabled, setDisabled] = useState(false);
	const [phoneInputValidate, setPhoneInputValidate] = useState(false);
	const [phoneInputErrorMessage, setPhoneInputErrorMessage] = useState('');

	const [companyRegistration, setCompanyRegistration] = useState('');
	const [vatRegister, setVATRegister] = useState(false);
	const [vatNumber, setVATNumber] = useState('');
	const [vatNumberValidate, setVATNumberValidate] = useState(false);

	const phoneInput = useRef(null);

	const dispatch = useDispatch();

	useFocusEffect(
		React.useCallback(() => {
			let headerConfig = {
				isBackArrow: true,
				leftTitle: 'Back',
				isRightContent: true,
				rightTitle: '',
				navParam: '',
			};

			dispatch(headerTitle(headerConfig));
		}, []),
	);

	useEffect(() => {
		dispatch(addressListApi());
	}, []);

	useEffect(() => {
		if (businessProfileDetails.length > 0) {
			// findLatLong(businessProfileDetails[0].post_code)
			findAddressFromPostcode(businessProfileDetails[0].post_code)
				.then((response) => {
					// if (response.data.status === 200 && response.data.result != null) {
					if (response?.status === 200) {
						// console.log('res ==> ', response.data.result[0]);
						setManualLatitude(response.data.latitude.toString());
						setManualLongitude(response.data.longitude.toString());
					} else {
						setManualLatitude('');
						setManualLongitude('');
					}
				})
				.catch((error) => {
					console.log('error ==> ', error);
				});
		}
	}, [businessProfileDetails]);

	useEffect(() => {
		if (businessProfileDetails.length > 0 && addressPickerList.length > 0) {
			setDisplayBusinessProfileImage(businessProfileDetails[0].avatar);
			setTradingName(businessProfileDetails[0].trading_name);

			if (businessProfileDetails[0].is_manual_address === 0) {
				setSavedAddress(true);
				setManualAddress(false);
			}

			if (businessProfileDetails[0].is_manual_address === 1) {
				setSavedAddress(false);
				setManualAddress(true);
			}

			setContactNumber(businessProfileDetails[0].phone_number);
			setFormattedContactNumber(businessProfileDetails[0].phone_number);
			setCountryCode(phoneInput.current?.getCountryCode() || '');
			setCompanyRegistration(
				businessProfileDetails[0].company_registation_number,
			);
			setVATRegister(
				businessProfileDetails[0].vat_registered === 1 ? true : false,
			);
			setVATNumber(businessProfileDetails[0].vat_registration_number);
		}
	}, [businessProfileDetails, addressPickerList]);

	useEffect(() => {
		ImagePicker.clean()
			.then(() => {
				console.log('removed tmp images from tmp directory');
			})
			.catch((e) => {
				console.log({e});
			});
	}, []);

	useEffect(() => {
		if (typedPostcode) {
			setTypedPostcode(false);
			if (manualPostcode.length >= 6 && manualPostcode.length < 9) {
				// findLatLong(manualPostcode)
				findAddressFromPostcode(manualPostcode)
					.then((response) => {
						// if (response.data.status === 200 && response.data.result != null) {
						if (response?.status === 200) {
							// console.log('res ==> ', response.data.result[0]);
							setManualLatitude(response.data.latitude.toString());
							setManualLongitude(response.data.longitude.toString());
						} else {
							setManualLatitude('');
							setManualLongitude('');
						}
					})
					.catch((error) => {
						console.log('error ==> ', error);
					});
			}
		}
	}, [typedPostcode]);

	useEffect(() => {
		if (savedAddress && !manualAddress) {
			setAddressPickerVisible(true);
		}

		if (!savedAddress && manualAddress) {
			setAddressPickerVisible(false);
		}
	}, [savedAddress, manualAddress]);

	const uploadBusinessProfileHandler = () => {
		ImagePicker.openPicker({
			includeBase64: true,
			compressImageQuality: 0.8,
			compressImageMaxWidth: 990,
			compressImageMaxHeight: 2050,
		})
			.then((result) => {
				// console.log('result ==> ', result);
				if (
					result.mime === 'image/jpg' ||
					result.mime === 'image/jpeg' ||
					result.mime === 'image/png'
				) {
					setBusinessProfileImage(`data:${result.mime};base64,${result.data}`);
					setDisplayBusinessProfileImage(
						`data:${result.mime};base64,${result.data}`,
					);
				} else {
					let alertConfig = {
						title: 'Oops!',
						message: 'Only images with JPEG, JPG, PNG formats are allowed',
					};
					dispatch(presentAlert(alertConfig));
				}
			})
			.catch((e) => {
				let alertConfig = {
					title: 'Oops!',
					message: 'User cancelled image selection',
				};
				dispatch(presentAlert(alertConfig));
			});
	};

	const tradingAddressHandler = (value) => {
		if (savedAddress && value != '') {
			addressList.filter((obj) => {
				if (obj.name === value) {
					setSavedLabelName(obj.name);
					setSavedAddressLine1(obj.address_line_1);
					setSavedAddressLine2(obj.address_line_2);
					setSavedCity(obj.city);
					setSavedCountry(obj.country);
					setSavedPostcode(obj.post_code);
					setSavedLatitude(obj.latitude.toString());
					setSavedLongitude(obj.longitude.toString());
				}
			});
		}
	};

	const businessProfileHandler = async () => {
		let vatNumberValid = true;

		if (savedAddress) {
			const validTradingName = await TradingNameSchema.isValid({
				tradingName: tradingName,
			});
			validTradingName
				? setTradingNameValidate(false)
				: setTradingNameValidate(true);

			const checkValid = phoneInput.current?.isValidNumber(contactNumber);
			setPhoneInputValidate(!checkValid ? true : false);
			setPhoneInputErrorMessage(!checkValid ? 'Invalid mobile number' : '');

			if (vatRegister) {
				vatNumberValid = await VATNumberSchema.isValid({
					vatNumber: vatNumber,
				});
				vatNumberValid
					? setVATNumberValidate(false)
					: setVATNumberValidate(true);
			}

			if (validTradingName && checkValid && vatNumberValid) {
				let obj = {
					avatar: businessProfileImage != '' ? businessProfileImage : null,
					trading_name: tradingName,
					name:
						savedLabelName != ''
							? savedLabelName
							: addressList.length > 0
							? addressList[0].name
							: '',
					address_line_1:
						savedAddressLine1 != ''
							? savedAddressLine1
							: addressList.length > 0
							? addressList[0].address_line_1
							: '',
					address_line_2:
						savedAddressLine2 != ''
							? savedAddressLine2
							: addressList.length > 0
							? addressList[0].address_line_2
							: '',
					city:
						savedCity != ''
							? savedCity
							: addressList.length > 0
							? addressList[0].city
							: '',
					country:
						savedCountry != ''
							? savedCountry
							: addressList.length > 0
							? addressList[0].country
							: '',
					post_code:
						savedPostcode != ''
							? savedPostcode
							: addressList.length > 0
							? addressList[0].post_code
							: '',
					latitude:
						savedLatitude != ''
							? savedLatitude
							: addressList.length > 0
							? addressList[0].latitude.toString()
							: '',
					longitude:
						savedLongitude != ''
							? savedLongitude
							: addressList.length > 0
							? addressList[0].longitude.toString()
							: '',
					save_this_address: saveThisAddress,
					phone_number: contactNumber,
					company_registation_number: companyRegistration,
					vat_registered: vatRegister ? '1' : '0',
					vat_registration_number: vatRegister ? vatNumber : '',
					is_manual_address: manualAddress ? '1' : '0',
				};

				// console.log('obj ==>', obj);
				dispatch(
					userBusinessProfilePOSTApi(
						obj,
						props.navigation,
						props?.route?.params?.collectInOneGo,
					),
				);
			}
		}

		if (manualAddress) {
			let validLabelName = true;
			let validAddressLine1 = true;
			// let validAddressLine2 = true;
			let validCity = true;
			let validCountry = true;
			let validPostcode = true;

			const validTradingName = await TradingNameSchema.isValid({
				tradingName: tradingName,
			});
			validTradingName
				? setTradingNameValidate(false)
				: setTradingNameValidate(true);

			if (saveThisAddress === '1') {
				validLabelName = await LabelSchema.isValid({
					manualLabelName: manualLabelName,
				});
				validLabelName
					? setManualLabelNameValidate(false)
					: setManualLabelNameValidate(true);
			}

			validAddressLine1 = await Address1Schema.isValid({
				manualAddressLine1: manualAddressLine1,
			});
			validAddressLine1
				? setManualAddressLine1Validate(false)
				: setManualAddressLine1Validate(true);

			//  validAddressLine2 = await Address2Schema.isValid({
			// 	manualAddressLine2: manualAddressLine2,
			// });
			// validAddressLine2
			// 	? setManualAddressLine2Validate(false)
			// 	: setManualAddressLine2Validate(true);

			validCity = await CitySchema.isValid({manualCity: manualCity});
			validCity ? setManualCityValidate(false) : setManualCityValidate(true);

			validCountry = await CountrySchema.isValid({
				manualCountry: manualCountry,
			});
			validCountry
				? setManualCountryValidate(false)
				: setManualCountryValidate(true);

			validPostcode = await PostcodeSchema.isValid({
				manualPostcode: manualPostcode,
			});
			validPostcode
				? setManualPostcodeValidate(false)
				: setManualPostcodeValidate(true);

			if (manualLatitude === '' && manualLongitude === '') {
				setManualLatLonValidate(true);
				return;
			}

			const checkValid = phoneInput.current?.isValidNumber(contactNumber);
			setPhoneInputValidate(!checkValid ? true : false);
			setPhoneInputErrorMessage(!checkValid ? 'Invalid mobile number' : '');

			if (vatRegister) {
				vatNumberValid = await VATNumberSchema.isValid({
					vatNumber: vatNumber,
				});
				vatNumberValid
					? setVATNumberValidate(false)
					: setVATNumberValidate(true);
			}

			if (
				validTradingName &&
				validLabelName &&
				validAddressLine1 &&
				// validAddressLine2 &&
				validCity &&
				validCountry &&
				validPostcode &&
				manualLatitude != '' &&
				manualLongitude != '' &&
				checkValid &&
				vatNumberValid
			) {
				let obj = {
					avatar: businessProfileImage != '' ? businessProfileImage : null,
					trading_name: tradingName,
					name: manualLabelName,
					address_line_1: manualAddressLine1,
					address_line_2: manualAddressLine2,
					city: manualCity,
					country: manualCountry,
					post_code: manualPostcode,
					latitude: manualLatitude,
					longitude: manualLongitude,
					save_this_address: saveThisAddress,
					phone_number: contactNumber,
					company_registation_number: companyRegistration,
					vat_registered: vatRegister ? '1' : '0',
					vat_registration_number: vatRegister ? vatNumber : '',
					is_manual_address: manualAddress ? '1' : '0',
				};

				// console.log('obj ==>', obj);
				dispatch(
					userBusinessProfilePOSTApi(
						obj,
						props.navigation,
						props?.route?.params?.collectInOneGo,
					),
				);
			}
		}
	};

	return (
		<GenericView isBackgroundColor>
			<>
				<Header />
				<KeyboardAwareScrollView
					extraHeight={hp(20.0)}
					keyboardShouldPersistTaps="handled"
					contentContainerStyle={styles.mainView}>
					{/* <ScrollView contentContainerStyle={styles.mainView}> */}
					<Divider xxxHuge />

					{/* <Divider xxMedium /> */}

					<TextField
						title
						letterSpacing={-0.32}
						lineHeight={26}
						fontFamily={GlobalTheme.fontBlack}
						color={GlobalTheme.primaryColor}>
						TRADING ACCOUNT
					</TextField>

					<Divider />

					<TextField
						medium
						lineHeight={23}
						fontFamily={GlobalTheme.fontBold}
						color={GlobalTheme.black}>
						BUSINESS PROFILE
					</TextField>

					<Divider />

					<TextField
						xThin
						letterSpacing={-0.07}
						lineHeight={18}
						fontFamily={GlobalTheme.fontRegular}
						color={GlobalTheme.textColor}>
						Business avatar
					</TextField>

					<Divider xMedium />

					<View style={styles.businessAvatarWrapperStyle}>
						<View style={styles.businessAvatarInnerLeftStyle}>
							<ShadowView style={styles.shadowViewStyle}>
								<TouchableOpacity
									style={styles.businessProfileFlexStyle}
									onPress={uploadBusinessProfileHandler}>
									{displayBusinessProfileImage != '' ? (
										<Image
											source={{uri: displayBusinessProfileImage}}
											style={styles.avatarStyle}
										/>
									) : (
										<Icon
											name="upload"
											size={hp('6.5%')}
											color={GlobalTheme.white}
											style={styles.uploadIconWrapperStyle}
										/>
									)}
								</TouchableOpacity>
							</ShadowView>
						</View>
						<View style={styles.businessAvatarInnerRightStyle}>
							<TextField
								xThin
								letterSpacing={-0.07}
								lineHeight={18}
								fontFamily={GlobalTheme.fontRegular}
								color={GlobalTheme.textColor}>
								Upload an image of yourself or your business logo to show it on
								items you offer for hire & sale.
							</TextField>
						</View>
					</View>

					<Divider />

					<TextField
						xThin
						letterSpacing={-0.07}
						lineHeight={18}
						fontFamily={GlobalTheme.fontRegular}
						color={GlobalTheme.textColor}>
						Trading Name
					</TextField>

					<HTMaterialTextInput
						placeholder="Enter Trading Name"
						hasError={tradingNameValidate}
						validationMessage="Please enter trading name"
						onChangeText={(tradingName) => {
							setTradingName(tradingName);
							setTradingNameValidate(false);
						}}
						value={tradingName}
					/>

					<Divider />

					<TextField
						xThin
						letterSpacing={-0.07}
						lineHeight={18}
						fontFamily={GlobalTheme.fontRegular}
						color={GlobalTheme.textColor}>
						Trading Address
					</TextField>

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

					<SelectiveLocation
						// addressPickerVisible
						addressPickerVisible={addressPickerVisible}
						// saved address
						savedAddressLine1={(savedAddressLine1) =>
							setSavedAddressLine1(savedAddressLine1)
						}
						savedAddressLine2={(savedAddressLine2) =>
							setSavedAddressLine2(savedAddressLine2)
						}
						savedCity={(savedCity) => setSavedCity(savedCity)}
						savedCountry={(savedCountry) => setSavedCountry(savedCountry)}
						savedPostcode={(savedPostcode) => setSavedPostcode(savedPostcode)}
						// manual address
						manualAddressLine1ValidateParent={manualAddressLine1Validate}
						manualAddressLine2ValidateParent={manualAddressLine1Validate}
						manualCityValidateParent={manualCityValidate}
						manualCountryValidateParent={manualCountryValidate}
						manualPostcodeValidateParent={manualPostcodeValidate}
						manualLatLonValidateParent={manualLatLonValidate}
						manualLabelNameValidateParent={manualLabelNameValidate}
						//
						manualAddressLine1={(manualAddressLine1) => {
							setManualAddressLine1(manualAddressLine1);
						}}
						manualAddressLine1Validate={(manualAddressLine1Validate) =>
							setManualAddressLine1Validate(manualAddressLine1Validate)
						}
						//
						manualAddressLine2={(manualAddressLine2) =>
							setManualAddressLine2(manualAddressLine2)
						}
						manualAddressLine2Validate={(manualAddressLine2Validate) =>
							setManualAddressLine2Validate(manualAddressLine2Validate)
						}
						//
						manualCity={(manualCity) => setManualCity(manualCity)}
						manualCityValidate={(manualCityValidate) =>
							setManualCityValidate(manualCityValidate)
						}
						//
						manualCountry={(manualCountry) => setManualCountry(manualCountry)}
						manualCountryValidate={(manualCountryValidate) =>
							setManualCountryValidate(manualCountryValidate)
						}
						//
						manualPostcode={(manualPostcode) =>
							setManualPostcode(manualPostcode)
						}
						manualPostcodeValidate={(manualPostcodeValidate) =>
							setManualPostcodeValidate(manualPostcodeValidate)
						}
						//
						typedPostcode={(typedPostcode) => setTypedPostcode(typedPostcode)}
						//
						manualLatLonValidate={(manualLatLonValidate) =>
							setManualLatLonValidate(manualLatLonValidate)
						}
						//
						manualLabelName={(manualLabelName) =>
							setManualLabelName(manualLabelName)
						}
						manualLabelNameValidate={(manualLabelNameValidate) =>
							setManualLabelNameValidate(manualLabelNameValidate)
						}
						//
						saveThisAddress={(saveThisAddress) =>
							setSaveThisAddress(saveThisAddress)
						}
						//
						tradingAddressHandler={(tradingAddressValue) =>
							tradingAddressHandler(tradingAddressValue)
						}
					/>

					{/* {!addressPickerVisible ? (
						<>
							<Divider small />

							<View
								style={{
									paddingHorizontal: hp('1.6%'),
									// borderWidth: 1,
								}}>
								<HTMaterialTextInput
									placeholder="Address line 1"
									hasError={manualAddressLine1Validate}
									validationMessage="Please enter valid address line 1"
									onChangeText={(manualAddressLine1) => {
										setManualAddressLine1(manualAddressLine1);
										setManualAddressLine1Validate(false);
									}}
									value={manualAddressLine1}
								/>

								<Divider />

								<HTMaterialTextInput
									placeholder="Address line 2"
									// hasError={addressLine2Validate}
									// validationMessage="Please enter valid address line 2"
									onChangeText={(manualAddressLine2) => {
										setManualAddressLine2(manualAddressLine2);
										// setManualAddressLine2Validate(false);
									}}
									value={manualAddressLine2}
								/>

								<Divider />

								<HTMaterialTextInput
									placeholder="Town/city"
									hasError={manualCityValidate}
									validationMessage="Please enter valid town / city"
									onChangeText={(manualCity) => {
										setManualCity(manualCity);
										setManualCityValidate(false);
									}}
									value={manualCity}
								/>

								<Divider />

								<HTMaterialTextInput
									placeholder="County"
									hasError={manualCountryValidate}
									validationMessage="Please enter valid country"
									onChangeText={(manualCountry) => {
										setManualCountry(manualCountry);
										setManualCountryValidate(false);
									}}
									value={manualCountry}
								/>

								<Divider />

								<HTMaterialTextInput
									placeholder="Postcode"
									hasError={manualPostcodeValidate}
									validationMessage="Please enter valid postcode"
									onChangeText={(manualPostcode) => {
										setManualPostcode(manualPostcode);
										setManualPostcodeValidate(false);
										setTypedPostcode(true);
										setManualLatLonValidate(false);
									}}
									value={manualPostcode}
								/>

								{!manualPostcodeValidate && manualLatLonValidate ? (
									<>
										<Divider small />

										<TextField
											xThin
											letterSpacing={-0.1}
											isRLH
											lineHeight={1.8}
											fontFamily={GlobalTheme.fontRegular}
											color={GlobalTheme.validationColor}>
											Invalid postcode. Please try again.
										</TextField>
									</>
								) : null}

								<Divider xxMedium />

								{saveThisAddress === '1' ? (
									<HTMaterialTextInput
										placeholder="Label name (used to identify in app)"
										hasError={manualLabelNameValidate}
										validationMessage="Please enter valid label name"
										onChangeText={(manualLabelName) => {
											setManualLabelName(manualLabelName);
											setManualLabelNameValidate(false);
										}}
										value={manualLabelName}
									/>
								) : null}

								{saveThisAddress === '1' ? <Divider /> : <Divider small />}

								<View style={styles.saveThisAddressWrapperStyle}>
									<OnlyCheckBox
										onPress={(val) => setSaveThisAddress(val ? '1' : '0')}
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
										Save this address
									</TextField>
								</View>
							</View>
						</>
					) : (
						<HTMaterialPicker
							placeholder="Select trading address"
							pickerDefaultValue={tradingAddress}
							onValueChange={(
								tradingAddressValue,
								tradingAddressSelectedId,
							) => {
								setTradingAddress(tradingAddressValue);
								tradingAddressHandler(tradingAddressValue);
							}}
							value={tradingAddress}
							data={addressPickerList.length > 0 ? addressPickerList : []}
						/>
					)} */}

					<Divider />

					<TextField
						xThin
						letterSpacing={-0.07}
						lineHeight={18}
						fontFamily={GlobalTheme.fontRegular}
						color={GlobalTheme.textColor}>
						Contact Number
					</TextField>

					<Divider />

					<PhoneInput
						containerStyle={styles.phoneInputContainerStyle(phoneInputValidate)}
						textContainerStyle={styles.phoneInputTextContainerStyle}
						textInputStyle={styles.textInputTextStyle}
						codeTextStyle={styles.codeTextStyle}
						ref={phoneInput}
						defaultValue={contactNumber}
						value={contactNumber}
						defaultCode="GB"
						// keyboardType="phone-pad"
						layout="first"
						onChangeText={(contactNumber) => {
							setContactNumber(contactNumber);
							setPhoneInputValidate(false);
						}}
						onChangeFormattedText={(formattedContactNumber) => {
							setFormattedContactNumber(formattedContactNumber);
							setCountryCode(phoneInput.current?.getCountryCode() || '');
						}}
						countryPickerProps={{withAlphaFilter: true}}
						disabled={disabled}
					/>

					{phoneInputValidate ? (
						<TextField
							xThin
							fontFamily={GlobalTheme.fontRegular}
							color={GlobalTheme.validationColor}>
							{phoneInputErrorMessage}
						</TextField>
					) : null}

					<Divider />

					<TextField
						xThin
						letterSpacing={-0.07}
						lineHeight={18}
						fontFamily={GlobalTheme.fontRegular}
						color={GlobalTheme.textColor}>
						Company Registration
					</TextField>

					<HTMaterialTextInput
						placeholder="Enter Company Registration"
						validationMessage="Please enter company registration"
						onChangeText={(companyRegistration) =>
							setCompanyRegistration(companyRegistration)
						}
						value={companyRegistration}
					/>

					<Divider />

					<View style={styles.termsOfUseWrapperStyle}>
						<OnlyCheckBox
							screen="TradingAccount"
							onPress={(val) => setVATRegister(val)}
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
							VAT Registered
						</TextField>
					</View>

					<Divider />

					{vatRegister ? (
						<>
							<TextField
								xThin
								letterSpacing={-0.07}
								lineHeight={18}
								fontFamily={GlobalTheme.fontRegular}
								color={GlobalTheme.textColor}>
								VAT Number
							</TextField>

							<HTMaterialTextInput
								hasError={vatNumberValidate}
								placeholder="Enter VAT Number"
								validationMessage="Please enter vat number"
								onChangeText={(vatNumber) => {
									setVATNumber(vatNumber);
									setVATNumberValidate(false);
								}}
								value={vatNumber}
							/>
						</>
					) : null}

					<Divider xLarge />

					<Button
						blackButton
						title="SAVE BUSINESS PROFILE"
						onPress={businessProfileHandler}
					/>

					<Divider xxLarge />
					{/* </ScrollView> */}
				</KeyboardAwareScrollView>
			</>
		</GenericView>
	);
};

const styles = StyleSheet.create({
	mainView: {
		// flex: 1,              // commented while contentContainerStyle is used for stying on ScrollView and to make screen scrollable
		paddingHorizontal: 10,
		// borderWidth: 1,
		// borderColor: 'red',
	},
	businessAvatarWrapperStyle: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		// borderWidth: 1,
	},
	businessAvatarInnerLeftStyle: {
		width: '30%',
		// borderWidth: 1
	},
	shadowViewStyle: {
		width: hp('10.6%'),
		height: hp('10.6%'),
		shadowRadius: GlobalTheme.shadowRadius,
		shadowColor: GlobalTheme.black,
		shadowOpacity: 0.28,
		borderWidth: 0.1,
		borderColor: 'transparent',
		backgroundColor: GlobalTheme.primaryColor,
		borderRadius: 50,
		shadowOffset: {width: 0, height: 6},
	},
	businessProfileFlexStyle: {
		flex: 1,
	},
	avatarStyle: {
		width: hp('10.6%'),
		height: hp('10.6%'),
		borderRadius: 50,
		resizeMode: 'cover',
	},
	uploadIconWrapperStyle: {
		alignSelf: 'center',
		top: hp('1.7%'),
		// borderWidth: 1,
		// borderColor: 'blue',
	},
	businessAvatarInnerRightStyle: {
		width: '70%',
		// borderWidth: 1
	},
	phoneInputContainerStyle: (phoneInputValidate = false) => ({
		width: '100%',
		height: hp('5.0%'),
		borderBottomWidth: phoneInputValidate ? 1 : 0.5,
		borderColor: phoneInputValidate
			? GlobalTheme.validationColor
			: GlobalTheme.horizontalLineColor,
		// borderWidth: 1,
		// borderColor: 'blue',
	}),
	phoneInputTextContainerStyle: {
		paddingVertical: 0,
		// borderWidth: 1,
		// borderColor: 'red',
	},
	textInputTextStyle: {
		lineHeight: hp('2.4%'),
		fontSize: hp('2.0%'),
	},
	codeTextStyle: {
		lineHeight: hp('2.4%'),
		fontSize: hp('2.0%'),
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
		width: hp('2.8%'),
		height: hp('2.8%'),
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
	termsOfUseWrapperStyle: {
		width: wp('95%'),
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		// borderWidth: 1,
	},
	onlyCheckBoxWrapperStyle: {
		width: wp('20%'),
	},
	linkTextStyle: {
		width: wp('80%'),
		// borderWidth: 1,
	},
	// onlyCheckBoxWrapperStyle: {
	// 	width: wp('25%'),
	// },
	// linkTextStyle: {
	// 	width: wp('75%'),
	// 	// borderWidth: 1,
	// },
	// saveThisAddressWrapperStyle: {
	// 	width: wp('90%'),
	// 	flexDirection: 'row',
	// 	justifyContent: 'flex-start',
	// 	alignItems: 'center',
	// 	// borderWidth: 1,
	// },
});

export {TradingAccount};
