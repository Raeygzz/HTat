import React from 'react';
import {StyleSheet} from 'react-native';

import {GlobalTheme} from '../theme';
import {TextField} from './TextField';

const ParsedText = (props) => {
	return (
		<TextField
			regular
			isRLH
			lineHeight={2.0}
			fontFamily={GlobalTheme.fontRegular}
			color={props.color ? props.color : GlobalTheme.black}
			style={[props.style, styles.parsedTextWrapperStyle]}>
			{props.children}
		</TextField>
	);
};

const styles = StyleSheet.create({
	parsedTextWrapperStyle: {},
});

export {ParsedText};
