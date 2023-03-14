// CUSTOM TAB BAR WITH tabbar props
import React, {useState, useEffect} from 'react';
import {View, Image, TouchableOpacity, StyleSheet} from 'react-native';

import ShadowView from 'react-native-simple-shadow-view';
import {useKeyboard} from '@react-native-community/hooks';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {Settings} from '../../screens';
import SearchStackScreen from '../stacks/Search';
import ProfileStackScreen from '../stacks/Profile';
import {GlobalTheme} from '../../components/theme';
import TabBarIcon from '../../components/images/TabBarIcon';

import {useSelector} from 'react-redux';

const Tab = createBottomTabNavigator();

function MyTabBar({state, descriptors, navigation}) {
	// console.log('state ==> ', state);
	// console.log('descriptors ==> ', descriptors);
	// console.log('navigation ==> ', navigation);

	const isFocused = useSelector((state) => state.focusedScreen.isFocused);

	const focusedOptions = descriptors[state.routes[state.index].key].options;
	// console.log('focusedOptions ==> ', focusedOptions);
	if (focusedOptions.tabBarVisible === false) {
		return null;
	}

	return isFocused ? (
		<ShadowView style={styles.shadowViewStyle}>
			{state.routes.map((route, index) => {
				// console.log('route, index ==> ', route, index);

				const {options} = descriptors[route.key];
				// console.log('options ==> ', options);

				let iconSource =
					route.name === 'Settings'
						? (iconSource = require('../../assets/image/icon/setting.png'))
						: route.name === 'SearchLanding'
						? (iconSource = <TabBarIcon />)
						: route.name === 'Profile'
						? (iconSource = require('../../assets/image/icon/user.png'))
						: null;

				const isFocused = state.index === index;

				const onPress = () => {
					const event = navigation.emit({
						type: 'tabPress',
						target: route.key,
						canPreventDefault: true,
					});

					if (!isFocused && !event.defaultPrevented) {
						navigation.navigate(route.name);
					}
				};

				const onLongPress = () => {
					navigation.emit({
						type: 'tabLongPress',
						target: route.key,
					});
				};

				return (
					<TouchableOpacity
						key={index}
						activeOpacity={1}
						accessibilityRole="button"
						accessibilityState={isFocused ? {selected: true} : {}}
						accessibilityLabel={options.tabBarAccessibilityLabel}
						testID={options.tabBarTestID}
						onPress={onPress}
						onLongPress={onLongPress}
						style={styles.tabBarContainerInnerStyle}>
						{route.name !== 'SearchLanding' ? (
							<Image
								style={styles.tabBarImageStyle(isFocused)}
								source={iconSource}
							/>
						) : (
							/* commented on 9th Nov 2021 */
							// <View style={styles.tabBarIconWrapperStyle}>
							<TabBarIcon />
							// </View>
						)}
					</TouchableOpacity>
				);
			})}
		</ShadowView>
	) : null;
}

const BottomTabBar = (props) => {
	const keyboard = useKeyboard();
	const isKeyboardShowing = keyboard.keyboardShown;

	return (
		<Tab.Navigator
			initialRouteName="SearchLanding"
			tabBar={(props) => {
				return !isKeyboardShowing ? <MyTabBar {...props} /> : null;
			}}>
			<Tab.Screen name="Settings" component={Settings} />
			<Tab.Screen
				name="SearchLanding"
				component={SearchStackScreen}
				// options={{tabBarVisible: true}}
			/>
			<Tab.Screen name="Profile" component={ProfileStackScreen} />
		</Tab.Navigator>
	);
};

export default BottomTabBar;

// // TAB BAR WITHOUT tabbar props but with image
// import React from 'react';
// import {Image, StyleSheet} from 'react-native';

// import ShadowView from 'react-native-simple-shadow-view';
// import {useKeyboard} from '@react-native-community/hooks';
// import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

// import {Settings, Profile} from '../../screens';
// import SearchStackScreen from '../stacks/Search';
// import {GlobalTheme} from '../../components/theme';
// import TabBarIcon from '../../components/images/TabBarIcon';

// const Tab = createBottomTabNavigator();

// const BottomTabBar = (props) => {
// 	const keyboard = useKeyboard();
// 	const isKeyboardShowing = keyboard.keyboardShown;

// 	return (
// 		<Tab.Navigator
// 			initialRouteName="SearchLanding"
// 			tabBarOptions={{
// 				// showLabel: false,
// 				activeTintColor: GlobalTheme.primaryColor,
// 				inactiveTintColor: GlobalTheme.black,
// 				keyboardHidesTabBar: true,
// 				style: styles.tabBarMainWrapperStyle,
// 				// labelStyle: {
// 				// 	textAlign: 'center',
// 				// 	// fontSize: ScreenUtil.scale(14),
// 				// 	fontSize: 22,
// 				// },
// 				// indicatorStyle: {
// 				// 	borderBottomWidth: 2,
// 				// 	borderBottomColor: '#87B56A',
// 				// },
// 			}}
// 			screenOptions={({route}) => ({
// 				tabBarLabel: '',
// 				// tabBarLabel: ({focused, color, size}) => {
// 				// 	return (
// 				// 		<Text
// 				// 			style={{
// 				// 				fontSize: 14,
// 				// 				fontWeight: '600',
// 				// 				color: GlobalTheme.primaryColor,
// 				// 			}}>
// 				// 			{focused ? route.name : ''}
// 				// 		</Text>
// 				// 	);
// 				// },
// 				tabBarIcon: ({focused, color, size}) => {
// 					let iconSource;

// 					if (route.name === 'Settings') {
// 						iconSource = require('../../assets/image/icon/setting.png');
// 					} else if (route.name === 'SearchLanding') {
// 						iconSource = <TabBarIcon />;
// 					} else if (route.name === 'Profile') {
// 						iconSource = require('../../assets/image/icon/user.png');
// 					}

// 					const icon =
// 						route.name !== 'SearchLanding' ? (
// 							<Image
// 								style={styles.tabBarImageStyleOnWithoutTabBarProps(focused)}
// 								source={iconSource}
// 							/>
// 						) : !isKeyboardShowing ? (
// 							<TabBarIcon />
// 						) : null;

// 					return icon;
// 				},
// 			})}
// 			// sceneContainerStyle={{
// 			// 	style: {},
// 			// }}
// 		>
// 			<Tab.Screen name="Settings" component={Settings} />
// 			<Tab.Screen name="SearchLanding" component={SearchStackScreen} />
// 			<Tab.Screen name="Profile" component={Profile} />
// 		</Tab.Navigator>
// 	);
// };

// export default BottomTabBar;

const styles = StyleSheet.create({
	// CUSTOM TAB BAR WITH tabbar props
	shadowViewStyle: {
		flexDirection: 'row',
		width: '100%',
		// height: 82,
		height: hp('10.5%'),
		borderTopWidth: 0.5,
		borderColor: '#0000002E',
		elevation: 44,
		// shadowRadius: GlobalTheme.shadowRadius,
		// shadowColor: GlobalTheme.black,
		// shadowOpacity: 0.28,
		// borderWidth: 0.1,
		// borderColor: 'transparent',
		// backgroundColor: GlobalTheme.white,
		// borderRadius: GlobalTheme.viewRadius,
		// shadowOffset: {width: 0, height: 6},

		// borderWidth: 1,
		// borderColor: 'blue',
	},
	tabBarContainerInnerStyle: {
		flex: 1,
		// height: 82,
		height: hp('10.5%'),
		backgroundColor: GlobalTheme.white,
		// borderWidth: 1,
	},
	tabBarImageStyle: (isFocused) => ({
		// width: 45,
		// height: 45,
		width: hp('5.8%'),
		height: hp('5.8%'),
		resizeMode: 'contain',
		top: 5,
		alignSelf: 'center',
		tintColor: isFocused ? GlobalTheme.primaryColor : GlobalTheme.black,
		// borderWidth: 1,
		// borderColor: 'blue',
	}),
	// tabBarIconWrapperStyle: {  // commented on 9th Nov 2021
	// bottom: 68,
	// bottom: hp('2.6%'),
	// borderWidth: 1,
	// },

	// TAB BAR WITHOUT tabbar props but with image
	// tabBarMainWrapperStyle: {
	// 	height: 82,
	// 	backgroundColor: GlobalTheme.white,
	// 	// borderTopWidth: 1,
	// 	// borderTopColor: 'green',
	// },
	// tabBarImageStyleOnWithoutTabBarProps: (focused) => ({
	// 	width: 45,
	// 	height: 45,
	// 	resizeMode: 'contain',
	// 	position: 'absolute',
	// 	top: 5,
	// 	tintColor: focused ? GlobalTheme.primaryColor : GlobalTheme.black,
	// }),
});
