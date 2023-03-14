import React from 'react';
import {
	View,
	Image,
	StyleSheet,
	ImageBackground,
	TouchableOpacity,
} from 'react-native';

import {isTablet} from 'react-native-device-info';
import ShadowView from 'react-native-simple-shadow-view';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
	heightPercentageToDP as hp,
	widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {IOS} from '../../helper';
import {TextField} from '../common';
import {GlobalTheme} from '../theme';

const ImageCard = (props) => {
	// console.log('ImageCard props ==> ', props);

	const {
		hasError,
		// hireMainImage,
		img,
		onPress,
		// saleMainImage,
		totalNumberImages,
	} = props;

	return (
		<ShadowView style={styles.shadowViewStyle(hasError, isTablet())}>
			<View style={styles.mainView}>
				{img != '' ? (
					<ImageBackground
						source={{uri: img}}
						style={styles.imageBackgroundStyle}
						imageStyle={styles.imageBackgroundImageStyle}>
						<TouchableOpacity
							style={styles.editImageWrapperStyle}
							onPress={onPress}>
							<View style={styles.editImageInnerStyle}>
								<Ionicons
									name="pencil"
									size={hp('1.6%')}
									color={GlobalTheme.white}
									style={styles.mr5}
								/>
								<TextField
									xSmall
									letterSpacing={-0.09}
									lineHeight={18}
									fontFamily={GlobalTheme.fontRegular}
									color={GlobalTheme.white}>
									Edit Image
								</TextField>
							</View>
						</TouchableOpacity>

						{img != '' ? (
							<View style={styles.numberOfImageWrapperStyle}>
								<Image
									source={require('../../assets/image/icon/images.png')}
									style={styles.imagesGalleryIconStyle}
								/>

								<TextField
									xThin
									letterSpacing={-0.19}
									lineHeight={20}
									fontFamily={GlobalTheme.fontRegular}
									color={GlobalTheme.white}>
									+{totalNumberImages} images
								</TextField>
							</View>
						) : null}
					</ImageBackground>
				) : (
					<>
						<Image
							source={require('../../assets/image/imagePlaceholder.png')}
							style={styles.placeholderImageStyle}
						/>

						<TouchableOpacity style={styles.rowStyle} onPress={onPress}>
							<Image
								source={require('../../assets/image/plus.png')}
								style={styles.plusImageStyle}
							/>

							<TextField
								xSmall
								letterSpacing={-0.09}
								lineHeight={18}
								fontFamily={GlobalTheme.fontRegular}
								color={GlobalTheme.primaryColor}>
								Add Images
							</TextField>
						</TouchableOpacity>
					</>
				)}
			</View>
		</ShadowView>
	);
};

const styles = StyleSheet.create({
	shadowViewStyle: (hasError = false, isTablet) => ({
		width: '95%',
		// height: 185,
		// height: hp('24%'),
		height: IOS && isTablet ? hp('50.0%') : hp('24.0%'),
		shadowRadius: hasError ? null : GlobalTheme.shadowRadius,
		shadowColor: GlobalTheme.black,
		shadowOpacity: 0.28,
		alignSelf: 'center',
		borderWidth: hasError ? 1 : 0.1,
		borderRadius: GlobalTheme.viewRadius,
		borderColor: hasError ? GlobalTheme.validationColor : 'transparent',
		backgroundColor: '#F2F2F2',
		shadowOffset: {width: 0, height: 6},
	}),
	mainView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		// borderWidth: 1,
	},
	imageBackgroundStyle: {
		width: '100%',
		height: '100%',
		resizeMode: 'cover',
		opacity: 0.8,
		backgroundColor: GlobalTheme.black,
		borderRadius: GlobalTheme.viewRadius,
	},
	imageBackgroundImageStyle: {
		borderRadius: GlobalTheme.viewRadius,
	},
	editImageWrapperStyle: {
		width: '100%',
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		// borderWidth: 1,
	},
	editImageInnerStyle: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	mr5: {
		marginRight: 5,
	},
	numberOfImageWrapperStyle: {
		width: 85,
		height: 22,
		borderRadius: 3,
		backgroundColor: GlobalTheme.primaryColor,
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		alignItems: 'center',
		position: 'absolute',
		left: 8,
		bottom: 10,
		elevation: 7,
	},
	imagesGalleryIconStyle: {
		width: 16,
		height: 16,
		resizeMode: 'stretch',
	},
	placeholderImageStyle: {
		// width: 50,
		// height: 50,
		width: hp('6.5%'),
		height: hp('6.5%'),
		resizeMode: 'cover',
		// borderWidth: 1,
		// borderColor: 'red',
	},
	rowStyle: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		// borderWidth: 1,
	},
	plusImageStyle: {
		// width: 15,
		// height: 15,
		width: hp('1.8%'),
		height: hp('1.8%'),
		resizeMode: 'cover',
		marginRight: 3,
		// borderWidth: 1,
		// borderColor: 'green',
	},
});

export {ImageCard};
