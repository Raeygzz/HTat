import React from 'react';
import {
	View,
	Modal,
	Image,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
} from 'react-native';

import ShadowView from 'react-native-simple-shadow-view';
import {
	heightPercentageToDP as hp,
	widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import VISA from '../../assets/image/visa.png';
import {GlobalTheme} from '../../components/theme';
import {cardLastFourDigitDisplay} from '../../utils';
import {TextField, Divider} from '../../components/common';
import MASTERCARD from '../../assets/image/mastercard.png';

import {useSelector, useDispatch} from 'react-redux';
import {headerTitle} from '../../store/actions/Header';
import {hideSavedCardPaymentScreenModal} from '../../store/actions/UserCard';

const cardBrand = (item) => {
	switch (item) {
		case 'visa':
			return VISA;

		case 'mastercard':
			return MASTERCARD;

		default:
			return null;
	}
};

const SavedCardsModal = (props) => {
	const filteredCardList = useSelector(
		(state) => state.userCard.filteredCardList,
	);

	const dispatch = useDispatch();

	const closeModalHandler = () => {
		let headerConfig = {
			isBackArrow: true,
			leftTitle: 'Search',
			isRightContent: false,
			rightTitle: '',
			navParam: '',
		};

		dispatch(headerTitle(headerConfig));

		dispatch(hideSavedCardPaymentScreenModal());
	};

	const onSelectCardHandler = (item) => {
		// console.log('item ==> ', item);
		props.selectedCardForItem(item);
	};

	const savedCardList =
		filteredCardList.length > 0
			? filteredCardList.slice(0, -1).map((item, index) => {
					return (
						<TouchableOpacity
							key={item.id}
							onPress={onSelectCardHandler.bind(this, item)}
							style={styles.paymentCardWrapperStyle}>
							<ShadowView style={styles.paymentListShadowViewStyle}>
								{item?.cardNumber ? (
									<>
										<View style={styles.defaultTextWrapperStyle}>
											<TextField
												xThin
												right
												letterSpacing={-0.19}
												isRLH
												lineHeight={2.0}
												fontFamily={GlobalTheme.fontRegular}
												color={GlobalTheme.primaryColor}>
												{item.defaultCard ? 'Default' : ''}
											</TextField>
										</View>

										<Divider />

										<TextField
											xSmall
											letterSpacing={0.6}
											isRLH
											lineHeight={2.0}
											fontFamily={GlobalTheme.fontRegular}
											color={GlobalTheme.textColor}>
											{cardLastFourDigitDisplay(item.cardNumber)}
										</TextField>

										<Divider />

										<View style={styles.rowStyle}>
											<Image
												source={cardBrand(item.cardBrand)}
												style={styles.imageStyle}
											/>

											<TextField
												xThin
												letterSpacing={0.96}
												isRLH
												lineHeight={1.8}
												fontFamily={GlobalTheme.fontRegular}
												color={GlobalTheme.textColor}>
												{`${item.expiryMonth}/${item.expiryYear}`}
											</TextField>
										</View>
									</>
								) : null}
							</ShadowView>
						</TouchableOpacity>
					);
			  })
			: null;

	return (
		<Modal
			statusBarTranslucent
			animationType="fade"
			transparent={true}
			visible={props.showSavedCardsModal}>
			<View style={styles.modal}>
				<View style={styles.shadowViewStyle}>
					<View style={styles.headerStyle}>
						<TextField
							regular
							letterSpacing={-0.1}
							isRLH
							lineHeight={2.0}
							fontFamily={GlobalTheme.fontRegular}
							color={GlobalTheme.white}
							style={styles.textCloseStyle}
							onPress={closeModalHandler}>
							Close
						</TextField>

						<TextField
							center
							regular
							letterSpacing={-0.1}
							isRLH
							lineHeight={2.1}
							fontFamily={GlobalTheme.fontBold}
							color={GlobalTheme.white}
							style={styles.headerTextStyle}>
							Saved Cards
						</TextField>
					</View>

					<Divider xLarge />

					<TextField
						title
						letterSpacing={-0.07}
						isRLH
						lineHeight={2.4}
						fontFamily={GlobalTheme.fontBold}
						color={GlobalTheme.black}
						style={styles.mh1}>
						Select Card
					</TextField>

					<ScrollView
						showsVerticalScrollIndicator={false}
						contentContainerStyle={styles.savedCardWrapper}>
						{/* <Divider huge /> */}

						{savedCardList}

						{/* <Divider large /> */}
					</ScrollView>
				</View>

				{/* <Modal animationType="fade" transparent={true} visible={modalLoader}>
					<View style={styles.searchFilterLoaderModalStyle}>
						<ActivityIndicator
							animating={true}
							size="large"
							color={GlobalTheme.black}
						/>
					</View>
				</Modal> */}
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modal: {
		flex: 1,
		// borderWidth: 2,
		// borderColor: 'green',
	},
	shadowViewStyle: {
		width: wp('96%'),
		height: hp('66%'),
		shadowRadius: GlobalTheme.shadowRadius,
		shadowColor: GlobalTheme.black,
		shadowOpacity: 0.28,
		borderWidth: 0.1,
		position: 'absolute',
		bottom: 0,
		alignSelf: 'center',
		backgroundColor: GlobalTheme.white,
		borderRadius: GlobalTheme.viewRadius,
		shadowOffset: {width: 0, height: 6},
		elevation: 44,
		// borderWidth: 1,
		// borderColor: 'blue',
	},
	headerStyle: {
		width: wp('96%'),
		height: hp('6.3%'),
		backgroundColor: GlobalTheme.primaryColor,
		borderTopLeftRadius: GlobalTheme.viewRadius,
		borderTopRightRadius: GlobalTheme.viewRadius,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		// borderWidth: 1,
	},
	textCloseStyle: {
		width: wp('20%'),
		paddingLeft: hp('2.6%'),
		// borderWidth: 1,
		// borderColor: '#fff',
	},
	headerTextStyle: {
		width: wp('58%'),
		// borderWidth: 1,
	},
	mh1: {
		marginHorizontal: hp('1.0%'),
	},
	savedCardWrapper: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexWrap: 'wrap',
		paddingHorizontal: hp('1.0%'),
		paddingVertical: hp('2.5%'),
		// borderWidth: 1,
	},
	// searchFilterLoaderModalStyle: {
	// 	width: '90%',
	// 	height: '66%',
	// 	justifyContent: 'center',
	// 	backgroundColor: 'rgba(0,0,0,0.04)',
	// 	borderRadius: GlobalTheme.viewRadius,
	// 	position: 'absolute',
	// 	bottom: 0,
	// 	alignSelf: 'center',
	// 	// borderWidth: 1,
	// },
	paymentCardWrapperStyle: {
		width: '48%',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		// borderWidth: 1,
		// borderColor: 'red',
	},
	paymentListShadowViewStyle: {
		width: '100%',
		height: hp('12.5%'),
		padding: hp('1.0%'),
		marginBottom: hp('1.0%'),
		shadowRadius: GlobalTheme.shadowRadius,
		shadowColor: GlobalTheme.black,
		shadowOpacity: 0.28,
		borderWidth: 0.1,
		borderColor: 'transparent',
		backgroundColor: GlobalTheme.white,
		borderRadius: GlobalTheme.viewRadius,
		shadowOffset: {width: 0, height: 0},
	},
	defaultTextWrapperStyle: {
		height: hp('2.0%'),
		// borderWidth: 1,
	},
	rowStyle: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		// borderWidth: 1,
	},
	imageStyle: {
		width: wp('10.5%'),
		height: hp('2.5%'),
		resizeMode: 'cover',
		// borderWidth: 1,
		// borderColor: 'blue',
	},
});

export {SavedCardsModal};
