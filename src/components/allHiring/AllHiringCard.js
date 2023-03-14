import React from 'react';
import {View, Image, StyleSheet, TouchableOpacity} from 'react-native';

import Icon from 'react-native-vector-icons/Entypo';
import ShadowView from 'react-native-simple-shadow-view';
import {
	heightPercentageToDP as hp,
	widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {Divider} from '../common/Divider';
import {TextField} from '../common/TextField';
import {GlobalTheme} from '../theme/GlobalTheme';

const AllHiringCard = (props) => {
	return (
		<>
			<TouchableOpacity
				style={styles.allHiringOutCardWrapperStyle}
				onPress={props.onPress}>
				<View style={styles.rowStyle}>
					<View style={styles.allHiringOutCardInnerLeftLayout}>
						<Image source={{uri: props.image}} style={styles.imageStyle} />
					</View>

					<View style={styles.allHiringOutCardInnerRightLayout}>
						<TextField
							xSmall
							letterSpacing={-0.36}
							// lineHeight={22}
							isRLH
							lineHeight={2.2}
							fontFamily={GlobalTheme.fontBold}
							color={GlobalTheme.defaultBlack}>
							{props.productName}
						</TextField>

						<Divider small />

						<View style={styles.allHiringOutCardInnerRightRowContent}>
							<Icon
								name="calendar"
								size={hp('1.6%')}
								color={GlobalTheme.primaryColor}
								style={styles.calendarIconStyle}
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
								{props.date}
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
								{`${props.days} days`}
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
									{props.providedBy}
								</TextField>
							</View>
						</View>
					</View>
				</View>
			</TouchableOpacity>
			<Divider borderTopWidth={0.5} color={GlobalTheme.horizontalLineColor} />
		</>
	);
};

const styles = StyleSheet.create({
	allHiringOutCardWrapperStyle: {
		width: wp('100%'),
		height: hp('14.8%'),
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: hp('1.2%'),
		// borderWidth: 1,
		// borderColor: 'yellow',
	},
	rowStyle: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		// borderWidth: 1,
		// borderColor: 'blue',
	},
	allHiringOutCardInnerLeftLayout: {
		width: wp('26.4%'),
		// borderWidth: 1,
		// borderColor: 'red',
	},
	imageStyle: {
		width: hp('11.6%'),
		height: hp('11.6%'),
		resizeMode: 'cover',
		// borderWidth: 1,
		// borderColor: 'magenta',
	},
	allHiringOutCardInnerRightLayout: {
		width: wp('68%'),
		// borderWidth: 1,
		// borderColor: 'green',
	},
	allHiringOutCardInnerRightRowContent: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		// borderWidth: 1,
	},
	calendarIconStyle: {
		top: -2,
	},
	providedByWrapperStyle: {
		width: wp('68%'),
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		// borderWidth: 1,
		// borderColor: 'red',
	},
	providedByImageStyle: {
		width: wp('12%'),
		height: hp('5.6%'),
		// paddingTop: hp('0.3%'),
		// borderWidth: 1,
	},
	circleShadowViewStyle: {
		width: hp('4.0%'),
		height: hp('4.0%'),
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
		width: wp('56%'),
		height: hp('5.6%'),
		paddingTop: hp('0.5%'),
		// borderWidth: 1,
	},
});

export {AllHiringCard};
