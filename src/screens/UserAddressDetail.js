import React, {useState, useEffect, useRef} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';

import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {IOS} from '../helper';
import {GlobalTheme} from '../components/theme';
// import {findLatLong} from '../services/axios/Api';
import {findAddressFromPostcode} from '../services/axios/Api';
import {
	TextField,
	Divider,
	Button,
	HTMaterialTextInput,
} from '../components/common';
import {
	LabelSchema,
	Address1Schema,
	Address2Schema,
	CitySchema,
	CountrySchema,
	PostcodeSchema,
} from '../models/validations/AddAddress';

import {useSelector, useDispatch} from 'react-redux';
import {showUserOnboarding} from '../store/actions/Auth';
import {userOnboardingAddressApi} from '../store/actions/Profile';

const UserAddressDetail = (props) => {
	const hasPrimaryCard = useSelector(
		(state) => state.auth.user.has_primary_card,
	);
	const showUserOnboardingScreen = useSelector(
		(state) => state.auth.showUserOnboardingScreen,
	);

	const [labelName, setLabelName] = useState('');
	const [labelNameValidate, setLabelNameValidate] = useState(false);

	const [addressLine1, setAddressLine1] = useState('');
	const [addressLine1Validate, setAddressLine1Validate] = useState(false);

	const [addressLine2, setAddressLine2] = useState('');
	// const [addressLine2Validate, setAddressLine2Validate] = useState(false);

	const [city, setCity] = useState('');
	const [cityValidate, setCityValidate] = useState(false);

	const [country, setCountry] = useState('');
	const [countryValidate, setCountryValidate] = useState(false);

	const [postcodeTyped, setPostcodeTyped] = useState(false);

	const [postcode, setPostcode] = useState('');
	const [postcodeValidate, setPostcodeValidate] = useState(false);

	const [latitude, setLatitude] = useState('');
	const [longitude, setLongitude] = useState('');
	const [latLonValidate, setLatLonValidate] = useState(false);

	const dispatch = useDispatch();

	const oAdd1Ref = useRef();
	const oAdd2Ref = useRef();
	const oCityRef = useRef();
	const oCountryRef = useRef();
	const oPostcodeRef = useRef();

	useEffect(() => {
		if (postcodeTyped) {
			setPostcodeTyped(false);
			if (postcode.length >= 6 && postcode.length < 9) {
				// findLatLong(postcode)
				findAddressFromPostcode(postcode)
					.then((response) => {
						if (response?.status === 200) {
							// if (response.data.status === 200 && response.data.result != null) {
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
	}, [postcodeTyped]);

	const addAddressHandler = async () => {
		const validLabelName = await LabelSchema.isValid({labelName: labelName});
		validLabelName ? setLabelNameValidate(false) : setLabelNameValidate(true);

		const validAddressLine1 = await Address1Schema.isValid({
			addressLine1: addressLine1,
		});
		validAddressLine1
			? setAddressLine1Validate(false)
			: setAddressLine1Validate(true);

		// const validAddressLine2 = await Address2Schema.isValid({
		// 	addressLine2: addressLine2,
		// });
		// validAddressLine2
		// 	? setAddressLine2Validate(false)
		// 	: setAddressLine2Validate(true);

		const validCity = await CitySchema.isValid({city: city});
		validCity ? setCityValidate(false) : setCityValidate(true);

		const validCountry = await CountrySchema.isValid({country: country});
		validCountry ? setCountryValidate(false) : setCountryValidate(true);

		const validPostcode = await PostcodeSchema.isValid({postcode: postcode});
		validPostcode ? setPostcodeValidate(false) : setPostcodeValidate(true);

		if (latitude == '' && longitude == '') {
			setLatLonValidate(true);
		}

		if (
			validLabelName &&
			validAddressLine1 &&
			// validAddressLine2 &&
			validCity &&
			validCountry &&
			validPostcode &&
			latitude != '' &&
			longitude != ''
		) {
			let obj = {
				name: labelName,
				address_line_1: addressLine1,
				address_line_2: addressLine2,
				address_line_3: '',
				city: city,
				country: country,
				post_code: postcode,
				latitude: latitude,
				longitude: longitude,
				// is_primary: '1',
			};

			// console.log('create address obj ==> ', obj);
			dispatch(userOnboardingAddressApi(obj, props.navigation, false, false));
		}
	};

	const skipForNowHandler = () => {
		dispatch(showUserOnboarding(false));

		// if (hasPrimaryCard !== 1) {
		// 	dispatch(showUserOnboarding(false));
		// 	setTimeout(() => {
		// 		props.navigation.navigate('ManagePayments');
		// 	}, 0);
		// 	//
		// } else {
		// 	if (!showUserOnboardingScreen) {
		// 		props.navigation.goBack();
		// 	} else {
		// 		dispatch(showUserOnboarding(false));
		// 	}
		// }
	};

	return (
		<View style={styles.userAddressDetailWrapperStyle}>
			<View style={styles.headerStyle}>
				<TextField
					medium
					center
					letterSpacing={-0.1}
					isRLH
					lineHeight={2.4}
					fontFamily={GlobalTheme.fontBold}
					color={GlobalTheme.white}
					style={styles.modalHeaderStyle}>
					Add User Address Detail
				</TextField>
			</View>

			<KeyboardAwareScrollView
				extraHeight={hp(20.0)}
				keyboardShouldPersistTaps="handled"
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.ph21}>
				<Divider xxLarge />

				<HTMaterialTextInput
					placeholder="Label name (used to identify in app)"
					returnKeyType="next"
					hasError={labelNameValidate}
					validationMessage="Please enter valid label name"
					onChangeText={(labelName) => {
						setLabelName(labelName);
						setLabelNameValidate(false);
					}}
					value={labelName}
					onSubmitEditing={(event) => oAdd1Ref.current.focus()}
					blurOnSubmit={false}
				/>

				<Divider />

				<HTMaterialTextInput
					placeholder="Address line 1"
					returnKeyType="next"
					inputRef={oAdd1Ref}
					hasError={addressLine1Validate}
					validationMessage="Please enter valid address line 1"
					onChangeText={(addressLine1) => {
						setAddressLine1(addressLine1);
						setAddressLine1Validate(false);
					}}
					value={addressLine1}
					onSubmitEditing={(event) => oAdd2Ref.current.focus()}
					blurOnSubmit={false}
				/>

				<Divider />

				<HTMaterialTextInput
					placeholder="Address line 2"
					returnKeyType="next"
					inputRef={oAdd2Ref}
					// hasError={addressLine2Validate}
					// validationMessage="Please enter valid address line 2"
					onChangeText={(addressLine2) => {
						setAddressLine2(addressLine2);
						// setAddressLine2Validate(false);
					}}
					value={addressLine2}
					onSubmitEditing={(event) => oCityRef.current.focus()}
					blurOnSubmit={false}
				/>

				<Divider />

				<HTMaterialTextInput
					placeholder="Town/city"
					returnKeyType="next"
					inputRef={oCityRef}
					hasError={cityValidate}
					validationMessage="Please enter valid town / city"
					onChangeText={(city) => {
						setCity(city);
						setCityValidate(false);
					}}
					value={city}
					onSubmitEditing={(event) => oCountryRef.current.focus()}
					blurOnSubmit={false}
				/>

				<Divider />

				<HTMaterialTextInput
					placeholder="County"
					returnKeyType="next"
					inputRef={oCountryRef}
					hasError={countryValidate}
					validationMessage="Please enter valid country"
					onChangeText={(country) => {
						setCountry(country);
						setCountryValidate(false);
					}}
					value={country}
					onSubmitEditing={(event) => oPostcodeRef.current.focus()}
					blurOnSubmit={false}
				/>

				<Divider />

				<HTMaterialTextInput
					placeholder="Postcode"
					returnKeyType="done"
					inputRef={oPostcodeRef}
					hasError={postcodeValidate}
					validationMessage="Please enter valid postcode"
					onChangeText={(postcode) => {
						setPostcode(postcode);
						setPostcodeTyped(true);
						setLatLonValidate(false);
						setPostcodeValidate(false);
					}}
					value={postcode}
					onSubmitEditing={(event) =>
						console.log('onboarding add user address details finally!!')
					}
				/>

				{!postcodeValidate && latLonValidate ? (
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

				<Divider xxxHuge />

				<Button title="ADD ADDRESS" blackButton onPress={addAddressHandler} />

				<Divider large />
				<TouchableOpacity onPress={skipForNowHandler}>
					<TextField
						regular
						right
						isRLH
						lineHeight={2.1}
						fontFamily={GlobalTheme.fontRegular}
						color={GlobalTheme.black}>
						{`Skip for now >>`}
					</TextField>
				</TouchableOpacity>

				<Divider xxLarge />

				<TextField
					xThin
					isRLH
					lineHeight={2.1}
					fontFamily={GlobalTheme.fontRegular}
					color={GlobalTheme.horizontalLineColor}>
					By saving your address detail, you allow HIRE THAT LTD to use your
					address for future addresses in accordance with their terms.
				</TextField>

				<Divider />

				<View style={styles.poweredByStyle}>
					<TextField
						xThin
						isRLH
						lineHeight={2.4}
						fontFamily={GlobalTheme.fontRegular}
						color={GlobalTheme.horizontalLineColor}>
						Powered by
					</TextField>

					<Divider horizontal small />

					<TextField
						small
						isRLH
						lineHeight={1.9}
						fontFamily={GlobalTheme.fontBold}
						color={GlobalTheme.primaryColor}>
						Hire That
					</TextField>
				</View>
			</KeyboardAwareScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	userAddressDetailWrapperStyle: {
		flex: 1,
		backgroundColor: GlobalTheme.white,
		// borderWidth: 2,
		// borderColor: 'blue',
	},
	headerStyle: {
		width: '100%',
		height: hp('10%'), // added & commented on 19 aug
		// height: IOS ? hp('7.4%') : hp('10%'),
		backgroundColor: GlobalTheme.primaryColor,
		justifyContent: 'center',
		alignItems: 'center',
		// borderWidth: 2,
		// borderColor: 'blue',
	},
	modalHeaderStyle: {
		width: '100%',
		top: hp('2.4%'), // added & commented on 19 aug
		// top: IOS ? hp('1.4%') : hp('2.4%'),
		// borderWidth: 1,
	},
	ph21: {
		paddingHorizontal: hp('2.1%'),
	},
	poweredByStyle: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		// borderWidth: 1,
	},
});

export {UserAddressDetail};
