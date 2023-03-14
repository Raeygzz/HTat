import React from 'react';
import {View, Image, StyleSheet, TouchableOpacity} from 'react-native';

import Icon from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {
	heightPercentageToDP as hp,
	widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {Divider} from '../common/Divider';
import {TextField} from '../common/TextField';
import {GlobalTheme} from '../theme/GlobalTheme';

const MyAdvertCard = (props) => {
	return (
		<>
			<TouchableOpacity
				style={styles.myAdvertCardWrapperStyle}
				onPress={props.onPress}>
				<View style={styles.rowStyle}>
					<View style={styles.myAdvertCardInnerLeftLayout}>
						<Image
							source={{uri: props.image}}
							style={styles.imageStyle(props.pause)}
						/>

						{props.pause ? (
							<View style={styles.pausedBarStyle}>
								<TextField
									center
									thin
									isRLH
									lineHeight={1.8}
									fontFamily={GlobalTheme.fontBold}
									color={GlobalTheme.white}>
									|| Paused
								</TextField>
							</View>
						) : null}
					</View>

					<View style={styles.myAdvertCardInnerRightLayout(props.pause)}>
						<TextField
							xSmall
							letterSpacing={-0.36}
							// lineHeight={22}
							isRLH
							lineHeight={2.2}
							fontFamily={GlobalTheme.fontBold}
							color={GlobalTheme.defaultBlack}>
							{props.name}
						</TextField>

						<Divider small />

						<View style={styles.myAdvertCardInnerRightRowContent}>
							<Icon
								name="calendar"
								size={hp('1.8%')}
								color={GlobalTheme.primaryColor}
							/>

							<Divider horizontal small />

							<TextField
								xThin
								letterSpacing={-0.07}
								// lineHeight={18}
								isRLH
								lineHeight={1.8}
								fontFamily={GlobalTheme.fontRegular}
								color={GlobalTheme.textColor}>
								Posted{' '}
							</TextField>

							<TextField
								xThin
								letterSpacing={-0.07}
								// lineHeight={18}
								isRLH
								lineHeight={1.8}
								fontFamily={GlobalTheme.fontBold}
								color={GlobalTheme.black}>
								{props.date}
							</TextField>
						</View>

						<Divider medium />

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
								From {props.pd}{' '}
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
								{props.pw}{' '}
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
								Advertised for sale
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
								{props.sale === 1 ? 'Yes' : 'No'}
							</TextField>
						</View>

						<EvilIcons
							name="chevron-right"
							size={hp('4.6%')}
							color={GlobalTheme.textColor}
							style={styles.chevronRightIconStyle}
						/>
					</View>
				</View>
			</TouchableOpacity>
			<Divider borderTopWidth={0.5} color={GlobalTheme.horizontalLineColor} />
		</>
	);
};

const styles = StyleSheet.create({
	myAdvertCardWrapperStyle: {
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
	myAdvertCardInnerLeftLayout: {
		// width: '28%',
		width: wp('26.4%'),
		// borderWidth: 1,
		// borderColor: 'blue',
	},
	imageStyle: (pause = false) => ({
		// width: 90,
		// height: 90,
		width: hp('11.6%'),
		height: hp('11.6%'),
		resizeMode: 'cover',
		opacity: pause ? 0.6 : 1,
		// borderWidth: 1,
		// borderColor: 'magenta',
	}),
	pausedBarStyle: {
		height: hp('1.8%'),
		width: hp('11.6%'),
		position: 'absolute',
		bottom: 0,
		backgroundColor: GlobalTheme.validationColor,
	},
	myAdvertCardInnerRightLayout: (pause = false) => ({
		// width: '72%',
		width: wp('68%'),
		opacity: pause ? 0.6 : 1,
		// borderWidth: 1,
		// borderColor: 'green',
	}),
	myAdvertCardInnerRightRowContent: {
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
	chevronRightIconStyle: {
		position: 'absolute',
		top: hp('3.5%'),
		right: 4,
		// borderWidth: 1,
		// borderColor: 'red',
		// elevation: 44,
	},
});

export {MyAdvertCard};
