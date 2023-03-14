import * as React from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import {UserAddressDetail} from '../../screens';

const UserOnboardingDetailStack = createStackNavigator();

const UserOnboardingDetailStackScreen = () => {
	// console.log('===IN UserOnboardingDetailStackScreen===');

	return (
		<UserOnboardingDetailStack.Navigator
			headerMode="none"
			mode="modal"
			initialRouteName="UserAddressDetail">
			<UserOnboardingDetailStack.Screen
				name="UserAddressDetail"
				component={UserAddressDetail}
			/>
		</UserOnboardingDetailStack.Navigator>
	);
};

export default UserOnboardingDetailStackScreen;
