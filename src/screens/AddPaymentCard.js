import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import analytics from '@react-native-firebase/analytics';
import AsyncStorage from '@react-native-community/async-storage';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

import {IOS} from '../helper';
import {TextField} from '../components/common';
import {GlobalTheme} from '../components/theme';
import {CardView} from '../components/stripe/CardView';

import {useDispatch, useSelector} from 'react-redux';
import {setUser} from '../store/actions/Auth';
import {presentAlert} from '../store/actions/Alert';
import {clearAddCardHtml} from '../store/actions/UserCard';
import {userDetailGETApi} from '../store/actions/UserDetail';

const AddPaymentCard = (props) => {
	const userId = useSelector((state) => state.auth.id);
	const userData = useSelector((state) => state.auth.user);

	const [addCardSuccessStatus, setAddCardSuccessStatus] = useState('');
	const [addCardSuccessMessage, setAddCardSuccessMessage] = useState('');

	const dispatch = useDispatch();

	const addCardCloseHandler = () => {
		dispatch(userDetailGETApi({userId: userId}, false));
		props.navigation.goBack();
	};

	const onAddCardFromWebViewSuccess = (addCardSuccessResponse) => {
		const parsedAddCardSuccessResponse = JSON.parse(addCardSuccessResponse);
		// console.log('parsedResponse ==> ', parsedAddCardSuccessResponse);
		if (parsedAddCardSuccessResponse.response_code === 'success') {
			let user = {
				id: userData.id,
				first_name: userData.first_name,
				last_name: userData.last_name,
				email: userData.email,
				login_with: userData.login_with,
				completed_stripe_onboarding: userData.completed_stripe_onboarding,
				has_primary_card: 1,
				has_primary_address: userData.has_primary_address,
				has_business_profile: userData.has_business_profile,
			};

			dispatch(
				setUser({
					user: user,
				}),
			);
			AsyncStorage.setItem('user', JSON.stringify(user));

			dispatch(clearAddCardHtml());

			analytics().logEvent('add_payment_card_success');

			props.navigation.goBack();
			// props.navigation.navigate('ManagePayments', {
			// 	addCardSuccess: true,
			// });
		} else {
			let alertConfig = {
				title: 'Sorry!',
				message: parsedAddCardSuccessResponse.response_message,
				navigation: props.navigation,
				shouldRunFunction: true,
				functionHandler: 'webViewFailureResponseHandler',
			};

			dispatch(clearAddCardHtml());
			dispatch(presentAlert(alertConfig));
		}

		setAddCardSuccessStatus(parsedAddCardSuccessResponse.response_code);
		setAddCardSuccessMessage(parsedAddCardSuccessResponse.response_message);
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
					onPress={addCardCloseHandler}>
					Close
				</TextField>

				<TextField
					regular
					letterSpacing={-0.1}
					isRLH
					lineHeight={2.4}
					fontFamily={GlobalTheme.fontBold}
					color={GlobalTheme.white}
					style={styles.modalHeaderStyle}>
					Add Card
				</TextField>
			</View>

			<CardView onAddCardFromWebViewSuccess={onAddCardFromWebViewSuccess} />
		</View>
	);
};

const styles = StyleSheet.create({
	modal: {
		flex: 1,
		// borderWidth: 1,
		// borderColor: 'green',
	},
	headerStyle: {
		width: '100%',
		height: hp('10%'), // added & commented on 19 aug
		// height: IOS ? hp('7.4%') : hp('10%'),
		backgroundColor: GlobalTheme.primaryColor,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		// borderWidth: 1
	},
	textCloseStyle: {
		width: '40%',
		top: hp('2.4%'), // added & commented on 19 aug
		// top: IOS ? hp('0.8%') : hp('2.4%'),
		paddingLeft: hp('2.5%'),
		// borderWidth: 1,
		// borderColor: '#fff',
	},
	modalHeaderStyle: {
		width: '60%',
		top: hp('2.4%'), // added & commented on 19 aug
		// top: IOS ? hp('0.8%') : hp('2.4%'),
		// borderWidth: 1,
	},
});

export {AddPaymentCard};
