import React from 'react';
import {View, TextInput, TouchableOpacity, StyleSheet} from 'react-native';

import DeleteIcon from 'react-native-vector-icons/FontAwesome5';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

import {GlobalTheme} from '../theme';

const CCEmailTextInput = ({
	id = null,
	value = '',
	inputHandler,
	setCCInvalidEmailsNum,
	setCCEmailsValidate,
	deleteHandler,
}) => {
	// console.log('CCEmailTextInput ==> ', id, value);

	return (
		<View style={styles.additionalCCInputWrapper}>
			<TextInput
				autoCorrect={false}
				autoCapitalize="none"
				placeholder="Enter cc email"
				value={value}
				onChangeText={(text) => {
					inputHandler(text, id);
					setCCInvalidEmailsNum(0);
					setCCEmailsValidate(false);
				}}
				style={styles.ccEmailTextInputStyle}
			/>

			<TouchableOpacity
				style={styles.ccEmailInputDeleteIconWrapperStyle}
				onPress={() => deleteHandler(id)}>
				<DeleteIcon
					name="trash"
					size={hp(2.0)}
					color={GlobalTheme.validationColor}
				/>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	additionalCCInputWrapper: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	ccEmailTextInputStyle: {
		width: '90%',
		height: hp('4.4%'),
		paddingVertical: 0,
		fontSize: hp('2.0%'),
		letterSpacing: -0.07,
		// lineHeight: 18,
		// lineHeight: hp('1.8%'),
		color: GlobalTheme.black,
		fontFamily: GlobalTheme.fontRegular,
		backgroundColor: GlobalTheme.white,
		// borderWidth: 1,
	},
	ccEmailInputDeleteIconWrapperStyle: {
		width: '10%',
		height: hp('4.4%'),
		justifyContent: 'center',
		alignItems: 'center',
		// borderWidth: 1,
	},
});

export {CCEmailTextInput};
