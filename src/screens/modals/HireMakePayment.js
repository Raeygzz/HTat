import React, {useState, useEffect} from 'react';
import {View, Modal, Image, ScrollView, StyleSheet} from 'react-native';

import ShadowView from 'react-native-simple-shadow-view';
import {useKeyboard} from '@react-native-community/hooks';
import {
	heightPercentageToDP as hp,
	widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {GlobalTheme} from '../../components/theme';
import {PaymentCardList} from '../../constants/Constant';
import {
	TextField,
	Divider,
	Button,
	CheckBox,
	HTMaterialTextInput,
	HTCustomPaymentCard,
} from '../../components/common';

import {useDispatch} from 'react-redux';
import {hideHireMakePaymentScreenModal} from '../../store/actions/Hire';

export const HireMakePayment = (props) => {
	const dispatch = useDispatch();

	const [cardNumber, setCardNumber] = useState('');
	const [cardNumberValidate, setCardNumberValidate] = useState(false);

	const [expiryDateMonth, setExpiryDateMonth] = useState('');

	const [expiryDateYear, setExpiryDateYear] = useState('');
	const [expiryDateYearValidate, setExpiryDateYearValidate] = useState(false);

	const [cvc, setCVC] = useState('');

	const [savedAddress, setSavedAddress] = useState(false);
	const [manualAddress, setManualAddress] = useState(false);
	const [checkBoxValidate, setCheckBoxValidate] = useState(false);

	const [address, setAddress] = useState('');
	const [work1, setWork1] = useState('');
	const [work2, setWork2] = useState('');

	const keyboard = useKeyboard();
	const keyboardHeight = keyboard.keyboardHeight;
	const isKeyboardShowing = keyboard.keyboardShown;

	const expiryYearValueHandler = (expiryYear) => {
		// console.log('exp ==> ', expiryYear);

		if (expiryYear !== '') {
			setExpiryDateYear(expiryYear);
			setExpiryDateYearValidate(false);
		}
	};

	const paymentCardHandler = (card) => {
		setCardNumber(card.label);
		setExpiryDateMonth(card.month);
		setCVC(card.cvc);
		setCardNumberValidate(false);
	};

	useEffect(() => {
		if (savedAddress && props.addressPickerList.length > 0) {
			setAddress(props.addressPickerList[0].value);
		} else if (!savedAddress && props.addressPickerList.length > 0) {
			setAddress('');
		}
	}, [savedAddress, manualAddress, props.addressPickerList]);

	const modalCancelHandler = () => {
		dispatch(hideHireMakePaymentScreenModal());
	};

	const payInPoundHandler = async () => {
		if (cardNumber === '') {
			setCardNumberValidate(true);
		}

		if (cardNumber !== '' && expiryDateYear === '') {
			setExpiryDateYearValidate(true);
		}

		if (!savedAddress && !manualAddress) {
			setCheckBoxValidate(true);
		}

		if (
			cardNumber != '' &&
			expiryDateYear != '' &&
			address != '' &&
			(savedAddress || manualAddress)
		) {
			let obj = {
				cardNumber: cardNumber,
				expiryDateMonth: expiryDateMonth,
				expiryDateYear: expiryDateYear,
				cvc: cvc,
				checked: savedAddress === true ? '1' : '0',
				address: address,
				work1: work1,
				work2: work2,
			};

			// console.log('obj ==> ', obj);

			dispatch(hideHireMakePaymentScreenModal());

			props.setModalOpen();
		}
	};

	return (
		<Modal
			statusBarTranslucent
			animationType="fade"
			transparent={true}
			visible={props.show}>
			<View style={styles.modal}>
				<View style={styles.shadowViewStyle(isKeyboardShowing, keyboardHeight)}>
					<View style={styles.headerStyle}>
						<TextField
							regular
							letterSpacing={-0.1}
							// lineHeight={18}
							isRLH
							lineHeight={2.1}
							fontFamily={GlobalTheme.fontRegular}
							color={GlobalTheme.white}
							style={styles.textCloseStyle}
							onPress={modalCancelHandler}>
							Cancel
						</TextField>

						<TextField
							regular
							letterSpacing={-0.1}
							// lineHeight={18}
							isRLH
							lineHeight={2.1}
							fontFamily={GlobalTheme.fontBold}
							color={GlobalTheme.white}
							style={styles.modalHeaderStyle}>
							Make Payment
						</TextField>
					</View>

					<ScrollView
						showsVerticalScrollIndicator={false}
						contentContainerStyle={styles.ph20}>
						<Divider large />

						<TextField
							xThin
							letterSpacing={-0.07}
							// lineHeight={18}
							isRLH
							lineHeight={1.8}
							fontFamily={GlobalTheme.fontRegular}
							color={GlobalTheme.textColor}>
							Enter card details
						</TextField>

						<HTCustomPaymentCard
							hasError={cardNumberValidate}
							hasErrorForExpiryError={expiryDateYearValidate}
							expiryYearValue={expiryYearValueHandler}
							data={PaymentCardList}
							paymentCardValue={paymentCardHandler}
						/>

						<Divider />

						<TextField
							xThin
							letterSpacing={-0.07}
							// lineHeight={18}
							isRLH
							lineHeight={1.8}
							fontFamily={GlobalTheme.fontRegular}
							color={GlobalTheme.textColor}>
							Billing address
						</TextField>

						<Divider medium />

						<View style={styles.checkBoxesRowStyle(checkBoxValidate)}>
							<View style={styles.checkBoxStyle}>
								<CheckBox
									ml
									onPress={(val) => {
										setSavedAddress(val);
										setCheckBoxValidate(false);
									}}
									// hasError={savedAddressValidate}
									// lineHeight={14}
									isRLH
									labelLineHeight={1.6}
									labelColor={GlobalTheme.black}
									labelFontFamily={GlobalTheme.fontSF}
									label="Saved addresses"
								/>
							</View>

							<View style={styles.checkBoxStyle}>
								<CheckBox
									ml
									onPress={(val) => {
										setManualAddress(val);
										setCheckBoxValidate(false);
									}}
									// hasError={manualAddressValidate}
									// lineHeight={14}
									isRLH
									labelLineHeight={1.6}
									labelColor={GlobalTheme.black}
									labelFontFamily={GlobalTheme.fontSF}
									label="Manual address"
								/>
							</View>
						</View>

						<Divider />

						<View style={styles.homeAddressStyle}>
							<TextField
								small
								letterSpacing={-0.09}
								isRLH
								lineHeight={1.8}
								fontFamily={GlobalTheme.fontBold}
								color={GlobalTheme.black}>
								Home
							</TextField>

							<View style={styles.homeAddressInnerStyle}>
								<TextField
									xThin
									letterSpacing={-0.07}
									isRLH
									lineHeight={1.8}
									fontFamily={GlobalTheme.fontRegular}
									color={GlobalTheme.primaryColor}>
									Primary
								</TextField>

								<Divider horizontal small />

								<Image
									source={require('../../assets/image/icon/tick.png')}
									style={styles.tickIconStyle}
								/>
							</View>
						</View>

						<HTMaterialTextInput
							placeholder="Home Address"
							// hasError={addressValidate}
							validationMessage="Please enter home address"
							onChangeText={(address) => setAddress(address)}
							value={address}
						/>

						<Divider medium />

						<HTMaterialTextInput
							placeholder="Work 1"
							// hasError={work1Validate}
							validationMessage="Please enter work 1"
							onChangeText={(work1) => setWork1(work1)}
							value={work1}
						/>

						<Divider medium />

						<HTMaterialTextInput
							placeholder="Work 2"
							// hasError={work2Validate}
							validationMessage="Please enter work 2"
							onChangeText={(work2) => setWork2(work2)}
							value={work2}
						/>

						<Divider xLarge />

						<Button
							title={`PAY £${props.totalHireCost}`}
							blackButton
							onPress={payInPoundHandler}
						/>

						<Divider />
						<Divider xxxHuge />
					</ScrollView>
				</View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modal: {
		flex: 1,
		// borderWidth: 1,
		// borderColor: 'green',
		// backgroundColor: GlobalTheme.white,
	},
	shadowViewStyle: (isKeyboardShowing, keyboardHeight) => ({
		width: '90%',
		height: '55%',
		shadowRadius: GlobalTheme.shadowRadius,
		shadowColor: GlobalTheme.black,
		shadowOpacity: 0.28,
		borderWidth: 0.1,
		borderColor: 'transparent',
		position: 'absolute',
		bottom: !isKeyboardShowing ? 0 : keyboardHeight,
		alignSelf: 'center',
		backgroundColor: GlobalTheme.white,
		borderRadius: GlobalTheme.viewRadius,
		shadowOffset: {width: 0, height: 6},
		elevation: 44,
		// borderWidth: 1,
		// borderColor: 'blue',
	}),
	headerStyle: {
		width: '100%',
		height: 49,
		backgroundColor: GlobalTheme.primaryColor,
		borderTopLeftRadius: GlobalTheme.viewRadius,
		borderTopRightRadius: GlobalTheme.viewRadius,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	textCloseStyle: {
		width: '40%',
		paddingLeft: 20,
		// borderWidth: 1,
		// borderColor: '#fff',
	},
	modalHeaderStyle: {
		width: '60%',
		// borderWidth: 1,
	},
	ph20: {
		paddingHorizontal: 20,
	},
	checkBoxesRowStyle: (checkBoxValidate = false) => ({
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderWidth: checkBoxValidate ? 1 : null,
		borderColor: checkBoxValidate ? GlobalTheme.validationColor : null,
		padding: checkBoxValidate ? 10 : null,
	}),
	checkBoxStyle: {
		width: '45%',
		// borderWidth: 1,
		// borderColor: 'green',
	},
	homeAddressStyle: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	homeAddressInnerStyle: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	tickIconStyle: {
		width: hp('1.4%'),
		height: hp('1.4%'),
		// borderWidth: 1,
		// borderColor: 'blue',
	},
});
