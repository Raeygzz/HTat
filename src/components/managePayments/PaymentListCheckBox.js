import React, {useState} from 'react';
import {View, StyleSheet, TouchableWithoutFeedback} from 'react-native';

import ShadowView from 'react-native-simple-shadow-view';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

import {TextField} from '../common';
import {GlobalTheme} from '../theme/GlobalTheme';

const PaymentListCheckBox = (props) => {
	const {
		onPress,
		item,
		selectedItem,
		labelLetterSpacing,
		labelLineHeight,
		labelColor,
		labelFontFamily,
		label,
		style,
	} = props;

	const [selected, setSelected] = useState(false);

	return (
		<TouchableWithoutFeedback
			onPress={() => {
				onPress();
				setSelected(!selected);
			}}>
			<View style={[style, styles.checkboxWrapper]}>
				<View style={styles.checkboxWidthStyle}>
					<ShadowView style={styles.checkbox}>
						{selectedItem.id === item.id ? (
							<View style={styles.selectedStyle} />
						) : null}
					</ShadowView>
				</View>

				<View style={styles.textStyle}>
					<TextField
						thin
						letterSpacing={labelLetterSpacing ? labelLetterSpacing : -0.07}
						isRLH
						lineHeight={labelLineHeight ? labelLineHeight : 1.8}
						color={labelColor ? labelColor : GlobalTheme.white}
						fontFamily={
							labelFontFamily ? labelFontFamily : GlobalTheme.fontRegular
						}
						style={styles.textFieldStyle}>
						{label ? label : null}
					</TextField>
				</View>
			</View>
		</TouchableWithoutFeedback>
	);
};

const styles = StyleSheet.create({
	checkboxWrapper: {
		flex: 1,
		width: '90%',
		height: hp('4.8%'),
		flexDirection: 'row',
		justifyContent: 'flex-start',
		borderColor: GlobalTheme.validationColor,
		paddingLeft: hp('1.0%'),
		// borderWidth: 1,
		// borderColor: 'blue',
	},
	checkboxWidthStyle: {
		width: '18%',
		// borderWidth: 1,
		// borderColor: 'magenta',
	},
	checkbox: {
		width: hp('2.8%'),
		height: hp('2.8%'),
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
		width: hp('2.3%'),
		height: hp('2.3%'),
		marginTop: hp('0.2%'),
		alignSelf: 'center',
		borderRadius: GlobalTheme.viewRadius,
		backgroundColor: GlobalTheme.primaryColor,
	},
	textStyle: {
		width: '75%',
		// borderWidth: 1,
		// borderColor: 'red',
	},
	textFieldStyle: {
		marginLeft: hp('1.0%'),
		marginTop: '5.0%',
	},
});

export {PaymentListCheckBox};
