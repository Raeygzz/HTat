import * as React from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import BottomTabBar from './bottom/Tab';
import UserOnboardingDetailStackScreen from './stacks/UserOnboardingDetail';
import {
	HireConfirm,
	BuyConfirm,
	PostAdvert,
	ViewAdvert,
	ViewHire,
	EditAdvert,
	ManagePayments,
	TradingAccount,
	WebView,
	AddPaymentCard,
	TermsPolicies,
} from '../screens';

import {useSelector} from 'react-redux';

const RoutesStack = createStackNavigator();

const RoutesStackScreen = () => {
	// console.log('===IN RoutesStackScreen===');

	const showUserOnboardingScreen = useSelector(
		(state) => state.auth.showUserOnboardingScreen,
	);
	// const hasPrimaryCard = useSelector(
	// 	(state) => state.auth.user.has_primary_card,
	// );

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
		<RoutesStack.Navigator
			headerMode="none"
			// initialRouteName="BottomTabBar"
			initialRouteName={
				// hasPrimaryCard != 1 ? 'ManagePayments' : 'BottomTabBar
				showUserOnboardingScreen ? 'UserOnboardingDetail' : 'BottomTabBar'
			}
			mode="modal">
			<RoutesStack.Screen
				name="BottomTabBar"
				component={BottomTabBar}
				options={horizontalAnimation}
			/>
			<RoutesStack.Screen
				name="HireConfirm"
				component={HireConfirm}
				options={horizontalAnimation}
			/>
			<RoutesStack.Screen name="BuyConfirm" component={BuyConfirm} />
			<RoutesStack.Screen
				name="PostAdvert"
				component={PostAdvert}
				options={horizontalAnimation}
			/>
			<RoutesStack.Screen
				name="ViewAdvert"
				component={ViewAdvert}
				options={horizontalAnimation}
			/>
			<RoutesStack.Screen
				name="ViewHire"
				component={ViewHire}
				options={horizontalAnimation}
			/>
			<RoutesStack.Screen
				name="EditAdvert"
				component={EditAdvert}
				options={horizontalAnimation}
			/>
			<RoutesStack.Screen name="WebView" component={WebView} />
			<RoutesStack.Screen
				name="UserOnboardingDetail"
				component={UserOnboardingDetailStackScreen}
			/>
			<RoutesStack.Screen
				name="ManagePayments"
				component={ManagePayments}
				options={horizontalAnimation}
			/>
			<RoutesStack.Screen name="TermsPolicies" component={TermsPolicies} />
			<RoutesStack.Screen name="AddPaymentCard" component={AddPaymentCard} />
			<RoutesStack.Screen
				name="TradingAccount"
				component={TradingAccount}
				options={horizontalAnimation}
			/>
		</RoutesStack.Navigator>
	);
};

export default RoutesStackScreen;
