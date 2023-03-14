import React from 'react';
import {View, Image, StyleSheet} from 'react-native';

import ShadowView from 'react-native-simple-shadow-view';
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {GlobalTheme} from '../theme';
import {TextField, Divider, Button} from '../common';

const HiringOutNoSetupCard = (props) => {
	return (
		<ShadowView style={[props.style, styles.hiringOutShadowViewStyle]}>
			<View style={styles.hiringOutInner}>
				<View style={styles.hiringOutInnerLeftLayout}>
					<Image
						source={require('../../assets/image/arrow.png')}
						style={styles.arrowImageStyle}
					/>
				</View>
				<View style={styles.hiringOutInnerRightLayout}>
					<TextField
						small
						letterSpacing={-0.36}
						// lineHeight={22}
						isRLH
						lineHeight={1.8}
						fontFamily={GlobalTheme.fontBold}
						color={GlobalTheme.white}>
						Advertise your items for hire & sale
					</TextField>

					<Divider medium />

					<TextField
						thin
						letterSpacing={-0.29}
						// lineHeight={18}
						isRLH
						lineHeight={2.0}
						fontFamily={GlobalTheme.fontRegular}
						color={GlobalTheme.white}>
						Do you have decent kit sitting around which you are not using? Why
						not let your investment earn you some extra money by hiring it out
						through our app?
					</TextField>
				</View>
			</View>

			<View style={styles.hiringOutInnerButtonStyle}>
				<Button blackButton title="FIND OUT MORE" onPress={props.noSetupCard} />
			</View>
		</ShadowView>
	);
};

const styles = StyleSheet.create({
	hiringOutShadowViewStyle: {
		width: '95%',
		// height: 166,
		height: hp('21.5%'),
		// padding: 20,
		padding: hp('2.0%'),
		shadowRadius: GlobalTheme.shadowRadius,
		shadowColor: GlobalTheme.black,
		shadowOpacity: 0.28,
		borderWidth: 0.1,
		borderColor: 'transparent',
		backgroundColor: GlobalTheme.primaryColor,
		borderRadius: GlobalTheme.viewRadius,
		shadowOffset: {width: 0, height: 6},
	},
	hiringOutInner: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		height: '68%',
		// borderWidth: 1,
		// borderColor: 'yellow',
	},
	hiringOutInnerLeftLayout: {
		width: '14%',
		// borderWidth: 1,
		// borderColor: 'green',
	},
	arrowImageStyle: {
		// width: wp('9.6%'),
		// height: hp('6.7%'),
		width: null,
		height: hp('7.0%'),
		resizeMode: 'contain',
		// borderWidth: 1,
		// borderColor: 'blue',
	},
	hiringOutInnerRightLayout: {
		width: '84%',
		// borderWidth: 1,
	},
	hiringOutInnerButtonStyle: {
		height: '32%',
		justifyContent: 'center',
		// borderWidth: 1,
		// borderColor: 'white',
	},
});

export {HiringOutNoSetupCard};
