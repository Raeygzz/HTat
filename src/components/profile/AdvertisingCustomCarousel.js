import React from 'react';
import {View, Image, StyleSheet, FlatList} from 'react-native';

import Entypo from 'react-native-vector-icons/Entypo';
import ShadowView from 'react-native-simple-shadow-view';
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {GlobalTheme} from '../theme';
import {TextField, Divider} from '../common';
import {formatToSentenceDateWithsufix} from '../../utils/Utils';

import {useSelector, useDispatch} from 'react-redux';

const AdvertisingCustomCarousel = (props) => {
	const advertList = useSelector((state) => state.adverts.advertList);

	// const data = [
	// 	{
	// 		id: 0,
	// 		name: '2013 Hitachi ZX27-3 mini digger',
	// 		posted: 'Posted',
	// 		date: 'September 14',
	// 		price: 'Hire price',
	// 		pd: '£80',
	// 		pw: '£360',
	// 		for: 'For Sale',
	// 		sale: 'Yes',
	// 	},
	// 	{
	// 		id: 1,
	// 		name: '2013 Hitachi ZX27-3 mini digger',
	// 		name: '2013 Hitachi ZX27-3 mini digger',
	// 		posted: 'Posted',
	// 		date: 'September 14',
	// 		price: 'Hire price',
	// 		pd: '£80',
	// 		pw: '£360',
	// 		for: 'For Sale',
	// 		sale: 'Yes',
	// 	},
	// 	{
	// 		id: 2,
	// 		name: '2013 Hitachi ZX27-3 mini digger',
	// 		posted: 'Posted',
	// 		date: 'September 14',
	// 		price: 'Hire price',
	// 		pd: '£80',
	// 		pw: '£360',
	// 		for: 'For Sale',
	// 		sale: 'Yes',
	// 	},
	// ];

	return (
		<View style={[props.style, styles.mainListStyle]}>
			<FlatList
				horizontal
				showsHorizontalScrollIndicator={false}
				data={advertList}
				renderItem={({item, index}) => (
					<ShadowView style={styles.hiringCardShadowViewStyle}>
						<View style={styles.hiringCardInnerImageLayout}>
							<Image
								source={{uri: item.main_image}}
								style={styles.hiringCardInnerImageStyle}
							/>
						</View>

						<View style={styles.hiringCardInnerRightLayout}>
							<TextField
								xSmall
								letterSpacing={-0.36}
								// lineHeight={22}
								isRLH
								lineHeight={2.2}
								fontFamily={GlobalTheme.fontBold}
								color={GlobalTheme.defaultBlack}>
								{item.name}
							</TextField>

							<Divider small />

							<View style={styles.hiringCardInnerDateAndTimeStyle}>
								<Entypo
									name="calendar"
									size={hp('1.6%')}
									color={GlobalTheme.primaryColor}
								/>

								<Divider horizontal medium />

								<TextField
									xThin
									letterSpacing={-0.07}
									// lineHeight={18}
									isRLH
									lineHeight={1.8}
									fontFamily={GlobalTheme.fontRegular}
									color={GlobalTheme.textColor}>
									Posted
									{'  '}
								</TextField>

								<TextField
									xThin
									letterSpacing={-0.07}
									// lineHeight={18}
									isRLH
									lineHeight={1.8}
									fontFamily={GlobalTheme.fontBold}
									color={GlobalTheme.black}>
									{formatToSentenceDateWithsufix(item.created_at)}
								</TextField>
							</View>

							<Divider />

							<View style={styles.providedByWrapperStyle}>
								<TextField
									xThin
									letterSpacing={-0.07}
									// lineHeight={18}
									isRLH
									lineHeight={1.8}
									fontFamily={GlobalTheme.fontRegular}
									color={GlobalTheme.textColor}>
									Hire price
								</TextField>

								<Divider horizontal medium />

								<TextField
									xThin
									letterSpacing={-0.07}
									// lineHeight={18}
									isRLH
									lineHeight={1.8}
									fontFamily={GlobalTheme.fontBold}
									color={GlobalTheme.black}>
									From £{item.least_price}{' '}
								</TextField>

								{/* <TextField
									xThin
									letterSpacing={-0.07}
									// lineHeight={18}
									isRLH
									lineHeight={1.8}
									fontFamily={GlobalTheme.fontRegular}
									color={GlobalTheme.textColor}>
									per day
								</TextField> */}

								{/* <TextField
									xThin
									letterSpacing={-0.07}
									// lineHeight={18}
									isRLH
									lineHeight={1.8}
									fontFamily={GlobalTheme.fontBold}
									color={GlobalTheme.black}>
									£{item.per_week_price}{' '}
								</TextField>

								<TextField
									xThin
									letterSpacing={-0.07}
									// lineHeight={18}
									isRLH
									lineHeight={1.8}
									fontFamily={GlobalTheme.fontRegular}
									color={GlobalTheme.textColor}>
									pw
								</TextField> */}
							</View>

							<Divider small />

							<View style={styles.providedByWrapperStyle}>
								<TextField
									xThin
									letterSpacing={-0.07}
									// lineHeight={18}
									isRLH
									lineHeight={1.8}
									fontFamily={GlobalTheme.fontRegular}
									color={GlobalTheme.textColor}>
									For Sale
								</TextField>

								<Divider horizontal medium />

								<TextField
									xThin
									letterSpacing={-0.07}
									// lineHeight={18}
									isRLH
									lineHeight={1.8}
									fontFamily={GlobalTheme.fontBold}
									color={GlobalTheme.black}>
									{item.is_for_sale === 1 ? 'Yes' : 'No'}
								</TextField>
							</View>
						</View>
					</ShadowView>
				)}
				keyExtractor={(item) => item.id.toString()}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	mainListStyle: {
		// width: '100%',
		// height: 135,
		width: wp('100%'),
		// height: hp('17%'),
		height: hp('18%'),
		// borderWidth: 1,
		// borderColor: 'red',
	},
	hiringCardShadowViewStyle: {
		// width: 310,
		// height: 105,
		width: wp('78%'),
		// height: hp('12%'),
		height: hp('13.5%'),
		flexDirection: 'row',
		justifyContent: 'flex-start',
		// padding: 10,
		padding: hp('1.0%'),
		marginTop: 10,
		marginLeft: 10,
		marginRight: 5,
		shadowRadius: GlobalTheme.shadowRadius,
		shadowColor: GlobalTheme.black,
		shadowOpacity: 0.28,
		borderWidth: 0.1,
		borderColor: 'transparent',
		backgroundColor: GlobalTheme.white,
		borderRadius: GlobalTheme.viewRadius,
		shadowOffset: {width: 0, height: 6},
	},
	hiringCardInnerImageLayout: {
		// width: '22%',
		// width: wp('22%'),
		width: wp('18%'),
		// borderWidth: 1,
		// borderColor: 'green',
	},
	hiringCardInnerImageStyle: {
		// width: wp('14.2%'),
		// height: hp('7.2%'),
		width: wp('15.2%'),
		height: hp('8.2%'),
		resizeMode: 'cover',
	},
	hiringCardInnerRightLayout: {
		// width: '78%',
		// width: wp('52%'),
		width: wp('56%'),
		// borderWidth: 1,
		// borderColor: 'blue',
	},
	hiringCardInnerDateAndTimeStyle: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	providedByWrapperStyle: {
		// width: '100%',
		// width: wp('52%'),
		width: wp('56%'),
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		// borderWidth: 1,
	},
});

export {AdvertisingCustomCarousel};
