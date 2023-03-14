import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {Profile, AllHiring, AllHiringOut, AllAdverts} from '../../screens';

const ProfileStack = createStackNavigator();

const ProfileStackScreen = () => (
	<ProfileStack.Navigator headerMode="none" initialRouteName="Profile">
		<ProfileStack.Screen name="Profile" component={Profile} />
		<ProfileStack.Screen name="AllHiring" component={AllHiring} />
		<ProfileStack.Screen name="AllHiringOut" component={AllHiringOut} />
		<ProfileStack.Screen name="AllAdverts" component={AllAdverts} />
	</ProfileStack.Navigator>
);

export default ProfileStackScreen;
