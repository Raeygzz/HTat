import React, {useState, useEffect} from 'react';
import {View, Image, Modal, ScrollView, StyleSheet} from 'react-native';

import ShadowView from 'react-native-simple-shadow-view';
import {
	heightPercentageToDP as hp,
	widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {makeCall} from '../../utils';
import Logo from '../../assets/image/logo.png';
import {GlobalTheme} from '../../components/theme';
import {TextField, Divider, Button} from '../../components/common';

import {useDispatch, useSelector} from 'react-redux';
import {hideDetailFinanceScreenModal} from '../../store/actions/SearchLanding';

const DetailFinanceModal = (props) => {
	const dispatch = useDispatch();

	// useEffect(() => {
	// 	if (props.showDetailFinanceModal) {
	// 	}
	// }, [props.showDetailFinanceModal]);

	const modalCancelHandler = () => {
		dispatch(hideDetailFinanceScreenModal());
	};

	const callToDiscussHandler = () => {
		console.log('callToDiscussHandler');
		makeCall('03332420310');
		dispatch(hideDetailFinanceScreenModal());
	};

	return (
		<Modal
			statusBarTranslucent
			animationType="fade"
			transparent={true}
			visible={props.showDetailFinanceModal}>
			<ShadowView style={styles.modal}>
				<View style={styles.shadowViewStyle}>
					<View style={styles.headerStyle}>
						<TextField
							regular
							letterSpacing={-0.1}
							isRLH
							lineHeight={2.1}
							fontFamily={GlobalTheme.fontRegular}
							color={GlobalTheme.white}
							style={styles.textCloseStyle}
							onPress={modalCancelHandler}>
							Cancel
						</TextField>

						<TextField
							regular
							letterSpacing={-0.1}
							isRLH
							lineHeight={2.1}
							fontFamily={GlobalTheme.fontBold}
							color={GlobalTheme.white}
							style={styles.textFilterSearchStyle}>
							Need finance?
						</TextField>
					</View>

					<ScrollView
						showsVerticalScrollIndicator={false}
						contentContainerStyle={styles.ph12}>
						<Divider />

						<View style={styles.hireThatMoneyWrapper}>
							<Image source={Logo} style={styles.hireThatMoneyImage} />

							<TextField
								center
								xHuge
								letterSpacing={-1.03}
								isRLH
								lineHeight={6.3}
								fontFamily={GlobalTheme.fontBold}
								color={GlobalTheme.moneyColor}
								style={styles.moneyTextStyle}>
								MONEY
							</TextField>
						</View>

						<Divider large />

						<TextField
							center
							xThin
							letterSpacing={-0.38}
							isRLH
							lineHeight={2.2}
							fontFamily={GlobalTheme.fontBold}
							color={GlobalTheme.black}>
							Contact us now for a free,
						</TextField>

						<TextField
							center
							xThin
							letterSpacing={-0.38}
							isRLH
							lineHeight={2.2}
							fontFamily={GlobalTheme.fontBold}
							color={GlobalTheme.black}>
							no-obligation quote on 03332420310
						</TextField>

						<Divider xLarge />

						<Button
							title="CALL TO DISCUSS"
							blackButton
							onPress={callToDiscussHandler}
						/>

						<Divider xxLarge />
					</ScrollView>
				</View>
			</ShadowView>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modal: {
		flex: 1,
	},
	shadowViewStyle: {
		width: '94%',
		height: '54%',
		shadowRadius: GlobalTheme.shadowRadius,
		shadowColor: GlobalTheme.black,
		shadowOpacity: 0.28,
		borderWidth: 0.1,
		position: 'absolute',
		bottom: 0,
		alignSelf: 'center',
		backgroundColor: GlobalTheme.white,
		borderRadius: GlobalTheme.viewRadius,
		shadowOffset: {width: 0, height: 6},
		// elevation: 44,
	},
	headerStyle: {
		width: '100%',
		height: 49,
		backgroundColor: GlobalTheme.primaryColor,
		borderTopLeftRadius: GlobalTheme.viewRadius,
		borderTopRightRadius: GlobalTheme.viewRadius,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	textCloseStyle: {
		width: '40%',
		paddingLeft: 20,
		// borderWidth: 1,
		// borderColor: '#fff',
	},
	textFilterSearchStyle: {
		width: '60%',
		// borderWidth: 1,
	},
	ph12: {
		paddingHorizontal: 12,
	},
	hireThatMoneyWrapper: {
		width: '100%',
		height: hp('23%'),
		backgroundColor: GlobalTheme.primaryColor,
	},
	hireThatMoneyImage: {
		width: hp('20%'),
		height: hp('20%'),
		resizeMode: 'contain',
		alignSelf: 'center',
		// borderWidth: 1,
		// borderColor: 'green',
	},
	moneyTextStyle: {
		width: hp('20%'),
		height: hp('5%'),
		alignSelf: 'center',
		position: 'absolute',
		top: hp('16.5%'),
		// borderWidth: 1,
	},
});

export {DetailFinanceModal};
