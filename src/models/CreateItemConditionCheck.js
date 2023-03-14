import Store from '../store/Store';
import {presentAlert} from '../store/actions/Alert';
import {addressListApi} from '../store/actions/Profile';
import {showUserOnboarding} from '../store/actions/Auth';
import {postAdvertFromSearchLandingScreen} from '../store/actions/SearchLanding';

const CreateItemConditionCheck = (
	userEmail,
	// completedStripeOnboarding,
	hasPrimaryAddress,
	// hasPrimaryCard,
	hasBusinessProfile,
	navigation,
) => {
	// console.log('userEmail ==> ', userEmail);
	// console.log('completedStripeOnboarding ==> ', completedStripeOnboarding);
	// console.log('hasPrimaryAddress ==> ', hasPrimaryAddress);
	// console.log('hasPrimaryCard ==> ', hasPrimaryCard);
	// console.log('hasBusinessProfile ==> ', hasBusinessProfile);
	// console.log('navigation ==> ', navigation);

	if (
		userEmail != null &&
		// completedStripeOnboarding === 1 &&
		hasPrimaryAddress === 1 &&
		// hasPrimaryCard === 1 &&
		hasBusinessProfile === 1
	) {
		Store.dispatch(addressListApi());
		Store.dispatch(postAdvertFromSearchLandingScreen(true));
		navigation.navigate('PostAdvert');
		return;
	}

	if (userEmail === null) {
		let alertConfig = {
			title: 'Wait!',
			shouldRunFunction: true,
			navigation: navigation,
			functionHandler: 'resetRoute&NavigateToSettingScreen',
			message: `Please fill in the email address first from Setting Screen under Edit details.`,
		};

		Store.dispatch(presentAlert(alertConfig));
		return;
	}

	// if (completedStripeOnboarding != 1) {
	// 	let alertConfig = {
	// 		title: 'Wait!',
	// 		shouldNavigate: true,
	// 		// shouldRunFunction: true,
	// 		navigation: navigation,
	// 		navigateTo: 'WebView',
	// 		message: `Please connect the stripe account to your Hire That account so we can protect you and your money.`,
	// 		// functionHandler: 'resetRoute&NavigateToSettingScreen',
	// 		// message: `Please connect the stripe account to your Hire That account from the settings screen so we can protect you and your money.`,
	// 	};

	// 	Store.dispatch(presentAlert(alertConfig));
	// 	return;
	// }

	if (hasPrimaryAddress != 1) {
		// let alertConfig = {
		// 	title: 'Wait!',
		// 	shouldRunFunction: true,
		// 	navigation: navigation,
		// 	functionHandler: 'resetRoute&NavigateToSettingScreen',
		// 	message: `Please add an address first from Setting Screen under USER ON BOARD section.`,
		// };

		// Store.dispatch(presentAlert(alertConfig));

		Store.dispatch(showUserOnboarding(true));
		return;
	}

	// if (hasPrimaryCard != 1) {
	// 	let alertConfig = {
	// 		title: 'Wait!',
	// 		shouldRunFunction: true,
	// 		navigation: navigation,
	// 		functionHandler: 'resetRoute&NavigateToSettingScreen',
	// 		message: `Please add at least one card from Setting Screen under MANAGE PAYMENT section`,
	// 	};

	// 	Store.dispatch(presentAlert(alertConfig));
	// 	return;
	// }

	if (hasBusinessProfile != 1) {
		navigation.navigate('TradingAccount', {
			collectInOneGo: false,
		});
		return;

		// let alertConfig = {
		// 	title: 'Wait!',
		// 	shouldRunFunction: true,
		// 	navigation: navigation,
		// 	functionHandler: 'resetRoute&NavigateToSettingScreen',
		// 	message: `Please update your business profile from Setting Screen under MANAGE TRADING DETAILS section`,
		// };

		// Store.dispatch(presentAlert(alertConfig));
		// return;
	}

	// return null;
};

export {CreateItemConditionCheck};
