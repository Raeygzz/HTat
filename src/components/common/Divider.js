import React from 'react';
import {View, StyleSheet} from 'react-native';

import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

import {GlobalTheme} from '../theme/GlobalTheme';

const Divider = (props) => {
	const styles = _styles(props);

	return <View style={styles.container} />;
};

const _styles = ({
	small,
	medium,
	xMedium,
	xxMedium,
	xxxMedium,
	large,
	xLarge,
	xxLarge,
	xxxLarge,
	xxxHuge,
	borderTopWidth = 0,
	color = GlobalTheme.primaryColor,
	horizontal,
}) => {
	return StyleSheet.create({
		container: {
			width: horizontal
				? small
					? hp('0.6%')
					: medium
					? hp('1.0%')
					: xMedium
					? hp('1.2%')
					: xxMedium
					? hp('1.6%')
					: xxxMedium
					? hp('2.1%')
					: large
					? hp('2.4%')
					: xLarge
					? hp('3.8%')
					: xxLarge
					? hp('4.2%')
					: xxxLarge
					? hp('6.4%')
					: xxxHuge
					? hp('8.6%')
					: hp('2.0%')
				: null,

			height: horizontal
				? null
				: small
				? hp('0.6%')
				: medium
				? hp('1.0%')
				: xMedium
				? hp('1.2%')
				: xxMedium
				? hp('1.6%')
				: xxxMedium
				? hp('2.1%')
				: large
				? hp('2.4%')
				: xLarge
				? hp('3.8%')
				: xxLarge
				? hp('4.2%')
				: xxxLarge
				? hp('6.4%')
				: xxxHuge
				? hp('8.6%')
				: hp('2.0%'),
			// borderWidth: 1,
			borderColor: color ? color : null,
			borderTopWidth: borderTopWidth ? borderTopWidth : null,
		},
	});
};

export {Divider};
