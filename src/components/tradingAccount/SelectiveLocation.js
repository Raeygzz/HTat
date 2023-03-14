import React, {useState, useEffect, useRef} from 'react';
import {View, StyleSheet} from 'react-native';

import {
	heightPercentageToDP as hp,
	widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {GlobalTheme} from '../theme';
import {_ENV_CONFIG} from '../../config';
import {
	Divider,
	TextField,
	OnlyCheckBox,
	HTMaterialPicker,
	HTMaterialTextInput,
} from '../common';

import {useSelector} from 'react-redux';

const SelectiveLocation = (props) => {
	const {addressPickerVisible} = props;

	const addressList = useSelector((state) => state.profile.addressList);
	const addressPickerList = useSelector(
		(state) => state.profile.addressPickerList,
	);
	const businessProfileDetails = useSelector(
		(state) => state.settings.businessProfileDetails,
	);

	// SAVED ADDRESS
	const [savedLabelName, setSavedLabelName] = useState('');
	const [savedAddressLine1, setSavedAddressLine1] = useState('');
	const [savedAddressLine2, setSavedAddressLine2] = useState('');
	const [savedCity, setSavedCity] = useState('');
	const [savedCountry, setSavedCountry] = useState('');
	// const [savedPostcode, setSavedPostcode] = useState('');
	// const [savedLatitude, setSavedLatitude] = useState('');
	// const [addressPickerVisible, setAddressPickerVisible] = useState(false);
	const [tradingAddress, setTradingAddress] = useState('');

	// MANUAL ADDRESS
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
	// const [typedPostcode, setTypedPostcode] = useState(false);
	// const [manualLatitude, setManualLatitude] = useState('');
	// const [manualLongitude, setManualLongitude] = useState('');
	const [manualLatLonValidate, setManualLatLonValidate] = useState(false);
	const [saveThisAddress, setSaveThisAddress] = useState('0');

	const addressLine2Ref = useRef();
	const cityRef = useRef();
	const countyRef = useRef();
	const postcodeRef = useRef();

	useEffect(() => {
		if (businessProfileDetails.length > 0 && addressPickerList.length > 0) {
			if (businessProfileDetails[0].is_manual_address === 0) {
				addressList.filter((obj) => {
					if (obj.post_code === businessProfileDetails[0].post_code) {
						props.savedAddressLine1(obj.address_line_1);
						props.savedAddressLine2(obj.address_line_2);
						props.savedCity(obj.city);
						props.savedCountry(obj.country);
						props.savedPostcode(obj.post_code);

						// setSavedAddressLine1(obj.address_line_1);
						// setSavedAddressLine2(obj.address_line_2);
						// setSavedCity(obj.city);
						// setSavedCountry(obj.country);
						// setSavedPostcode(obj.post_code);
					}
				});

				addressPickerList.filter((obj) => {
					if (obj.postcode === businessProfileDetails[0].post_code) {
						// props.tradingAddress(obj.value);

						setTradingAddress(obj.value);
					}
				});
			}

			if (businessProfileDetails[0].is_manual_address === 1) {
				props.manualAddressLine1(businessProfileDetails[0].address_line_1);
				props.manualAddressLine2(businessProfileDetails[0].address_line_2);
				props.manualCity(businessProfileDetails[0].city);
				props.manualCountry(businessProfileDetails[0].country);
				props.manualPostcode(businessProfileDetails[0].post_code);

				setManualAddressLine1(businessProfileDetails[0].address_line_1);
				setManualAddressLine2(businessProfileDetails[0].address_line_2);
				setManualCity(businessProfileDetails[0].city);
				setManualCountry(businessProfileDetails[0].country);
				setManualPostcode(businessProfileDetails[0].post_code);
			}
		}
	}, [businessProfileDetails, addressPickerList]);

	useEffect(() => {
		if (props.manualAddressLine1ValidateParent) {
			setManualAddressLine1Validate(props.manualAddressLine1ValidateParent);
		}

		// if (props.manualAddressLine2ValidateParent) {
		// 	setManualAddressLine2Validate(props.manualAddressLine2ValidateParent);
		// }

		if (props.manualCityValidateParent) {
			setManualCityValidate(props.manualCityValidateParent);
		}

		if (props.manualCountryValidateParent) {
			setManualCountryValidate(props.manualCountryValidateParent);
		}

		if (props.manualPostcodeValidateParent) {
			setManualPostcodeValidate(props.manualPostcodeValidateParent);
		}

		if (props.manualLatLonValidateParent) {
			setManualLatLonValidate(props.manualLatLonValidateParent);
		}

		if (props.manualLabelNameValidateParent) {
			setManualLabelNameValidate(props.manualLabelNameValidateParent);
		}
	}, [
		props.manualAddressLine1ValidateParent,
		// props.manualAddressLine2ValidateParent,
		props.manualCityValidateParent,
		props.manualCountryValidateParent,
		props.manualPostcodeValidateParent,
		props.manualLatLonValidateParent,
		props.manualLabelNameValidateParent,
	]);

	return !addressPickerVisible ? (
		<>
			<Divider small />

			<View style={styles.manualAddressWrapperStyle}>
				<HTMaterialTextInput
					placeholder="Address line 1"
					returnKeyType="next"
					hasError={manualAddressLine1Validate}
					validationMessage="Please enter valid address line 1"
					onChangeText={(manualAddressLine1) => {
						setManualAddressLine1(manualAddressLine1);
						setManualAddressLine1Validate(false);

						props.manualAddressLine1(manualAddressLine1);
						props.manualAddressLine1Validate(false);
					}}
					value={manualAddressLine1}
					onSubmitEditing={(event) => addressLine2Ref.current.focus()}
					blurOnSubmit={false}
				/>

				<Divider />

				<HTMaterialTextInput
					placeholder="Address line 2"
					// hasError={addressLine2Validate}
					// validationMessage="Please enter valid address line 2"
					returnKeyType="next"
					inputRef={addressLine2Ref}
					onChangeText={(manualAddressLine2) => {
						setManualAddressLine2(manualAddressLine2);
						// setManualAddressLine2Validate(false);

						props.manualAddressLine2(manualAddressLine2);
						// props.manualAddressLine2Validate(false);
					}}
					value={manualAddressLine2}
					onSubmitEditing={(event) => cityRef.current.focus()}
					blurOnSubmit={false}
				/>

				<Divider />

				<HTMaterialTextInput
					placeholder="Town/city"
					returnKeyType="next"
					inputRef={cityRef}
					hasError={manualCityValidate}
					validationMessage="Please enter valid town / city"
					onChangeText={(manualCity) => {
						setManualCity(manualCity);
						setManualCityValidate(false);

						props.manualCity(manualCity);
						props.manualCityValidate(false);
					}}
					value={manualCity}
					onSubmitEditing={(event) => countyRef.current.focus()}
					blurOnSubmit={false}
				/>

				<Divider />

				<HTMaterialTextInput
					placeholder="County"
					returnKeyType="next"
					inputRef={countyRef}
					hasError={manualCountryValidate}
					validationMessage="Please enter valid country"
					onChangeText={(manualCountry) => {
						setManualCountry(manualCountry);
						setManualCountryValidate(false);

						props.manualCountry(manualCountry);
						props.manualCountryValidate(false);
					}}
					value={manualCountry}
					onSubmitEditing={(event) => postcodeRef.current.focus()}
					blurOnSubmit={false}
				/>

				<Divider />

				<HTMaterialTextInput
					placeholder="Postcode"
					returnKeyType="done"
					inputRef={postcodeRef}
					hasError={manualPostcodeValidate}
					validationMessage="Please enter valid postcode"
					onChangeText={(manualPostcode) => {
						setManualPostcode(manualPostcode);
						setManualPostcodeValidate(false);
						setManualLatLonValidate(false);

						props.manualPostcode(manualPostcode);
						props.manualPostcodeValidate(false);
						props.typedPostcode(true);
						props.manualLatLonValidate(false);
					}}
					value={manualPostcode}
					onSubmitEditing={(event) =>
						console.log('selective location finally!!')
					}
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

							props.manualLabelName(manualLabelName);
							props.manualLabelNameValidate(false);
						}}
						value={manualLabelName}
					/>
				) : null}

				{saveThisAddress === '1' ? <Divider /> : <Divider small />}

				<View style={styles.saveThisAddressWrapperStyle}>
					<OnlyCheckBox
						onPress={(val) => {
							setSaveThisAddress(val ? '1' : '0');
							props.saveThisAddress(val ? '1' : '0');
						}}
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
			onValueChange={(tradingAddressValue, tradingAddressSelectedId) => {
				setTradingAddress(tradingAddressValue);

				props.tradingAddressHandler(tradingAddressValue);
			}}
			value={tradingAddress}
			data={addressPickerList.length > 0 ? addressPickerList : []}
		/>
	);
};

const styles = StyleSheet.create({
	manualAddressWrapperStyle: {
		paddingHorizontal: hp('1.6%'),
		// borderWidth: 1,
	},
	saveThisAddressWrapperStyle: {
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
});

export {SelectiveLocation};
