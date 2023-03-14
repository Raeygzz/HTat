import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import analytics from '@react-native-firebase/analytics';
import AsyncStorage from '@react-native-community/async-storage';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

import {IOS} from '../helper';
import {TextField} from '../components/common';
import {GlobalTheme} from '../components/theme';
import {StripeView} from '../components/stripe/StripeView';

import {useSelector, useDispatch} from 'react-redux';
import {setUser} from '../store/actions/Auth';
import {presentAlert} from '../store/actions/Alert';
import {userDetailGETApi} from '../store/actions/UserDetail';

const WebView = (props) => {
	const userId = useSelector((state) => state.auth.id);
	const userData = useSelector((state) => state.auth.user);
	const completedStripeOnboarding = useSelector(
		(state) => state.auth.user.completed_stripe_onboarding,
	);

	const [stripeStatus, setStripeStatus] = useState('');
	const [responseMessage, setResponseMessage] = useState('');

	const dispatch = useDispatch();

	const onCheckStatus = (stripeResponse) => {
		const parsedStripeResponse = JSON.parse(stripeResponse);
		// console.log('parsedStripeResponse ==> ', parsedStripeResponse);
		if (parsedStripeResponse.response_code === 'success') {
			let user = {
				id: userData.id,
				first_name: userData.first_name,
				last_name: userData.last_name,
				email: userData.email,
				login_with: userData.login_with,
				completed_stripe_onboarding: 1,
				has_primary_card: userData.has_primary_card,
				has_primary_address: userData.has_primary_address,
				has_business_profile: userData.has_business_profile,
			};

			dispatch(
				setUser({
					user: user,
				}),
			);

			AsyncStorage.setItem('user', JSON.stringify(user));

			// analytics().logEvent('stripe_connect_success');

			props.navigation.goBack();
			//
		} else {
			let alertConfig = {
				title: 'Sorry!',
				message: parsedStripeResponse.response_message,
				navigation: props.navigation,
				shouldRunFunction: true,
				functionHandler: 'webViewFailureResponseHandler',
			};

			dispatch(presentAlert(alertConfig));
		}

		setStripeStatus(parsedStripeResponse.response_code);
		setResponseMessage(parsedStripeResponse.response_message);
	};

	const onCancelHandler = () => {
		dispatch(userDetailGETApi({userId: userId}, false));

		props.navigation.goBack();
	};

	// console.log('stripeStatus ==> ', stripeStatus);
	// console.log('responseMessage ==> ', responseMessage);
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
					{`Stripe ${completedStripeOnboarding === 1 ? 'login' : 'connect'}`}
				</TextField>
			</View>

			<StripeView onCheckStatus={onCheckStatus} />
		</View>
	);
};

const styles = StyleSheet.create({
	modal: {
		flex: 1,
		// borderWidth: 2,
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
});

export {WebView};
