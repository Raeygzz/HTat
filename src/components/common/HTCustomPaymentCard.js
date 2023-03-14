import React, {useState} from 'react';
import {View, FlatList, StyleSheet, TouchableOpacity} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import {
	heightPercentageToDP as hp,
	widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {Divider} from './Divider';
import {TextField} from './TextField';
import {GlobalTheme} from '../theme/GlobalTheme';
import {ExpiryYear} from '../../constants/Constant';

const HTCustomPaymentCard = (props) => {
	const [showCardFlatList, setShowCardFlatList] = useState(false);
	const [expiryYearFlatList, setExpiryYearFlatList] = useState(false);
	const [cardNumber, setCardNumber] = useState('');
	const [expiryMonth, setExpiryMonth] = useState('');
	const [expiryYear, setExpiryYear] = useState('');
	const [cvc, setCVC] = useState('');

	const selectedItemHandler = (item) => {
		setCardNumber(item.label);
		setExpiryMonth(item.month);
		setCVC(item.cvc);
		props.paymentCardValue(item);
		setShowCardFlatList(false);
	};

	const expiryYearSelectedItemHandler = (exp) => {
		setExpiryYear(exp.value);
		props.expiryYearValue(exp.value);
		setExpiryYearFlatList(false);
	};

	const renderItem = ({item}) => (
		<>
			<TouchableOpacity
				style={styles.textFieldStyle}
				onPress={selectedItemHandler.bind(this, item)}>
				<TextField
					regular
					lineHeight={26}
					fontFamily={GlobalTheme.fontMedium}
					color={GlobalTheme.white}>
					{item.label}
				</TextField>
			</TouchableOpacity>

			<View style={styles.borderBottomLineStyle} />
		</>
	);

	const expiryYearRenderItem = ({item}) => (
		<>
			<TouchableOpacity
				style={styles.expiryYearTextFieldStyle}
				onPress={expiryYearSelectedItemHandler.bind(this, item)}>
				<TextField
					center
					regular
					lineHeight={26}
					fontFamily={GlobalTheme.fontMedium}
					color={GlobalTheme.white}>
					{item.label}
				</TextField>
			</TouchableOpacity>

			<View style={styles.expiryYearBorderBottomLineStyle} />
		</>
	);

	return (
		<>
			<TouchableOpacity
				style={styles.mainView(props.hasError)}
				onPress={() => {
					setShowCardFlatList(true);
				}}>
				<Divider xxMedium />

				<View style={styles.cardNumberStyle}>
					<TextField
						small
						letterSpacing={-0.07}
						fontFamily={GlobalTheme.fontRegular}
						color={GlobalTheme.black}>
						{cardNumber != '' ? cardNumber : 'Card Number'}
					</TextField>
				</View>

				<View style={styles.expiryMonthStyle}>
					<TextField
						center
						small
						letterSpacing={-0.07}
						fontFamily={GlobalTheme.fontRegular}
						color={GlobalTheme.black}>
						{expiryMonth != '' ? expiryMonth : 'MM'}
					</TextField>
				</View>

				<View style={styles.seperatorStyle}>
					<TextField
						center
						regular
						fontFamily={GlobalTheme.fontRegular}
						color={GlobalTheme.black}>
						/
					</TextField>
				</View>

				<TouchableOpacity
					onPress={() => setExpiryYearFlatList(true)}
					style={styles.expiryYearStyle(props.hasErrorForExpiryError)}>
					<TextField
						center
						small
						letterSpacing={-0.07}
						fontFamily={GlobalTheme.fontRegular}
						color={GlobalTheme.black}>
						{expiryYear != '' ? expiryYear : 'YY'}
					</TextField>
				</TouchableOpacity>

				<View style={styles.cvcStyle}>
					<TextField
						center
						small
						letterSpacing={-0.07}
						fontFamily={GlobalTheme.fontRegular}
						color={GlobalTheme.black}>
						{cvc != '' ? cvc : 'CVC'}
					</TextField>
				</View>

				<Icon
					name="chevron-down-circle-outline"
					size={hp('1.8%')}
					color={GlobalTheme.primaryColor}
					style={styles.pickerIconStyle}
				/>
			</TouchableOpacity>

			{showCardFlatList ? (
				<View style={styles.flatListViewStyle}>
					<FlatList
						nestedScrollEnabled
						ListHeaderComponent={<Divider large />}
						ListFooterComponent={<Divider medium />}
						showsVerticalScrollIndicator={false}
						data={props.data}
						renderItem={renderItem}
						keyExtractor={(item) => item.id}
					/>
				</View>
			) : null}

			{expiryYearFlatList ? (
				<View style={styles.expiryYearFlatListViewStyle}>
					<FlatList
						nestedScrollEnabled
						ListHeaderComponent={<Divider large />}
						ListFooterComponent={<Divider medium />}
						showsVerticalScrollIndicator={false}
						data={ExpiryYear}
						renderItem={expiryYearRenderItem}
						keyExtractor={(item) => item.id}
					/>
				</View>
			) : null}
		</>
	);
};

const styles = StyleSheet.create({
	textFieldStyle: {
		marginVertical: 1,
		paddingLeft: 15,
	},
	borderBottomLineStyle: {
		marginHorizontal: 15,
		color: GlobalTheme.white,
		borderTopWidth: 0.5,
		borderColor: GlobalTheme.white,
	},
	mainView: (hasError = false) => ({
		width: '100%',
		height: hp('4.4%'),
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		zIndex: 2000,
		borderBottomWidth: hasError ? 1 : 0.5,
		borderColor: hasError
			? GlobalTheme.validationColor
			: GlobalTheme.horizontalLineColor,
		// borderWidth: 1,
	}),
	cardNumberStyle: {
		width: '58%',
		// borderWidth: 1,
	},
	expiryMonthStyle: {
		width: '10%',
		// borderWidth: 1,
	},
	seperatorStyle: {
		width: '4%',
		justifyContent: 'center',
		alignItems: 'center',
		// borderWidth: 1,
	},
	expiryYearStyle: (hasErrorForExpiryError = false) => ({
		width: '10%',
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		borderBottomWidth: hasErrorForExpiryError ? 1 : null,
		borderColor: hasErrorForExpiryError ? GlobalTheme.validationColor : null,
		// borderWidth: 1,
	}),
	cvcStyle: {
		width: '12%',
		// borderWidth: 1,
	},
	pickerIconStyle: {
		position: 'absolute',
		top: hp('1.0%'),
		right: hp('0.2%'),
		backgroundColor: GlobalTheme.white,
		// borderWidth: 1,
	},
	flatListViewStyle: {
		// flex: 1,
		width: '100%',
		height: hp('15.5%'),
		alignSelf: 'center',
		backgroundColor: 'rgba(0,0,0,0.75)',
		position: 'absolute',
		top: '15%',
		zIndex: 1000,
		borderLeftWidth: 0.5,
		borderRightWidth: 0.5,
		borderBottomWidth: 0.5,
		borderColor: GlobalTheme.horizontalLineColor,
	},
	expiryYearTextFieldStyle: {
		marginVertical: 1,
	},
	expiryYearBorderBottomLineStyle: {
		borderTopWidth: 1,
		borderColor: GlobalTheme.white,
	},
	expiryYearFlatListViewStyle: {
		// flex: 1,
		width: '10%',
		height: hp('25.5%'),
		alignSelf: 'flex-end',
		backgroundColor: 'rgba(0,0,0,0.75)',
		position: 'absolute',
		top: '15%',
		right: '25%',
		zIndex: 1000,
	},
});

export {HTCustomPaymentCard};
