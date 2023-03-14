import React, {useState, useEffect} from 'react';
import {View, StyleSheet, TouchableWithoutFeedback} from 'react-native';

import {useFocusEffect} from '@react-navigation/native';
import ShadowView from 'react-native-simple-shadow-view';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

import {GlobalTheme} from '../theme/GlobalTheme';

import {useSelector} from 'react-redux';

const OnlyCheckBox = (props) => {
	const {screen = ''} = props;

	const onlyCheckBoxSelected = useSelector(
		(state) => state.adverts.singleAdvert.vat,
	);
	const onlyCheckBoxSelectedForTradingAccount = useSelector(
		(state) => state.settings.businessProfileDetails[0]?.vat_registered,
	);

	const [selected, setSelected] = useState(false);

	useFocusEffect(
		React.useCallback(() => {
			if (screen != 'EditAdvert' && screen != 'TradingAccount') {
				setSelected(false);
			}
		}, [screen]),
	);

	useEffect(() => {
		if (
			screen === 'EditAdvert' &&
			(onlyCheckBoxSelected === 0 || onlyCheckBoxSelected === 1)
		) {
			let selectedValue = onlyCheckBoxSelected === 1 ? true : false;
			setSelected(selectedValue);
		}
	}, [screen, onlyCheckBoxSelected]);

	useEffect(() => {
		if (
			screen === 'TradingAccount' &&
			(onlyCheckBoxSelectedForTradingAccount === 0 ||
				onlyCheckBoxSelectedForTradingAccount === 1)
		) {
			let selectedValue =
				onlyCheckBoxSelectedForTradingAccount === 1 ? true : false;
			setSelected(selectedValue);
		}
	}, [screen, onlyCheckBoxSelectedForTradingAccount]);

	return (
		<TouchableWithoutFeedback
			onPress={() => {
				setSelected(!selected);
				props.onPress(!selected);
			}}>
			<View style={[styles.checkboxWrapper(props.style.width)]}>
				<ShadowView style={styles.checkbox}>
					{selected ? <View style={styles.selectedStyle} /> : null}
				</ShadowView>
			</View>
		</TouchableWithoutFeedback>
	);
};

const styles = StyleSheet.create({
	checkboxWrapper: (width = '10%') => ({
		flex: 1,
		width: width,
		height: hp('3.8%'),
		paddingLeft: hp('0.4%'),
		// borderWidth: 1,
		// borderColor: 'blue',
	}),
	checkbox: {
		width: hp('3.4%'),
		height: hp('3.4%'),
		borderWidth: 0.1,
		borderColor: 'transparent',
		shadowOpacity: 0.28,
		shadowColor: GlobalTheme.black,
		shadowRadius: GlobalTheme.shadowRadius,
		borderRadius: GlobalTheme.viewRadius,
		backgroundColor: GlobalTheme.white,
		shadowOffset: {width: 0, height: 6},
	},
	selectedStyle: {
		width: hp('2.8%'),
		height: hp('2.8%'),
		marginTop: hp('0.3%'),
		alignSelf: 'center',
		borderRadius: GlobalTheme.viewRadius,
		backgroundColor: GlobalTheme.primaryColor,
	},
});

export {OnlyCheckBox};
