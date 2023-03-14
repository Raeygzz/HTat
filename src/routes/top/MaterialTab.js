import * as React from 'react';

import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

import BuyStackScreen from '../stacks/Buy';
import HireStackScreen from '../stacks/Hire';
import {GlobalTheme} from '../../components/theme/GlobalTheme';

const MaterialTab = createMaterialTopTabNavigator();

const MaterialTabStackScreen = () => {
	return (
		<MaterialTab.Navigator
			lazy={true}
			initialRouteName="Hire"
			tabBarOptions={{
				activeTintColor: GlobalTheme.primaryColor,
				inactiveTintColor: GlobalTheme.black,
				// labelStyle: GlobalTheme.primaryColor,
				// indicatorStyle: {backgroundColor: null},
				// tabStyle: { backgroundColor: GlobalTheme.shadowColor },
				indicatorStyle: {
					height: null,
					top: 0,
					backgroundColor: GlobalTheme.white,
					// borderWidth: 1,
					// borderColor: 'blue',
				},
				tabStyle: {
					// borderWidth: 1,
				},
				labelStyle: {
					fontSize: GlobalTheme.fontSizeTitle,
					// lineHeight: hp(2.4),
					// top: hp(0.3),
					// alignSelf: 'center',
					fontFamily: GlobalTheme.fontBold,
					// borderWidth: 1,
				},
				style: {
					// height: hp(6.0),
					backgroundColor: GlobalTheme.materialTabBackgroundColor,
				},
				// renderIndicator: renderTopTabIndicator,
			}}
			// sceneContainerStyle={{style: {backgroundColor: 'red'}}}
		>
			<MaterialTab.Screen
				name="Hire"
				component={HireStackScreen}
				options={{tabBarLabel: 'HIRE'}}
			/>
			<MaterialTab.Screen
				name="Buy"
				component={BuyStackScreen}
				options={{tabBarLabel: 'BUY'}}
			/>
		</MaterialTab.Navigator>
	);
};

export default MaterialTabStackScreen;
