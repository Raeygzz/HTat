import React, {useEffect, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {View, Image, ScrollView, StyleSheet} from 'react-native';

import analytics from '@react-native-firebase/analytics';

import {GlobalTheme} from '../components/theme';
import {AddressList} from '../components/profile/AddressList';
import {GenericView, Header, TextField, Divider} from '../components/common';
import {HiringCustomCarousel} from '../components/profile/HiringCustomCarousel';
import {HiringOutNoSetupCard} from '../components/profile/HiringOutNoSetupCard';
import {HiringOutNoAdvertsCard} from '../components/profile/HiringOutNoAdvertsCard';
import {HiringOutCustomCarousel} from '../components/profile/HiringOutCustomCarousel';
import {AdvertisingCustomCarousel} from '../components/profile/AdvertisingCustomCarousel';
import {
	heightPercentageToDP as hp,
	widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {useSelector, useDispatch} from 'react-redux';
import {headerTitle} from '../store/actions/Header';
import {advertListApi} from '../store/actions/Adverts';
import {hiringListApi, hiringOutListApi} from '../store/actions/Hire';
import {addressListApi, addressAddSuccess} from '../store/actions/Profile';

const Profile = (props) => {
	const hiringList = useSelector((state) => state.hire.hiringList);
	const hiringOnProfileVisible = useSelector(
		(state) => state.hire.hiringOnProfileVisible,
	);
	const hiringOutList = useSelector((state) => state.hire.hiringOutList);
	const advertList = useSelector((state) => state.adverts.advertList);
	const advertOnProfileVisible = useSelector(
		(state) => state.adverts.advertOnProfileVisible,
	);
	const addressList = useSelector((state) => state.profile.addressList);
	const addAddressSuccess = useSelector(
		(state) => state.profile.addressAddSuccess,
	);

	const [hiringOutCardVisible, setHiringOutCardVisible] = useState(false);

	const dispatch = useDispatch();

	useFocusEffect(
		React.useCallback(() => {
			if (hiringOutCardVisible || hiringOutList.length > 0) {
				let headerConfig = {
					isBackArrow: false,
					leftTitle: '',
					isRightContent: true,
					rightTitle: 'Post Advert',
					navParam: 'PostAdvert',
				};

				dispatch(headerTitle(headerConfig));
			} else {
				let headerConfig = {
					isBackArrow: false,
					leftTitle: '',
					isRightContent: false,
					rightTitle: '',
					navParam: '',
				};

				dispatch(headerTitle(headerConfig));
			}
		}, [hiringOutCardVisible, hiringOutList]),
	);

	useFocusEffect(
		React.useCallback(() => {
			dispatch(hiringListApi(1));
			dispatch(hiringOutListApi(1));
			dispatch(advertListApi(1));
		}, []),
	);

	useEffect(() => {
		// dispatch(hiringListApi(1));
		// dispatch(hiringOutListApi(1));
		// dispatch(advertListApi(1));
		dispatch(addressListApi());
	}, []);

	useEffect(() => {
		if (addAddressSuccess) {
			dispatch(addressListApi());
			dispatch(addressAddSuccess(false));
		}
	}, [addAddressSuccess]);

	return (
		<GenericView isBackgroundColor>
			<>
				<Header />
				<ScrollView
					showsVerticalScrollIndicator={false}
					style={styles.mainView}>
					{/* <Divider xxMedium /> */}

					<Divider xxxHuge />

					<TextField
						title
						letterSpacing={-0.32}
						isRLH
						lineHeight={2.6}
						fontFamily={GlobalTheme.fontBlack}
						color={GlobalTheme.primaryColor}
						style={styles.ph10}>
						MY ACCOUNT
					</TextField>

					<Divider xMedium />

					{hiringOnProfileVisible ? (
						<>
							<View style={styles.rowViewStyle}>
								<TextField
									medium
									isRLH
									lineHeight={2.3}
									fontFamily={GlobalTheme.fontBold}
									color={GlobalTheme.black}>
									HIRING IN
								</TextField>

								{hiringList.length > 0 ? (
									<TextField
										xSmall
										letterSpacing={-0.09}
										isRLH
										lineHeight={1.9}
										fontFamily={GlobalTheme.fontRegular}
										color={GlobalTheme.primaryColor}
										onPress={() => props.navigation.navigate('AllHiring')}>
										See all
									</TextField>
								) : null}
							</View>

							{hiringList.length > 0 ? (
								<HiringCustomCarousel
									hiring={hiringList.length > 0 ? hiringList : []}
								/>
							) : (
								<Image
									source={require('../assets/image/gif/shimmer.gif')}
									style={styles.shimmerStyle}
								/>
							)}
						</>
					) : null}

					<View style={styles.rowViewStyle}>
						<TextField
							medium
							isRLH
							lineHeight={2.3}
							fontFamily={GlobalTheme.fontBold}
							color={GlobalTheme.black}>
							HIRING OUT
						</TextField>

						{hiringOutList.length > 0 ? (
							<TextField
								xSmall
								letterSpacing={-0.09}
								isRLH
								lineHeight={1.9}
								fontFamily={GlobalTheme.fontRegular}
								color={GlobalTheme.primaryColor}
								onPress={() => {
									analytics().logEvent('hiring_out_see_more');
									props.navigation.navigate('AllHiringOut');
								}}>
								See all
							</TextField>
						) : null}
					</View>

					{/* NO HIRING OUT START */}
					{hiringOutList.length < 1 ? (
						<>
							<Divider small />

							{!hiringOutCardVisible ? (
								<HiringOutNoSetupCard
									style={styles.mh10}
									noSetupCard={() => setHiringOutCardVisible(true)}
								/>
							) : (
								<HiringOutNoAdvertsCard
									style={styles.mh10}
									navigation={props.navigation}
								/>
							)}

							<Divider xxMedium />
						</>
					) : null}
					{/* NO HIRING OUT END */}

					{/* HIRING OUT START */}
					{hiringOutList.length > 0 ? (
						<HiringOutCustomCarousel
							hiringOut={hiringOutList.length > 0 ? hiringOutList : []}
						/>
					) : null}
					{/* HIRING OUT END */}

					{advertOnProfileVisible ? (
						<>
							<View style={styles.rowViewStyle}>
								<TextField
									medium
									isRLH
									lineHeight={2.3}
									fontFamily={GlobalTheme.fontBold}
									color={GlobalTheme.black}>
									ADVERTISING
								</TextField>

								{advertList.length > 0 ? (
									<TextField
										xSmall
										letterSpacing={-0.09}
										isRLH
										lineHeight={1.9}
										fontFamily={GlobalTheme.fontRegular}
										color={GlobalTheme.primaryColor}
										onPress={() => props.navigation.navigate('AllAdverts')}>
										See all
									</TextField>
								) : null}
							</View>

							{advertList.length > 0 ? (
								<AdvertisingCustomCarousel
									Advertisement={advertList.length > 0 ? advertList : []}
								/>
							) : (
								<Image
									source={require('../assets/image/gif/shimmer.gif')}
									style={styles.shimmerStyle}
								/>
							)}
						</>
					) : null}

					<TextField
						medium
						isRLH
						lineHeight={2.3}
						fontFamily={GlobalTheme.fontBold}
						color={GlobalTheme.black}
						style={styles.ph10}>
						ADDRESSES
					</TextField>

					<Divider medium />

					<AddressList
						navigation={props.navigation}
						addresses={addressList.length > 0 ? addressList : []}
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
	},
	ph10: {
		paddingHorizontal: 10,
	},
	mh10: {
		marginHorizontal: 10,
	},
	rowViewStyle: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 10,
		// borderWidth: 1,
	},
	shimmerStyle: {
		width: '94%',
		height: hp('10%'),
		marginHorizontal: 10,
	},
	addressShadowViewStyle: {
		width: 170,
		height: 105,
		// flexDirection: 'row',
		// justifyContent: 'flex-start',
		// alignItems: 'center',
		padding: 10,
		marginBottom: 15,
		shadowRadius: GlobalTheme.shadowRadius,
		shadowColor: GlobalTheme.black,
		shadowOpacity: 0.28,
		borderWidth: 0.1,
		borderColor: 'transparent',
		// borderColor: 'red',
		backgroundColor: GlobalTheme.white,
		borderRadius: GlobalTheme.viewRadius,
		shadowOffset: {width: 0, height: 0},
	},
});

export {Profile};
