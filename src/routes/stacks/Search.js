import * as React from 'react';

// import {useRoute} from '@react-navigation/native';
// import * as RootNavigation from '../RootNavigation';
// import {useNavigationState} from '@react-navigation/native';

import {createStackNavigator} from '@react-navigation/stack';

import {SearchLanding, SearchResults} from '../../screens';

const SearchStack = createStackNavigator();

const SearchStackScreen = (props) => {
	// console.log('props ==> ', props);

	// const route = useRoute();
	// console.log(route.name);

	// const route = RootNavigation.getCurrentRoute();
	// console.log('route ==> ', route);

	// const state = useNavigationState((state) => state);
	// console.log('state ==> ', state);
	// const routeName = state.routeNames[state.index];
	// console.log('routeName: ==> ', routeName);

	return (
		<SearchStack.Navigator headerMode="none" initialRouteName="SearchLanding">
			<SearchStack.Screen name="SearchLanding" component={SearchLanding} />
			<SearchStack.Screen name="SearchResults" component={SearchResults} />
		</SearchStack.Navigator>
	);
};

export default SearchStackScreen;
