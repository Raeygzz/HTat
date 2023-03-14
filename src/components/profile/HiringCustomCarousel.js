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
import {
	changeTwoDatesToFormattedDate,
	findNumberOfDaysFromTwoDates,
} from '../../utils';

const HiringCustomCarousel = (props) => {
	// const data = [
	// 	{
	// 		id: 0,
	// 		name: '2013 Hitachi ZX27-3 mini digger',
	// 		days: '5 days',
	// 		date: '(9th - 13th Sept)',
	// 		providedBy: 'Provided by',
	// 		brandName: 'Wedgewood groundworks',
	// 	},
	// 	{
	// 		id: 1,
	// 		name: '2013 Hitachi ZX27-3 mini digger',
	// 		days: '6 days',
	// 		date: '(14th - 18th Sept)',
	// 		providedBy: 'Provided by',
	// 		brandName: 'Wedgewood groundworks',
	// 	},
	// 	{
	// 		id: 2,
	// 		name: '2013 Hitachi ZX27-3 mini digger',
	// 		days: '7 days',
	// 		date: '(18th - 22th Sept)',
	// 		providedBy: 'Provided by',
	// 		brandName: 'Wedgewood groundworks',
	// 	},
	// ];

	return (
		<View style={[props.style, styles.mainListStyle]}>
			<FlatList
				horizontal
				showsHorizontalScrollIndicator={false}
				data={props.hiring}
				renderItem={({item, index}) => (
					<ShadowView style={styles.hiringCardShadowViewStyle}>
						<View style={styles.hiringCardInnerImageLayout}>
							<Image
								source={{uri: item.item.main_image}}
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
								{item.item.name}
							</TextField>

							<Divider small />

							<View style={styles.hiringCardInnerDateAndTimeStyle}>
								<Entypo
									name="calendar"
									size={hp('1.6%')}
									style={{top: -2}}
									color={GlobalTheme.primaryColor}
								/>

								<Divider horizontal small />

								<TextField
									xThin
									letterSpacing={-0.07}
									// lineHeight={18}
									isRLH
									lineHeight={1.8}
									fontFamily={GlobalTheme.fontBold}
									color={GlobalTheme.black}>
									{changeTwoDatesToFormattedDate(
										item.start_date,
										item.end_date,
									)}
									{'  '}
								</TextField>

								<TextField
									xThin
									letterSpacing={-0.07}
									// lineHeight={18}
									isRLH
									lineHeight={1.8}
									fontFamily={GlobalTheme.fontRegular}
									color={GlobalTheme.primaryColor}>
									{`${findNumberOfDaysFromTwoDates(
										item.start_date,
										item.end_date,
									)} days`}
								</TextField>
							</View>

							<Divider medium />

							<View style={styles.providedByWrapperStyle}>
								<View style={styles.providedByImageStyle}>
									<ShadowView style={styles.circleShadowViewStyle}></ShadowView>
								</View>

								<View style={styles.providedByDetailStyle}>
									<TextField
										xThin
										letterSpacing={-0.07}
										// lineHeight={18}
										isRLH
										lineHeight={1.8}
										fontFamily={GlobalTheme.fontRegular}
										color={GlobalTheme.textColor}>
										Provided by
									</TextField>

									<Divider small />

									<TextField
										small
										letterSpacing={-0.09}
										// lineHeight={18}
										isRLH
										lineHeight={1.8}
										fontFamily={GlobalTheme.fontBold}
										color={GlobalTheme.black}>
										{item.item.provided_by}
									</TextField>
								</View>
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
		// borderWidth: 1,
		// borderColor: 'red',
	},
	hiringCardInnerRightLayout: {
		// width: '69%',
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
		// height: 56,
		// width: wp('52%'),
		width: wp('56%'),
		height: hp('5.6%'),
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		// paddingTop: 10,
		// paddingTop: hp('1.5%'),
		// borderWidth: 1,
		// borderColor: 'red',
	},
	providedByImageStyle: {
		// width: '15%',
		// height: 56,
		width: wp('9%'),
		height: hp('5.6%'),
		paddingTop: hp('0.3%'),
		// borderWidth: 1,
	},
	circleShadowViewStyle: {
		// width: 32,
		// height: 32,
		width: hp('3.8%'),
		height: hp('3.8%'),
		shadowRadius: 3,
		shadowColor: GlobalTheme.black,
		shadowOpacity: 0.28,
		borderWidth: 0.1,
		marginLeft: hp('0.2%'),
		borderColor: 'transparent',
		backgroundColor: '#00595D',
		borderRadius: 50,
		shadowOffset: {width: 0, height: 0},
	},
	providedByDetailStyle: {
		// width: '85%',
		// height: 56,
		// width: wp('43%'),
		width: wp('47%'),
		height: hp('5.6%'),
		paddingTop: hp('0.3%'),
		paddingLeft: 5,
		// borderWidth: 1,
		// borderColor: 'red',
	},
});

export {HiringCustomCarousel};
