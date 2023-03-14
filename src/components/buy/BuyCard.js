import React from 'react';
import {View, Image, StyleSheet, TouchableOpacity} from 'react-native';

import Icon from 'react-native-vector-icons/EvilIcons';
import {
	heightPercentageToDP as hp,
	widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {Divider} from '../common/Divider';
import {TextField} from '../common/TextField';
import {GlobalTheme} from '../theme/GlobalTheme';

const BuyCard = (props) => {
	return (
		<>
			<TouchableOpacity style={styles.cardWrapper} onPress={props.onPress}>
				<View style={styles.cardSubWrapper}>
					<View style={styles.leftLayoutStyle}>
						<Image
							source={{uri: props.image}}
							resizeMode="cover"
							style={styles.imageStyle}
						/>
					</View>

					<View style={styles.rightLayoutStyle}>
						<TextField
							xSmall
							// lineHeight={22}
							numberOfLines={3}
							letterSpacing={-0.36}
							fontFamily={GlobalTheme.fontBold}
							color={GlobalTheme.defaultBlack}>
							{props.name}
						</TextField>

						<Divider large />

						<View style={styles.rightLayoutSecondContent}>
							<View style={styles.rightLayoutSecondContentDetail}>
								<TextField
									xThin
									letterSpacing={-0.07}
									isRLH
									lineHeight={1.8}
									fontFamily={GlobalTheme.fontRegular}
									color={GlobalTheme.textColor}>
									From{' '}
								</TextField>
								<TextField
									small
									letterSpacing={-0.22}
									isRLH
									lineHeight={2.2}
									fontFamily={GlobalTheme.fontBold}
									color={GlobalTheme.black}>
									£{props.price}{' '}
								</TextField>
								<TextField
									xThin
									letterSpacing={-0.07}
									isRLH
									lineHeight={1.8}
									fontFamily={GlobalTheme.fontRegular}
									color={GlobalTheme.textColor}>
									per day
								</TextField>
							</View>

							<Divider horizontal xxMedium />

							{props.buyingPrice !== null ? (
								<View style={styles.rightLayoutSecondContentLast}>
									<Image
										source={require('../../assets/image/icon/tag.png')}
										resizeMode="contain"
										style={styles.tagImageStyle}
									/>

									<TextField
										xThin
										letterSpacing={-0.19}
										isRLH
										lineHeight={2.0}
										fontFamily={GlobalTheme.fontBold}
										color={GlobalTheme.primaryColor}
										style={styles.mr5}>
										Buy
									</TextField>

									<TextField
										small
										letterSpacing={-0.22}
										isRLH
										lineHeight={2.0}
										fontFamily={GlobalTheme.fontBold}
										color={GlobalTheme.black}>
										£{props.buyingPrice}
									</TextField>
								</View>
							) : null}

							<Icon
								name="chevron-right"
								size={hp('3.2%')}
								color={GlobalTheme.textColor}
								style={styles.chevronIconStyle}
							/>
						</View>

						{/* <Divider xMedium /> */}

						<View style={styles.rightLayoutThirdContent}>
							<Image
								source={require('../../assets/image/icon/location.png')}
								resizeMode="contain"
								style={styles.locationImageStyle}
							/>

							<Divider horizontal small />

							<TextField
								xThin
								letterSpacing={-0.07}
								isRLH
								lineHeight={1.8}
								fontFamily={GlobalTheme.fontRegular}
								color={GlobalTheme.textColor}>
								{props.distance}
							</TextField>
						</View>
					</View>
				</View>
			</TouchableOpacity>

			<View style={styles.borderLineStyle} />
		</>
	);
};

const styles = StyleSheet.create({
	cardWrapper: {
		width: wp('100%'),
		height: hp('15%'),
		padding: 10,
		// borderWidth: 1,
	},
	cardSubWrapper: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	leftLayoutStyle: {
		width: wp('30%'),
		height: hp('12%'),
		// borderWidth: 1,
		// borderColor: 'red',
	},
	imageStyle: {
		width: wp('28%'),
		height: hp('11.5%'),
	},
	rightLayoutStyle: {
		width: wp('65%'),
		height: hp('12%'),
		// borderWidth: 1,
		// borderColor: 'blue',
	},
	rightLayoutSecondContent: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	rightLayoutSecondContentDetail: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	rightLayoutSecondContentLast: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	tagImageStyle: {
		width: 17,
		height: 15,
	},
	mr5: {
		marginRight: 5,
	},
	chevronIconStyle: {
		position: 'absolute',
		right: 0,
	},
	rightLayoutThirdContent: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		position: 'absolute',
		left: 0,
		bottom: 0,
		// borderWidth: 1,
	},
	locationImageStyle: {
		width: 14,
		height: 15,
	},
	borderLineStyle: {
		width: wp('100%'),
		borderColor: '#0000002E',
		borderTopWidth: 1,
	},
});

export {BuyCard};
