import React from 'react';
import {View, StyleSheet} from 'react-native';

import ShadowView from 'react-native-simple-shadow-view';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

import {TextField} from './TextField';
import {GlobalTheme} from '../theme/GlobalTheme';

const SuccessCard = ({title = 'NA', iconName = null}) => {
	return (
		<ShadowView style={styles.shadowView}>
			<View style={styles.toastContent}>
				{iconName !== null ? (
					<Icon
						name={iconName}
						size={19}
						color={GlobalTheme.green}
						style={styles.topMinus6}
					/>
				) : null}

				<TextField
					small
					lineHeight={20}
					color={GlobalTheme.green}
					fontFamily={GlobalTheme.fontBold}
					style={styles.textFieldWidthStyle}>
					{title}
				</TextField>
			</View>
		</ShadowView>
	);
};

const styles = StyleSheet.create({
	shadowView: {
		width: '100%',
		height: 50,
		shadowRadius: GlobalTheme.shadowRadius,
		shadowColor: GlobalTheme.black,
		shadowOpacity: 0.28,
		borderWidth: 0.1,
		padding: 10,
		alignSelf: 'center',
		justifyContent: 'center',
		borderColor: 'transparent',
		backgroundColor: GlobalTheme.white,
		borderRadius: GlobalTheme.viewRadius,
		shadowOffset: {width: 0, height: 6},
	},
	toastContent: {
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		alignItems: 'center',
	},
	topMinus6: {
		width: '10%',
		height: 40,
		paddingTop: 4,
		// borderWidth: 1,
	},
	textFieldWidthStyle: {
		width: '90%',
		height: 40,
		// borderWidth: 1,
	},
});

export {SuccessCard};
