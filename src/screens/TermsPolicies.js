import React from 'react';
import {View, StyleSheet} from 'react-native';

import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

import {IOS} from '../helper';
import {TextField} from '../components/common';
import {GlobalTheme} from '../components/theme';
import {TermsPoliciesView} from '../components/termsPolicies/TermsPoliciesView';

const TermsPolicies = (props) => {
	const onCancelHandler = () => {
		props.navigation.goBack();
	};

	return (
		<View style={styles.modal}>
			<View style={styles.headerStyle}>
				<TextField
					regular
					letterSpacing={-0.1}
					isRLH
					lineHeight={2.4}
					fontFamily={GlobalTheme.fontRegular}
					color={GlobalTheme.white}
					style={styles.textCloseStyle}
					onPress={onCancelHandler}>
					Cancel
				</TextField>

				<TextField
					medium
					letterSpacing={-0.1}
					isRLH
					lineHeight={2.4}
					fontFamily={GlobalTheme.fontBold}
					color={GlobalTheme.white}
					style={styles.modalHeaderStyle}>
					{props.route?.params?.terms?.title}
				</TextField>
			</View>

			<TermsPoliciesView link={props.route?.params?.terms?.link} />
		</View>
	);
};

const styles = StyleSheet.create({
	modal: {
		flex: 1,
		// borderWidth: 2,
		// borderColor: 'blue',
	},
	headerStyle: {
		width: '100%',
		height: hp('10%'), // added & commented on 19 aug
		// height: IOS ? hp('7.4%') : hp('10%'),
		backgroundColor: GlobalTheme.primaryColor,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		// borderWidth: 1,
	},
	textCloseStyle: {
		width: '32%',
		top: hp('2.4%'), // added & commented on 19 aug
		// top: IOS ? hp('0.8%') : hp('2.4%'),
		paddingLeft: hp('2.5%'),
		// borderWidth: 1,
	},
	modalHeaderStyle: {
		width: '78%',
		top: hp('2.4%'), // added & commented on 19 aug
		// top: IOS ? hp('0.8%') : hp('2.4%'),
		// borderWidth: 1,
	},
});

export {TermsPolicies};
