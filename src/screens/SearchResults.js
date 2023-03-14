import React from 'react';
import {View, StyleSheet} from 'react-native';

import {isTablet} from 'react-native-device-info';
import {useFocusEffect} from '@react-navigation/native';
import {
	heightPercentageToDP as hp,
	widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {IOS, ANDROID} from '../helper';
import {GlobalTheme} from '../components/theme';
import {GenericView, Header} from '../components/common';
import MaterialTabStackScreen from '../routes/top/MaterialTab';

import {useDispatch} from 'react-redux';
import {headerTitle} from '../store/actions/Header';

const SearchResults = (props) => {
	const dispatch = useDispatch();

	useFocusEffect(
		React.useCallback(() => {
			let headerConfig = {
				isBackArrow: true,
				leftTitle: 'Search',
				isRightContent: false,
				rightTitle: '',
				navParam: '',
			};

			dispatch(headerTitle(headerConfig));
		}, []),
	);

	// const aspectRatio = GlobalTheme.deviceHeight / GlobalTheme.deviceWidth;
	// console.log('aspectRatio ==> ', aspectRatio);
	return (
		<GenericView isBackgroundColor>
			<>
				<Header />
				<View style={styles.mainView}>
					{/* added on 19 aug */}
					<View style={styles.materialTabTopStyle(isTablet())} />

					<MaterialTabStackScreen />
				</View>
			</>
		</GenericView>
	);
};

const styles = StyleSheet.create({
	mainView: {
		flex: 1,
		// top: IOS ? hp('-7.4%') : null, // commented on 19 aug
		// borderWidth: 1,
	},
	materialTabTopStyle: (isTablet) => ({
		height: ANDROID && isTablet ? hp(7.3) : hp(5.5), // commented and added on 10th Nov
		backgroundColor: GlobalTheme.primaryColor,
	}),
});

export {SearchResults};
