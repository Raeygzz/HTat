import * as React from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import {
	Welcome,
	Login,
	ForgotPassword,
	RegisterEmail,
	TermsPolicies,
} from '../../screens';

const AuthStack = createStackNavigator();

const AuthStackScreen = () => {
	// console.log('=====IN AuthStackScreen====');

	const horizontalAnimation = {
		gestureDirection: 'horizontal',
		cardStyleInterpolator: ({current, layouts}) => {
			return {
				cardStyle: {
					transform: [
						{
							translateX: current.progress.interpolate({
								inputRange: [0, 1],
								outputRange: [layouts.screen.width, 0],
							}),
						},
					],
				},
			};
		},
	};

	return (
		<AuthStack.Navigator
			headerMode="none"
			initialRouteName="Welcome"
			mode="modal">
			<AuthStack.Screen
				name="Welcome"
				component={Welcome}
				options={horizontalAnimation}
			/>
			<AuthStack.Screen
				name="Login"
				component={Login}
				options={horizontalAnimation}
			/>
			<AuthStack.Screen
				name="ForgotPassword"
				component={ForgotPassword}
				options={horizontalAnimation}
			/>
			<AuthStack.Screen
				name="RegisterEmail"
				component={RegisterEmail}
				options={horizontalAnimation}
			/>
			<AuthStack.Screen name="TermsPolicies" component={TermsPolicies} />
		</AuthStack.Navigator>
	);
};

export default AuthStackScreen;
