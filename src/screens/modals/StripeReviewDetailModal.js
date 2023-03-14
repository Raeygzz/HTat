import React from 'react';
import {View, Modal, Linking, ScrollView, StyleSheet} from 'react-native';

import {
	heightPercentageToDP as hp,
	widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {GlobalTheme} from '../../components/theme';
import {
	TextField,
	Divider,
	Button,
	ParsedLinkText,
} from '../../components/common';

import {useSelector, useDispatch} from 'react-redux';
import {hideStripeReviewDetailScreenModal} from '../../store/actions/Settings';

const StripeReviewDetails = (props) => {
	const stripeAvailableBalance = useSelector(
		(state) => state.settings.stripeBalance.available_balance,
	);
	const stripePendingBalance = useSelector(
		(state) => state.settings.stripeBalance.pending_balance,
	);

	const dispatch = useDispatch();

	const modalCancelHandler = () => {
		dispatch(hideStripeReviewDetailScreenModal());
	};

	const stripeDashboardHandler = () => {
		dispatch(hideStripeReviewDetailScreenModal());
		Linking.openURL(`https://dashboard.stripe.com/login`);
	};

	const doneHandler = () => {
		dispatch(hideStripeReviewDetailScreenModal());
	};

	return (
		<Modal
			statusBarTranslucent
			animationType="fade"
			transparent={true}
			visible={props.showStripeReviewDetailsModal}>
			<View style={styles.modal}>
				<View style={styles.shadowViewStyle}>
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
							Stripe review detail
						</TextField>
					</View>

					<ScrollView
						showsVerticalScrollIndicator={false}
						contentContainerStyle={styles.ph20}>
						<Divider xLarge />

						<TextField
							title
							isRLH
							lineHeight={2.6}
							letterSpacing={-0.1}
							fontFamily={GlobalTheme.fontRegular}
							color={GlobalTheme.black}>
							Your current Stripe balance is
						</TextField>

						<Divider large />

						<View style={styles.stripeBalanceWrapperStyle}>
							<TextField
								left
								xThin
								letterSpacing={-0.36}
								isRLH
								lineHeight={2.2}
								fontFamily={GlobalTheme.fontRegular}
								color={GlobalTheme.defaultBlack}
								style={styles.leftTextLabelStyle}>
								Available balance:
							</TextField>

							<Divider horizontal small />

							<TextField
								left
								xThin
								letterSpacing={-0.07}
								isRLH
								lineHeight={1.8}
								fontFamily={GlobalTheme.fontRegular}
								color={GlobalTheme.textColor}
								style={styles.rightTextValueStyle}>
								{`£${stripeAvailableBalance}`}
							</TextField>
						</View>

						<Divider small />

						<View style={styles.stripeBalanceWrapperStyle}>
							<TextField
								left
								xThin
								letterSpacing={-0.36}
								isRLH
								lineHeight={2.2}
								fontFamily={GlobalTheme.fontRegular}
								color={GlobalTheme.defaultBlack}
								style={styles.leftTextLabelStyle}>
								Pending balance:
							</TextField>

							<Divider horizontal small />

							<TextField
								left
								xThin
								letterSpacing={-0.07}
								isRLH
								lineHeight={1.8}
								fontFamily={GlobalTheme.fontRegular}
								color={GlobalTheme.textColor}
								style={styles.rightTextValueStyle}>
								{`£${stripePendingBalance}`}
							</TextField>
						</View>

						<Divider xLarge />

						<TextField
							xThin
							isRLH
							lineHeight={2.1}
							letterSpacing={-0.09}
							color={GlobalTheme.black}
							fontFamily={GlobalTheme.fontRegular}
							style={styles.linkTextStyle}>
							{`To view your Stripe dashboard please visit`}
							<ParsedLinkText
								onPress={stripeDashboardHandler}
								color={GlobalTheme.primaryColor}
								style={styles.linkTopStyle}>
								{` `}dashboard.stripe.com{` `}
							</ParsedLinkText>
							{`or download the Stripe mobile app.`}
						</TextField>

						<Divider xLarge />

						<Button title="Done" blackButton onPress={doneHandler} />

						<Divider />
					</ScrollView>
				</View>
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
	shadowViewStyle: {
		width: wp('90%'),
		height: hp('50%'),
		shadowRadius: GlobalTheme.shadowRadius,
		shadowColor: GlobalTheme.black,
		shadowOpacity: 0.28,
		borderWidth: 0.1,
		position: 'absolute',
		bottom: 0,
		alignSelf: 'center',
		borderColor: 'transparent',
		backgroundColor: GlobalTheme.white,
		borderRadius: GlobalTheme.viewRadius,
		shadowOffset: {width: 0, height: 6},
		elevation: 44,
		// borderWidth: 1,
		// borderColor: 'blue',
	},
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
	stripeBalanceWrapperStyle: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		// borderWidth: 1,
	},
	leftTextLabelStyle: {
		width: '45%',
		// borderWidth: 1,
	},
	rightTextValueStyle: {
		width: '55%',
		// borderWidth: 1,
	},
	linkTextStyle: {
		width: wp('75%'),
		// borderWidth: 1,
	},
	linkTopStyle: {
		top: hp('0.3%'),
		// borderWidth: 1,
	},
});

export {StripeReviewDetails};
