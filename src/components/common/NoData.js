import React from 'react';
import {View, StyleSheet} from 'react-native';

import {GlobalTheme} from '../theme';
import {TextField} from './TextField';

const NoData = (props) => {
	const {title, style} = props;

	return (
		<TextField
			center
			title
			isRLH
			lineHeight={2.6}
			fontFamily={GlobalTheme.fontRegular}
			color={GlobalTheme.black}
			style={style}>
			{title || 'No Data Found'}
		</TextField>
	);
};

const styles = StyleSheet.create({});

export {NoData};
