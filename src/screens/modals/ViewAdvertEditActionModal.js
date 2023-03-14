import React from 'react';
import {View, Modal, ScrollView, StyleSheet} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import ShadowView from 'react-native-simple-shadow-view';
import {
	heightPercentageToDP as hp,
	widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {cancelHiringButton} from '../../utils';
import {GlobalTheme} from '../../components/theme';
import {Divider, Button} from '../../components/common';

import {useDispatch} from 'react-redux';
import {presentAlert} from '../../store/actions/Alert';
import {headerTitle} from '../../store/actions/Header';
import {cancelHiringApi} from '../../store/actions/Hire';
import {categoriesApi} from '../../store/actions/Categories';
import {hideAdvertScreenModal} from '../../store/actions/Adverts';
import {
	deleteAdvertByIdApi,
	advertByIdApi,
	pauseResumeAdvertApi,
} from '../../store/actions/Adverts';

const ViewAdvertEditActionModal = (props) => {
	const {hideAdvertButtons = false} = props;

	const dispatch = useDispatch();
	const navigation = useNavigation();

	const editAdvertHandler = () => {
		console.log('EDIT ADVERT');
		// let headerConfig = {
		// 	isBackArrow: true,
		// 	leftTitle: 'Back',
		// 	isRightContent: true,
		// 	rightTitle: 'Edit',
		// 	navParam: '',
		// };

		// dispatch(headerTitle(headerConfig));

		dispatch(categoriesApi());
		// dispatch(advertByIdApi(props.advertId, null));
		dispatch(hideAdvertScreenModal());

		navigation.navigate('EditAdvert', {
			advertId: props.item,
		});
	};

	const pauseAdvertHandler = () => {
		console.log('PAUSE ADVERT');
		let headerConfig = {
			isBackArrow: true,
			leftTitle: 'Back',
			isRightContent: true,
			rightTitle: 'Edit',
			navParam: 'callback',
		};

		dispatch(headerTitle(headerConfig));
		dispatch(
			pauseResumeAdvertApi(
				props.item,
				props.pause === 0 ? 'pause' : 'resume',
				navigation,
			),
		);

		dispatch(hideAdvertScreenModal());
	};

	const removeAdvertHandler = () => {
		console.log('REMOVE ADVERT');
		let headerConfig = {
			isBackArrow: true,
			leftTitle: 'Back',
			isRightContent: true,
			rightTitle: 'Edit',
			navParam: 'callback',
		};

		dispatch(headerTitle(headerConfig));

		dispatch(deleteAdvertByIdApi(props.item, navigation));
		dispatch(hideAdvertScreenModal());
	};

	const cancelHandler = () => {
		console.log('CANCEL ADVERT');

		let headerConfig = {
			isBackArrow: true,
			leftTitle: 'Back',
			isRightContent: true,
			rightTitle: 'Edit',
			navParam: 'callback',
		};

		dispatch(headerTitle(headerConfig));
		dispatch(hideAdvertScreenModal());
	};

	const cancelHiringAlertHandler = () => {
		console.log('CANCEL HIRING');

		dispatch(hideAdvertScreenModal());

		let headerConfig = {
			isBackArrow: true,
			leftTitle: 'Back',
			isRightContent: true,
			rightTitle: 'Edit',
			navParam: 'callback',
		};

		dispatch(headerTitle(headerConfig));

		let alertConfig = {
			title: 'Wait!',
			message: 'Are you sure? Charges will apply',
			showCancelButton: true,
			shouldRunFunction: true,
			functionHandler: 'cancelHiringHandler',
			shouldCallback: () => cancelHiringHandler(props.item.id),
		};

		dispatch(presentAlert(alertConfig));
	};

	const cancelHiringHandler = (id) => {
		dispatch(cancelHiringApi(id, navigation));
	};

	return (
		<Modal
			statusBarTranslucent
			animationType="fade"
			transparent={true}
			visible={props.show}>
			<View style={styles.modal}>
				<ShadowView style={styles.shadowViewStyle(hideAdvertButtons)}>
					<ScrollView
						showsVerticalScrollIndicator={false}
						contentContainerStyle={styles.ph54}>
						<Divider xLarge />

						{hideAdvertButtons ? (
							<>
								<Button
									redButton={
										cancelHiringButton(props.item.start_date) ? false : true
									}
									disabled={cancelHiringButton(props.item.start_date)}
									title="CANCEL THIS HIRE"
									onPress={cancelHiringAlertHandler}
								/>

								<Divider />

								<Button blackButton title="CANCEL" onPress={cancelHandler} />
							</>
						) : (
							<>
								<Button
									title="EDIT ADVERT"
									blackButton
									onPress={editAdvertHandler}
								/>

								<Divider />

								<Button
									title={props.pause === 0 ? 'PAUSE ADVERT' : 'RESUME ADVERT'}
									blackButton
									onPress={pauseAdvertHandler}
								/>

								<Divider />

								<Button
									title="REMOVE ADVERT"
									redButton
									onPress={removeAdvertHandler}
								/>

								<Divider />

								<Button title="CANCEL" blackButton onPress={cancelHandler} />
							</>
						)}
					</ScrollView>
				</ShadowView>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modal: {
		flex: 1,
		// borderWidth: 1,
		// borderColor: 'green',
	},
	shadowViewStyle: (hideAdvertButtons = false) => ({
		width: '100%',
		height: hideAdvertButtons ? '20%' : '32%',
		// width: wp('100%'),
		// height: hp('36%'),
		shadowRadius: GlobalTheme.shadowRadius,
		shadowColor: GlobalTheme.black,
		shadowOpacity: 0.28,
		borderWidth: 0.1,
		position: 'absolute',
		bottom: 0,
		alignSelf: 'center',
		borderColor: 'transparent',
		backgroundColor: GlobalTheme.white,
		borderRadius: GlobalTheme.viewRadius,
		shadowOffset: {width: 0, height: 0},
	}),
	ph54: {
		paddingHorizontal: 54,
		// paddingHorizontal: hp('5.4%'),
	},
});

export {ViewAdvertEditActionModal};
