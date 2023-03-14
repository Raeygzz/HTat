import React, {useState, useEffect} from 'react';
import {
	View,
	Image,
	FlatList,
	TouchableOpacity,
	StyleSheet,
} from 'react-native';

import ImageView from 'react-native-image-viewing';
import analytics from '@react-native-firebase/analytics';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

import {TextField} from '../common';
import {GlobalTheme} from '../theme';

const Gallery = (props) => {
	const {imageGallery} = props;

	const [imageViewVisible, setImageViewVisible] = useState(false);
	const [imageIndex, setImageIndex] = useState(0);
	const [imagesCount, setImagesCount] = useState(0);
	const [finalViewingImage, setFinalViewingImage] = useState([]);

	useEffect(() => {
		if (imageGallery.length > 0) {
			setImagesCount(imageGallery.length);

			let images = [];
			for (let i = 0; i < imageGallery.length; i++) {
				images.push({
					uri: imageGallery[i].photo,
				});
			}

			setFinalViewingImage(images);
		}
	}, [imageGallery]);

	const viewImageHandler = (index) => {
		setImageIndex(index);
		setImageViewVisible(true);
		analytics().logEvent('images_gallery_pressed');
	};

	return (
		<>
			<FlatList
				horizontal
				showsHorizontalScrollIndicator={false}
				style={styles.mainListStyle}
				data={imageGallery}
				renderItem={({item, index}) => (
					<TouchableOpacity
						style={styles.mainViewStyle}
						onPress={viewImageHandler.bind(this, index)}>
						<Image
							key={index}
							source={{uri: item.photo}}
							style={styles.imageStyle}
						/>
					</TouchableOpacity>
				)}
				keyExtractor={(item) => item.id.toString()}
			/>

			<ImageView
				animationType="fade"
				images={finalViewingImage}
				imageIndex={imageIndex}
				visible={imageViewVisible}
				onRequestClose={() => setImageViewVisible(false)}
				FooterComponent={({imageIndex}) => (
					<View style={styles.root}>
						<TextField
							xThin
							letterSpacing={-0.07}
							isRLH
							lineHeight={1.8}
							fontFamily={GlobalTheme.fontRegular}
							color={GlobalTheme.white}>
							{`${imageIndex + 1} / ${imagesCount}`}
						</TextField>
					</View>
				)}
			/>
		</>
	);
};

const styles = StyleSheet.create({
	mainListStyle: {
		width: '100%',
		height: hp('12.0%'),
		// borderWidth: 1,
		// borderColor: 'red',
	},
	mainViewStyle: {
		height: hp('10.5%'),
		width: hp('10.5%'),
		marginRight: hp('1.2%'),
		alignSelf: 'center',
		justifyContent: 'center',
		alignItems: 'center',
	},
	imageStyle: {
		height: hp('10.5%'),
		width: hp('10.5%'),
		resizeMode: 'contain',
		// borderWidth: 1,
		// borderColor: 'green',
	},
	root: {
		height: hp('8.4%'),
		backgroundColor: '#00000077',
		justifyContent: 'center',
		alignItems: 'center',
		// borderWidth: 1,
		// borderColor: '#FFF',
	},
});

export {Gallery};
