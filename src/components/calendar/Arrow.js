import React from 'react';
import {StyleSheet} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import {
	heightPercentageToDP as hp,
	widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {GlobalTheme} from '../theme/GlobalTheme';

const Arrow = (props) => {
	return (
		<>
			{props.direction === 'left' && (
				<Icon
					name="ios-chevron-back-circle-sharp"
					size={hp('4.5%')}
					color={GlobalTheme.primaryColor}
				/>
			)}

			{props.direction === 'right' && (
				<Icon
					name="ios-chevron-forward-circle-sharp"
					size={hp('4.5%')}
					color={GlobalTheme.primaryColor}
				/>
			)}
		</>
	);
};

const styles = StyleSheet.create({});

export {Arrow};
