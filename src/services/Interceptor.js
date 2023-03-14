//setup AXIOS INTERCEPTOR
import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-community/async-storage';

import Store from '../store/Store';
import {_ENV_CONFIG} from '../config';
import {hideLoader} from '../store/actions/Loader';
import {showNetInfo} from '../store/actions/Network';

export const Interceptor = () => {
	axios.defaults.baseURL = _ENV_CONFIG.BASE_URL;
	axios.defaults.headers.post['Accept'] = 'application/json';
	// axios.defaults.headers.post['Content-Type'] = 'application/json';
	axios.defaults.headers.post['Content-Type'] =
		'application/x-www-form-urlencoded;charset=UTF-8';

	let networkConnectivityCheck = false;
	let showModalOnce = false;

	axios.interceptors.request.use(
		async function (config) {
			await NetInfo.fetch().then((state) => {
				if (state.isConnected) {
					showModalOnce = true;
					networkConnectivityCheck = true;
				} else {
					showModalOnce = false;
					networkConnectivityCheck = false;
				}
			});

			if (!networkConnectivityCheck) {
				if (!showModalOnce) {
					Store.dispatch(hideLoader());
					Store.dispatch(showNetInfo());
				}
			} else {
				let endpoint = config.url;
				// console.log('endpoint ==> ', endpoint);

				const token = await AsyncStorage.getItem('accessToken');
				if (token != null && !endpoint.includes('renewtoken')) {
					config.headers.Authorization = `Bearer ${token}`;
				}

				// console.log('config ==> ', config);
				return config;
			}
		},

		function (err) {
			return Promise.reject(err);
		},
	);

	let isAlreadyFetchingAccessToken = false;
	let subscribers = [];

	function onAccessTokenFetched(access_token) {
		subscribers = subscribers.filter((callback) => callback(access_token));
	}

	function addSubscriber(callback) {
		subscribers.push(callback);
	}

	axios.interceptors.response.use(
		(response) => {
			// console.log('response ==> ', response);
			return response;
		},

		(error) => {
			// we have the error
			// we focus on token expired
			const message = error.response.data.message;
			const statusCode = error.response.status;
			const originalRequest = error.config;

			// console.log('errorResponse ==> ', {
			//   message: message,
			//   statusCode: statusCode,
			//   originalRequest: originalRequest,
			// });

			// if (statusCode === 401 && message === 'Unauthorized') {
			//   // time to ask for fresh token
			//   if (!isAlreadyFetchingAccessToken) {
			//     isAlreadyFetchingAccessToken = true;
			//     Store.dispatch(getNewAccessToken())
			//       .then((res) => {
			//         if (res.status === 200) {
			//           isAlreadyFetchingAccessToken = false;
			//           AsyncStorage.setItem('accessToken', res.data.body.token);
			//           Store.dispatch(refreshAccessToken(res.data.data.access_token));
			//           onAccessTokenFetched(res.data.data.access_token);
			//         }
			//       })
			//       .catch((err) => {
			//         console.log('renew token error ==> ', err);
			//       });
			//   }

			//   const retryOriginalRequest = new Promise((resolve) => {
			//     addSubscriber((access_token) => {
			//       originalRequest.headers.Authorization = `Bearer ${access_token}`;
			//       resolve(axios(originalRequest));
			//     });
			//   });
			//   return retryOriginalRequest;
			// }

			return Promise.reject(error);
		},
	);
};
