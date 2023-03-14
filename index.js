/**
 * @format
 */

import 'react-native-gesture-handler';
import {AppRegistry, LogBox} from 'react-native';
import React from 'react';
import App from './App';
import {name as appName} from './app.json';

import {Provider} from 'react-redux';
import Store from './src/store/Store';

// Axios API Interceptor
import {Interceptor} from './src/services/Interceptor';
Interceptor();

// comment it after the useNativeDriver is set to true for welcome screen animation
LogBox.ignoreAllLogs(true);

const RNRedux = () => {
	return (
		<Provider store={Store}>
			<App />
		</Provider>
	);
};

AppRegistry.registerComponent(appName, () => RNRedux);
