import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import ShadowView from 'react-native-simple-shadow-view';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {Divider} from '../common/Divider';
import {TextField} from '../common/TextField';
import {GlobalTheme} from '../theme/GlobalTheme';

import {useSelector, useDispatch} from 'react-redux';
import {backButtonWelcomScreenAnimation} from '../../store/actions/Animations';

// Back Button
export const BackButton = ({title = null}) => {
	const animationValidate = useSelector(
		(state) => state.animate.animationValidate,
	);

	const navigation = useNavigation();
	const dispatch = useDispatch();

	const backButtonHandler = () => {
		navigation.goBack();

		if (animationValidate) {
			dispatch(backButtonWelcomScreenAnimation(true));
		}
	};

	return (
		<TouchableOpacity
			style={styles.backButtonStyle}
			onPress={backButtonHandler}>
			<View style={styles.backButtonContentStyle}>
				<Ionicons name="chevron-back" size={24} color={GlobalTheme.black} />
				<TextField xMedium lineHeight={44} fontFamily={GlobalTheme.fontBold}>
					{title ? title : 'Back'}
				</TextField>
			</View>
		</TouchableOpacity>
	);
};

// Button
export const Button = ({
	title = 'Button',
	iconName = null,
	iconLibrary = null,
	blackButton = false,
	redButton = false,
	primaryButton = false,
	buttonWidth = null,
	onPress,
	disabled = false,
	style,
}) => {
	return (
		<TouchableOpacity style={style} disabled={disabled} onPress={onPress}>
			<ShadowView
				style={styles.shadowView(
					buttonWidth,
					blackButton,
					redButton,
					primaryButton,
					disabled,
				)}>
				<View style={styles.buttonContent}>
					{iconName !== null ? (
						<>
							{iconLibrary === 'fontAwesome5' ? (
								<Icon
									name={iconName}
									size={16}
									color={
										disabled || blackButton || redButton
											? GlobalTheme.white
											: GlobalTheme.black
									}
									style={styles.buttonIconStyle}
								/>
							) : (
								<Ionicons
									name={iconName}
									size={16}
									color={
										disabled || blackButton || redButton
											? GlobalTheme.white
											: GlobalTheme.black
									}
									style={styles.buttonIconStyle}
								/>
							)}

							<Divider horizontal small />
						</>
					) : null}

					<TextField
						center
						regular
						// lineHeight={22}
						isRLH
						lineHeight={2.4}
						color={
							disabled || blackButton || redButton
								? GlobalTheme.white
								: GlobalTheme.black
						}
						fontFamily={GlobalTheme.fontBold}>
						{title}
					</TextField>
				</View>
			</ShadowView>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	backButtonStyle: {
		height: 60,
		paddingLeft: 20,
		paddingTop: 20,
	},
	backButtonContentStyle: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	shadowView: (
		buttonWidth = '100%',
		blackButton,
		redButton,
		primaryButton,
		disabled = false,
	) => ({
		width: buttonWidth ? buttonWidth : '100%',
		height: hp(GlobalTheme.buttonHeight),
		// height: GlobalTheme.buttonHeight,
		shadowRadius: GlobalTheme.shadowRadius,
		// shadowColor: GlobalTheme.shadowColor,
		shadowColor: GlobalTheme.black,
		shadowOpacity: 0.28,
		borderWidth: 0.1,
		alignSelf: 'center',
		justifyContent: 'center',
		borderColor: 'transparent',
		backgroundColor: blackButton
			? GlobalTheme.black
			: redButton
			? GlobalTheme.buttonRedColor
			: primaryButton
			? GlobalTheme.primaryColor
			: disabled
			? GlobalTheme.textColor
			: GlobalTheme.white,
		borderRadius: GlobalTheme.viewRadius,
		shadowOffset: {width: 0, height: 6},
	}),
	buttonContent: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	buttonIconStyle: {
		bottom: hp(0.3),
	},
});
