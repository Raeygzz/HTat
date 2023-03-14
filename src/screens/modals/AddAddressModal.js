import React, {useState, useEffect, useRef} from 'react';
import {
	View,
	Modal,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	ActivityIndicator,
} from 'react-native';

import Icon from 'react-native-vector-icons/AntDesign';
import ShadowView from 'react-native-simple-shadow-view';
import {useKeyboard} from '@react-native-community/hooks';
import {
	heightPercentageToDP as hp,
	widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {IOS} from '../../helper';
import {getObjectLength} from '../../utils';
import {formBody} from '../../utils/FormBody';
import {GlobalTheme} from '../../components/theme';
// import {findLatLong} from '../../services/axios/Api';
import {findAddressFromPostcode} from '../../services/axios/Api';
import {
	TextField,
	Divider,
	Button,
	CheckBox,
	HTMaterialTextInput,
} from '../../components/common';
import {
	LabelSchema,
	Address1Schema,
	Address2Schema,
	CitySchema,
	CountrySchema,
	PostcodeSchema,
} from '../../models/validations/AddAddress';

import {useSelector, useDispatch} from 'react-redux';
import {
	createAddressApi,
	hideAddressScreenModal,
	addressByIdApi,
	updateAddressApi,
	deleteAddressApi,
	addressResponseMessage,
} from '../../store/actions/Profile';

const AddAddressModal = (props) => {
	const addressById = useSelector((state) => state.profile.addressById);
	const addAddressSuccess = useSelector(
		(state) => state.profile.addressAddSuccess,
	);
	const addressDeleteApiResponseMessage = useSelector(
		(state) => state.profile.addressResponseMessage,
	);
	const modalLoader = useSelector(
		(state) => state.modalLoader.presentModalLoader,
	);

	const dispatch = useDispatch();

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

	const [checkBox, setCheckBox] = useState(false);
	const [checkBoxValidate, setCheckBoxValidate] = useState(false);

	const keyboard = useKeyboard();
	const keyboardHeight = keyboard.keyboardHeight;
	const isKeyboardShowing = keyboard.keyboardShown;

	const address1Ref = useRef();
	const address2Ref = useRef();
	const townRef = useRef();
	const countryRef = useRef();
	const postcodeRef = useRef();

	useEffect(() => {
		if (props.showAddressModal) {
			if (props.addressId != '') {
				if (IOS) {
					setTimeout(() => {
						dispatch(addressByIdApi(props.addressId, '', false, true));
					}, 300);
				} else {
					dispatch(addressByIdApi(props.addressId, '', false, true));
				}
			}
		}
	}, [props.showAddressModal]);

	useEffect(() => {
		if (getObjectLength(addressById) !== 0) {
			setLabelName(addressById.name);
			setAddressLine1(addressById.address_line_1);
			setAddressLine2(addressById.address_line_2);
			setCity(addressById.city);
			setCountry(addressById.country);
			setPostcode(addressById.post_code);
			setLatitude(addressById.latitude);
			setLongitude(addressById.longitude);
			let checkBoxSelected = addressById.is_primary === 1 ? true : false;
			setCheckBox(checkBoxSelected);
		}
	}, [addressById]);

	const closeModalHandler = () => {
		dispatch(hideAddressScreenModal());
		dispatch(addressResponseMessage());
	};

	const addressDeleteHandler = () => {
		dispatch(deleteAddressApi(props.addressId, '', false, true));
	};

	useEffect(() => {
		if (postcodeTyped) {
			setPostcodeTyped(false);
			if (postcode.length >= 6 && postcode.length < 9) {
				// findLatLong(postcode)
				findAddressFromPostcode(postcode)
					.then((response) => {
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
			if (props.addressId != '') {
				let obj = {
					_method: 'PUT',
					name: labelName,
					address_line_1: addressLine1,
					address_line_2: addressLine2,
					address_line_3: '',
					city: city,
					country: country,
					post_code: postcode,
					latitude: latitude,
					longitude: longitude,
					is_primary: checkBox ? '1' : '0',
				};

				dispatch(updateAddressApi(obj, props.addressId, '', false, true));
			} else {
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
					is_primary: checkBox ? '1' : '0',
				};

				if (props.addressListLength < 2) {
					dispatch(createAddressApi(obj, '', true, true));
				} else {
					dispatch(createAddressApi(obj, '', false, true));
				}
			}
		}
	};

	useEffect(() => {
		if (addAddressSuccess) {
			setLabelName('');
			// setLabelNameValidate(false);
			setAddressLine1('');
			// setAddressLine1Validate(false);
			setAddressLine2('');
			// setAddressLine2Validate(false);
			setCity('');
			// setCityValidate(false);
			setCountry('');
			// setCountryValidate(false);
			setPostcode('');
			// setPostcodeValidate(false);
			setLatitude('');
			setLongitude('');
			// setLatLonValidate(false);
			setCheckBox(false);
			// setCheckBoxValidate(false);
		}
	}, [addAddressSuccess]);

	return (
		<Modal
			statusBarTranslucent
			animationType="fade"
			transparent={true}
			visible={props.showAddressModal}>
			<View style={styles.modal}>
				<View style={styles.shadowViewStyle(isKeyboardShowing, keyboardHeight)}>
					<View style={styles.headerStyle}>
						<TextField
							regular
							letterSpacing={-0.1}
							// lineHeight={18}
							isRLH
							lineHeight={2.0}
							fontFamily={GlobalTheme.fontRegular}
							color={GlobalTheme.white}
							style={styles.textCloseStyle}
							onPress={closeModalHandler}>
							Close
						</TextField>

						<TextField
							center
							regular
							letterSpacing={-0.1}
							// lineHeight={18}
							isRLH
							lineHeight={2.1}
							fontFamily={GlobalTheme.fontBold}
							color={GlobalTheme.white}
							style={styles.headerTextStyle}>
							Add Address
						</TextField>

						<TouchableOpacity onPress={addressDeleteHandler}>
							<Icon
								style={styles.deleteIconStyle}
								name="delete"
								size={hp('2.6%')}
								color={GlobalTheme.white}
							/>
						</TouchableOpacity>
					</View>

					<ScrollView
						showsVerticalScrollIndicator={false}
						contentContainerStyle={styles.ph21}>
						<Divider xLarge />

						{addressDeleteApiResponseMessage != '' ? (
							<>
								<TextField
									center
									xThin
									letterSpacing={-0.1}
									isRLH
									lineHeight={1.8}
									fontFamily={GlobalTheme.fontRegular}
									color={GlobalTheme.validationColor}>
									{addressDeleteApiResponseMessage}
								</TextField>

								<Divider />
							</>
						) : null}

						<HTMaterialTextInput
							placeholder="Label name (used to identify in app)"
							returnKeyType="next"
							hasError={labelNameValidate}
							validationMessage="Please enter valid label name"
							onChangeText={(labelName) => setLabelName(labelName)}
							value={labelName}
							onSubmitEditing={(event) => address1Ref.current.focus()}
							blurOnSubmit={false}
						/>

						<Divider />

						<HTMaterialTextInput
							placeholder="Address line 1"
							returnKeyType="next"
							inputRef={address1Ref}
							hasError={addressLine1Validate}
							validationMessage="Please enter valid address line 1"
							onChangeText={(addressLine1) => setAddressLine1(addressLine1)}
							value={addressLine1}
							onSubmitEditing={(event) => address2Ref.current.focus()}
							blurOnSubmit={false}
						/>

						<Divider />

						<HTMaterialTextInput
							placeholder="Address line 2"
							returnKeyType="next"
							inputRef={address2Ref}
							// hasError={addressLine2Validate}
							// validationMessage="Please enter valid address line 2"
							onChangeText={(addressLine2) => setAddressLine2(addressLine2)}
							value={addressLine2}
							onSubmitEditing={(event) => townRef.current.focus()}
							blurOnSubmit={false}
						/>

						<Divider />

						<HTMaterialTextInput
							placeholder="Town/city"
							returnKeyType="next"
							inputRef={townRef}
							hasError={cityValidate}
							validationMessage="Please enter valid town / city"
							onChangeText={(city) => setCity(city)}
							value={city}
							onSubmitEditing={(event) => countryRef.current.focus()}
							blurOnSubmit={false}
						/>

						<Divider />

						<HTMaterialTextInput
							placeholder="County"
							returnKeyType="next"
							inputRef={countryRef}
							hasError={countryValidate}
							validationMessage="Please enter valid country"
							onChangeText={(country) => setCountry(country)}
							value={country}
							onSubmitEditing={(event) => postcodeRef.current.focus()}
							blurOnSubmit={false}
						/>

						<Divider />

						<HTMaterialTextInput
							placeholder="Postcode"
							returnKeyType="done"
							inputRef={postcodeRef}
							hasError={postcodeValidate}
							validationMessage="Please enter valid postcode"
							onChangeText={(postcode) => {
								setPostcode(postcode);
								setPostcodeTyped(true);
								setLatLonValidate(false);
							}}
							value={postcode}
							onSubmitEditing={(event) => console.log('add address finally!!')}
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

						<Divider />

						<CheckBox
							onPress={(val) => {
								setCheckBox(val);
								// setCheckBoxValidate(false);
							}}
							// hasError={checkBoxValidate}
							labelColor={GlobalTheme.primaryColor}
							labelFontFamily={GlobalTheme.fontRegular}
							// labelLineHeight={18}
							labelLineHeight={1.8}
							label="Make this address primary?"
							nextLabel="If marked primary, Hire That app will use this address by default
							for searches, hiring & delivery."
						/>

						<Divider />

						<Button
							title="ADD ADDRESS"
							blackButton
							onPress={addAddressHandler}
						/>

						<Divider />
					</ScrollView>
				</View>

				<Modal animationType="fade" transparent={true} visible={modalLoader}>
					<View style={styles.searchFilterLoaderModalStyle}>
						<ActivityIndicator
							animating={true}
							size="large"
							color={GlobalTheme.black}
						/>
					</View>
				</Modal>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modal: {
		flex: 1,
		// borderWidth: 1,
		// borderColor: 'green',
	},
	shadowViewStyle: (isKeyboardShowing, keyboardHeight) => ({
		width: wp('90%'),
		height: hp('66%'),
		shadowRadius: GlobalTheme.shadowRadius,
		shadowColor: GlobalTheme.black,
		shadowOpacity: 0.28,
		borderWidth: 0.1,
		position: 'absolute',
		bottom: !isKeyboardShowing ? 0 : keyboardHeight,
		alignSelf: 'center',
		borderColor: 'transparent',
		backgroundColor: GlobalTheme.white,
		borderRadius: GlobalTheme.viewRadius,
		shadowOffset: {width: 0, height: 6},
		elevation: 44,
		// borderWidth: 1,
		// borderColor: 'blue',
	}),
	headerStyle: {
		width: wp('90%'),
		height: hp('6.3%'),
		backgroundColor: GlobalTheme.primaryColor,
		borderTopLeftRadius: GlobalTheme.viewRadius,
		borderTopRightRadius: GlobalTheme.viewRadius,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		// borderWidth: 1,
	},
	textCloseStyle: {
		width: wp('20%'),
		paddingLeft: hp('2.6%'),
		// borderWidth: 1,
		// borderColor: '#fff',
	},
	headerTextStyle: {
		width: wp('60%'),
		// borderWidth: 1,
	},
	deleteIconStyle: {
		width: wp('10%'),
		// borderWidth: 1,
	},
	ph21: {
		paddingHorizontal: hp('2.7%'),
	},
	searchFilterLoaderModalStyle: {
		width: wp('90%'),
		height: hp('66%'),
		justifyContent: 'center',
		backgroundColor: 'rgba(0,0,0,0.04)',
		borderRadius: GlobalTheme.viewRadius,
		position: 'absolute',
		bottom: 0,
		alignSelf: 'center',
		// borderWidth: 1,
	},
});

export {AddAddressModal};
