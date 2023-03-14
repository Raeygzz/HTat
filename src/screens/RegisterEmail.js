import React, {useState, useEffect, useRef} from 'react';
import {View, Image, ScrollView, StyleSheet} from 'react-native';

import analytics from '@react-native-firebase/analytics';
import {useKeyboard} from '@react-native-community/hooks';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
	heightPercentageToDP as hp,
	widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {formBody} from '../utils';
import Logo from '../assets/image/logo.png';
import {GlobalTheme} from '../components/theme';
import {
	FullNameSchema,
	EmailSchema,
	PasswordSchema,
	ConfirmPasswordSchema,
} from '../models/validations/RegisterEmail';
import {
	Button,
	Divider,
	TextField,
	GenericView,
	HTTextInput,
	OnlyCheckBox,
	ParsedLinkText,
	ErrorCard,
} from '../components/common';

import {useSelector, useDispatch} from 'react-redux';
import {setError} from '../store/actions/Error';
import {presentAlert} from '../store/actions/Alert';
import {registerEmailApi} from '../store/actions/RegisterEmail';

const RegisterEmail = (props) => {
	const showError = useSelector((state) => state.error.showError);
	const errorMessage = useSelector((state) => state.error.message);

	const [fullName, setFullName] = useState('');
	const [fullNameValidate, setFullNameValidate] = useState(false);
	const [email, setEmail] = useState('');
	const [emailValidate, setEmailValidate] = useState(false);
	const [password, setPassword] = useState('');
	const [passwordValidate, setPasswordValidate] = useState(false);
	const [confirmPassword, setConfirmPassword] = useState('');
	const [confirmPasswordValidate, setConfirmPasswordValidate] = useState(false);
	const [checkBox, setCheckBox] = useState(false);
	const [checkBoxValidate, setCheckBoxValidate] = useState(false);

	const dispatch = useDispatch();

	const keyboard = useKeyboard();
	const isKeyboardShowing = keyboard.keyboardShown;

	const emailRef = useRef();
	const passwordRef = useRef();
	const confirmPasswordRef = useRef();

	const termsOfUseHandler = () => {
		props.navigation.navigate('TermsPolicies', {
			terms: {
				title: 'Terms of Use',
				link: 'https://hirethat.com/terms-of-use/',
			},
		});
	};

	const privacyPolicyHandler = () => {
		props.navigation.navigate('TermsPolicies', {
			terms: {
				title: 'Privacy policy',
				link: 'https://hirethat.com/privacy-policy/',
			},
		});
	};

	const firstNameFromFullName = (fullName) => {
		let firstName = fullName
			.split(' ')
			.map((item) => item.trim())
			.filter((obj) => obj != '')[0];

		return firstName;
	};

	const lastNameFromFullName = (fullName) => {
		let lastName = fullName
			.split(' ')
			.map((item) => item.trim())
			.filter((obj) => obj != '')[1];

		return lastName;
	};

	const registerEmailHandler = async () => {
		const validFullName = await FullNameSchema.isValid({fullName: fullName});
		validFullName ? setFullNameValidate(false) : setFullNameValidate(true);

		const validEmail = await EmailSchema.isValid({email: email});
		validEmail ? setEmailValidate(false) : setEmailValidate(true);

		const validPassword = await PasswordSchema.isValid({password: password});
		validPassword ? setPasswordValidate(false) : setPasswordValidate(true);

		const validConfirmPassword = await ConfirmPasswordSchema.isValid({
			confirmPassword: confirmPassword,
		});
		validConfirmPassword
			? setConfirmPasswordValidate(false)
			: setConfirmPasswordValidate(true);

		if (!validPassword || !validConfirmPassword) {
			let alertConfig = {
				title: 'Oops!',
				message:
					'Password must contain one capital letter, one small letter, one special character, one number and must be between 8 to 16 characters.',
			};

			dispatch(presentAlert(alertConfig));
		}

		if (!checkBox) {
			setCheckBoxValidate(true);
			return;
		}

		if (
			validFullName &&
			validEmail &&
			validPassword &&
			validConfirmPassword &&
			!checkBoxValidate
		) {
			if (password === confirmPassword) {
				let obj = {
					first_name: firstNameFromFullName(fullName) || '_',
					last_name: lastNameFromFullName(fullName) || '_',
					email: email,
					password: password,
					password_confirmation: confirmPassword,
					accepted_terms_and_conditions: checkBox ? '1' : '0',
				};

				dispatch(
					registerEmailApi(
						formBody(obj),
						// props.navigation
					),
				);
			} else {
				setPasswordValidate(true);
				setConfirmPasswordValidate(true);

				let alertConfig = {
					title: 'Oops!',
					message: 'Passwords do not match.',
				};

				dispatch(presentAlert(alertConfig));

				analytics().logEvent('register_through_email_passwords_not_match');
			}
		}
	};

	useEffect(() => {
		if (showError) {
			let errorConfig = {
				message: '',
				showError: false,
			};

			setTimeout(() => {
				dispatch(setError(errorConfig));
			}, 3000);
		}
	}, [showError]);

	return (
		<GenericView showBackButton>
			<KeyboardAwareScrollView
				extraHeight={hp(20.0)}
				keyboardShouldPersistTaps="handled">
				{/* <ScrollView showsVerticalScrollIndicator={false}> */}
				<View style={styles.mainView}>
					{showError && !isKeyboardShowing ? (
						<>
							<ErrorCard iconName="exclamation" title={errorMessage} />

							<Divider xLarge />
						</>
					) : null}

					<Image style={styles.logo} source={Logo} />

					<TextField
						center
						regular
						lineHeight={22}
						fontFamily={GlobalTheme.fontBold}
						color={GlobalTheme.black}>
						REGISTER WITH EMAIL
					</TextField>

					<Divider large />

					<HTTextInput
						placeholder="Enter full name"
						iconName="text"
						value={fullName}
						returnKeyType="next"
						hasError={fullNameValidate}
						onChangeText={(fullName) => {
							setFullName(fullName);
							setFullNameValidate(false);
						}}
						onSubmitEditing={(event) => emailRef.current.focus()}
						blurOnSubmit={false}
					/>

					<Divider large />

					<HTTextInput
						placeholder="Enter email address"
						iconName="mail"
						value={email}
						returnKeyType="next"
						inputRef={emailRef}
						hasError={emailValidate}
						onChangeText={(email) => {
							setEmail(email);
							setEmailValidate(false);
						}}
						onSubmitEditing={(event) => passwordRef.current.focus()}
						blurOnSubmit={false}
					/>

					<Divider large />

					<HTTextInput
						secureTextEntry
						placeholder="Enter password"
						iconName="eye"
						value={password}
						returnKeyType="next"
						inputRef={passwordRef}
						hasError={passwordValidate}
						onChangeText={(password) => {
							setPassword(password);
							setPasswordValidate(false);
						}}
						onSubmitEditing={(event) => confirmPasswordRef.current.focus()}
						blurOnSubmit={false}
					/>

					<Divider large />

					<HTTextInput
						secureTextEntry
						placeholder="Confirm password"
						iconName="eye"
						value={confirmPassword}
						returnKeyType="done"
						inputRef={confirmPasswordRef}
						hasError={confirmPasswordValidate}
						onChangeText={(confirmPassword) => {
							setConfirmPassword(confirmPassword);
							setConfirmPasswordValidate(false);
						}}
						onSubmitEditing={(event) => console.log('register email finally!!')}
					/>

					<Divider xxMedium />

					<TextField
						// center
						xThin
						isRLH
						lineHeight={1.8}
						fontFamily={GlobalTheme.fontRegular}
						color={GlobalTheme.black}>
						(Include at least one capital letter, one lowercase letter, one
						special character, one number. Must be between 8 and 16 characters.)
					</TextField>

					<Divider xLarge />

					<View style={styles.termsOfUseWrapperStyle(checkBoxValidate)}>
						<OnlyCheckBox
							onPress={(val) => {
								setCheckBox(val);
								setCheckBoxValidate(false);
							}}
							style={styles.onlyCheckBoxWrapperStyle}
						/>

						<TextField
							xThin
							isRLH
							lineHeight={1.9}
							letterSpacing={-0.13}
							color={GlobalTheme.white}
							fontFamily={GlobalTheme.fontBold}
							style={styles.linkTextStyle}>
							{`By creating an account and using Hire That you agree to our`}
							<ParsedLinkText
								onPress={termsOfUseHandler}
								style={styles.linkTopStyle}>
								{` `}Terms of Use{` `}
							</ParsedLinkText>
							{`and`}
							<ParsedLinkText
								onPress={privacyPolicyHandler}
								style={styles.linkTopStyle}>
								{` `}Privacy Policy
							</ParsedLinkText>
							{`.`}
						</TextField>
					</View>

					<Divider xLarge />

					<Button
						// buttonWidth={268}
						title="REGISTER"
						onPress={registerEmailHandler}
					/>
				</View>
				{/* </ScrollView> */}
			</KeyboardAwareScrollView>
		</GenericView>
	);
};

const styles = StyleSheet.create({
	mainView: {
		flex: 1,
		// padding: 54,
		padding: hp('5.4%'),
		// borderWidth: 1,
		justifyContent: 'center',
		// alignItems: 'center',
	},
	logo: {
		width: wp('39.5%'),
		height: hp('16.0%'),
		// height: hp('19.5%'),
		alignSelf: 'center',
		resizeMode: 'contain',
		// borderWidth: 1,
	},
	termsOfUseWrapperStyle: (checkBoxValidate = false) => ({
		width: wp('78%'),
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		borderWidth: checkBoxValidate ? 1 : null,
		borderColor: checkBoxValidate ? GlobalTheme.validationColor : null,
		padding: checkBoxValidate ? hp('0.4%') : null,
	}),
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

export {RegisterEmail};
