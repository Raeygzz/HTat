import React from 'react';
import {Keyboard, StyleSheet, TouchableWithoutFeedback} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';

import {BackButton} from '../common/Button';
import {GlobalTheme} from '../theme/GlobalTheme';

const GenericView = ({
	showBackButton = false,
	title = null,
	children,
	isBackgroundColor,
	// dismiss = null,
}) => {
	const dismissKeyboardHandler = () => {
		Keyboard.dismiss();

		// 	if (dismiss != null) {
		// 		dismiss();
		// 	}
	};

	return (
		<SafeAreaView style={styles.safeAreaView(isBackgroundColor)}>
			{showBackButton && <BackButton title={title} />}
			<TouchableWithoutFeedback onPress={dismissKeyboardHandler}>
				{children}
			</TouchableWithoutFeedback>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	safeAreaView: (isBackgroundColor = false) => ({
		flex: 1,
		backgroundColor: isBackgroundColor
			? GlobalTheme.white
			: GlobalTheme.primaryColor,
	}),
});

export {GenericView};
