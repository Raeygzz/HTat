import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {Buy, BuyItemDetail} from '../../screens';

const BuyStack = createStackNavigator();

const BuyStackScreen = () => (
	<BuyStack.Navigator headerMode="none" initialRouteName="Buy">
		<BuyStack.Screen name="Buy" component={Buy} />
		<BuyStack.Screen name="BuyItemDetail" component={BuyItemDetail} />
	</BuyStack.Navigator>
);

export default BuyStackScreen;
