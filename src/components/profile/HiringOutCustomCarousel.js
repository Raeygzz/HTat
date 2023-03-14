import React from 'react';
import {View, Image, StyleSheet, FlatList} from 'react-native';

import Entypo from 'react-native-vector-icons/Entypo';
import ShadowView from 'react-native-simple-shadow-view';
import {
	changeTwoDatesToFormattedDate,
	findNumberOfDaysFromTwoDates,
} from '../../utils';
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {GlobalTheme} from '../theme';
import {TextField, Divider} from '../common';

const HiringOutCustomCarousel = (props) => {
	// const data = [
	// 	{
	// 		id: 0,
	// 		name: 'JCB 8026 Compact Excavator',
	// 		date: '7th - 8th Sept',
	// 		days: '2 days',
	// 		hiree: 'Hiree',
	// 		hireeName: 'Trevor Jones',
	// 		collectionType: 'Collection type',
	// 		delivery: 'Delivery',
	// 		ff: 'EX2 8FF',
	// 	},
	// 	{
	// 		id: 1,
	// 		name: 'JCB 8026 Compact Excavator',
	// 		date: '9th - 11th Sept',
	// 		days: '3 days',
	// 		hiree: 'Hiree',
	// 		hireeName: 'Trevor Jones',
	// 		collectionType: 'Collection type',
	// 		delivery: 'Delivery',
	// 		ff: 'EX2 8FF',
	// 	},
	// 	{
	// 		id: 2,
	// 		name: 'JCB 8026 Compact Excavator',
	// 		date: '12th - 15th Sept',
	// 		days: '4 days',
	// 		hiree: 'Hiree',
	// 		hireeName: 'Trevor Jones',
	// 		collectionType: 'Collection type',
	// 		delivery: 'Delivery',
	// 		ff: 'EX2 8FF',
	// 	},
	// ];

	return (
		<View style={[props.style, styles.mainListStyle]}>
			<FlatList
				horizontal
				showsHorizontalScrollIndicator={false}
				data={props.hiringOut}
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
									color={GlobalTheme.primaryColor}
								/>

								<Divider horizontal medium />

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
									Hiree
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
									{item.hiree.name}
								</TextField>
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
									Collection Type
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
									{item.collection_type.charAt(0).toUpperCase() +
										item.collection_type.slice(1)}{' '}
								</TextField>

								<TextField
									xThin
									letterSpacing={-0.07}
									// lineHeight={18}
									isRLH
									lineHeight={1.8}
									fontFamily={GlobalTheme.fontRegular}
									color={GlobalTheme.primaryColor}>
									{item.delivery.post_code}
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

export {HiringOutCustomCarousel};
