import React, {useState} from 'react';
import {View, Image, StyleSheet, TouchableOpacity} from 'react-native';

import ShadowView from 'react-native-simple-shadow-view';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
	heightPercentageToDP as hp,
	widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import VISA from '../../assets/image/visa.png';
import {GlobalTheme} from '../../components/theme';
import {PaymentListCheckBox} from './PaymentListCheckBox';
import MASTERCARD from '../../assets/image/mastercard.png';
import {cardLastFourDigitDisplay} from '../../utils/Utils';
import {TextField, Divider} from '../../components/common';

import {useSelector, useDispatch} from 'react-redux';
import {presentAlert} from '../../store/actions/Alert';

const cardBrand = (item) => {
	switch (item) {
		case 'visa':
			return VISA;

		case 'mastercard':
			return MASTERCARD;

		default:
			return null;
	}
};

const PaymentLists = (props) => {
	const {cardList} = props;
	// console.log('cardList ==> ', cardList);

	const addCardHtml = useSelector((state) => state.userCard.addCardHtml);

	const dispatch = useDispatch();

	const [selectedItem, setSelectedItem] = useState({});

	const addCardHandler = () => {
		if (addCardHtml !== '') {
			props.navigation.navigate('AddPaymentCard');
			//
		} else {
			let alertConfig = {
				title: 'Oops!',
				message:
					'This link has expired. This means that stripe have already received your payment information or you session has expired. Please try again.',
				navigation: props.navigation,
				shouldRunFunction: true,
				functionHandler: 'resetRoute&NavigateToSettingScreen',
			};

			dispatch(presentAlert(alertConfig));
		}
	};

	const onDefaultSelectHandler = (item) => {
		setSelectedItem(item);
		props.selectedDefaultCard(item.id);
	};

	const deleteCardHandler = (item) => {
		props.selectedDeleteCard(item.id);
	};

	const cardsList =
		cardList.length > 0 ? (
			cardList.map((item, index) => {
				return item?.cardNumber ? (
					<View key={item.id} style={styles.paymentCardWrapperStyle}>
						<ShadowView style={styles.paymentListShadowViewStyle}>
							<>
								<View style={styles.defaultTextWrapperStyle}>
									<TextField
										xThin
										right
										letterSpacing={-0.19}
										isRLH
										lineHeight={2.0}
										fontFamily={GlobalTheme.fontRegular}
										color={GlobalTheme.primaryColor}>
										{item.defaultCard ? 'Default' : ''}
									</TextField>
								</View>

								<View style={styles.makeDefaultStyle}>
									{!item.defaultCard ? (
										<View style={styles.checkBoxNDeleteFlexRowStyle}>
											<PaymentListCheckBox
												item={item}
												selectedItem={selectedItem}
												onPress={onDefaultSelectHandler.bind(this, item)}
												isRLH
												labelLineHeight={1.8}
												labelLetterSpacing={-0.07}
												labelColor={GlobalTheme.primaryColor}
												labelFontFamily={GlobalTheme.fontRegular}
												label="Make Default"
												style={styles.paymentListCheckboxStyle}
											/>

											<TouchableOpacity
												style={styles.deleteIconWrapperStyle}
												onPress={deleteCardHandler.bind(this, item)}>
												<AntDesign
													name="delete"
													size={hp('2.6%')}
													color={GlobalTheme.primaryColor}
												/>
											</TouchableOpacity>
										</View>
									) : null}
								</View>

								<TextField
									xSmall
									letterSpacing={0.6}
									isRLH
									lineHeight={2.0}
									fontFamily={GlobalTheme.fontRegular}
									color={GlobalTheme.textColor}>
									{cardLastFourDigitDisplay(item.cardNumber)}
								</TextField>

								<Divider small />

								<View style={styles.rowStyle}>
									<Image
										source={cardBrand(item.cardBrand)}
										style={styles.imageStyle}
									/>

									<TextField
										xThin
										letterSpacing={0.96}
										isRLH
										lineHeight={1.8}
										fontFamily={GlobalTheme.fontRegular}
										color={GlobalTheme.textColor}>
										{`${item.expiryMonth}/${item.expiryYear}`}
									</TextField>
								</View>
							</>
						</ShadowView>
					</View>
				) : cardList.length <= 4 ? (
					<View key={item.id} style={styles.paymentCardWrapperStyle}>
						<ShadowView style={styles.paymentListShadowViewStyle}>
							<TouchableOpacity
								style={styles.addPaymentStyle}
								onPress={addCardHandler}>
								<AntDesign
									name="pluscircle"
									size={20}
									color={GlobalTheme.primaryColor}
									style={styles.plusIconStyle}
								/>

								<TextField
									xThin
									letterSpacing={-0.07}
									isRLH
									lineHeight={1.8}
									fontFamily={GlobalTheme.fontRegular}
									color={GlobalTheme.textColor}>
									Add Card
								</TextField>
							</TouchableOpacity>
						</ShadowView>
					</View>
				) : null;
			})
		) : (
			<View style={styles.paymentCardWrapperStyle}>
				<ShadowView style={styles.paymentListShadowViewStyle}>
					<TouchableOpacity
						style={styles.addPaymentStyle}
						onPress={addCardHandler}>
						<AntDesign
							name="pluscircle"
							size={20}
							color={GlobalTheme.primaryColor}
							style={styles.plusIconStyle}
						/>

						<TextField
							xThin
							letterSpacing={-0.07}
							isRLH
							lineHeight={1.8}
							fontFamily={GlobalTheme.fontRegular}
							color={GlobalTheme.textColor}>
							Add Card
						</TextField>
					</TouchableOpacity>
				</ShadowView>
			</View>
		);

	return <View style={styles.paymentListWrapperStyle}>{cardsList}</View>;
};

const styles = StyleSheet.create({
	paymentCardWrapperStyle: {
		width: '48%',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		// borderWidth: 1,
		// borderColor: 'red',
	},
	paymentListShadowViewStyle: {
		width: '100%',
		height: hp('14.0%'),
		padding: hp('1.0%'),
		marginBottom: hp('1.0%'),
		shadowRadius: GlobalTheme.shadowRadius,
		shadowColor: GlobalTheme.black,
		shadowOpacity: 0.28,
		borderWidth: 0.1,
		borderColor: 'transparent',
		backgroundColor: GlobalTheme.white,
		borderRadius: GlobalTheme.viewRadius,
		shadowOffset: {width: 0, height: 0},
	},
	defaultTextWrapperStyle: {
		height: hp('2.0%'),
		// borderWidth: 1,
	},
	makeDefaultStyle: {
		height: hp('5.0%'),
		// borderWidth: 1,
	},
	checkBoxNDeleteFlexRowStyle: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		// borderWidth: 1,
	},
	paymentListCheckboxStyle: {
		width: '75%',
		// borderWidth: 1,
	},
	deleteIconWrapperStyle: {
		width: '25%',
		justifyContent: 'flex-start',
		alignItems: 'flex-end',
		// borderWidth: 1,
	},
	rowStyle: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		// borderWidth: 1,
	},
	imageStyle: {
		width: wp('10.5%'),
		height: hp('2.5%'),
		resizeMode: 'cover',
		// borderWidth: 1,
		// borderColor: 'blue',
	},
	addPaymentStyle: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		// borderWidth: 1,
	},
	plusIconStyle: {
		marginBottom: hp('0.6%'),
		// borderWidth: 1,
	},
	paymentListWrapperStyle: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexWrap: 'wrap',
		padding: hp('1.0%'),
		// borderWidth: 1,
	},
});

export {PaymentLists};
