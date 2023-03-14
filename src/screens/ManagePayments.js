import React, {useEffect} from 'react';
import {ScrollView, StyleSheet} from 'react-native';

import {useFocusEffect} from '@react-navigation/native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

import {ANDROID} from '../helper';
import {GlobalTheme} from '../components/theme';
import {PaymentLists} from '../components/managePayments/PaymentLists';
import {GenericView, Header, Divider, TextField} from '../components/common';

import {useSelector, useDispatch} from 'react-redux';
import {headerTitle} from '../store/actions/Header';
import {presentAlert} from '../store/actions/Alert';
// import {resetNavigationRoutes} from '../store/actions/ResetNavigation';
import {
	// addCardApi,
	listUserCardsApi,
	defaultCardApi,
	deleteCardApi,
	deleteDefaultCardSuccess,
} from '../store/actions/UserCard';

const ManagePayments = (props) => {
	// const hasPrimaryCard = useSelector(
	// 	(state) => state.auth.user.has_primary_card,
	// );
	const filteredCardList = useSelector(
		(state) => state.userCard.filteredCardList,
	);
	const cardDeleteDefaultSuccess = useSelector(
		(state) => state.userCard.cardDeleteDefaultSuccess,
	);

	const dispatch = useDispatch();

	// useFocusEffect(
	// 	React.useCallback(() => {
	// 		if (hasPrimaryCard === 0) {
	// 			dispatch(resetNavigationRoutes(true));
	// 		}
	// 	}, [hasPrimaryCard]),
	// );

	useFocusEffect(
		React.useCallback(() => {
			let headerConfig = {
				isBackArrow: true,
				leftTitle: 'Back',
				// leftTitle:
				// 	props.route?.params?.fromSettingsScreen !== 'Settings'
				// 		? 'Skip for now'
				// 		: 'Back',
				isRightContent: false,
				rightTitle: '',
				navParam: '',
			};

			dispatch(headerTitle(headerConfig));
			dispatch(listUserCardsApi());
		}, []),
	);

	// useEffect(() => {
	// 	dispatch(addCardApi());
	// }, []);

	const makeDefaultHandler = (cardID) => {
		dispatch(defaultCardApi(cardID));
	};

	const onDeleteCard = (cardID) => {
		let alertConfig = {
			title: 'Wait!',
			message: 'Are you sure. You want to delete selected card?',
			showCancelButton: true,
			shouldRunFunction: true,
			functionHandler: 'deleteCardHandler',
			shouldCallback: () => deleteCardHandler(cardID),
		};

		dispatch(presentAlert(alertConfig));
	};

	const deleteCardHandler = (cardID) => {
		dispatch(deleteCardApi(cardID));
	};

	useEffect(() => {
		if (cardDeleteDefaultSuccess) {
			dispatch(listUserCardsApi());
			dispatch(deleteDefaultCardSuccess(false));
		}
	}, [cardDeleteDefaultSuccess]);

	return (
		<GenericView isBackgroundColor>
			<>
				<Header />

				<Divider xxxHuge />

				{/* {ANDROID ? <Divider xxLarge /> : null} */}

				<TextField
					title
					letterSpacing={-0.32}
					isRLH
					lineHeight={2.6}
					fontFamily={GlobalTheme.fontBlack}
					color={GlobalTheme.primaryColor}
					style={styles.mh10}>
					MANAGE PAYMENTS
				</TextField>

				<Divider />

				<TextField
					medium
					isRLH
					lineHeight={2.3}
					fontFamily={GlobalTheme.fontBold}
					color={GlobalTheme.black}
					style={styles.mh10}>
					MY CARDS
				</TextField>

				<Divider xxMedium />

				<ScrollView style={styles.mainView}>
					<PaymentLists
						navigation={props.navigation}
						cardList={filteredCardList}
						selectedDeleteCard={(cardID) => onDeleteCard(cardID)}
						selectedDefaultCard={(cardID) => makeDefaultHandler(cardID)}
					/>
				</ScrollView>
			</>
		</GenericView>
	);
};

const styles = StyleSheet.create({
	mainView: {
		flex: 1,
		// borderWidth: 1,
		// borderColor: 'red',
	},
	mh10: {
		marginHorizontal: hp('1.0%'),
	},
});

export {ManagePayments};
