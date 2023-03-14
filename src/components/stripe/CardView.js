import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import {WebView} from 'react-native-webview';
import * as Progress from 'react-native-progress';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

import {GlobalTheme} from '../theme';
import {_ENV_CONFIG} from '../../config';

import {useSelector} from 'react-redux';

const CardView = (props) => {
	const addCardHtml = useSelector((state) => state.userCard.addCardHtml);

	const [progress, setProgress] = useState(0);
	const [isLoaded, setIsLoaded] = useState(false);

	const onAddCardFromWebViewSuccess = (response) => {
		props.onAddCardFromWebViewSuccess(response);
	};

	const onMessage = (event) => {
		const {data} = event.nativeEvent;
		// console.log('data ==> ', data);
		onAddCardFromWebViewSuccess(data);
	};

	const cardWebViewNavigationStateChange = (newNavState) => {
		// console.log('newNavState ==> ', newNavState);
	};

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
					source={{
						html: addCardHtml,
						baseUrl: _ENV_CONFIG.SAVE_CARD_WEB_HOST,
					}}
					onMessage={onMessage}
					onLoadEnd={() => setIsLoaded(true)}
					onLoadProgress={({nativeEvent}) => setProgress(nativeEvent.progress)}
					onError={(event) => console.log('WebView Error: ', event.nativeEvent)}
					onNavigationStateChange={cardWebViewNavigationStateChange}
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
		marginTop: hp('-8.2%'),
		// borderWidth: 2,
		// borderColor: 'blue',
	},
});

export {CardView};
