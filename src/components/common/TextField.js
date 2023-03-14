import React from 'react';
import {Text, StyleSheet} from 'react-native';

import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

import {GlobalTheme} from '../theme/GlobalTheme';

const TextField = (props) => {
	const styles = _styles(props);

	const {children, onPress, style, numberOfLines} = props;

	return (
		<Text
			style={[style, styles.text]}
			onPress={onPress}
			// ellipsizeMode="tail"
			numberOfLines={numberOfLines ? numberOfLines : null}>
			{children}
		</Text>
	);
};

const _styles = ({
	xxxHuge,
	xxHuge,
	xHuge,
	huge,
	title,
	medium,
	regular,
	xSmall,
	small,
	xThin,
	thin,
	color,
	bold,
	isRLH = false,
	lineHeight,
	fontFamily,
	center,
	left,
	right,
	justify,
	auto,
	letterSpacing,
}) => {
	return StyleSheet.create({
		text: {
			fontSize: xxxHuge
				? hp('10.0%')
				: xxHuge
				? hp('7.5%')
				: xHuge
				? hp('6.0%')
				: huge
				? hp('2.9%')
				: title
				? hp('2.4%')
				: medium
				? hp('2.2%')
				: regular
				? hp('2.0%')
				: xSmall
				? hp('1.9%')
				: small
				? hp('1.8%')
				: xThin
				? hp('1.6%')
				: thin
				? hp('1.4%')
				: hp('2.0%'),
			fontWeight: bold ? 'bold' : null,
			fontFamily: fontFamily ? fontFamily : null,
			lineHeight: isRLH ? hp(lineHeight) : lineHeight ? lineHeight : null,
			color: color ? color : GlobalTheme.placeholderColor,
			textAlign: center
				? 'center'
				: auto
				? 'auto'
				: left
				? 'left'
				: right
				? 'right'
				: justify
				? 'justify'
				: null,
			letterSpacing: letterSpacing ? letterSpacing : null,
		},
	});
};

export {TextField};
