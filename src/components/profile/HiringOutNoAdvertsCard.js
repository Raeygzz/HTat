import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';

import ShadowView from 'react-native-simple-shadow-view';
import analytics from '@react-native-firebase/analytics';
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {GlobalTheme} from '../theme';
import {TextField, Divider} from '../common';
import {CreateItemConditionCheck} from '../../models';

import {useSelector} from 'react-redux';

const HiringOutNoAdvertsCard = (props) => {
	const advertList = useSelector((state) => state.adverts.advertList);
	const hiringOutList = useSelector((state) => state.hire.hiringOutList);
	const userEmail = useSelector((state) => state.auth.user.email);
	// const completedStripeOnboarding = useSelector(
	// 	(state) => state.auth.user.completed_stripe_onboarding,
	// );
	const hasPrimaryAddress = useSelector(
		(state) => state.auth.user.has_primary_address,
	);
	// const hasPrimaryCard = useSelector(
	// 	(state) => state.auth.user.has_primary_card,
	// );
	const hasBusinessProfile = useSelector(
		(state) => state.auth.user.has_business_profile,
	);

	const onPostAdvertNavigateHandler = () => {
		analytics().logEvent('post_advert_pressed');

		CreateItemConditionCheck(
			userEmail,
			// completedStripeOnboarding,
			hasPrimaryAddress,
			// hasPrimaryCard,
			hasBusinessProfile,
			props.navigation,
		);
	};

	return (
		<ShadowView style={[props.style, styles.hiringOutShadowViewStyle]}>
			<View style={styles.hiringOutInner}>
				<View style={styles.hiringOutInnerLeftLayout}>
					<View style={styles.hiringOutInnerLeftLayoutContentStyle} />
				</View>
				<View style={styles.hiringOutInnerRightLayout}>
					<TextField
						xSmall
						letterSpacing={-0.36}
						// lineHeight={22}
						isRLH
						lineHeight={2.2}
						fontFamily={GlobalTheme.fontBold}
						color={GlobalTheme.defaultBlack}>
						No adverts
					</TextField>

					<Divider medium />

					<TextField
						xThin
						letterSpacing={-0.29}
						// lineHeight={18}
						isRLH
						lineHeight={1.8}
						fontFamily={GlobalTheme.fontRegular}
						color={GlobalTheme.defaultBlack}>
						{advertList.length > 0 && hiringOutList.length < 1
							? "You haven't yet successfully hired out any items. Be patient, Hire That is working on that for you."
							: 'You have not added any item for hire yet. Why not post one?'}
					</TextField>

					<Divider medium />

					<TouchableOpacity onPress={onPostAdvertNavigateHandler}>
						<TextField
							xSmall
							letterSpacing={-0.36}
							// lineHeight={18}
							isRLH
							lineHeight={1.9}
							fontFamily={GlobalTheme.fontRegular}
							color={GlobalTheme.primaryColor}>
							Post an advert
						</TextField>
					</TouchableOpacity>
				</View>
			</View>
		</ShadowView>
	);
};

const styles = StyleSheet.create({
	hiringOutShadowViewStyle: {
		width: '95%',
		// height: 104,
		height: hp('13.0%'),
		padding: 10,
		shadowRadius: GlobalTheme.shadowRadius,
		shadowColor: GlobalTheme.black,
		shadowOpacity: 0.28,
		borderWidth: 0.1,
		borderColor: 'transparent',
		backgroundColor: GlobalTheme.white,
		borderRadius: GlobalTheme.viewRadius,
		shadowOffset: {width: 0, height: 6},
	},
	hiringOutInner: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		height: '100%',
		// borderWidth: 1,
		// borderColor: 'yellow',
	},
	hiringOutInnerLeftLayout: {
		width: '20%',
		// borderWidth: 1,
	},
	hiringOutInnerLeftLayoutContentStyle: {
		// width: 50,
		// height: 50,
		width: hp('5.8%'),
		height: hp('5.8%'),
		backgroundColor: '#DDDDDD',
	},
	hiringOutInnerRightLayout: {
		width: '80%',
		// borderWidth: 1,
	},
});

export {HiringOutNoAdvertsCard};
