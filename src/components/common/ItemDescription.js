import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import {GlobalTheme} from '../theme';
import {TextField} from './TextField';

const ItemDescription = (props) => {
	const [descriptionNumberOfLine, setDescriptionNumberOfLine] = useState(1);
	const [descriptionStatus, setDescriptionStatus] = useState('View more');

	const viewMoreHandler = () => {
		if (descriptionStatus === 'View more') {
			setDescriptionNumberOfLine(100);
			setDescriptionStatus('View less');
		}

		if (descriptionStatus === 'View less') {
			setDescriptionNumberOfLine(1);
			setDescriptionStatus('View more');
		}
	};

	return (
		<>
			<View>
				<TextField
					xThin
					letterSpacing={-0.07}
					isRLH
					lineHeight={1.8}
					numberOfLines={descriptionNumberOfLine}
					fontFamily={GlobalTheme.fontRegular}
					color={GlobalTheme.black}>
					{props.description}
				</TextField>
				<LinearGradient
					start={{x: 0.0, y: 0.5}}
					end={{x: 0.0, y: 1.0}}
					locations={[0.0, 1.0]}
					colors={['#FFFFFF00', '#FFFFFF']}
					style={styles.gradient}
				/>
			</View>

			<TouchableOpacity onPress={viewMoreHandler}>
				<TextField
					xThin
					letterSpacing={-0.07}
					isRLH
					lineHeight={1.8}
					fontFamily={GlobalTheme.fontRegular}
					color={GlobalTheme.primaryColor}>
					+ {descriptionStatus}
				</TextField>
			</TouchableOpacity>
		</>
	);
};

const styles = StyleSheet.create({
	gradient: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
	},
});

export {ItemDescription};
