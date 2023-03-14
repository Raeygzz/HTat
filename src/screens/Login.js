import React, {useState, useEffect, useRef} from 'react';
import {
	View,
	Image,
	ScrollView,
	StyleSheet,
	Animated,
	TouchableOpacity,
} from 'react-native';

import {useFocusEffect} from '@react-navigation/native';
import {useKeyboard} from '@react-native-community/hooks';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
	heightPercentageToDP as hp,
	widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {
	LoginManager,
	AccessToken,
	GraphRequest,
	GraphRequestManager,
} from 'react-native-fbsdk-next';

import {ANDROID} from '../helper';
import {formBody} from '../utils';
import Logo from '../assets/image/logo.png';
import {GlobalTheme} from '../components/theme';
import {EmailSchema, PasswordSchema} from '../models/validations/Login';
import {SocialMediaTermsPolicies} from './modals/SocialMediaTermsPolicies';
import {
	Button,
	Divider,
	TextField,
	GenericView,
	HTTextInput,
	ErrorCard,
} from '../components/common';

import {useSelector, useDispatch} from 'react-redux';
import {setError} from '../store/actions/Error';
import {loginApi} from '../store/actions/Login';
import {
	appleRegistrationApi,
	facebookRegistrationApi,
	presentSocialMediaTermsPolicies,
} from '../store/actions/RegisterEmail';

const Login = (props) => {
	const appleButtonHeightScale = new Animated.Value(1.2);
	const appleButtonWidthAnimateValue = new Animated.Value(58);
	const signInButtonPositionAnimateValue = new Animated.Value(218);

	const showError = useSelector((state) => state.error.showError);
	const errorMessage = useSelector((state) => state.error.message);
	const showTermsConditionModal = useSelector(
		(state) => state.registerEmail.presentSocialMediaTermsPolicies,
	);

	const [socialMedia, setSocialMedia] = useState('');
	const [appleAuthIsSupported, setAppleAuthIsSupported] = useState(true);
	const [checkboxSelectedValue, setCheckboxSelectedValue] = useState(false);

	const [email, setEmail] = useState('');
	const [emailValidate, setEmailValidate] = useState(false);
	const [password, setPassword] = useState('');
	const [passwordValidate, setPasswordValidate] = useState(false);

	const dispatch = useDispatch();

	const keyboard = useKeyboard();
	const isKeyboardShowing = keyboard.keyboardShown;

	const passwordRef = useRef();

	useFocusEffect(
		React.useCallback(() => {
			Animated.parallel([
				Animated.timing(appleButtonHeightScale, {
					toValue: 1,
					duration: 300,
					useNativeDriver: false,
				}),
				Animated.timing(appleButtonWidthAnimateValue, {
					toValue: 41,
					duration: 300,
					useNativeDriver: false,
				}),
				Animated.timing(signInButtonPositionAnimateValue, {
					toValue: 0,
					duration: 300,
					useNativeDriver: false,
				}),
			]).start();
		}, []),
	);

	const appleSignInHandler = async () => {
		setSocialMedia('apple');
		setCheckboxSelectedValue(false);
		dispatch(presentSocialMediaTermsPolicies());
	};

	// const facebookSignInHandler = async () => {
	// 	setSocialMedia('facebook');
	// 	setCheckboxSelectedValue(false);
	// 	dispatch(presentSocialMediaTermsPolicies());
	// };

	useEffect(() => {
		if (checkboxSelectedValue && socialMedia === 'apple') {
			async function appleSignIn() {
				// console.log('appleAuth.isSupported ==> ', appleAuth.isSupported);
				if (appleAuth.isSupported) {
					try {
						setAppleAuthIsSupported(true);
						// performs login request
						const appleAuthRequestResponse = await appleAuth.performRequest({
							requestedOperation: appleAuth.Operation.LOGIN,
							requestedScopes: [
								appleAuth.Scope.EMAIL,
								appleAuth.Scope.FULL_NAME,
							],
						});
						// console.log('appleAuthRequestResponse ==> ', appleAuthRequestResponse);

						// if (appleAuthRequestResponse['realUserStatus']) {
						// 	console.log(
						// 		'appleAuthRequestResponse[realUserStatus] ==> ',
						// 		appleAuthRequestResponse['realUserStatus'],
						// 	);
						// }

						// get current authentication state for user
						// /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
						const credentialState = await appleAuth.getCredentialStateForUser(
							appleAuthRequestResponse.user,
						);
						// console.log('credentialState ==> ', credentialState);

						// use credentialState response to ensure the user is authenticated
						if (credentialState === appleAuth.State.AUTHORIZED) {
							// user is authenticated
							// console.log('User is authorized ==> ', appleAuth.State.AUTHORIZED);

							let obj = {
								identity_token: appleAuthRequestResponse.identityToken,
								email: appleAuthRequestResponse.email,
								first_name: appleAuthRequestResponse.fullName.givenName,
								last_name: appleAuthRequestResponse.fullName.familyName,
								user: appleAuthRequestResponse.user,
								accepted_terms_and_conditions: checkboxSelectedValue
									? '1'
									: '0',
							};

							console.log('obj ==> ', obj);
							dispatch(appleRegistrationApi(obj));
						}
					} catch (error) {
						if (error.code === AppleAuthError.CANCELED) {
							console.log('User cancelled Apple Sign-in ==> ', error);
						} else if (error.code === AppleAuthError.FAILED) {
							console.log('Touch ID FAILED');
						} else if (error.code === AppleAuthError.INVALID_RESPONSE) {
							console.log('Touch ID INVALID_RESPONSE');
						} else if (error.code === AppleAuthError.NOT_HANDLED) {
							console.log('Touch ID NOT_HANDLED');
						} else if (error.code === AppleAuthError.UNKNOWN) {
							console.log('Touch ID UNKNOWN');
						} else {
							// other unknown error
							console.log('Apple signup error ==> ', error);
						}
					}
				} else {
					setAppleAuthIsSupported(false);
				}
			}

			appleSignIn();
		}

		if (checkboxSelectedValue && socialMedia === 'facebook') {
			async function facebookSignIn() {
				// Attempt login with permissions
				const result = await LoginManager.logInWithPermissions([
					'public_profile',
					'email',
				]);

				if (result.isCancelled) {
					// throw 'User cancelled the login process';
					console.log('User cancelled the login process');
					return;
				}

				// Once signed in, get the users AccesToken
				const data = await AccessToken.getCurrentAccessToken();
				// console.log('data ==> ', data);

				if (!data) {
					// throw 'Something went wrong obtaining access token';
					console.log('Something went wrong obtaining access token');
				}

				if (data != null) {
					const processRequest = new GraphRequest(
						'/me?fields=name,email,picture.type(large)',
						null,
						(error, result) => {
							if (error) {
								console.log('Error fetching data: ' + error.toString());
							} else {
								// let obj = {
								// 	name: result.name,
								// 	email: result.email,
								// 	profilePic: result.picture.data.url,
								// 	accessToken: data.accessToken,
								// 	userId: data.userID,
								// 	applicationId: data.applicationID,
								// };
								// console.log('obj ==> ', obj);

								let obj = {
									access_token: data.accessToken,
									facebook_id: data.userID,
									email: result?.email != undefined ? result.email : null,
									accepted_terms_and_conditions: checkboxSelectedValue
										? '1'
										: '0',
								};

								dispatch(facebookRegistrationApi(obj));
							}
						},
					);
					// Start the graph request.
					new GraphRequestManager().addRequest(processRequest).start();
				}
			}

			facebookSignIn();
		}
	}, [checkboxSelectedValue, socialMedia]);

	const loginHandler = async () => {
		const validEmail = await EmailSchema.isValid({email: email});
		validEmail ? setEmailValidate(false) : setEmailValidate(true);

		const validPassword = await PasswordSchema.isValid({password: password});
		validPassword ? setPasswordValidate(false) : setPasswordValidate(true);

		if (validEmail && validPassword) {
			let obj = {
				email: email,
				password: password,
			};

			dispatch(loginApi(formBody(obj)));
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
				keyboardShouldPersistTaps="handled"
				contentContainerStyle={styles.mainView}>
				{/* <ScrollView contentContainerStyle={styles.mainView}> */}
				{showError && !isKeyboardShowing ? (
					<>
						<ErrorCard iconName="exclamation" title={errorMessage} />

						<Divider xLarge />
					</>
				) : null}

				<Image style={styles.logo} source={Logo} />

				{/* {!isKeyboardShowing ? (
					<> */}
				<TextField
					center
					regular
					// lineHeight={22}
					isRLH
					lineHeight={2.2}
					fontFamily={GlobalTheme.fontBold}
					color={GlobalTheme.black}>
					SIGN IN
				</TextField>

				<Divider xxLarge />
				{/* <Divider xxxHuge /> */}
				{/* </>
				) : null} */}

				{/* <View style={styles.buttonRowGroup}>
					<Animated.View
						style={{
							width: appleButtonWidthAnimateValue.interpolate({
								inputRange: [0, 100],
								outputRange: ['0%', '100%'],
							}),
							transform: [{scaleY: appleButtonHeightScale}],
						}}> */}
				<Button
					// buttonWidth={126}
					disabled={ANDROID || !appleAuthIsSupported ? true : false}
					iconName="apple"
					iconLibrary="fontAwesome5"
					title="Sign in with Apple"
					onPress={appleSignInHandler}
				/>
				{/* </Animated.View>

					<Button
						buttonWidth={126}
						iconName="facebook"
						iconLibrary="fontAwesome5"
						title="SIGN IN"
						onPress={facebookSignInHandler}
					/>
				</View> */}

				<SocialMediaTermsPolicies
					showTermsAndConditionModal={showTermsConditionModal}
					selectedValue={(selectedVal) => setCheckboxSelectedValue(selectedVal)}
				/>

				<Divider large />

				<TextField
					center
					small
					// lineHeight={16}
					isRLH
					lineHeight={1.8}
					fontFamily={GlobalTheme.fontBold}
					color={GlobalTheme.black}>
					Or sign in with email
				</TextField>

				<Divider />

				<HTTextInput
					placeholder="Enter email address"
					iconName="mail"
					value={email}
					returnKeyType="next" // uncommented on 20 july
					hasError={emailValidate}
					onChangeText={(email) => {
						setEmail(email);
						setEmailValidate(false);
					}}
					onSubmitEditing={(event) => passwordRef.current.focus()} // uncommented on 20 july
					blurOnSubmit={false}
				/>

				<Divider large />

				<HTTextInput
					secureTextEntry
					placeholder="Enter password"
					iconName="eye"
					returnKeyType="done" // added on 20 july
					value={password}
					inputRef={passwordRef} // added on 20 july
					hasError={passwordValidate}
					onChangeText={(password) => {
						setPassword(password);
						setPasswordValidate(false);
					}}
					onSubmitEditing={() => console.log('finally')} //added on 20 july
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

				<Animated.View style={{bottom: signInButtonPositionAnimateValue}}>
					<Button title="SIGN IN" onPress={loginHandler} />
				</Animated.View>
				{/* </View> */}

				<Divider />

				<TouchableOpacity
					onPress={() => props.navigation.navigate('ForgotPassword')}>
					<TextField
						center
						small
						isRLH
						letterSpacing={-0.15}
						lineHeight={1.8}
						fontFamily={GlobalTheme.fontBold}
						color={GlobalTheme.white}>
						Forgot password?
					</TextField>
				</TouchableOpacity>

				{/* <Divider xxLarge /> removed for keyboard issue solve 20 july 2021  */}
				{/* </ScrollView> */}
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
	buttonRowGroup: {
		width: '100%',
		// width: 268,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		// borderWidth: 1,
	},
});

export {Login};
