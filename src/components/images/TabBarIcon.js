import React from 'react';
import {View, Image, StyleSheet} from 'react-native';

import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const TabBarIcon = () => {
	return (
		<View
		// style={styles.mainView}
		>
			<Image
				source={require('../../assets/image/icon.png')}
				style={styles.tabMiddleImage}
				// resizeMode="cover"
				resizeMode="contain" // commented & added on 9th Nov 2021
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	// mainView: {
	// 	width: '100%',
	// 	// height: 200,
	// 	height: hp('14.0%'),
	// 	justifyContent: 'center',
	// 	alignItems: 'center',
	// 	// borderWidth: 1,
	// 	// borderColor: 'green',
	// },
	tabMiddleImage: {
		// width: '100%',
		width: '74%', // commented & added on 9th Nov 2021
		alignSelf: 'center', // added on 9th Nov 2021
		// height: hp('25.8%'),
		height: hp('14.0%'), // commented & added on 9th Nov 2021
		position: 'absolute',
		// bottom: hp(0.4),
		bottom: hp(-12.0), // commented & added on 9th Nov 2021
		// top: 0,
		// borderWidth: 1,
		// borderColor: 'blue',
	},
});

export default TabBarIcon;
