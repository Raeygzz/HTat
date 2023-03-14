import React, {useState, useEffect, useRef} from 'react';
import {
	View,
	Modal,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	ActivityIndicator,
} from 'react-native';

import {useKeyboard} from '@react-native-community/hooks';
import PlusIcon from 'react-native-vector-icons/EvilIcons';
import {
	heightPercentageToDP as hp,
	widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {RegExp, formBody} from '../../utils';
import {GlobalTheme} from '../../components/theme';
import {CCEmailTextInput} from '../../components/editDetails';
import {
	EmailSchema,
	FirstNameSchema,
	LastNameSchema,
} from '../../models/validations/EditDetails';
import {
	TextField,
	Divider,
	Button,
	HTMaterialTextInput,
} from '../../components/common';

import {useSelector, useDispatch} from 'react-redux';
import {setError} from '../../store/actions/Error';
import {userDetailPUTApi} from '../../store/actions/UserDetail';
import {clearTextInputReq} from '../../store/actions/ClearTextInput';
import {hideUserDetailScreenModal} from '../../store/actions/UserDetail';

const EditDetails = (props) => {
	const {loginWith = '', showEditDetailsModal = false} = props;

	const showError = useSelector((state) => state.error.showError);
	const errorMessage = useSelector((state) => state.error.message);
	const emailFromStore = useSelector((state) => state.userDetail.email);
	const cc_emails = useSelector((state) => state.userDetail.cc_emails);
	const first_name = useSelector((state) => state.userDetail.first_name);
	const last_name = useSelector((state) => state.userDetail.last_name);
	const textInputClear = useSelector(
		(state) => state.clearTextInput.textInputClear,
	);
	const editDetailModalLoader = useSelector(
		(state) => state.modalLoader.presentModalLoader,
	);

	const [email, setEmail] = useState('');
	const [emailValidate, setEmailValidate] = useState(false);

	const [ccEmails, setCCEmails] = useState([{key: '', value: ''}]);
	const [ccInvalidEmailsNum, setCCInvalidEmailsNum] = useState(0);
	const [ccEmailsValidate, setCCEmailsValidate] = useState(false);

	const [firstName, setFirstName] = useState('');
	const [firstNameValidate, setFirstNameValidate] = useState(false);

	const [lastName, setLastName] = useState('');
	const [lastNameValidate, setLastNameValidate] = useState(false);

	const [password, setPassword] = useState('');
	const [passwordValidate, setPasswordValidate] = useState(false);

	const [newPassword, setNewPassword] = useState('');
	const [newPasswordValidate, setNewPasswordValidate] = useState(false);

	const [confirmNewPassword, setConfirmNewPassword] = useState('');
	const [confirmNewPasswordValidate, setConfirmNewPasswordValidate] = useState(
		false,
	);

	const dispatch = useDispatch();

	const keyboard = useKeyboard();
	const keyboardHeight = keyboard.keyboardHeight;
	const isKeyboardShowing = keyboard.keyboardShown;

	const ccEmailsRef = useRef();
	const firstNameRef = useRef();
	const lastNameRef = useRef();
	const passwordRef = useRef();
	const newPasswordRef = useRef();
	const confirmNewPasswordRef = useRef();

	useEffect(() => {
		if (emailFromStore != '' && emailFromStore != null) {
			setEmail(emailFromStore);
		}
	}, [emailFromStore]);

	useEffect(() => {
		if (cc_emails != '' && cc_emails != null) {
			// console.log('cc_emails ==> ', cc_emails);

			let tempCCEmailsArr = [];
			cc_emails.forEach((item, index) => {
				tempCCEmailsArr.push({
					key: index,
					value: item,
				});
			});

			// console.log('tempCCEmailsArr ==> ', tempCCEmailsArr);
			setCCEmails(tempCCEmailsArr);
		}
	}, [cc_emails]);

	useEffect(() => {
		if (first_name != '' && first_name != null) {
			setFirstName(first_name);
			setLastName(last_name);
		}
	}, [first_name]);

	const modalCancelHandler = () => {
		dispatch(hideUserDetailScreenModal());
		setCCInvalidEmailsNum(0);
		setCCEmailsValidate(false);
	};

	const addHandler = () => {
		const _ccEmails = [...ccEmails];
		_ccEmails.push({key: '', value: ''});
		setCCEmails(_ccEmails);
	};

	const deleteHandler = (key) => {
		const _ccEmails = ccEmails.filter((input, index) => index != key);
		setCCEmails(_ccEmails);
	};

	const inputHandler = (text, key) => {
		const _ccEmails = [...ccEmails];
		_ccEmails[key].value = text.trim();
		_ccEmails[key].key = key;
		setCCEmails(_ccEmails);
	};

	const updateDetailsHandler = async () => {
		let ccEmailsArr = [];
		let validCCEmails = true;

		const validEmail = await EmailSchema.isValid({
			email: email,
		});
		validEmail ? setEmailValidate(false) : setEmailValidate(true);

		if (ccEmails.length > 0) {
			// console.log('ccEmails ==> ', ccEmails);

			for (let i = 0; i < ccEmails.length; i++) {
				if (ccEmails[i].value != '') {
					ccEmailsArr.push(ccEmails[i].value);
				}

				if (!RegExp.EmailPattern.test(ccEmails[i].value)) {
					if (ccEmails[i].value != '') {
						validCCEmails = false;
						setCCEmailsValidate(true);
						setCCInvalidEmailsNum((prev) => prev + 1);
					}
				}
			}

			// console.log('ccEmailsArr ==> ', ccEmailsArr);
		}

		const validFirstName = await FirstNameSchema.isValid({
			firstName: firstName,
		});
		validFirstName ? setFirstNameValidate(false) : setFirstNameValidate(true);

		const validLastName = await LastNameSchema.isValid({lastName: lastName});
		validLastName ? setLastNameValidate(false) : setLastNameValidate(true);

		if (validEmail && validCCEmails && validFirstName && validLastName) {
			let obj = {
				_method: 'PUT',
				email: email,
				cc_emails: ccEmailsArr,
				first_name: firstName,
				last_name: lastName,
			};

			// console.log('obj ==> ', obj);

			let errorConfig = {
				message: '',
				showError: false,
			};
			dispatch(setError(errorConfig));

			if (password !== '') {
				let validNewPassword = RegExp.PasswordPattern.test(newPassword);
				let validConfirmNewPassword = RegExp.PasswordPattern.test(
					confirmNewPassword,
				);

				if (newPassword != '' && validNewPassword) {
					setNewPasswordValidate(false);
				} else {
					setNewPasswordValidate(true);
				}

				if (confirmNewPassword != '' && validConfirmNewPassword) {
					setConfirmNewPasswordValidate(false);
				} else {
					setConfirmNewPasswordValidate(true);
					return;
				}

				if (newPassword === confirmNewPassword) {
					let userData = {
						email: email,
						first_name: firstName,
						last_name: lastName,
					};

					obj.password = password;
					obj.new_password = newPassword;
					obj.new_password_confirmation = confirmNewPassword;

					props.ccEmailsToSettingsScreen(ccEmailsArr);
					dispatch(userDetailPUTApi(obj, userData));
					// dispatch(userDetailPUTApi(formBody(obj), userData));
				} else {
					setNewPasswordValidate(true);
					setConfirmNewPasswordValidate(true);
				}
			} else {
				let userData = {
					email: email,
					first_name: firstName,
					last_name: lastName,
				};

				props.ccEmailsToSettingsScreen(ccEmailsArr);
				dispatch(userDetailPUTApi(obj, userData));
				// dispatch(userDetailPUTApi(formBody(obj), userData));
			}
		}
	};

	useEffect(() => {
		if (showError) {
			setPasswordValidate(showError);
		}
	}, [showError]);

	useEffect(() => {
		if (textInputClear) {
			setPassword('');
			setNewPassword('');
			setConfirmNewPassword('');

			console.log('== 2 ==');
			dispatch(clearTextInputReq(false));
		}
	}, [textInputClear]);

	const inputFields =
		ccEmails.length > 0
			? ccEmails.map((input, key) => {
					// console.log('val ==> ', input, key);

					return (
						<View key={key}>
							<CCEmailTextInput
								id={key}
								value={input.value}
								inputHandler={inputHandler}
								setCCInvalidEmailsNum={(val) => setCCInvalidEmailsNum(val)}
								setCCEmailsValidate={(val) => setCCEmailsValidate(val)}
								deleteHandler={deleteHandler}
							/>

							{key + 1 == ccEmails.length && (
								<View style={styles.horizontalLineStyle} />
							)}
						</View>
					);
			  })
			: null;

	return (
		<Modal
			statusBarTranslucent
			animationType="fade"
			transparent={true}
			visible={showEditDetailsModal}>
			<View style={styles.modal}>
				<View style={styles.shadowViewStyle(isKeyboardShowing, keyboardHeight)}>
					<View style={styles.headerStyle}>
						<TextField
							regular
							isRLH
							lineHeight={2.1}
							letterSpacing={-0.1}
							fontFamily={GlobalTheme.fontRegular}
							color={GlobalTheme.white}
							style={styles.textCloseStyle}
							onPress={modalCancelHandler}>
							Cancel
						</TextField>

						<TextField
							regular
							center
							isRLH
							lineHeight={2.1}
							letterSpacing={-0.1}
							fontFamily={GlobalTheme.fontBold}
							color={GlobalTheme.white}
							style={styles.modalHeaderStyle}>
							Edit details
						</TextField>
					</View>

					<ScrollView
						showsVerticalScrollIndicator={false}
						contentContainerStyle={styles.ph20}>
						<Divider />

						<TextField
							xThin
							letterSpacing={-0.07}
							lineHeight={18}
							fontFamily={GlobalTheme.fontRegular}
							color={GlobalTheme.textColor}>
							Email
						</TextField>

						<HTMaterialTextInput
							// editable={
							// 	// loginWith != 'email' ? true : false
							// 	// emailFromStore != '' && emailFromStore != null ? true : false
							// 	emailFromStore == '' || emailFromStore == null
							// 		? false
							// 		: loginWith != 'apple'
							// 		? false
							// 		: true
							// }
							placeholder="Enter Email"
							// returnKeyType="next"
							hasError={emailValidate}
							validationMessage="Please enter valid email"
							onChangeText={(email) => {
								setEmail(email);
								setEmailValidate(false);
							}}
							value={email}
							// onSubmitEditing={(event) => ccEmailsRef.current.focus()}
							// blurOnSubmit={false}
						/>

						<Divider />

						<TextField
							xThin
							letterSpacing={-0.07}
							lineHeight={18}
							fontFamily={GlobalTheme.fontRegular}
							color={GlobalTheme.textColor}>
							Cc
						</TextField>

						{inputFields}

						<Divider />

						{ccEmailsValidate && (
							<>
								<TextField
									thin
									isRLH
									lineHeight={1.8}
									letterSpacing={-0.07}
									fontFamily={GlobalTheme.fontRegular}
									color={GlobalTheme.validationColor}>
									{`${ccInvalidEmailsNum} - invalid email, Please check your Cc email addresses`}
								</TextField>

								<Divider />
							</>
						)}

						<TouchableOpacity
							style={styles.addCCEmailButtonStyle}
							onPress={addHandler}>
							<TextField
								center
								regular
								isRLH
								lineHeight={4.0}
								letterSpacing={-0.07}
								fontFamily={GlobalTheme.fontBold}
								color={GlobalTheme.white}>
								Add
							</TextField>

							<PlusIcon
								name="plus"
								size={hp(3.0)}
								color={GlobalTheme.white}
								style={styles.plusIconStyle}
							/>
						</TouchableOpacity>

						<Divider />

						<View style={styles.nameRowStyle}>
							<View style={styles.w48}>
								<TextField
									xThin
									letterSpacing={-0.07}
									lineHeight={18}
									fontFamily={GlobalTheme.fontRegular}
									color={GlobalTheme.textColor}>
									First Name
								</TextField>

								<HTMaterialTextInput
									placeholder="Enter First name"
									returnKeyType="next"
									inputRef={firstNameRef}
									hasError={firstNameValidate}
									validationMessage="Please enter valid first name"
									onChangeText={(firstName) => {
										setFirstName(firstName);
										setFirstNameValidate(false);
									}}
									value={firstName}
									onSubmitEditing={(event) => lastNameRef.current.focus()}
									blurOnSubmit={false}
								/>
							</View>

							<View style={styles.w48}>
								<TextField
									xThin
									letterSpacing={-0.07}
									lineHeight={18}
									fontFamily={GlobalTheme.fontRegular}
									color={GlobalTheme.textColor}>
									Last Name
								</TextField>

								<HTMaterialTextInput
									placeholder="Enter Last name"
									returnKeyType="next"
									inputRef={lastNameRef}
									hasError={lastNameValidate}
									validationMessage="Please enter valid last name"
									onChangeText={(lastName) => {
										setLastName(lastName);
										setLastNameValidate(false);
									}}
									value={lastName}
									onSubmitEditing={(event) => passwordRef.current.focus()}
									blurOnSubmit={false}
								/>
							</View>
						</View>

						<Divider />

						<TextField
							xThin
							letterSpacing={-0.07}
							lineHeight={18}
							fontFamily={GlobalTheme.fontRegular}
							color={GlobalTheme.textColor}>
							Password
						</TextField>

						<HTMaterialTextInput
							editable={
								loginWith === 'facebook' || loginWith === 'apple' ? true : false
							}
							secureTextEntry
							placeholder="Enter Password"
							returnKeyType="next"
							inputRef={passwordRef}
							hasError={passwordValidate}
							validationMessage={errorMessage}
							onChangeText={(password) => {
								setPassword(password);
								setPasswordValidate(false);
							}}
							value={password}
							onSubmitEditing={(event) => newPasswordRef.current.focus()}
							blurOnSubmit={false}
						/>

						<Divider />

						<TextField
							xThin
							letterSpacing={-0.07}
							lineHeight={18}
							fontFamily={GlobalTheme.fontRegular}
							color={GlobalTheme.textColor}>
							New Password
						</TextField>

						<HTMaterialTextInput
							editable={
								loginWith === 'facebook' || loginWith === 'apple' ? true : false
							}
							secureTextEntry
							placeholder="Enter New Password"
							returnKeyType="next"
							inputRef={newPasswordRef}
							hasError={newPasswordValidate}
							validationMessage="Please enter valid new password"
							onChangeText={(newPassword) => {
								setNewPassword(newPassword);
								setNewPasswordValidate(false);
							}}
							value={newPassword}
							onSubmitEditing={(event) => confirmNewPasswordRef.current.focus()}
							blurOnSubmit={false}
						/>

						<Divider />

						<TextField
							xThin
							letterSpacing={-0.07}
							lineHeight={18}
							fontFamily={GlobalTheme.fontRegular}
							color={GlobalTheme.textColor}>
							Confirm New Password
						</TextField>

						<HTMaterialTextInput
							secureTextEntry
							editable={
								loginWith === 'facebook' || loginWith === 'apple' ? true : false
							}
							placeholder="Enter Confirm New Password"
							returnKeyType="done"
							inputRef={confirmNewPasswordRef}
							hasError={confirmNewPasswordValidate}
							validationMessage="Please enter valid confirm new password"
							onChangeText={(confirmNewPassword) => {
								setConfirmNewPassword(confirmNewPassword);
								setConfirmNewPasswordValidate(false);
							}}
							value={confirmNewPassword}
							onSubmitEditing={(event) =>
								console.log('edit user detail finally!!')
							}
						/>

						<Divider xLarge />

						<Button
							title="UPDATE DETAILS"
							blackButton
							onPress={updateDetailsHandler}
						/>

						<Divider />
					</ScrollView>
				</View>

				<Modal
					animationType="fade"
					transparent={true}
					visible={editDetailModalLoader}>
					<View style={styles.editUserModalStyle}>
						<ActivityIndicator
							animating={true}
							size="large"
							color={GlobalTheme.black}
						/>
					</View>
				</Modal>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modal: {
		flex: 1,
		// borderWidth: 1,
		// borderColor: 'green',
	},
	shadowViewStyle: (isKeyboardShowing, keyboardHeight) => ({
		width: wp('90%'),
		height: hp('60%'),
		shadowRadius: GlobalTheme.shadowRadius,
		shadowColor: GlobalTheme.black,
		shadowOpacity: 0.28,
		borderWidth: 0.1,
		position: 'absolute',
		bottom: !isKeyboardShowing ? 0 : keyboardHeight,
		alignSelf: 'center',
		borderColor: 'transparent',
		backgroundColor: GlobalTheme.white,
		borderRadius: GlobalTheme.viewRadius,
		shadowOffset: {width: 0, height: 6},
		elevation: 44,
		// borderWidth: 1,
		// borderColor: 'blue',
	}),
	headerStyle: {
		width: wp('90%'),
		height: hp('6.3%'),
		backgroundColor: GlobalTheme.primaryColor,
		borderTopLeftRadius: GlobalTheme.viewRadius,
		borderTopRightRadius: GlobalTheme.viewRadius,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		// borderWidth: 1,
	},
	textCloseStyle: {
		width: wp('20%'),
		paddingLeft: hp('2.6%'),
		// borderWidth: 1,
		// borderColor: '#fff',
	},
	modalHeaderStyle: {
		width: wp('60%'),
		// borderWidth: 1,
	},
	ph20: {
		paddingHorizontal: hp('2.7%'),
	},
	horizontalLineStyle: {
		borderBottomWidth: hp(0.1),
		borderBottomColor: GlobalTheme.horizontalLineColor,
	},
	addCCEmailButtonStyle: {
		width: '100%',
		height: hp(4.0),
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: GlobalTheme.primaryColor,
	},
	plusIconStyle: {
		bottom: hp(0.2),
		// borderWidth: 1,
	},
	nameRowStyle: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		// borderWidth: 1,
	},
	w48: {
		width: wp('38%'),
		// borderWidth: 1,
	},
	editUserModalStyle: {
		width: wp('90%'),
		height: hp('60%'),
		justifyContent: 'center',
		backgroundColor: 'rgba(0,0,0,0.04)',
		borderRadius: GlobalTheme.viewRadius,
		position: 'absolute',
		bottom: 0,
		alignSelf: 'center',
		// borderWidth: 1,
	},
});

export {EditDetails};
