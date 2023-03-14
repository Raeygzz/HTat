import React, {useState, useEffect} from 'react';
import {
	View,
	Modal,
	Image,
	ScrollView,
	StyleSheet,
	ImageBackground,
	TouchableOpacity,
} from 'react-native';

import {isTablet} from 'react-native-device-info';
import Icon from 'react-native-vector-icons/Entypo';
import {useFocusEffect} from '@react-navigation/native';
import ShadowView from 'react-native-simple-shadow-view';
import ImagePicker from 'react-native-image-crop-picker';
import {
	heightPercentageToDP as hp,
	widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {IOS} from '../../helper';
import {GlobalTheme} from '../../components/theme';
import {TextField, Divider, Button} from '../../components/common';

import {useSelector, useDispatch} from 'react-redux';
import {
	hidePhotosScreenModal,
	deletePhotoByIdApi,
	storePhotosApi,
	photoDeleteSuccess,
} from '../../store/actions/Adverts';

const AddPhotosModal = (props) => {
	// console.log('AddPhotosModal props ==> ', props);

	const deletePhotoSuccess = useSelector(
		(state) => state.adverts.deletePhotoSuccess,
	);

	const dispatch = useDispatch();

	const [mainImage, setMainImage] = useState([]);
	const [selectedMainImage, setSelectedMainImage] = useState('');
	const [displayMainImage, setDisplayMainImage] = useState('');

	const [photos, setPhotos] = useState([]);
	const [displayPhotos, setDisplayPhotos] = useState([]);
	const [selectedPhotoIdDeletion, setSelectedPhotoIdDeletion] = useState('');
	const [photosErrorMessage, setPhotosErrorMessage] = useState('');
	const [validateMaxPhoto, setValidateMaxPhoto] = useState(false);
	const [isUseEffectValidate, setIsUseEffectValidate] = useState(true);

	useFocusEffect(
		React.useCallback(() => {
			if (props.showPhotoModal && props.screen === 'PostAdvert') {
				setMainImage([]);
				setDisplayMainImage('');
				setPhotos(props.postAdvertPhotos);
				setDisplayPhotos(props.postAdvertPhotos);
				setPhotosErrorMessage('');
			}
		}, [props.screen, props.showPhotoModal]),
	);

	useEffect(() => {
		if (props.showPhotoModal && isUseEffectValidate) {
			if (props?.mainImage !== '' && props?.photos?.length > 0) {
				setMainImage(props.mainImage);
				setDisplayMainImage(props.mainImage);
				setDisplayPhotos(props.photos);
			}

			setIsUseEffectValidate(false);
		}
	}, [props.showPhotoModal, isUseEffectValidate]);

	useEffect(() => {
		if (deletePhotoSuccess) {
			let displayPhotosMap = displayPhotos;

			setDisplayPhotos([]);

			displayPhotosMap.map((item, id) => {
				if (item?.id) {
					if (item.id != selectedPhotoIdDeletion) {
						setDisplayPhotos((prevArray) => [...prevArray, item]);
					}
				} else {
					setDisplayPhotos((prevArray) => [...prevArray, item]);
				}
			});

			dispatch(photoDeleteSuccess(false));
		}
	}, [deletePhotoSuccess]);

	const closeModalHandler = () => {
		if (props.screen === 'PostAdvert') {
			setPhotos([]);
			setDisplayPhotos([]);
			setDisplayMainImage('');
			setSelectedMainImage('');
			props.postAdvertPhotosCancelCallback([]);
			props.postAdvertPhotosCallback([]);
			props.postAdvertMainImageCallback([]);
		}

		dispatch(hidePhotosScreenModal());
	};

	const addPhotosHandler = () => {
		setValidateMaxPhoto(false);

		ImagePicker.openPicker({
			multiple: true,
			includeBase64: true,
			compressImageQuality: 0.8,
			compressImageMaxWidth: 990,
			compressImageMaxHeight: 2050,
		})
			.then((results) => {
				// console.log('results ==> ', results);
				// console.log('results.length ==> ', results.length);
				// console.log('displayPhotos.length ==> ', displayPhotos.length);
				// console.log('total ==> ', displayPhotos.length + results.length);

				if (displayPhotos.length + results.length < 6) {
					for (const res of results) {
						if (
							res.mime === 'image/jpg' ||
							res.mime === 'image/jpeg' ||
							res.mime === 'image/png'
						) {
							setPhotos((prevArray) => [
								...prevArray,
								`data:${res.mime};base64,${res.data}`,
							]);
							setDisplayPhotos((prevArray) => [
								...prevArray,
								`data:${res.mime};base64,${res.data}`,
							]);
						}
					}

					setPhotosErrorMessage('');
					//
				} else {
					setValidateMaxPhoto(true);
				}
			})
			.catch((e) => {
				console.log('e ==> ', e);

				// let alertConfig = {
				// 	title: 'Oops!',
				// 	message: 'User cancelled image selection',
				// };

				// dispatch(presentAlert(alertConfig));
			});
	};

	const removePhotoByIdHandler = (photo) => {
		// console.log('removePhotoByIdHandler photo ==> ', photo);

		if (photo?.id) {
			setSelectedPhotoIdDeletion(photo.id);
			dispatch(deletePhotoByIdApi(props.advertId, photo.id));
		} else {
			let photosMap = photos;
			let displayPhotosMap = displayPhotos;

			setPhotos([]);
			setDisplayPhotos([]);

			photosMap.map((item, id) => {
				if (item.path != photo) {
					setPhotos((prevArray) => [...prevArray, item]);
				}
			});

			displayPhotosMap.map((item, id) => {
				if (item?.id === undefined) {
					if (item != photo) {
						setDisplayPhotos((prevArray) => [...prevArray, item]);
					}
				} else {
					setDisplayPhotos((prevArray) => [...prevArray, item]);
				}
			});
		}
	};

	const makeMainImageHandler = (item) => {
		// console.log('makeMainImageHandler item ==> ', item);

		let selectedMainImage = '';
		let displayPhotosMap = displayPhotos;

		for (let i = 0; i < displayPhotosMap.length; i++) {
			if (displayPhotosMap[i] === item) {
				selectedMainImage = displayPhotosMap[i];
				displayPhotosMap.splice(i, 1);
			}
		}

		displayPhotosMap.unshift(selectedMainImage);
		setDisplayPhotos(displayPhotosMap);
		setPhotos(displayPhotosMap);

		setMainImage(item);
		setDisplayMainImage(item);
		setSelectedMainImage(item);
	};

	const previewSelectedPhotoHandler = (item) => {
		// console.log('previewSelectedPhotoHandler item ==> ', item);

		if (typeof item === 'string') {
			setDisplayMainImage(item);
		}

		if (typeof item === 'object') {
			setDisplayMainImage(item.photo);
		}
	};

	const savePhotosHandler = () => {
		if (displayPhotos.length < 1) {
			setPhotosErrorMessage('Please add at least one photos in gallery.');
			return;
		}

		if (displayPhotos.length > 5) {
			setPhotosErrorMessage('Only five photos are allowed to add in gallery.');
			return;
		}

		if (props.screen === 'PostAdvert') {
			props.postAdvertPhotosCallback(photos);
			props.postAdvertMainImageCallback(mainImage);
			dispatch(hidePhotosScreenModal());
		}

		if (props.screen === 'EditAdvert') {
			let obj = {
				photos: photos,
			};

			if (photos.length > 0) {
				dispatch(storePhotosApi(obj, props.advertId));
			} else {
				dispatch(hidePhotosScreenModal());
			}
		}
	};

	// const clearMainImageHandler = () => {
	// 	setMainImage([]);
	// 	setSelectedMainImage('');
	// 	setDisplayMainImage('');
	// };

	const clearPhotosHandler = () => {
		setPhotos([]);
		setDisplayPhotos([]);
		setDisplayMainImage('');
	};

	// console.log('displayPhotos ==> ', displayPhotos);
	const photosGrid =
		displayPhotos.length > 0
			? displayPhotos.map((item, id) => {
					return (
						<View
							key={id}
							style={styles.photoGridViewStyle(props.screen, isTablet())}>
							{props.screen === 'PostAdvert' ? (
								<TouchableOpacity
									onPress={makeMainImageHandler.bind(this, item)}
									style={{
										height: hp('3.0%'),
										justifyContent: 'center',
										alignItems: 'center',
										// borderWidth: 1,
										// borderColor: 'red',
									}}>
									{selectedMainImage !== item ? (
										<TextField
											xThin
											center
											fontFamily={GlobalTheme.fontBold}
											color={GlobalTheme.primaryColor}>
											Set main image
										</TextField>
									) : null}
								</TouchableOpacity>
							) : null}

							<TouchableOpacity
								onPress={previewSelectedPhotoHandler.bind(this, item)}>
								<ImageBackground
									source={{
										uri: item?.photo ? item.photo : item,
									}}
									style={styles.photoGridViewImageStyle(isTablet())}>
									{props.screen === 'EditAdvert' ? (
										<TouchableOpacity
											onPress={removePhotoByIdHandler.bind(this, item)}>
											<Icon
												name="cross"
												size={hp('2.8%')}
												color={GlobalTheme.black}
												style={styles.crossIcon}
											/>
										</TouchableOpacity>
									) : null}
								</ImageBackground>
							</TouchableOpacity>
						</View>
					);
			  })
			: null;

	return (
		<Modal
			statusBarTranslucent
			animationType="fade"
			transparent={true}
			visible={props.showPhotoModal}>
			<View style={styles.modal}>
				<View style={styles.shadowViewStyle}>
					<View style={styles.headerStyle}>
						<TextField
							regular
							letterSpacing={-0.1}
							// lineHeight={18}
							isRLH
							lineHeight={2.0}
							fontFamily={GlobalTheme.fontRegular}
							color={GlobalTheme.white}
							style={styles.textCloseStyle}
							onPress={closeModalHandler}>
							Close
						</TextField>

						<TextField
							center
							regular
							letterSpacing={-0.1}
							// lineHeight={18}
							isRLH
							lineHeight={2.1}
							fontFamily={GlobalTheme.fontBold}
							color={GlobalTheme.white}
							style={styles.headerTextStyle}>
							Add Photos
						</TextField>

						<TouchableOpacity onPress={addPhotosHandler}>
							<TextField
								regular
								letterSpacing={-0.1}
								// lineHeight={18}
								isRLH
								lineHeight={2.0}
								fontFamily={GlobalTheme.fontRegular}
								color={GlobalTheme.white}
								style={styles.addTextStyle}>
								Add
							</TextField>
						</TouchableOpacity>
					</View>

					<ScrollView
						showsVerticalScrollIndicator={false}
						contentContainerStyle={styles.ph21}>
						<Divider />

						<View style={styles.mainImageAddButtonStyle}>
							{displayMainImage === '' ? (
								<TextField
									xSmall
									letterSpacing={-0.09}
									isRLH
									lineHeight={2.0}
									fontFamily={GlobalTheme.fontRegular}
									color={GlobalTheme.primaryColor}>
									Preview photos
								</TextField>
							) : (
								<Image
									source={{uri: displayMainImage}}
									style={styles.mainImageStyle}
								/>
							)}
						</View>

						<Divider medium />

						{validateMaxPhoto ? (
							<>
								<TextField
									thin
									isRLH
									lineHeight={1.8}
									fontFamily={GlobalTheme.fontRegular}
									color={GlobalTheme.primaryColor}>
									Oops!. You can only add 5 images in total. Please try again.
								</TextField>

								<Divider medium />
							</>
						) : null}

						<View style={styles.photoGridWrapperStyle}>{photosGrid}</View>

						{photosErrorMessage != '' ? (
							<TextField
								thin
								isRLH
								lineHeight={1.8}
								fontFamily={GlobalTheme.fontRegular}
								color={GlobalTheme.primaryColor}>
								{photosErrorMessage}
							</TextField>
						) : null}

						<Divider xxLarge />

						<Button
							title="SAVE PHOTOS"
							blackButton
							onPress={savePhotosHandler}
						/>

						<Divider />

						<View style={styles.clearButtonsGroup}>
							<View style={styles.clearButtonsWidthStyle}>
								{/* {displayMainImage != '' && props.screen === 'PostAdvert' ? ( */}
								{/* {mainImage != '' && props.screen === 'PostAdvert' ? (
									<TextField
										xThin
										left
										fontFamily={GlobalTheme.fontRegular}
										color={GlobalTheme.primaryColor}
										onPress={clearMainImageHandler}>
										Clear main image
									</TextField>
								) : null} */}
							</View>

							<View style={styles.clearButtonsWidthStyle}>
								{displayPhotos.length > 0 && props.screen === 'PostAdvert' ? (
									<TextField
										xThin
										right
										fontFamily={GlobalTheme.fontRegular}
										color={GlobalTheme.primaryColor}
										onPress={clearPhotosHandler}>
										Clear photos
									</TextField>
								) : null}
							</View>
						</View>

						<Divider xLarge />
					</ScrollView>
				</View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modal: {
		flex: 1,
		// borderWidth: 1,
		// borderColor: 'green',
	},
	photoGridViewStyle: (screen = 'PostAdvert', isTablet) => ({
		width: '30.8%',
		// height: screen === 'PostAdvert' ? hp('12%') : hp('9%'),
		height:
			screen === 'PostAdvert'
				? IOS && isTablet
					? hp('17.0%')
					: hp('12.0%')
				: IOS && isTablet
				? hp('14.0%')
				: hp('9.0%'),
		marginRight: hp('1.0%'),
		marginBottom: hp('1.0%'),
		backgroundColor: GlobalTheme.photoGridBackgroundColor,
		// borderWidth: 1,
		// borderColor: 'red',
	}),
	photoGridViewImageStyle: (isTablet) => ({
		width: '100%',
		// height: hp('9%'),
		height: IOS && isTablet ? hp('13.8%') : hp('9.0%'),
		resizeMode: 'contain',
		// borderWidth: 1,
		// borderColor: 'blue',
	}),
	crossIcon: {
		textAlign: 'right',
		// borderWidth: 1
	},
	shadowViewStyle: {
		width: wp('90%'),
		height: hp('66%'),
		shadowRadius: GlobalTheme.shadowRadius,
		shadowColor: GlobalTheme.black,
		shadowOpacity: 0.28,
		borderWidth: 0.1,
		position: 'absolute',
		bottom: 0,
		alignSelf: 'center',
		borderColor: 'transparent',
		backgroundColor: GlobalTheme.white,
		borderRadius: GlobalTheme.viewRadius,
		shadowOffset: {width: 0, height: 6},
		elevation: 44,
		// borderWidth: 1,
		// borderColor: 'blue',
	},
	headerStyle: {
		width: wp('90%'),
		height: hp('6.3%'),
		backgroundColor: GlobalTheme.primaryColor,
		borderTopLeftRadius: GlobalTheme.viewRadius,
		borderTopRightRadius: GlobalTheme.viewRadius,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		// borderWidth: 1,
		// borderColor: 'blue',
	},
	textCloseStyle: {
		width: wp('20%'),
		paddingLeft: hp('2.6%'),
		// borderWidth: 1,
		// borderColor: '#fff',
	},
	headerTextStyle: {
		width: wp('60%'),
		// borderWidth: 1,
	},
	addTextStyle: {
		width: wp('10%'),
		// borderWidth: 1,
	},
	mainImageAddButtonStyle: {
		flex: 1,
		width: '100%',
		height: hp('26.0%'),
		backgroundColor: GlobalTheme.photoGridBackgroundColor,
		justifyContent: 'center',
		alignItems: 'center',
		// borderWidth: 1,
	},
	ph21: {
		paddingHorizontal: hp('2.7%'),
		// borderWidth: 1,
	},
	// mainImageAddButtonInnerStyle: {
	// 	flexDirection: 'row',
	// 	position: 'absolute',
	// 	top: '45%',
	// 	left: '35%',
	// 	// borderWidth: 1,
	// },
	plusImageStyle: {
		width: hp('1.8%'),
		height: hp('1.8%'),
		resizeMode: 'cover',
		marginRight: 3,
		// borderWidth: 1,
		// borderColor: 'green',
	},
	mainImageStyle: {
		flex: 1,
		width: '100%',
		height: hp('26.0%'),
		resizeMode: 'contain',
		// borderWidth: 1,
		// borderColor: 'blue',
	},
	numberOfImageWrapperStyle: {
		// width: 95,
		// height: 22,
		width: wp('23%'),
		height: hp('2.8%'),
		borderRadius: 3,
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		alignItems: 'center',
		// alignSelf: 'center',
		backgroundColor: GlobalTheme.primaryColor,
		position: 'absolute',
		left: '35%',
		bottom: 10,
	},
	imagesGalleryIconStyle: {
		width: hp('2%'),
		height: hp('2%'),
		resizeMode: 'cover',
	},
	photoGridWrapperStyle: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		flexWrap: 'wrap',
		// borderWidth: 1,
	},
	clearButtonsGroup: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		// borderWidth: 1,
	},
	clearButtonsWidthStyle: {
		width: '50%',
		// borderWidth: 1,
	},
});

export {AddPhotosModal};
