import React from 'react';
import {View, StyleSheet, Animated} from 'react-native';

import {useFocusEffect} from '@react-navigation/native';
import {
	heightPercentageToDP as hp,
	widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import Logo from '../assets/image/logo.png';
import {GlobalTheme} from '../components/theme';
import {GenericView, Button, Divider, TextField} from '../components/common';

import {useSelector, useDispatch} from 'react-redux';
import {
	animationValidate,
	backButtonWelcomScreenAnimation,
} from '../store/actions/Animations';

const Welcome = (props) => {
	const startAnimation = useSelector((state) => state.animate.startAnimation);

	const dispatch = useDispatch();

	const HTImageScale = new Animated.Value(1.5);
	const HTImageCoord = new Animated.ValueXY({x: 0, y: 95});
	const registerButtonValue = new Animated.Value(125);
	const loginButtonWidthAnimateValue = new Animated.Value(50);
	const loginButtonPositionAnimateValue = new Animated.Value(70);

	useFocusEffect(
		React.useCallback(() => {
			Animated.parallel([
				Animated.timing(HTImageCoord, {
					toValue: {x: 0, y: 0},
					duration: 300,
					useNativeDriver: false,
				}),
				Animated.timing(HTImageScale, {
					toValue: 1,
					duration: 300,
					useNativeDriver: false,
				}),
			]).start();
		}, []),
	);

	useFocusEffect(
		React.useCallback(() => {
			if (startAnimation) {
				Animated.parallel([
					Animated.timing(registerButtonValue, {
						toValue: 0,
						duration: 300,
						useNativeDriver: false,
					}),
					Animated.timing(loginButtonPositionAnimateValue, {
						toValue: 0,
						duration: 300,
						useNativeDriver: false,
					}),
					Animated.timing(loginButtonWidthAnimateValue, {
						toValue: 100,
						duration: 300,
						useNativeDriver: false,
					}),
				]).start();
			}

			return () => dispatch(backButtonWelcomScreenAnimation(false));
		}, [startAnimation]),
	);

	const loginNavigationHandler = () => {
		dispatch(animationValidate(true));

		props.navigation.navigate('Login');
	};

	const registerChoiceNavigationHandler = () => {
		dispatch(animationValidate(false));

		props.navigation.navigate('RegisterEmail');
	};

	return (
		<GenericView>
			<View style={styles.mainView}>
				<View style={styles.firstLayout}>
					<Animated.Image
						source={Logo}
						style={[
							styles.logo,
							{
								transform: [
									{scale: HTImageScale},
									{translateY: HTImageCoord.y},
								],
							},
						]}
					/>

					<TextField
						center
						regular
						isRLH
						lineHeight={2.2}
						fontFamily={GlobalTheme.fontBold}
						color={GlobalTheme.black}>
						THE HOLISTIC HIRE,
					</TextField>

					<TextField
						center
						regular
						isRLH
						lineHeight={2.2}
						fontFamily={GlobalTheme.fontBold}
						color={GlobalTheme.black}>
						FINANCE & SELLING
					</TextField>

					<TextField
						center
						regular
						isRLH
						lineHeight={2.2}
						fontFamily={GlobalTheme.fontBold}
						color={GlobalTheme.black}>
						PLATFORM
					</TextField>
				</View>

				<Divider xxLarge />

				<View style={styles.secondLayout}>
					<Animated.View
						style={{
							top: startAnimation ? registerButtonValue : null,
						}}>
						<Button
							title="REGISTER FREE ACCOUNT"
							onPress={registerChoiceNavigationHandler}
						/>
					</Animated.View>

					<Divider xLarge />

					<Animated.View
						style={{
							bottom: startAnimation ? loginButtonPositionAnimateValue : null,
							width: startAnimation
								? loginButtonWidthAnimateValue.interpolate({
										inputRange: [0, 100],
										outputRange: ['0%', '100%'],
								  })
								: null,
						}}>
						<Button title="LOGIN" onPress={loginNavigationHandler} />
					</Animated.View>
				</View>
			</View>
		</GenericView>
	);
};

const styles = StyleSheet.create({
	mainView: {
		flex: 1,
		paddingHorizontal: hp('5.4%'),
		// borderWidth: 1,
		// borderColor: 'blue',
	},
	firstLayout: {
		flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'center',
		// borderWidth: 1,
	},
	logo: {
		width: wp('39.5%'),
		height: hp('19.5%'),
		resizeMode: 'contain',
		// borderWidth: 1,
		// borderColor: 'red',
	},
	secondLayout: {
		flex: 1,
		// borderWidth: 1,
		// borderColor: 'green',
	},
});

export {Welcome};
