import React, {useState} from 'react';
import {View, TextInput, TouchableOpacity, StyleSheet} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import FoundationIcons from 'react-native-vector-icons/Foundation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
	heightPercentageToDP as hp,
	widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {TextField} from './TextField';
import {GlobalTheme} from '../theme/GlobalTheme';

const HTMaterialTextInput = (props) => {
	const [text, setText] = useState('');

	const {
		iconName = null,
		iconLibrary = 'Ionicons',
		iconColor = GlobalTheme.black,
		position = 'right',
		validationMessage = null,
		locationPermissionStatus,
		inputRef = null,
		blurOnSubmit = true,
		onSubmitEditing = null,
	} = props;

	return (
		<View style={props.style}>
			<View style={styles.textInputContentStyle}>
				{iconName !== null && position === 'left' ? (
					iconLibrary === 'Ionicons' ? (
						<Icon
							name={iconName}
							size={hp('1.8%')}
							color={iconColor ? iconColor : GlobalTheme.black}
							style={styles.leftIconStyle(position)}
						/>
					) : iconLibrary === 'MaterialIcons' ? (
						<MaterialIcons
							name={iconName}
							size={hp('1.8%')}
							color={GlobalTheme.black}
							style={styles.leftIconStyle(position)}
						/>
					) : (
						<FoundationIcons
							name={iconName}
							size={hp('1.8%')}
							color={GlobalTheme.black}
							style={styles.leftIconStyle(position)}
						/>
					)
				) : null}

				<TextInput
					style={styles.textInputStyle(
						props.iconName,
						props.position,
						props.multiline,
						props.textAlignVertical,
						props.hasError,
						props.editable,
					)}
					autoCorrect={false}
					autoCapitalize="none"
					placeholder={props.placeholder ? props.placeholder : ''}
					maxLength={props.maxLength ? props.maLength : null}
					keyboardType={props.KeyboardType ? props.KeyboardType : 'default'}
					returnKeyType={props.returnKeyType ? props.returnKeyType : 'done'}
					secureTextEntry={props.secureTextEntry ? true : false}
					autoFocus={props.autoFocus ? true : false}
					selectionColor={GlobalTheme.black}
					placeholderTextColor={GlobalTheme.textColor}
					ref={inputRef} // updated on 21 july 2021
					blurOnSubmit={blurOnSubmit}
					onSubmitEditing={onSubmitEditing}
					editable={props.editable ? false : true}
					multiline={props.multiline ? true : false}
					numberOfLines={props.multiline ? 4 : null}
					value={props.value !== '' ? props.value : null}
					onChangeText={(text) => {
						setText(text);
						props.onChangeText(text);
					}}
				/>

				{iconName !== null && position === 'right' ? (
					iconLibrary === 'Ionicons' ? (
						<Icon
							name={iconName}
							size={hp('1.8%')}
							color={GlobalTheme.primaryColor}
							style={styles.rightIconStyle(position)}
						/>
					) : iconLibrary === 'MaterialIcons' ? (
						<TouchableOpacity
							style={styles.rightIconStyle(position)}
							onPress={locationPermissionStatus}>
							<MaterialIcons
								name={iconName}
								size={hp('1.8%')}
								color={GlobalTheme.primaryColor}
							/>
						</TouchableOpacity>
					) : (
						<FoundationIcons
							name={iconName}
							size={hp('1.8%')}
							color={GlobalTheme.primaryColor}
							style={styles.rightIconStyle(position)}
						/>
					)
				) : null}
			</View>
			{props.hasError ? (
				<TextField
					thin
					letterSpacing={-0.07}
					// lineHeight={18}
					isRLH
					lineHeight={1.8}
					fontFamily={GlobalTheme.fontRegular}
					color={GlobalTheme.validationColor}>
					{validationMessage}
				</TextField>
			) : null}
		</View>
	);
};

const styles = StyleSheet.create({
	textInputContentStyle: {
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		alignItems: 'center',
		// borderWidth: 1,
	},
	textInputStyle: (
		iconName = null,
		position = 'right',
		multiline = false,
		textAlignVertical = false,
		hasError = false,
		editable = false,
	) => ({
		// width: 230,
		width: '100%',
		// fontSize: 14,
		paddingVertical: 0,
		fontSize: hp('2.0%'),
		letterSpacing: -0.07,
		// lineHeight: 18,
		// lineHeight: hp('1.8%'),
		paddingLeft: iconName && position === 'left' ? 20 : null,
		paddingRight: iconName && position === 'right' ? 30 : null,
		// height: multiline ? 68 : 34,
		height: multiline ? hp('8.8%') : hp('4.4%'),
		color: GlobalTheme.black,
		paddingTop: multiline ? hp(1.0) : null,
		backgroundColor: GlobalTheme.white,
		fontFamily: GlobalTheme.fontRegular,
		textAlignVertical: textAlignVertical ? 'top' : 'center',
		// borderWidth: 1,
		borderBottomWidth: hasError ? 1 : 0.5,
		borderColor: hasError
			? GlobalTheme.validationColor
			: GlobalTheme.horizontalLineColor,
		backgroundColor: editable ? GlobalTheme.textColor : GlobalTheme.white,
	}),
	leftIconStyle: (position) => ({
		position: 'absolute',
		left: position === 'left' ? 0 : null,
		zIndex: 4, // iOS only
		elevation: 4, // android only
	}),
	rightIconStyle: (position) => ({
		position: 'absolute',
		right: position === 'right' ? 0 : null,
	}),
});

export {HTMaterialTextInput};
