import React, {useState} from 'react';
import {View, Modal, StyleSheet} from 'react-native';

import {useFocusEffect} from '@react-navigation/native';
import {
	heightPercentageToDP as hp,
	widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {IOS} from '../../helper';
import {GlobalTheme} from '../../components/theme';
import {TermsPoliciesView} from '../../components/termsPolicies/TermsPoliciesView';
import {
	Divider,
	TextField,
	OnlyCheckBox,
	ParsedLinkText,
} from '../../components/common';

import {useDispatch} from 'react-redux';
import {hideSocialMediaTermsPolicies} from '../../store/actions/RegisterEmail';

const SocialMediaTermsPolicies = (props) => {
	const {showTermsAndConditionModal = false} = props;

	const [title, setTitle] = useState('Terms of use');
	const [link, setLink] = useState('https://hirethat.com/terms-of-use/');

	const dispatch = useDispatch();

	useFocusEffect(
		React.useCallback(() => {
			if (showTermsAndConditionModal) {
				setTitle('Terms of use');
				setLink('https://hirethat.com/terms-of-use/');
			}
		}, [showTermsAndConditionModal]),
	);

	const closeModalHandler = () => {
		dispatch(hideSocialMediaTermsPolicies());
	};

	const termsOfUseHandler = () => {
		setTitle('Terms of use');
		setLink('https://hirethat.com/terms-of-use/');
	};

	const privacyPolicyHandler = () => {
		setTitle('Privacy policy');
		setLink('https://hirethat.com/privacy-policy/');
	};

	const onCheckBoxPressed = (val) => {
		props.selectedValue(val);
		dispatch(hideSocialMediaTermsPolicies());
	};

	return (
		<Modal
			statusBarTranslucent
			animationType="fade"
			transparent={true}
			visible={props.showTermsAndConditionModal}>
			<View style={styles.modal}>
				<View style={styles.headerStyle}>
					<TextField
						regular
						letterSpacing={-0.1}
						isRLH
						lineHeight={2.0}
						fontFamily={GlobalTheme.fontRegular}
						color={GlobalTheme.white}
						style={styles.textCloseStyle}
						onPress={closeModalHandler}>
						Close
					</TextField>

					<TextField
						regular
						letterSpacing={-0.1}
						isRLH
						lineHeight={2.1}
						fontFamily={GlobalTheme.fontBold}
						color={GlobalTheme.white}
						style={styles.headerTextStyle}>
						{title}
					</TextField>
				</View>

				<View style={styles.flx6Style}>
					<TermsPoliciesView link={link} />
				</View>

				<View style={styles.flx1Style}>
					<Divider small />

					<View style={styles.horizontalLineStyle} />

					<Divider xxMedium />

					<View style={styles.termsOfUseWrapperStyle}>
						<OnlyCheckBox
							onPress={(val) => onCheckBoxPressed(val)}
							style={styles.onlyCheckBoxWrapperStyle}
						/>

						<TextField
							xThin
							isRLH
							lineHeight={1.9}
							letterSpacing={-0.13}
							color={GlobalTheme.black}
							fontFamily={GlobalTheme.fontBold}
							style={styles.linkTextStyle}>
							{`By creating an account and using Hire That you agree to our`}
							<ParsedLinkText
								color={GlobalTheme.primaryColor}
								onPress={termsOfUseHandler}
								style={styles.linkTopStyle}>
								{` `}Terms of Use{` `}
							</ParsedLinkText>
							{`and`}
							<ParsedLinkText
								color={GlobalTheme.primaryColor}
								onPress={privacyPolicyHandler}
								style={styles.linkTopStyle}>
								{` `}Privacy Policy
							</ParsedLinkText>
							{`.`}
						</TextField>
					</View>
				</View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modal: {
		flex: 1,
		// borderWidth: 2,
		// borderColor: 'blue',
		backgroundColor: GlobalTheme.white,
	},
	headerStyle: {
		width: '100%',
		height: IOS ? hp('10.0%') : hp('12.0%'),
		backgroundColor: GlobalTheme.primaryColor,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		// borderWidth: 1,
	},
	textCloseStyle: {
		width: '32%',
		top: IOS ? hp('2.6%') : hp('3.2%'),
		paddingLeft: hp('2.6%'),
		// borderWidth: 1,
	},
	headerTextStyle: {
		width: '68%',
		top: IOS ? hp('2.6%') : hp('3.2%'),
		// borderWidth: 1,
	},
	flx6Style: {
		flex: 6,
		width: '100%',
		// borderWidth: 2,
		// borderColor: 'green',
	},
	flx1Style: {
		flex: 1,
		width: '100%',
		alignItems: 'center',
		// borderWidth: 2,
		// borderColor: 'blue',
	},
	horizontalLineStyle: {
		width: '100%',
		borderWidth: 0.5,
		borderColor: GlobalTheme.horizontalLineColor,
	},
	termsOfUseWrapperStyle: {
		width: wp('78%'),
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	onlyCheckBoxWrapperStyle: {
		width: wp('12%'),
	},
	linkTextStyle: {
		width: wp('66%'),
		// borderWidth: 1
	},
	linkTopStyle: {
		top: hp('0.6%'),
		// borderWidth: 1,
	},
});

export {SocialMediaTermsPolicies};
