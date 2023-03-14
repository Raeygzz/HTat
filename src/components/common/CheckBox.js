import React, {useState, useEffect} from 'react';
import {View, StyleSheet, TouchableWithoutFeedback} from 'react-native';

import ShadowView from 'react-native-simple-shadow-view';
import {
	heightPercentageToDP as hp,
	widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {Divider} from './Divider';
import {TextField} from './TextField';
import {GlobalTheme} from '../theme/GlobalTheme';

import {useSelector} from 'react-redux';

const CheckBox = (props) => {
	const checkBoxSelected = useSelector(
		(state) => state.profile.addressById.is_primary,
	);

	const [selected, setSelected] = useState(false);

	useEffect(() => {
		if (checkBoxSelected === 0 || checkBoxSelected === 1) {
			let selectedValue = checkBoxSelected === 1 ? true : false;
			setSelected(selectedValue);
		}
	}, [checkBoxSelected]);

	return (
		<TouchableWithoutFeedback
			onPress={() => {
				setSelected(!selected);
				props.onPress(!selected);
			}}>
			<View
				style={[
					props.style,
					styles.checkboxWrapper(
						props.withPadding,
						props.hasError,
						props.nextLabel,
					),
				]}>
				<View style={styles.checkboxWidthStyle}>
					<ShadowView style={styles.checkbox}>
						{selected ? <View style={styles.selectedStyle} /> : null}
					</ShadowView>
				</View>

				<View style={styles.textStyle(props.nextLabel)}>
					<TextField
						xThin
						letterSpacing={
							props.labelLetterSpacing ? props.labelLetterSpacing : -0.07
						}
						// lineHeight={props.labelLineHeight ? props.labelLineHeight : 14}
						isRLH
						lineHeight={props.labelLineHeight ? props.labelLineHeight : 1.4}
						color={props.labelColor ? props.labelColor : GlobalTheme.white}
						fontFamily={
							props.labelFontFamily
								? props.labelFontFamily
								: GlobalTheme.fontBold
						}
						style={styles.textFieldStyle(props.ml)}>
						{props.label ? props.label : null}
					</TextField>

					<Divider small />

					{props.nextLabel ? (
						<TextField
							xThin
							letterSpacing={-0.07}
							// lineHeight={18}
							isRLH
							lineHeight={1.8}
							fontFamily={GlobalTheme.fontRegular}
							color={GlobalTheme.textColor}
							style={styles.checkBoxSecondTextStyle}>
							{props.nextLabel}
						</TextField>
					) : null}
				</View>
			</View>
		</TouchableWithoutFeedback>
	);
};

const styles = StyleSheet.create({
	checkboxWrapper: (withPadding = false, hasError = false, nextLabel = '') => ({
		flex: 1,
		width: withPadding ? '95%' : '100%',
		// width: withPadding ? wp('85%') : wp('90%'),
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: nextLabel != '' ? null : 'center',
		padding: hasError ? 6 : null,
		borderWidth: hasError ? 1.5 : null,
		borderColor: GlobalTheme.validationColor,

		// borderWidth: 1,
		// borderColor: 'blue',
	}),
	checkboxWidthStyle: {
		width: '18%',
		// width: wp('18%'),
		// borderWidth: 1,
		// borderColor: 'magenta',
	},
	checkbox: {
		width: 28,
		height: 28,
		// width: hp('3.8%'),
		// height: hp('3.8%'),
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
		width: 22,
		height: 22,
		// width: hp('3.0%'),
		// height: hp('3.0%'),
		marginTop: 3,
		// marginTop: hp('0.3%'),
		alignSelf: 'center',
		borderRadius: GlobalTheme.viewRadius,
		backgroundColor: GlobalTheme.primaryColor,
	},
	textStyle: (nextLabel = '') => ({
		width: '82%',
		// width: wp('72%'),
		paddingTop: nextLabel != '' ? 5 : null,
		// borderWidth: 1,
		// borderColor: 'red',
	}),
	textFieldStyle: (ml) => ({
		marginLeft: ml ? 10 : null,
	}),
});

export {CheckBox};
