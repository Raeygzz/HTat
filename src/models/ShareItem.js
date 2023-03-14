import Share from 'react-native-share';

import {_ENV_CONFIG} from '../config';

const ShareItem = async (viewRef, message) => {
	// console.log('ShareItem ==> ', viewRef, message);

	try {
		const uri = await viewRef.current.capture();
		// console.log('uri ==> ', uri);

		// let options = {
		// 	title: 'HT Share via',
		// 	message:
		// 		message +
		// 		'\n\n' +
		// 		'To download the HireThat app from the Apple store click here => ' +
		// 		_ENV_CONFIG.HT_IOS +
		// 		'\n\n' +
		// 		'To download the app from Google play store click here => ' +
		// 		_ENV_CONFIG.HT_ANDROID,
		// 	url: uri,
		// 	subject: 'Hire That item detail share',
		// };

		let options = {
			title: 'HT Share Via',
			message:
				'I FOUND SOMETHING OF INTEREST ON HIRE THAT!' +
				'\n\n' +
				'Download the app from the App store or get it on Google play' +
				'\n' +
				_ENV_CONFIG.HT_IOS +
				'\n' +
				_ENV_CONFIG.HT_ANDROID,
			url: uri,
			subject: 'Hire That Item Details',
		};

		const ShareResponse = await Share.open(options);
		console.log('ShareResponse ==> ', ShareResponse);
		//
	} catch (error) {
		console.log('share item error =>', error);
	}

	// try {
	// 	const uri = await captureRef(viewRef, {
	// 		format: 'png',
	// 		quality: 0.7,
	// 	});

	// 	let options = {
	// 		title: 'HT Share via',
	// 		message: 'Hire That Content',
	// 		url: uri,
	// 		subject: 'Hire That item detail share',
	// 		// type: ,
	// 		// email: ,
	// 		// recipient: ,
	// 		// saveToFiles: true,
	// 		// failOnCancel: false,
	// 		// social: Share.Social.SMS,
	// 		// social: Share.Social.EMAIL,
	// 		// backgroundImage: images.image1,
	// 		// social: Share.Social.INSTAGRAM_STORIES,
	// 	};
	// 	const ShareResponse = await Share.open(options);
	// 	console.log('ShareResponse ==> ', ShareResponse);
	// 	//
	// } catch (error) {
	// 	console.log('Error =>', error);
	// }
};

export {ShareItem};
