import React from 'react';
import {View, Modal, StyleSheet, ActivityIndicator} from 'react-native';

import {GlobalTheme} from '../theme/GlobalTheme';

import {useSelector} from 'react-redux';

const Loader = () => {
	const loaderState = useSelector((state) => state.loader.presentLoader);

	return (
		<Modal
			statusBarTranslucent={true}
			animationType="fade"
			transparent={true}
			visible={loaderState}>
			<View style={styles.loaderView}>
				<ActivityIndicator animating={true} size="large" color={GlobalTheme.white} />
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	loaderView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0,0,0,0.44)',
	},
});

export {Loader};
