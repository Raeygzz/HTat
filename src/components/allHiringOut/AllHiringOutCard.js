import React from 'react';
import {View, Image, StyleSheet, TouchableOpacity} from 'react-native';

import Icon from 'react-native-vector-icons/Entypo';
import {
	heightPercentageToDP as hp,
	widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {Divider} from '../common/Divider';
import {TextField} from '../common/TextField';
import {GlobalTheme} from '../theme/GlobalTheme';

const AllHiringOutCard = (props) => {
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
							/>

							<Divider horizontal small />

							<TextField
								xThin
								letterSpacing={-0.07}
								lineHeight={18}
								fontFamily={GlobalTheme.fontBold}
								color={GlobalTheme.black}>
								{props.date}
								{'  '}
							</TextField>

							<TextField
								xThin
								letterSpacing={-0.07}
								lineHeight={18}
								fontFamily={GlobalTheme.fontRegular}
								color={GlobalTheme.primaryColor}>
								{`${props.days} days`}
							</TextField>
						</View>

						<Divider medium />

						<View style={styles.providedByWrapperStyle}>
							<TextField
								xThin
								letterSpacing={-0.07}
								lineHeight={18}
								fontFamily={GlobalTheme.fontRegular}
								color={GlobalTheme.textColor}>
								Hiree
							</TextField>

							<Divider horizontal medium />

							<TextField
								xThin
								letterSpacing={-0.07}
								lineHeight={18}
								fontFamily={GlobalTheme.fontBold}
								color={GlobalTheme.black}>
								{props.name}
							</TextField>
						</View>

						<View style={styles.providedByWrapperStyle}>
							<TextField
								xThin
								letterSpacing={-0.07}
								lineHeight={18}
								fontFamily={GlobalTheme.fontRegular}
								color={GlobalTheme.textColor}>
								Collection type
							</TextField>

							<Divider horizontal medium />

							<TextField
								xThin
								letterSpacing={-0.07}
								lineHeight={18}
								fontFamily={GlobalTheme.fontBold}
								color={GlobalTheme.black}>
								{props.delivery}
							</TextField>

							<Divider horizontal small />

							<TextField
								xThin
								letterSpacing={-0.07}
								lineHeight={18}
								fontFamily={GlobalTheme.fontRegular}
								color={GlobalTheme.primaryColor}>
								{props.ff}
							</TextField>
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
		// height: 115,
		height: hp('14.8%'),
		justifyContent: 'center',
		alignItems: 'center',
		// paddingHorizontal: 10,
		paddingHorizontal: hp('1.2%'),
		// borderWidth: 1,
		// borderColor: 'yellow',
	},
	rowStyle: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		// borderWidth: 1,
		// borderColor: 'red',
	},
	allHiringOutCardInnerLeftLayout: {
		// width: '28%',
		width: wp('26.4%'),
		// borderWidth: 1,
		// borderColor: 'blue',
	},
	imageStyle: {
		// width: 90,
		// height: 90,
		width: hp('11.6%'),
		height: hp('11.6%'),
		resizeMode: 'cover',
		// borderWidth: 1,
		// borderColor: 'magenta',
	},
	allHiringOutCardInnerRightLayout: {
		// width: '72%',
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
	providedByWrapperStyle: {
		// width: '100%',
		width: wp('52%'),
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		// borderWidth: 1,
	},
});

export {AllHiringOutCard};
