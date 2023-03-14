import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {Hire, HireItemDetail} from '../../screens';

const HireStack = createStackNavigator();

const HireStackScreen = () => (
	<HireStack.Navigator headerMode="none" initialRouteName="Hire">
		<HireStack.Screen name="Hire" component={Hire} />
		<HireStack.Screen name="HireItemDetail" component={HireItemDetail} />
	</HireStack.Navigator>
);

export default HireStackScreen;
