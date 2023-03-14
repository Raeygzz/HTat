import React, {useState, useEffect} from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';

import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {IOS} from '../helper';
import {getObjectLength} from '../utils';
import {GlobalTheme} from '../components/theme';
import {
	TextField,
	Divider,
	Button,
	ParsedLinkText,
	HTMaterialTextInput,
} from '../components/common';

import {useSelector, useDispatch} from 'react-redux';
import {sendEmailApi} from '../store/actions/Buy';

const BuyConfirm = (props) => {
	const userDetail = useSelector((state) => state.auth.user);

	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [message, setMessage] = useState('');
	const [messageLength, setMessageLength] = useState('');

	const dispatch = useDispatch();

	useEffect(() => {
		if (getObjectLength(userDetail) != 0) {
			setFirstName(userDetail.first_name);
			setLastName(userDetail.last_name);
			setEmail(userDetail.email);
		}
	}, [userDetail]);

	const onCancelHandler = () => {
		props.navigation.goBack();
	};

	const messageSetHandler = (message) => {
		let textLength = message.length;

		if (textLength < 256) {
			setMessage(message);
			setMessageLength(message.length);
		}
	};

	const privacyPolicyHandler = () => {
		props.navigation.navigate('TermsPolicies', {
			terms: {
				title: 'Privacy policy',
				link: 'https://hirethat.com/privacy-policy/',
			},
		});
	};

	const sendEmailHandler = () => {
		let obj = {
			item_id: props.route.params.buyConfirmData.itemId,
			message: message,
		};

		// console.log('obj ==> ', obj);
		dispatch(sendEmailApi(obj, props.navigation));
	};

	return (
		<View style={styles.modal}>
			<View style={styles.headerStyle}>
				<TextField
					regular
					letterSpacing={-0.1}
					isRLH
					lineHeight={2.4}
					fontFamily={GlobalTheme.fontRegular}
					color={GlobalTheme.white}
					style={styles.textCloseStyle}
					onPress={onCancelHandler}>
					Cancel
				</TextField>

				<TextField
					medium
					letterSpacing={-0.1}
					isRLH
					lineHeight={2.4}
					fontFamily={GlobalTheme.fontBold}
					color={GlobalTheme.white}
					style={styles.modalHeaderStyle}>
					Email seller
				</TextField>
			</View>

			<KeyboardAwareScrollView
				extraHeight={hp(20.0)}
				keyboardShouldPersistTaps="handled"
				style={styles.scrollViewWrapperStyle}>
				<Divider />

				<TextField
					title
					letterSpacing={-0.36}
					isRLH
					lineHeight={2.6}
					fontFamily={GlobalTheme.fontBlack}
					color={GlobalTheme.primaryColor}>
					Enquiry regarding
				</TextField>

				<Divider />

				<TextField
					medium
					letterSpacing={-0.9}
					isRLH
					lineHeight={2.4}
					fontFamily={GlobalTheme.fontBlack}
					color={GlobalTheme.horizontalLineColor}>
					{props.route.params.buyConfirmData.itemName}
				</TextField>

				<Divider large />

				<TextField
					xThin
					letterSpacing={-0.07}
					isRLH
					lineHeight={1.8}
					fontFamily={GlobalTheme.fontRegular}
					color={GlobalTheme.black}>
					First Name *
				</TextField>

				<HTMaterialTextInput
					editable={true}
					placeholder="Nicholas"
					validationMessage="Please enter valid first name"
					onChangeText={(firstName) => {
						setFirstName(firstName);
					}}
					value={firstName}
				/>

				<Divider />

				<TextField
					xThin
					letterSpacing={-0.07}
					isRLH
					lineHeight={1.8}
					fontFamily={GlobalTheme.fontRegular}
					color={GlobalTheme.black}>
					Last Name *
				</TextField>

				<HTMaterialTextInput
					editable={true}
					placeholder="Thomas"
					validationMessage="Please enter valid last name"
					onChangeText={(lastName) => {
						setLastName(lastName);
					}}
					value={lastName}
				/>

				<Divider />

				<TextField
					xThin
					letterSpacing={-0.07}
					isRLH
					lineHeight={1.8}
					fontFamily={GlobalTheme.fontRegular}
					color={GlobalTheme.black}>
					Email *
				</TextField>

				<HTMaterialTextInput
					editable={true}
					placeholder="nicholas@gmail.com"
					validationMessage="Please enter valid email"
					onChangeText={(email) => {
						setEmail(email);
					}}
					value={email}
				/>

				<Divider />

				<View style={styles.messageWrapperStyle}>
					<View style={styles.flxStartRow}>
						<TextField
							xThin
							letterSpacing={-0.07}
							lineHeight={18}
							fontFamily={GlobalTheme.fontRegular}
							color={GlobalTheme.black}>
							Include a message:
						</TextField>

						<TextField
							xThin
							letterSpacing={-0.07}
							lineHeight={18}
							fontFamily={GlobalTheme.fontRegular}
							color={GlobalTheme.textColor}>
							(optional)
						</TextField>
					</View>

					<TextField
						xThin
						letterSpacing={-0.07}
						lineHeight={18}
						fontFamily={GlobalTheme.fontRegular}
						color={GlobalTheme.black}>
						{messageLength != '' ? messageLength : '0'} / 255
					</TextField>
				</View>

				<HTMaterialTextInput
					// multiline
					// textAlignVertical
					maxLength={255}
					onChangeText={(message) => messageSetHandler(message)}
					value={message}
				/>

				<Divider />

				<TextField
					xThin
					isRLH
					lineHeight={1.9}
					letterSpacing={-0.13}
					color={GlobalTheme.black}
					fontFamily={GlobalTheme.fontRegular}>
					{`Enter what you'd like to know. For example, you could ask for more details about`}
					<ParsedLinkText
						color={GlobalTheme.textColor}
						style={styles.linkTopStyle}>
						{` `}
						{props.route.params.buyConfirmData.itemName}
					</ParsedLinkText>
					{`or more photos.`}
				</TextField>

				<Divider xLarge />

				<TextField
					xThin
					isRLH
					lineHeight={1.9}
					letterSpacing={-0.13}
					color={GlobalTheme.black}
					fontFamily={GlobalTheme.fontRegular}>
					By hitting "Send email" you're happy for us to create an account and
					pass your details to the seller and their third-party data processors.
				</TextField>

				<Divider />

				<TextField
					xThin
					isRLH
					lineHeight={1.9}
					letterSpacing={-0.13}
					color={GlobalTheme.black}
					fontFamily={GlobalTheme.fontRegular}>
					{`Read our`}
					<ParsedLinkText
						color={GlobalTheme.primaryColor}
						onPress={privacyPolicyHandler}
						style={styles.linkTopStyle}>
						{` `}privacy policy{` `}
					</ParsedLinkText>
					{`to see what we do with your personal information and how we keep it secure.`}
				</TextField>

				<Divider xxLarge />

				<Button blackButton title="SEND EMAIL" onPress={sendEmailHandler} />

				<Divider xxxHuge />
			</KeyboardAwareScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	modal: {
		flex: 1,
		// borderWidth: 1,
		// borderColor: 'blue',
	},
	headerStyle: {
		width: '100%',
		height: hp('10%'), // added & commented on 19 aug
		// height: IOS ? hp('7.4%') : hp('10%'),
		backgroundColor: GlobalTheme.primaryColor,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		// borderWidth: 1,
	},
	textCloseStyle: {
		width: '40%',
		top: hp('2.4%'), // added & commented on 19 aug
		// top: IOS ? hp('0.8%') : hp('2.4%'),
		paddingLeft: hp('2.5%'),
		// borderWidth: 1,
	},
	modalHeaderStyle: {
		width: '60%',
		top: hp('2.4%'), // added & commented on 19 aug
		// top: IOS ? hp('0.8%') : hp('2.4%'),
		// borderWidth: 1,
	},
	scrollViewWrapperStyle: {
		flex: 1,
		paddingHorizontal: hp('2.0%'),
		backgroundColor: GlobalTheme.white,
		// borderWidth: 1,
		// borderColor: 'blue',
	},
	messageWrapperStyle: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	flxStartRow: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	linkTopStyle: {
		top: hp('0.3%'),
		// borderWidth: 1,
	},
});

export {BuyConfirm};
