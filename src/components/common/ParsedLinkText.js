import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';

import {GlobalTheme} from '../theme';
import {TextField} from './TextField';

const ParsedLinkText = (props) => {
	return (
		<TouchableOpacity
			onPress={props.onPress}
			style={styles.parsedLinkTextStyle}>
			<TextField
				xThin
				isRLH
				lineHeight={1.9}
				letterSpacing={-0.13}
				color={props.color ? props.color : GlobalTheme.textHyperLinkColor}
				fontFamily={GlobalTheme.fontBold}
				style={props.style}>
				{props.children}
			</TextField>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	parsedLinkTextStyle: {
		// borderWidth: 1,
	},
});

export {ParsedLinkText};
