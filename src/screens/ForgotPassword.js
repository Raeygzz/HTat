import React, {useState, useEffect} from 'react';
import {Image, StyleSheet} from 'react-native';

import {useKeyboard} from '@react-native-community/hooks';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
	heightPercentageToDP as hp,
	widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import Logo from '../assets/image/logo.png';
import {GlobalTheme} from '../components/theme';
import {EmailSchema} from '../models/validations/Login';
import {
	Button,
	Divider,
	TextField,
	GenericView,
	HTTextInput,
	ErrorCard,
	SuccessCard,
} from '../components/common';

import {useSelector, useDispatch} from 'react-redux';
import {setError} from '../store/actions/Error';
import {setSuccess} from '../store/actions/Success';
import {forgotPasswordApi} from '../store/actions/Login';

const ForgotPassword = (props) => {
	const showError = useSelector((state) => state.error.showError);
	const errorMessage = useSelector((state) => state.error.message);

	const showSuccess = useSelector((state) => state.success.showSuccess);
	const successMessage = useSelector((state) => state.success.message);

	const [email, setEmail] = useState('');
	const [emailValidate, setEmailValidate] = useState(false);

	const dispatch = useDispatch();

	const keyboard = useKeyboard();
	const isKeyboardShowing = keyboard.keyboardShown;

	const forgotPasswordHandler = async () => {
		const validEmail = await EmailSchema.isValid({email: email});
		validEmail ? setEmailValidate(false) : setEmailValidate(true);

		if (validEmail) {
			let obj = {
				email: email,
			};

			dispatch(forgotPasswordApi(obj));
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

		if (showSuccess) {
			let successConfig = {
				message: '',
				showSuccess: false,
			};

			setTimeout(() => {
				dispatch(setSuccess(successConfig));
				props.navigation.navigate('Login');
			}, 2800);
		}
	}, [showError, showSuccess]);

	return (
		<GenericView showBackButton>
			<KeyboardAwareScrollView
				extraHeight={hp(20.0)}
				keyboardShouldPersistTaps="handled"
				contentContainerStyle={styles.mainView}>
				{showSuccess && !isKeyboardShowing ? (
					<>
						<SuccessCard iconName="check" title={successMessage} />

						<Divider xLarge />
					</>
				) : null}

				{showError && !isKeyboardShowing ? (
					<>
						<ErrorCard iconName="exclamation" title={errorMessage} />

						<Divider xLarge />
					</>
				) : null}

				<Image style={styles.logo} source={Logo} />

				{!isKeyboardShowing ? (
					<>
						<TextField
							center
							regular
							isRLH
							lineHeight={2.2}
							fontFamily={GlobalTheme.fontBold}
							color={GlobalTheme.black}>
							FORGOT PASSWORD
						</TextField>

						<Divider xxxHuge />
					</>
				) : null}

				<Divider xxLarge />

				<TextField
					center
					small
					isRLH
					lineHeight={1.8}
					fontFamily={GlobalTheme.fontBold}
					color={GlobalTheme.black}
					style={styles.forgotPasswordSentenceStyle}>
					Enter the email you registered with to receive a password reset email
				</TextField>

				<Divider />

				<HTTextInput
					placeholder="Enter email address"
					iconName="mail"
					value={email}
					hasError={emailValidate}
					onChangeText={(email) => {
						setEmail(email);
						setEmailValidate(false);
					}}
				/>

				<Divider xLarge />

				<Button title="RESET PASSWORD" onPress={forgotPasswordHandler} />

				<Divider xxLarge />
			</KeyboardAwareScrollView>
		</GenericView>
	);
};

const styles = StyleSheet.create({
	mainView: {
		flex: 1,
		// paddingHorizontal: 54,
		paddingHorizontal: hp('5.4%'),
		justifyContent: 'center',
		// borderWidth: 1,
		// borderColor: 'green',
	},
	logo: {
		width: wp('39.5%'),
		height: hp('19.5%'),
		// width: 155,
		// height: 150,
		alignSelf: 'center',
		resizeMode: 'contain',
	},
	forgotPasswordSentenceStyle: {
		width: '85%',
		alignSelf: 'center',
		// borderWidth: 1,
	},
});

export {ForgotPassword};
