import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import {WebView} from 'react-native-webview';
import * as Progress from 'react-native-progress';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

import {IOS} from '../../helper';
import {GlobalTheme} from '../theme';

const TermsPoliciesView = (props) => {
	const {link = ''} = props;

	const [progress, setProgress] = useState(0);
	const [isLoaded, setIsLoaded] = useState(false);

	// const handleWebViewNavigationStateChange = (newNavState) => {
	// 	// console.log('newNavState ==> ', newNavState);
	// };

	return (
		<>
			<View style={styles.webViewWrapperStyle}>
				{!isLoaded ? (
					<Progress.Bar
						borderWidth={0}
						borderRadius={0}
						color={GlobalTheme.black}
						progress={progress}
						width={null}
					/>
				) : null}

				<WebView
					javaScriptEnabled={true}
					originWhitelist={['*']}
					source={{uri: link}}
					onLoadEnd={() => setIsLoaded(true)}
					onLoadProgress={({nativeEvent}) => setProgress(nativeEvent.progress)}
					onError={(event) =>
						console.log('WebView Error ==> ', event.nativeEvent)
					}
					// onNavigationStateChange={handleWebViewNavigationStateChange}
					style={styles.webViewStyle}
				/>
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	webViewWrapperStyle: {
		flex: 1,
		// borderWidth: 2,
		// borderColor: 'green',
	},
	webViewStyle: {
		width: '100%',
		height: hp('100%'),
		marginTop: IOS ? hp('-45.0%') : hp('-54.0%'),
		// borderWidth: 2,
		// borderColor: 'blue',
	},
});

export {TermsPoliciesView};
