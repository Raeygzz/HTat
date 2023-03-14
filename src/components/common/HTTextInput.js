import React, {useState} from 'react';
import {
	View,
	TextInput,
	StyleSheet,
	Keyboard,
	TouchableOpacity,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import ShadowView from 'react-native-simple-shadow-view';
import FoundationIcons from 'react-native-vector-icons/Foundation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
	heightPercentageToDP as hp,
	widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {IOS} from '../../helper';
import {GlobalTheme} from '../theme/GlobalTheme';

const HTTextInput = (props) => {
	const [text, setText] = useState('');
	const [passVisible, setPassVisible] = useState(false);

	const {
		iconName = null,
		iconLibrary = 'Ionicons',
		position = 'right',
		inputRef = null,
		blurOnSubmit = true,
		onSubmitEditing = null,
	} = props;

	return (
		<ShadowView
			style={styles.shadowViewStyle(
				props.textInputWidth,
				props.hasError,
				props.multiline,
			)}>
			{/* <View style={styles.textInputContentStyle}> */}
			{iconName !== null && position === 'left' ? (
				iconLibrary === 'Ionicons' ? (
					<Icon
						name={iconName}
						size={hp('1.8%')}
						// color={GlobalTheme.black}
						color={props.hasError ? GlobalTheme.white : GlobalTheme.black}
						style={styles.leftIconStyle(position)}
					/>
				) : iconLibrary === 'MaterialIcons' ? (
					<MaterialIcons
						name={iconName}
						size={hp('1.8%')}
						// color={GlobalTheme.black}
						color={props.hasError ? GlobalTheme.white : GlobalTheme.black}
						style={styles.leftIconStyle(position)}
					/>
				) : (
					<FoundationIcons
						name={iconName}
						size={hp('1.8%')}
						// color={GlobalTheme.black}
						color={props.hasError ? GlobalTheme.white : GlobalTheme.black}
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
				)}
				autoCorrect={false}
				autoCapitalize="none"
				placeholder={props.placeholder ? props.placeholder : ''}
				keyboardType={props.KeyboardType ? props.KeyboardType : 'default'}
				returnKeyType={props.returnKeyType ? props.returnKeyType : 'done'}
				secureTextEntry={props.secureTextEntry && !passVisible ? true : false}
				ref={inputRef} // added on 20 july 2021
				autoFocus={props.autoFocus ? true : false}
				selectionColor={GlobalTheme.black}
				// placeholderTextColor={GlobalTheme.placeholderColor}
				placeholderTextColor={
					props.hasError ? GlobalTheme.white : GlobalTheme.placeholderColor
				}
				// blurOnSubmit={IOS ? false : null} // ios (commented on 20 july 2021)
				blurOnSubmit={blurOnSubmit}
				// onSubmitEditing={IOS ? () => Keyboard.dismiss() : null} // ios (commented on 20 july 2021)
				onSubmitEditing={onSubmitEditing} // uncommented on 20 july 2021
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
					<TouchableOpacity
						style={styles.rightIconStyle(position)}
						onPress={() => setPassVisible(!passVisible)}>
						<Icon
							name={iconName}
							size={15}
							// color={GlobalTheme.primaryColor}
							color={
								props.hasError ? GlobalTheme.white : GlobalTheme.primaryColor
							}
						/>
					</TouchableOpacity>
				) : iconLibrary === 'MaterialIcons' ? (
					<TouchableOpacity
						style={styles.rightIconStyle(position)}
						onPress={props.locationPermissionStatus}>
						<MaterialIcons
							name={iconName}
							size={15}
							// color={GlobalTheme.primaryColor}
							color={
								props.hasError ? GlobalTheme.white : GlobalTheme.primaryColor
							}
						/>
					</TouchableOpacity>
				) : (
					<FoundationIcons
						name={iconName}
						size={15}
						// color={GlobalTheme.primaryColor}
						color={
							props.hasError ? GlobalTheme.white : GlobalTheme.primaryColor
						}
						style={styles.rightIconStyle(position)}
					/>
				)
			) : null}
			{/* </View> */}
		</ShadowView>
	);
};

const styles = StyleSheet.create({
	shadowViewStyle: (
		textInputWidth = '100%',
		hasError = false,
		multiline = false,
	) => ({
		width: textInputWidth ? textInputWidth : '100%',
		// height: multiline ? 130 : 40,
		height: multiline ? 130 : hp('5.2%'),
		shadowRadius: GlobalTheme.shadowRadius,
		// shadowRadius: hasError ? null : GlobalTheme.shadowRadius,
		shadowColor: GlobalTheme.black,
		shadowOpacity: 0.28,
		borderWidth: 0.1,
		// borderWidth: hasError ? 1.5 : 0.1,
		borderRadius: GlobalTheme.viewRadius,
		alignSelf: 'center',
		justifyContent: 'center',
		borderColor: 'transparent',
		// borderColor: hasError ? GlobalTheme.validationColor : 'transparent',
		backgroundColor: hasError ? GlobalTheme.validationColor : GlobalTheme.white,
		shadowOffset: {width: 0, height: 0},
	}),
	// textInputContentStyle: {
	// 	flexDirection: 'row',
	// 	justifyContent: 'space-evenly',
	// 	alignItems: 'center',
	// },
	textInputStyle: (
		iconName = null,
		position = 'right',
		multiline = false,
		textAlignVertical = false,
		hasError = false,
	) => ({
		width: '100%',
		paddingVertical: 0,
		fontSize: hp('2.0%'),
		letterSpacing: -0.07,
		// lineHeight: 20,
		lineHeight: hp('2.3%'),
		borderRadius: 5,
		paddingLeft: iconName && position === 'left' ? 30 : 15,
		paddingRight: iconName && position === 'right' ? 30 : null,
		// height: multiline ? 127 : 40,
		height: multiline ? 127 : hp('5.2%'),
		color: hasError ? GlobalTheme.white : GlobalTheme.placeholderColor,
		paddingTop: multiline ? 20 : null,
		backgroundColor: hasError ? GlobalTheme.validationColor : GlobalTheme.white,
		fontFamily: GlobalTheme.fontRegular,
		textAlignVertical: textAlignVertical ? 'top' : 'center',
		// borderWidth: 1,
	}),
	leftIconStyle: (position) => ({
		position: 'absolute',
		left: position === 'left' ? 10 : null,
		zIndex: 9, // ios only
		elevation: 4, // android only
	}),
	rightIconStyle: (position) => ({
		position: 'absolute',
		right: position === 'right' ? 10 : null,
	}),
});

export {HTTextInput};
