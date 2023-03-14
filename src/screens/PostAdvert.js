import React, {useState, useEffect, useRef} from 'react';
import {
	View,
	ScrollView,
	StyleSheet,
	PermissionsAndroid,
	TouchableWithoutFeedback,
} from 'react-native';

import {Switch} from 'react-native-switch';
import Geocoder from 'react-native-geocoding';
import {showMessage} from 'react-native-flash-message';
import ImagePicker from 'react-native-image-crop-picker';
import ShadowView from 'react-native-simple-shadow-view';
import Geolocation from 'react-native-geolocation-service';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
	heightPercentageToDP as hp,
	widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {_ENV_CONFIG} from '../config';
import {IOS, ANDROID} from '../helper';
import {RegExp, getYears} from '../utils';
import {GlobalTheme} from '../components/theme';
// import {findLatLong} from '../services/axios/Api';
import {findAddressFromPostcode} from '../services/axios/Api';
import {YesNo, Distance} from '../constants/Constant';
import {AddPhotosModal} from './modals/AddPhotosModal';
import {ImageCard} from '../components/postAdvert/ImageCard';
import {
	GenericView,
	Header,
	Button,
	Divider,
	TextField,
	HTMaterialPicker,
	HTMaterialTextInput,
	OnlyCheckBox,
	ParsedLinkText,
} from '../components/common';
import {
	TitleSchema,
	CategorySchema,
	SubCategorySchema,
	DescriptionSchema,
	AgeSchema,
	LengthSchema,
	WidthSchema,
	DepthSchema,
	LocationSchema,
	ManualAddressLocationSchema,
	ManualAddressFromPostcodeSchema,
	CollectionAvailableSchema,
	DeliveryAvailableSchema,
	DeliveryDistanceSchema,
	MakeSchema,
	ModelSchema,
	DeliveryChargeSchema,
	PerDaySchema,
	PerWeekSchema,
	WeightSchema,
	ForSaleSchema,
	OffersAcceptedSchema,
} from '../models/validations/PostAdvert';

import {useSelector, useDispatch} from 'react-redux';
import {headerTitle} from '../store/actions/Header';
import {presentAlert} from '../store/actions/Alert';
import {clearTextInputReq} from '../store/actions/ClearTextInput';
import {presentLoader, hideLoader} from '../store/actions/Loader';
import {categoriesApi, subCategoriesApi} from '../store/actions/Categories';
import {
	createAdvertApi,
	presentPhotosScreenModal,
	removeAdvertErrorMessage,
} from '../store/actions/Adverts';

const PostAdvert = (props) => {
	const categoriesPickerList = useSelector(
		(state) => state.categories.categoriesPickerList,
	);
	const categoriesHirePickerList = useSelector(
		(state) => state.categories.categoriesHirePickerList,
	);
	const categoriesSalePickerList = useSelector(
		(state) => state.categories.categoriesSalePickerList,
	);
	const categoriesForBothPickerList = useSelector(
		(state) => state.categories.categoriesForBothPickerList,
	);
	const subCategoriesPickerList = useSelector(
		(state) => state.categories.subCategoriesPickerList,
	);
	const addressPickerList = useSelector(
		(state) => state.profile.addressPickerList,
	);
	const textInputClear = useSelector(
		(state) => state.clearTextInput.textInputClear,
	);
	const photosScreenModal = useSelector(
		(state) => state.adverts.presentPhotosScreenModal,
	);
	const hasPrimaryCard = useSelector(
		(state) => state.auth.user.has_primary_card,
	);
	const completedStripeOnboarding = useSelector(
		(state) => state.auth.user.completed_stripe_onboarding,
	);
	const main_image_error_message = useSelector(
		(state) => state.adverts.mainImageErrorMessage,
	);
	const photos_error_message = useSelector(
		(state) => state.adverts.photosErrorMessage,
	);
	// const length_error_message = useSelector(
	// 	(state) => state.adverts.lengthErrorMessage,
	// );
	// const width_error_message = useSelector(
	// 	(state) => state.adverts.widthErrorMessage,
	// );
	// const depth_error_message = useSelector(
	// 	(state) => state.adverts.depthErrorMessage,
	// );
	const delivery_charge_error_message = useSelector(
		(state) => state.adverts.deliveryChargeErrorMessage,
	);
	const perDay_error_message = useSelector(
		(state) => state.adverts.perDayErrorMessage,
	);
	const perWeek_error_message = useSelector(
		(state) => state.adverts.perWeekErrorMessage,
	);
	const forSale_error_message = useSelector(
		(state) => state.adverts.forSaleErrorMessage,
	);

	const [advertTitle, setAdvertTitle] = useState('');
	const [advertTitleValidate, setAdvertTitleValidate] = useState(false);

	const [advertiseToHire, setAdvertiseToHire] = useState(false);
	const [advertiseToSale, setAdvertiseToSale] = useState(false);
	const [toggleButtonValidate, setToggleButtonValidate] = useState(false);

	const [modalScreenPhotos, setModalScreenPhotos] = useState([]);
	const [postAdvertPhotos, setPostAdvertPhotos] = useState([]);
	const [postAdvertPhotosValidate, setPostAdvertPhotosValidate] = useState(
		false,
	);
	const [
		postAdvertPhotosErrorMessage,
		setPostAdvertPhotosErrorMessage,
	] = useState('');

	const [modalScreenMainImage, setModalScreenMainImage] = useState([]);
	const [postAdvertMainImage, setPostAdvertMainImage] = useState([]);
	const [
		postAdvertMainImageErrorMessage,
		setPostAdvertMainImageErrorMessage,
	] = useState('');

	const [advertCategory, setAdvertCategory] = useState('');
	const [advertCategoryErrorMessage, setAdvertCategoryErrorMessage] = useState(
		'',
	);
	const [advertCategorySelectedId, setAdvertCategorySelectedId] = useState('');
	const [advertCategoryValidate, setAdvertCategoryValidate] = useState(false);
	const [
		clearCategoryPickerDefaultValue,
		setClearCategoryPickerDefaultValue,
	] = useState(false);

	const [advertSubCategory, setAdvertSubCategory] = useState('');
	const [
		advertSubCategoryErrorMessage,
		setAdvertSubCategoryErrorMessage,
	] = useState('');
	const [advertSubCategoryValidate, setAdvertSubCategoryValidate] = useState(
		false,
	);
	const [
		clearSubCategoryPickerDefaultValue,
		setClearSubCategoryPickerDefaultValue,
	] = useState(false);

	const [make, setMake] = useState('');
	const [makeValidate, setMakeValidate] = useState(false);

	const [model, setModel] = useState('');
	const [modelValidate, setModelValidate] = useState(false);

	const [description, setDescription] = useState('');
	// const [descriptionValidate, setDescriptionValidate] = useState(false);

	const [age, setAge] = useState('');
	const [ageValidate, setAgeValidate] = useState(false);

	const [mileage, setMileage] = useState('');
	// const [mileageValidate, setMileageValidate] = useState(false);

	const [hoursUsed, setHoursUsed] = useState('');
	// const [hoursUsedValidate, setHoursUsedValidate] = useState(false);

	const [length, setLength] = useState('');
	// const [lengthValidate, setLengthValidate] = useState(false);
	// const [lengthErrorMessage, setLengthErrorMessage] = useState('');

	const [width, setWidth] = useState('');
	// const [widthValidate, setWidthValidate] = useState(false);
	// const [widthErrorMessage, setWidthErrorMessage] = useState('');

	const [depth, setDepth] = useState('');
	// const [depthValidate, setDepthValidate] = useState(false);
	// const [depthErrorMessage, setDepthErrorMessage] = useState('');

	const [postAdvertSavedAddress, setPostAdvertSavedAddress] = useState(true);
	const [postAdvertManualAddress, setPostAdvertManualAddress] = useState(false);

	const [itemLocation, setItemLocation] = useState('');
	const [addressFromPostcode, setAddressFromPostcode] = useState('');
	const [
		addressFromPostcodeValidate,
		setAddressFromPostcodeValidate,
	] = useState(false);
	const [itemLocationValidate, setItemLocationValidate] = useState(false);
	const [itemLocationErrorMessage, setItemLocationErrorMessage] = useState('');

	const [typedPostcode, setTypedPostcode] = useState(false);
	const [fromGeoLocation, setFromGeoLocation] = useState(false);
	const [manualAddressItemLocation, setManualAddressItemLocation] = useState(
		'',
	);
	const [
		manualAddressItemLocationValidate,
		setManualAddressItemLocationValidate,
	] = useState(false);
	const [latLongFetchedAddresses, setLatLongFetchedAddresses] = useState([]);
	const [
		addressPickerListFromPostcode,
		setAddressPickerListFromPostcode,
	] = useState([]);

	const [postcode, setPostcode] = useState('');

	const [postAdvertlatitude, setPostAdvertLatitude] = useState('');
	const [postAdvertlongitude, setPostAdvertLongitude] = useState('');

	const [collectionAvailable, setCollectionAvailable] = useState('');
	const [
		collectionAvailableErrorMessage,
		setCollectionAvailableErrorMessage,
	] = useState('');
	// const [
	// 	collectionAvailableValidate,
	// 	setCollectionAvailableValidate,
	// ] = useState(false);

	const [deliveryAvailable, setDeliveryAvailable] = useState('');
	const [
		deliveryAvailableErrorMessage,
		setDeliveryAvailableErrorMessage,
	] = useState('');
	const [deliveryAvailableValidate, setDeliveryAvailableValidate] = useState(
		false,
	);

	const [deliveryDistance, setDeliveryDistance] = useState('');
	const [
		deliveryDistanceErrorMessage,
		setDeliveryDistanceErrorMessage,
	] = useState('');
	const [deliveryDistanceValidate, setDeliveryDistanceValidate] = useState(
		false,
	);

	const [deliveryCharge, setDeliveryCharge] = useState('');
	const [deliveryChargeValidate, setDeliveryChargeValidate] = useState(false);
	const [deliveryChargeErrorMessage, setDeliveryChargeErrorMessage] = useState(
		'',
	);

	const [perDay, setPerDay] = useState('');
	const [perDayValidate, setPerDayValidate] = useState(false);
	const [perDayErrorMessage, setPerDayErrorMessage] = useState('');

	const [perWeek, setPerWeek] = useState('');
	const [perWeekValidate, setPerWeekValidate] = useState(false);
	const [perWeekErrorMessage, setPerWeekErrorMessage] = useState('');

	const [weight, setWeight] = useState('');
	// const [weightValidate, setWeightValidate] = useState(false);
	// const [weightErrorMessage, setWeightErrorMessage] = useState('');

	const [productCode, setProductCode] = useState('');
	const [productCodeValidate, setProductCodeValidate] = useState(false);
	const [productCodeErrorMessage, setProductCodeErrorMessage] = useState('');

	const [ean, setEAN] = useState('');
	const [eanValidate, setEANValidate] = useState(false);
	const [eanErrorMessage, setEANErrorMessage] = useState('');

	const [forSale, setForSale] = useState('');
	const [forSaleValidate, setForSaleValidate] = useState(false);
	const [forSaleErrorMessage, setForSaleErrorMessage] = useState('');

	const [offersAccepted, setOffersAccepted] = useState('');
	const [offersAcceptedErrorMessage, setOffersAcceptedErrorMessage] = useState(
		'',
	);
	const [offersAcceptedValidate, setOffersAcceptedValidate] = useState(false);

	const [plusVAT, setPlusVAT] = useState(false);

	const [checkBox, setCheckBox] = useState(false);

	const [verticalScrollPosition, setVerticalScrollPosition] = useState(0);

	// const [constantYears, setConstantYears] = useState(getYears());
	const constantYears = useState(getYears())[0];

	const [perDayPriceValidate, setPerDayPriceValidate] = useState('');
	const [perDayWiseValidateText, setPerDayWiseValidateText] = useState('');
	const [hirePriceDayWiseValidate, setHirePriceDayWiseValidate] = useState(
		false,
	);
	const [values, setValues] = useState([
		{
			id: 0,
			perDayPrice: '',
			perDayWiseValidate: false,
			perDayPriceRef: useRef(),
		},
		{
			id: 1,
			perDayPrice: '',
			perDayWiseValidate: false,
			perDayPriceRef: useRef(),
		},
		{
			id: 2,
			perDayPrice: '',
			perDayWiseValidate: false,
			perDayPriceRef: useRef(),
		},
		{
			id: 3,
			perDayPrice: '',
			perDayWiseValidate: false,
			perDayPriceRef: useRef(),
		},
		{
			id: 4,
			perDayPrice: '',
			perDayWiseValidate: false,
			perDayPriceRef: useRef(),
		},
		{
			id: 5,
			perDayPrice: '',
			perDayWiseValidate: false,
			perDayPriceRef: useRef(),
		},
		{
			id: 6,
			perDayPrice: '',
			perDayWiseValidate: false,
			perDayPriceRef: useRef(),
		},
	]);

	const dispatch = useDispatch();

	const modelRef = useRef();
	const descriptionRef = useRef();

	const hoursUsedRef = useRef();
	const lengthRef = useRef();
	const widthRef = useRef();
	const depthRef = useRef();

	const hirePriceRef = useRef();
	const hirePriceWeeklyRef = useRef();
	const weightRef = useRef();
	const productCodeRef = useRef();
	const eanRef = useRef();
	const salePriceRef = useRef();

	useEffect(() => {
		let headerConfig = {
			isBackArrow: true,
			leftTitle: 'Back',
			isRightContent: false,
			rightTitle: '',
			navParam: '',
		};

		dispatch(headerTitle(headerConfig));
	}, []);

	useEffect(() => {
		if (IOS) {
			// setTimeout(() => {
			dispatch(categoriesApi());
			// }, 300);
		} else {
			dispatch(categoriesApi());
			dispatch(subCategoriesApi('1'));
		}
	}, []);

	useEffect(() => {
		ImagePicker.clean()
			.then(() => {
				console.log('removed tmp images from tmp directory');
			})
			.catch((e) => {
				console.log({e});
			});
	}, []);

	useEffect(() => {
		if (
			advertCategorySelectedId !== '' &&
			advertCategorySelectedId !== null &&
			advertCategorySelectedId !== '--Select--'
		) {
			setAdvertSubCategory('');
			dispatch(subCategoriesApi(advertCategorySelectedId));
		}
	}, [advertCategorySelectedId]);

	useEffect(() => {
		if (advertiseToSale) {
			showMessage({
				message:
					// 'A weekly sales charge will be charged to payment method at £2.99 per item',
					'Card details will be requested, However, listing an item for sale is completely free and no charge will be applied to your card at this time. You will be notified of any changes in advance.',
				floating: true,
				position: {
					top: hp('15%'),
				},
				duration: 10000,
				type: 'default',
				color: GlobalTheme.white,
				backgroundColor: GlobalTheme.textColor,
				icon: {icon: 'danger', position: 'right'},
			});

			setForSaleValidate(false);
			setOffersAcceptedValidate(false);
		}
	}, [advertiseToSale]);

	useEffect(() => {
		if (!advertiseToHire && advertiseToSale) {
			setHirePriceDayWiseValidate(true);
		} else {
			setHirePriceDayWiseValidate(false);
		}
	}, [advertiseToHire, advertiseToSale]);

	useEffect(() => {
		if (!advertiseToHire && advertiseToSale) {
			setPerDayValidate(false);
			setPerWeekValidate(false);
		}
	}, [advertiseToHire, advertiseToSale]);

	const photosModalHandler = () => {
		setPostAdvertPhotos([]);
		ImagePicker.openPicker({
			// width: 300,
			// height: 300,
			// cropping: true,
			multiple: true,
			includeBase64: true,
			compressImageQuality: 0.8,
			compressImageMaxWidth: 990,
			compressImageMaxHeight: 2050,
		})
			.then((results) => {
				if (results.length === 1) {
					if (
						results[0].mime === 'image/jpg' ||
						results[0].mime === 'image/jpeg' ||
						results[0].mime === 'image/png'
					) {
						setPostAdvertPhotos((prevArray) => [
							...prevArray,
							`data:${results[0].mime};base64,${results[0].data}`,
						]);
						setPostAdvertPhotosValidate(false);
						setPostAdvertPhotosErrorMessage('');
						setPostAdvertMainImageErrorMessage('');
					}
					//
				} else if (results.length > 1 && results.length < 6) {
					for (const res of results) {
						if (
							res.mime === 'image/jpg' ||
							res.mime === 'image/jpeg' ||
							res.mime === 'image/png'
						) {
							setPostAdvertPhotos((prevArray) => [
								...prevArray,
								`data:${res.mime};base64,${res.data}`,
							]);
							setPostAdvertPhotosValidate(false);
							setPostAdvertPhotosErrorMessage('');
							setPostAdvertMainImageErrorMessage('');
						}
					}

					dispatch(presentPhotosScreenModal());
					//
				} else {
					let alertConfig = {
						title: 'Sorry!',
						message: 'Only five photos are allowed to add in gallery.',
					};

					dispatch(presentAlert(alertConfig));
					return;
				}
			})
			.catch((e) => {
				setPostAdvertPhotos([]);
				setPostAdvertPhotosValidate(false);
				setPostAdvertPhotosErrorMessage('');
				setPostAdvertMainImageErrorMessage('');

				let alertConfig = {
					title: 'Oops!',
					message: 'User cancelled image selection',
				};
				dispatch(presentAlert(alertConfig));
				// console.log({e});
			});

		// if (advertiseToSale) {
		// 	// dispatch(presentPhotosScreenModal());
		// 	ImagePicker.openPicker({
		// 		// width: 300,
		// 		// height: 300,
		// 		// cropping: true,
		// 		multiple: true,
		// 		includeBase64: true,
		// 		compressImageQuality: 0.8,
		// 		compressImageMaxWidth: 990,
		// 		compressImageMaxHeight: 2050,
		// 	})
		// 		.then((results) => {
		// 			console.log('results ==> ', results);
		// 			console.log('results.length ==> ', results.length);
		// 			// setPostAdvertPhotos((prevArray) => [...prevArray, results]);
		// 			for (const res of results) {
		// 				if (
		// 					res.mime === 'image/jpg' ||
		// 					res.mime === 'image/jpeg' ||
		// 					res.mime === 'image/png'
		// 				) {
		// 					setPostAdvertPhotos((prevArray) => [
		// 						...prevArray,
		// 						`data:${results.mime};base64,${results.data}`,
		// 					]);
		// 					setPostAdvertPhotosValidate(false);
		// 					setPostAdvertPhotosErrorMessage('');
		// 					setPostAdvertMainImageErrorMessage('');
		// 				}
		// 			}
		// 		})
		// 		.catch((e) => {
		// 			let alertConfig = {
		// 				title: 'Oops!',
		// 				message: 'User cancelled image selection',
		// 			};
		// 			dispatch(presentAlert(alertConfig));
		// 			// console.log({e});
		// 		});
		// 	//
		// } else {
		// 	setPostAdvertPhotos([]);
		// 	ImagePicker.openPicker({
		// 		// width: 300,
		// 		// height: 300,
		// 		// cropping: true,
		// 		// multiple: true,
		// 		includeBase64: true,
		// 		compressImageQuality: 0.8,
		// 		compressImageMaxWidth: 990,
		// 		compressImageMaxHeight: 2050,
		// 	})
		// 		.then((results) => {
		// 			// console.log('results ==> ', results);
		// 			// setPostAdvertPhotos((prevArray) => [...prevArray, results]);
		// 			if (
		// 				results.mime === 'image/jpg' ||
		// 				results.mime === 'image/jpeg' ||
		// 				results.mime === 'image/png'
		// 			) {
		// 				setPostAdvertPhotos((prevArray) => [
		// 					...prevArray,
		// 					`data:${results.mime};base64,${results.data}`,
		// 				]);
		// 				setPostAdvertPhotosValidate(false);
		// 				setPostAdvertPhotosErrorMessage('');
		// 				setPostAdvertMainImageErrorMessage('');
		// 			} else {
		// 				setPostAdvertPhotos([]);
		// 				let alertConfig = {
		// 					title: 'Oops!',
		// 					message: 'Only images with JPEG, JPG, PNG formats are allowed',
		// 				};
		// 				dispatch(presentAlert(alertConfig));
		// 			}
		// 		})
		// 		.catch((e) => {
		// 			let alertConfig = {
		// 				title: 'Oops!',
		// 				message: 'User cancelled image selection',
		// 			};
		// 			dispatch(presentAlert(alertConfig));
		// 			// console.log({e});
		// 		});
		// }
	};

	useEffect(() => {
		if (postAdvertSavedAddress && itemLocation != '') {
			postcodeHandler();
		}
	}, [postAdvertSavedAddress, itemLocation]);

	const postcodeHandler = () => {
		if (addressPickerList.length > 0) {
			addressPickerList.filter((item) => {
				// if (itemLocation != '') {
				if (itemLocation === item.value) {
					setPostcode(item.postcode);
					setPostAdvertLatitude(item.lat);
					setPostAdvertLongitude(item.lon);
				}
				// }
			});
		}
	};

	const handlePhotosCallback = (photosCallback) => {
		// console.log('photosCallback ==> ', photosCallback);
		setModalScreenPhotos(photosCallback);
	};

	const handleMainImageCallback = (mainImageCallback) => {
		// console.log('mainImageCallback ==> ', mainImageCallback);
		setModalScreenMainImage(mainImageCallback);
	};

	const handlePhotosCancelCallback = (photosCancelCallback) => {
		setPostAdvertPhotos(photosCancelCallback);
	};

	useEffect(() => {
		if (!advertiseToSale) {
			setModalScreenPhotos([]);
			setModalScreenMainImage([]);
			setForSaleValidate(false);
			setOffersAcceptedValidate(false);
		}
	}, [advertiseToSale]);

	useEffect(() => {
		if (postAdvertSavedAddress) {
			setManualAddressItemLocation('');
			setManualAddressItemLocationValidate(false);
			setAddressFromPostcode('');
			setAddressFromPostcodeValidate(false);
			setAddressPickerListFromPostcode([]);
		}

		if (postAdvertManualAddress) {
			setItemLocation('');
			setItemLocationValidate(false);
			setPostcode('');
			setPostAdvertLatitude('');
			setPostAdvertLongitude('');
		}
	}, [postAdvertSavedAddress, postAdvertManualAddress]);

	useEffect(() => {
		if (fromGeoLocation) {
			setFromGeoLocation(false);

			let latLong_postcode = latLongFetchedAddresses[0].formatted_address.split(
				',',
			)[1];
			// console.log('latLong_postcode ==> ', latLong_postcode);

			let addressArr1 = [];
			latLongFetchedAddresses.filter((obj, index) => {
				setAddressPickerListFromPostcode([]);
				let obj_postcode = obj.formatted_address.split(',')[1];
				// console.log('obj_postcode ==> ', obj_postcode);

				if (obj_postcode !== undefined && latLong_postcode === obj_postcode) {
					addressArr1.push({
						id: index,
						label: obj.formatted_address.split(',')[0],
						value: obj.formatted_address.split(',')[0],
					});
				}
			});

			setAddressPickerListFromPostcode(addressArr1);
		}
	}, [fromGeoLocation]);

	useEffect(() => {
		if (typedPostcode) {
			setTypedPostcode(false);

			if (
				manualAddressItemLocation.length >= 6 &&
				manualAddressItemLocation.length < 9
			) {
				// findLatLong(manualAddressItemLocation)
				findAddressFromPostcode(manualAddressItemLocation)
					.then((res) => {
						// if (res.data.status === 200 && res.data.result != null) {
						if (res?.status === 200) {
							// console.log('res ==> ', res);

							setPostAdvertLatitude(res.data.latitude);
							setPostAdvertLongitude(res.data.longitude);

							// let primaryOutCode = res.data.result[0].outcode;
							// let primaryInCode = res.data.result[0].incode;

							// Geocoder.init(_ENV_CONFIG.GOOGLE_KEY);
							// Geocoder.from(
							// 	res.data.result[0].latitude,
							// 	res.data.result[0].longitude,
							// )
							// 	.then((json) => {
							// 		// console.log('json ==> ', json.results);
							// 		setLatLongFetchedAddresses(json.results);

							let addressArr2 = [];
							res.data.addresses.filter((obj, index) => {
								setAddressFromPostcode('');
								setAddressPickerListFromPostcode([]);
								addressArr2.push({
									id: index,
									label: obj.split(',')[0],
									value: obj.split(',')[0],
								});
							});

							// let addressArr2 = [];
							// json.results.filter((obj, index) => {
							// 	let formattedAddress = obj.formatted_address.split(',')[1];
							// 	// console.log('formattedAddress ==> ', formattedAddress);
							// 	if (RegExp.MatchWhiteSpaceChar.test(formattedAddress)) {
							// 		let trimmedAndSplitted = formattedAddress.split(' ');
							// 		if (trimmedAndSplitted.length >= 3) {
							// 			// console.log('trimmedAndSplitted ==> ', trimmedAndSplitted);
							// 			if (
							// 				trimmedAndSplitted[2] == primaryOutCode &&
							// 				trimmedAndSplitted[3] == primaryInCode
							// 			) {
							// 				// console.log('obj ==> ', obj);
							// 				setAddressFromPostcode('');
							// 				setAddressPickerListFromPostcode([]);
							// 				addressArr2.push({
							// 					id: index,
							// 					label: obj.formatted_address.split(',')[0],
							// 					value: obj.formatted_address.split(',')[0],
							// 				});
							// 			}
							// 		}
							// 	}
							// });

							// console.log('addressArr2 ==> ', addressArr2);
							setAddressPickerListFromPostcode(addressArr2);
							// })
							// .catch((error) =>
							// 	console.log('Typed Postcode Geocoder error ==> ', error),
							// );
						}
					})
					.catch((error) => {
						console.log('error ==> ', error.response);
					});
			}
		}
	}, [typedPostcode]);

	const tradingAccountLocationPermissionHandler = async () => {
		if (IOS) {
			try {
				let iosLocationPermission = await Geolocation.requestAuthorization(
					'whenInUse',
				);
				// console.log('iosLocationPermission ==> ', iosLocationPermission);

				if (iosLocationPermission === 'granted') {
					dispatch(presentLoader());
					Geolocation.getCurrentPosition(
						(position) => {
							// console.log('position ==> ', position);

							Geocoder.init(_ENV_CONFIG.GOOGLE_KEY);
							// Geocoder.from(53.483002, -2.2931)
							Geocoder.from(position.coords.latitude, position.coords.longitude)
								.then((json) => {
									// console.log('json ==> ', json);
									setLatLongFetchedAddresses(json.results);
									let addressComponent = json.results[0].address_components;
									// console.log('addressComponent ==> ', addressComponent);
									addressComponent.filter((obj) => {
										if (obj?.types) {
											setManualAddressItemLocation('');
											if (obj.types[0] === 'postal_code') {
												setFromGeoLocation(true);
												setManualAddressItemLocation(obj.long_name);
											}
										}
									});
									dispatch(hideLoader());
								})
								.catch((error) => {
									dispatch(hideLoader());
									console.log('Geocoder error ==> ', error);
								});
						},
						(error) => {
							dispatch(hideLoader());
							console.log('error ==> ', error);
						},
						{enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
					);
				} else if (iosLocationPermission === 'denied') {
					openAppSetting(
						'Location Permission',
						'App needs access to your location.',
					);
				}
			} catch (err) {
				console.warn(err);
			}
		} else {
			try {
				const granted = await PermissionsAndroid.request(
					PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
					{
						title: 'Location Permission',
						message: 'App needs access to your location.',
						buttonNeutral: 'Ask Me Later',
						buttonNegative: 'Cancel',
						buttonPositive: 'OK',
					},
				);
				if (granted === PermissionsAndroid.RESULTS.GRANTED) {
					dispatch(presentLoader());
					Geolocation.getCurrentPosition(
						(position) => {
							// console.log('position ==> ', position);

							Geocoder.init(_ENV_CONFIG.GOOGLE_KEY);
							// Geocoder.from(53.483002, -2.2931)
							Geocoder.from(position.coords.latitude, position.coords.longitude)
								.then((json) => {
									// console.log('json ==> ', json);
									setLatLongFetchedAddresses(json.results);
									let addressComponent = json.results[0].address_components;
									// console.log('addressComponent ==> ', addressComponent);
									addressComponent.filter((obj) => {
										if (obj?.types) {
											setManualAddressItemLocation('');
											if (obj.types[0] === 'postal_code') {
												setFromGeoLocation(true);
												setManualAddressItemLocation(obj.long_name);
											}
										}
									});
									dispatch(hideLoader());
								})
								.catch((error) => {
									dispatch(hideLoader());
									console.log('Geocoder error ==> ', error);
								});
						},
						(error) => {
							dispatch(hideLoader());
							console.log('error ==> ', error);
						},
						{enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
					);
				} else {
					console.log('location permission denied');
				}
			} catch (err) {
				console.warn(err);
			}
		}
	};

	const postAdvertHireTermsAndConditionHandler = () => {
		props.navigation.navigate('TermsPolicies', {
			terms: {
				title: 'Hire terms & condition',
				link: 'https://hirethat.com/hire-terms-conditions/',
			},
		});
	};

	const postAdvertBuyTermsAndConditionHandler = () => {
		props.navigation.navigate('TermsPolicies', {
			terms: {
				title: 'Sale terms & condition',
				link: 'https://hirethat.com/sale-terms-conditions/',
			},
		});
	};

	const createAdvertHandler = async () => {
		let validCategory = true;
		let validSubCategory = true;
		let validAge = true;
		let validLocation = true;
		let validManualAddressLocation = true;
		let validManualAddressFromPostcode = true;
		// let validCollectionAvailable = true;
		let validDeliveryAvailable = true;
		let validDeliveryCharge = true;
		let validDeliveryDistance = true;
		let validPerDay = true;
		let validPerWeek = true;
		let validWeight = true;
		let validForSale = true;
		let validOffersAccepted = true;

		if (collectionAvailable === '0' && deliveryAvailable === '0') {
			let alertConfig = {
				title: 'Oops!',
				message:
					'You cannot disable both delivery and collection available. Please enable any one of them.',
			};

			dispatch(presentAlert(alertConfig));
			return;
		}

		const validTitle = await TitleSchema.isValid({advertTitle: advertTitle});
		validTitle ? setAdvertTitleValidate(false) : setAdvertTitleValidate(true);

		if (IOS) {
			validCategory = await CategorySchema.isValid({
				advertCategory: advertCategory,
			});
			validCategory
				? setAdvertCategoryValidate(false)
				: setAdvertCategoryValidate(true);

			validSubCategory = await SubCategorySchema.isValid({
				advertSubCategory: advertSubCategory,
			});
			validSubCategory
				? setAdvertSubCategoryValidate(false)
				: setAdvertSubCategoryValidate(true);

			// validCollectionAvailable = await CollectionAvailableSchema.isValid({
			// 	collectionAvailable: collectionAvailable,
			// });
			// validCollectionAvailable
			// 	? setCollectionAvailableValidate(false)
			// 	: setCollectionAvailableValidate(true);

			validDeliveryAvailable = await DeliveryAvailableSchema.isValid({
				deliveryAvailable: deliveryAvailable,
			});
			validDeliveryAvailable
				? setDeliveryAvailableValidate(false)
				: setDeliveryAvailableValidate(true);
		}

		if (IOS && postAdvertSavedAddress) {
			validLocation = await LocationSchema.isValid({
				itemLocation: itemLocation,
			});
			validLocation
				? setItemLocationValidate(false)
				: setItemLocationValidate(true);
		} else if (ANDROID && postAdvertSavedAddress) {
			if (addressPickerList.length < 1) {
				validLocation = await LocationSchema.isValid({
					itemLocation: itemLocation,
				});
				validLocation
					? setItemLocationValidate(false)
					: setItemLocationValidate(true);
			}
		}

		if (postAdvertManualAddress) {
			validManualAddressLocation = await ManualAddressLocationSchema.isValid({
				manualAddressItemLocation: manualAddressItemLocation,
			});
			validManualAddressLocation
				? setManualAddressItemLocationValidate(false)
				: setManualAddressItemLocationValidate(true);

			if (IOS) {
				validManualAddressFromPostcode = await ManualAddressFromPostcodeSchema.isValid(
					{addressFromPostcode: addressFromPostcode},
				);
				validManualAddressFromPostcode
					? setAddressFromPostcodeValidate(false)
					: setAddressFromPostcodeValidate(true);
			}
		}

		const validMake = await MakeSchema.isValid({
			make: make,
		});
		validMake ? setMakeValidate(false) : setMakeValidate(true);

		const validModel = await ModelSchema.isValid({
			model: model,
		});
		validModel ? setModelValidate(false) : setModelValidate(true);

		// const validDescription = await DescriptionSchema.isValid({
		// 	description: description,
		// });
		// validDescription
		// 	? setDescriptionValidate(false)
		// 	: setDescriptionValidate(true);

		if (age != '') {
			validAge = await AgeSchema.isValid({
				age: age,
			});
			validAge ? setAgeValidate(false) : setAgeValidate(true);
		}

		// const validLength = await LengthSchema.isValid({length: length});
		// validLength ? setLengthValidate(false) : setLengthValidate(true);

		// const validWidth = await WidthSchema.isValid({width: width});
		// validWidth ? setWidthValidate(false) : setWidthValidate(true);

		// const validDepth = await DepthSchema.isValid({depth: depth});
		// validDepth ? setDepthValidate(false) : setDepthValidate(true);

		if (deliveryAvailable !== '0') {
			if (IOS) {
				validDeliveryDistance = await DeliveryDistanceSchema.isValid({
					deliveryDistance: deliveryDistance,
				});
				validDeliveryDistance
					? setDeliveryDistanceValidate(false)
					: setDeliveryDistanceValidate(true);
			}

			validDeliveryCharge = await DeliveryChargeSchema.isValid({
				deliveryCharge: deliveryCharge,
			});
			validDeliveryCharge
				? setDeliveryChargeValidate(false)
				: setDeliveryChargeValidate(true);
		} else {
			setDeliveryChargeValidate(false);
			setDeliveryChargeErrorMessage('');
			setDeliveryDistanceValidate(false);
			setDeliveryDistanceErrorMessage('');
		}

		if (
			(!advertiseToHire && !advertiseToSale) ||
			(advertiseToHire && !advertiseToSale) ||
			(advertiseToHire && advertiseToSale)
		) {
			validPerDay = await PerDaySchema.isValid({perDay: perDay});
			validPerDay ? setPerDayValidate(false) : setPerDayValidate(true);

			validPerWeek = await PerWeekSchema.isValid({perWeek: perWeek});
			validPerWeek ? setPerWeekValidate(false) : setPerWeekValidate(true);
		} else {
			setPerDayValidate(false);
			setPerWeekValidate(false);
		}

		// if (weight != '') {
		// 	validWeight = await WeightSchema.isValid({
		// 		weight: weight,
		// 	});
		// 	validWeight ? setWeightValidate(false) : setWeightValidate(true);
		// }

		if (advertiseToSale) {
			validForSale = await ForSaleSchema.isValid({forSale: forSale});
			validForSale ? setForSaleValidate(false) : setForSaleValidate(true);

			if (IOS) {
				validOffersAccepted = await OffersAcceptedSchema.isValid({
					offersAccepted: offersAccepted,
				});
				validOffersAccepted
					? setOffersAcceptedValidate(false)
					: setOffersAcceptedValidate(true);
			}
		} else {
			setForSaleValidate(false);
			setOffersAcceptedValidate(false);
		}

		if (!advertiseToHire && !advertiseToSale) {
			setToggleButtonValidate(true);
			return;
		}

		if (postAdvertPhotos.length > 0 && modalScreenPhotos.length < 1) {
			setPostAdvertMainImage(postAdvertPhotos[0]);
		}

		if (postAdvertPhotos.length < 1 && modalScreenPhotos.length < 1) {
			setPostAdvertPhotosValidate(true);
			return;
		}

		let tempValidateArr = [];
		values.filter((obj) => {
			if (
				obj.perDayPrice != '' &&
				!RegExp.DigitAndDecimalsOnly.test(obj.perDayPrice)
			) {
				tempValidateArr = [...values, (obj.perDayWiseValidate = true)];

				tempValidateArr.splice(7);

				setValues(tempValidateArr);
			}
		});

		// console.log('values ==> ', values);
		// console.log('tempValidateArr ==> ', tempValidateArr);
		if (
			!hirePriceDayWiseValidate &&
			(values[0].perDayWiseValidate ||
				values[1].perDayWiseValidate ||
				values[2].perDayWiseValidate ||
				values[3].perDayWiseValidate ||
				values[4].perDayWiseValidate ||
				values[5].perDayWiseValidate ||
				values[6].perDayWiseValidate)
		) {
			return;
		}

		if (!hirePriceDayWiseValidate) {
			for (let i = values.length - 1; i >= 0; i--) {
				for (let j = i - 1; j >= 0; j--) {
					if (
						parseFloat(values[i].perDayPrice) <
						parseFloat(values[j].perDayPrice)
					) {
						// console.log('i ==> ', values[i].perDayPrice);
						// console.log('j ==> ', values[j].perDayPrice);
						// console.log(
						// 	`per_day_price_${i + 1} must be greater than per_day_price_${j + 1}.`
						// );

						setPerDayWiseValidateText(
							`hire_price associated to day ${
								i + 1
							} must be greater than hire_price associated to day ${j + 1}.`,
						);

						return;
					}
				}
			}
		}

		if (
			!hirePriceDayWiseValidate &&
			values[0].perDayPrice === '' &&
			values[1].perDayPrice === '' &&
			values[2].perDayPrice === '' &&
			values[3].perDayPrice === '' &&
			values[4].perDayPrice === '' &&
			values[5].perDayPrice === '' &&
			values[6].perDayPrice === ''
		) {
			setPerDayPriceValidate('At least one day rate must be entered.');
			return;
		}

		if (advertiseToHire && completedStripeOnboarding != 1) {
			setCheckBox(false);

			let alertConfig = {
				title: 'Wait!',
				message:
					'Please connect the stripe account to your Hire That account so we can protect you and your money.',
				shouldRunFunction: true,
				functionHandler: 'stripeConnectFillUpHandler',
				shouldCallback: () => stripeConnectFillUpHandler(),
			};

			dispatch(presentAlert(alertConfig));
			return;
		}

		if (advertiseToSale && hasPrimaryCard != 1) {
			setCheckBox(false);

			props.navigation.navigate('AddPaymentCard');
			return;
		}

		if (
			validTitle &&
			validCategory &&
			validSubCategory &&
			validMake &&
			validModel &&
			// validDescription &&
			validAge &&
			// validLength &&
			// validWidth &&
			// validDepth &&
			validLocation &&
			// validCollectionAvailable &&
			validDeliveryAvailable &&
			validManualAddressLocation &&
			validManualAddressFromPostcode &&
			validDeliveryCharge &&
			validDeliveryDistance &&
			// validPerDay &&
			// validPerWeek &&
			// validWeight &&
			validForSale &&
			validOffersAccepted
		) {
			// let fd = new FormData();
			// fd.append('name', advertTitle);
			// fd.append('is_for_hire', advertiseToHire ? '1' : '0');
			// fd.append('is_for_sale', advertiseToSale ? '1' : '0');
			// fd.append('category_id', advertCategorySelectedId);
			// fd.append('sub_category_id', advertSubCategory);
			// fd.append('make', make);
			// fd.append('model', model);
			// fd.append('description', description);
			// fd.append('length_mm', length);
			// fd.append('width_mm', width);
			// fd.append('height_mm', depth);
			// fd.append('location', itemLocation === '' ? 'Anamnagar' : itemLocation);
			// fd.append(
			// 	'is_for_delivery',
			// 	deliveryAvailable === '' ? '1' : deliveryAvailable,
			// );
			// fd.append(
			// 	'delivery_distance',
			// 	deliveryDistance === '' ? '200' : deliveryDistance,
			// );
			// // fd.append('photos', photos);
			// // photos.map((item) => {
			// // 	fd.append('photos', {
			// // 		name: item.name,
			// // 		uri: item.uri,
			// // 		type: item.type,
			// // 		size: item.size,
			// // 	});
			// // });
			// fd.append('delivery_charge_mile', deliveryCharge);
			// fd.append('per_day_price', perDay);
			// fd.append('per_week_price', perWeek);
			// fd.append('post_code', 12536);
			// // fd.append('main_image', mainImage);
			// fd.append('main_image', mainImage);
			// // fd.append('main_image', {
			// // 	type: 'image/jpeg',
			// // 	uri: mainImage.uri,
			// // 	name: 'upload1.jpg',
			// // });
			// // mainImage.map((item) => {
			// // 	fd.append('main_image', {
			// // 		name: item.name,
			// // 		uri: item.uri,
			// // 		type: item.type,
			// // 		size: item.size,
			// // 	});
			// // });

			// dispatch(createAdvertApi(fd, props.navigation));

			let obj = {
				name: advertTitle,
				is_for_hire: advertiseToHire === true ? '1' : '0',
				is_for_sale: advertiseToSale === true ? '1' : '0',
				photos:
					postAdvertPhotos.length > 0 && modalScreenPhotos.length < 1
						? postAdvertPhotos
						: modalScreenPhotos,
				main_image:
					postAdvertPhotos.length > 0 && modalScreenMainImage.length < 1
						? postAdvertPhotos[0]
						: modalScreenMainImage,
				// category_id:
				// 	advertCategorySelectedId != ''
				// 		? advertCategorySelectedId
				// 		: categoriesPickerList[0].value,
				category_id:
					advertCategorySelectedId != ''
						? advertCategorySelectedId
						: advertiseToHire && advertiseToSale
						? categoriesForBothPickerList[0].value
						: advertiseToHire
						? categoriesHirePickerList[0].value
						: categoriesSalePickerList[0].value,
				sub_category_id:
					advertSubCategory != ''
						? advertSubCategory
						: subCategoriesPickerList[0].value,
				make: make,
				model: model,
				description: description,
				age: parseInt(age),
				mileage: mileage,
				hours_used: hoursUsed,
				length_mm: length,
				width_mm: width,
				height_mm: depth,
				is_manual_address: postAdvertManualAddress ? 1 : 0,
				// location: postAdvertSavedAddress
				// 	? itemLocation != ''
				// 		? itemLocation
				// 		: addressPickerList[0].value
				// 	: manualAddressItemLocation,
				location: postAdvertSavedAddress
					? itemLocation != ''
						? itemLocation
						: addressPickerList[0].value
					: addressFromPostcode != ''
					? addressFromPostcode
					: addressPickerListFromPostcode.length > 0
					? addressPickerListFromPostcode[0].value
					: '',
				// post_code: postcode != '' ? postcode : addressPickerList[0].postcode,
				post_code: postAdvertSavedAddress
					? postcode != ''
						? postcode
						: addressPickerList[0].postcode
					: manualAddressItemLocation,
				latitude:
					postAdvertlatitude != ''
						? postAdvertlatitude
						: addressPickerList[0].lat,
				longitude:
					postAdvertlongitude != ''
						? postAdvertlongitude
						: addressPickerList[0].lon,
				is_for_collection:
					collectionAvailable != '' ? collectionAvailable : YesNo[0].value,
				is_for_delivery:
					deliveryAvailable != '' ? deliveryAvailable : YesNo[0].value,
				delivery_distance:
					deliveryAvailable === '0'
						? null
						: deliveryDistance === '' || deliveryDistance === 'Unlimited'
						? null
						: deliveryDistance,
				delivery_charge_mile: deliveryAvailable === '0' ? null : deliveryCharge,
				// per_day_price: !advertiseToHire && advertiseToSale ? null : perDay,
				// per_week_price: !advertiseToHire && advertiseToSale ? null : perWeek,
				// price_day_1: values[0].perDayPrice != '' ? values[0].perDayPrice : '',
				// price_day_2: values[1].perDayPrice != '' ? values[1].perDayPrice : '',
				// price_day_3: values[2].perDayPrice != '' ? values[2].perDayPrice : '',
				// price_day_4: values[3].perDayPrice != '' ? values[3].perDayPrice : '',
				// price_day_5: values[4].perDayPrice != '' ? values[4].perDayPrice : '',
				// price_day_6: values[5].perDayPrice != '' ? values[5].perDayPrice : '',
				// price_day_7: values[6].perDayPrice != '' ? values[6].perDayPrice : '',
				price_day_1: !hirePriceDayWiseValidate ? values[0].perDayPrice : '',
				price_day_2: !hirePriceDayWiseValidate ? values[1].perDayPrice : '',
				price_day_3: !hirePriceDayWiseValidate ? values[2].perDayPrice : '',
				price_day_4: !hirePriceDayWiseValidate ? values[3].perDayPrice : '',
				price_day_5: !hirePriceDayWiseValidate ? values[4].perDayPrice : '',
				price_day_6: !hirePriceDayWiseValidate ? values[5].perDayPrice : '',
				price_day_7: !hirePriceDayWiseValidate ? values[6].perDayPrice : '',
				weight: weight,
				product_code: productCode,
				ean: ean,
				vat: advertiseToSale ? (plusVAT ? 1 : 0) : 0,
				selling_price: advertiseToSale ? forSale : null,
				offers_accepted: advertiseToSale
					? offersAccepted != ''
						? offersAccepted
						: YesNo[0].value
					: '0',
				accepted_terms_and_conditions: checkBox ? '1' : '0',
			};

			console.log('obj --> ', obj);
			dispatch(createAdvertApi(obj, props.navigation));
		}
	};

	const stripeConnectFillUpHandler = () => {
		props.navigation.navigate('WebView');
	};

	useEffect(() => {
		if (main_image_error_message != '') {
			setPostAdvertMainImageErrorMessage(main_image_error_message);
		}

		if (photos_error_message != '') {
			setPostAdvertMainImageErrorMessage(photos_error_message);
		}

		// if (length_error_message != '') {
		// 	setLengthValidate(true);
		// 	setLengthErrorMessage(length_error_message);
		// }

		// if (width_error_message != '') {
		// 	setWidthValidate(true);
		// 	setWidthErrorMessage(width_error_message);
		// }

		// if (depth_error_message != '') {
		// 	setDepthValidate(true);
		// 	setDepthErrorMessage(depth_error_message);
		// }

		if (delivery_charge_error_message != '') {
			setDeliveryChargeValidate(true);
			setDeliveryChargeErrorMessage(delivery_charge_error_message);
		}

		if (perDay_error_message != '') {
			setPerDayValidate(true);
			setPerDayErrorMessage(perDay_error_message);
		}

		if (perWeek_error_message != '') {
			setPerWeekValidate(true);
			setPerWeekErrorMessage(perWeek_error_message);
		}

		if (forSale_error_message != '') {
			setForSaleValidate(true);
			setForSaleErrorMessage(forSale_error_message);
		}
	}, [
		main_image_error_message,
		// length_error_message,
		// width_error_message,
		// depth_error_message,
		delivery_charge_error_message,
		perDay_error_message,
		perWeek_error_message,
		forSale_error_message,
	]);

	useEffect(() => {
		if (textInputClear) {
			setAdvertCategoryErrorMessage('');
			setAdvertSubCategoryErrorMessage('');
			setItemLocationErrorMessage('');
			// setCollectionAvailableErrorMessage('');
			setDeliveryAvailableErrorMessage('');
			setDeliveryDistanceErrorMessage('');
			setOffersAcceptedErrorMessage('');
			setPostAdvertPhotosErrorMessage('');
			setPostAdvertMainImageErrorMessage('');
			// setLengthErrorMessage('');
			// setWidthErrorMessage('');
			// setDepthErrorMessage('');
			setDeliveryChargeErrorMessage('');
			setPerDayErrorMessage('');
			setPerWeekErrorMessage('');
			setForSaleErrorMessage('');

			dispatch(clearTextInputReq(false));
			dispatch(removeAdvertErrorMessage());
		}
	}, [textInputClear]);

	const clearCategoryPickerError = () => {
		setAdvertCategoryValidate(false);
	};

	const clearSubCategoryPickerError = () => {
		setAdvertSubCategoryValidate(false);
	};

	const clearItemLocationPickerError = () => {
		setItemLocationValidate(false);
	};

	// const clearCollectionAvailablePickerError = () => {
	// 	setCollectionAvailableValidate(false);
	// setCollectionChargeValidate(false);
	// setCollectionDistanceValidate(false);
	// };

	const clearDeliveryAvailablePickerError = () => {
		setDeliveryAvailableValidate(false);
		setDeliveryChargeValidate(false);
		setDeliveryDistanceValidate(false);
	};

	const clearDeliveryDistancePickerError = () => {
		setDeliveryDistanceValidate(false);
	};

	const clearOffersAcceptedPickerError = () => {
		setOffersAcceptedValidate(false);
	};

	const handleChange = (i, e) => {
		// console.log('i, e ==> ', i, e);

		let tempArr = [];
		values.forEach((item, index) => {
			if (item.id == i) {
				tempArr = [
					...values,
					(values[index].perDayPrice = e),
					(values[index].perDayWiseValidate = false),
				];
			}
		});

		tempArr.splice(7);
		// console.log('termpArr ==> ', tempArr);

		setValues(tempArr);
		setPerDayPriceValidate('');
		setPerDayWiseValidateText('');
	};

	let tabularPerDayPrice = [];
	for (let i = 0; i <= 6; i++) {
		tabularPerDayPrice.push(
			<View
				key={i}
				// style={{
				// flexDirection: 'row',
				// justifyContent: 'flex-start',
				// alignItems: 'center',
				// borderWidth: 1,
				// }}
			>
				{/* <TextField
			 		regular
			 		isRLH
			 		lineHeight={2.0}
			 		letterSpacing={-0.07}
			 		fontFamily={GlobalTheme.fontRegular}
			 		color={GlobalTheme.black}
			 		style={{
			 			width: '50%',
			 			paddingLeft: hp(1.0),
			 		}}>
			 		{i + 1}
			 	</TextField> */}

				<Divider />

				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'flex-start',
						alignItems: 'center',
					}}>
					<TextField
						xThin
						letterSpacing={-0.07}
						lineHeight={18}
						fontFamily={GlobalTheme.fontRegular}
						color={GlobalTheme.black}>
						{`Hire price ${i + 1} day${i + 1 != 1 ? 's' : ''} `}
					</TextField>

					<TextField
						xThin
						letterSpacing={-0.07}
						lineHeight={18}
						fontFamily={GlobalTheme.fontRegular}
						color={GlobalTheme.textColor}>
						(optional)
					</TextField>
				</View>

				<HTMaterialTextInput
					editable={hirePriceDayWiseValidate ? true : false}
					placeholder={`E.g ${80 + i}`}
					position="left"
					iconName="pound"
					iconLibrary="Foundation"
					returnKeyType="next"
					inputRef={values[i].perDayPriceRef}
					hasError={values[i].perDayWiseValidate}
					// validationMessage="Please enter valid price which is greater than previous"
					onChangeText={handleChange.bind(this, i)}
					value={values[i].perDayPrice}
					style={{
						width: wp(41.0),
						// borderWidth: 1,
						// borderColor: 'red',
					}}
					onSubmitEditing={(event) => {
						i != 6
							? values[i + 1].perDayPriceRef.current.focus()
							: weightRef.current.focus();
					}}
					blurOnSubmit={false}
				/>
			</View>,
		);
	}

	// console.log('values ==> ', values);
	// console.warn('sub ==> ', advertSubCategory);
	return (
		<GenericView isBackgroundColor>
			<>
				<Header />
				<KeyboardAwareScrollView
					extraHeight={hp(20.0)}
					keyboardShouldPersistTaps="handled"
					onMomentumScrollEnd={(event) => {
						// console.log(
						// 	'onMomentumScrollEnd ==> ',
						// 	event.nativeEvent.contentOffset.y,
						// );
						setVerticalScrollPosition(event.nativeEvent.contentOffset.y);
					}}
					onScrollEndDrag={(event) => {
						// console.log(
						// 	'onScrollEndDrag ==> ',
						// 	event.nativeEvent.contentOffset.y,
						// );
						setVerticalScrollPosition(event.nativeEvent.contentOffset.y);
					}}
					scrollEventThrottle={16}
					resetScrollToCoords={{x: 0, y: verticalScrollPosition}}
					style={styles.mainView}>
					{/* <ScrollView style={styles.mainView}> */}
					{/* <Divider xxMedium /> */}

					<Divider xxxHuge />

					<TextField
						title
						letterSpacing={-0.36}
						lineHeight={26}
						fontFamily={GlobalTheme.fontBlack}
						color={GlobalTheme.primaryColor}
						style={styles.mh10}>
						POST AN ADVERT
					</TextField>

					<Divider xxMedium />

					<TextField
						xThin
						letterSpacing={-0.07}
						lineHeight={18}
						fontFamily={GlobalTheme.fontRegular}
						color={GlobalTheme.black}
						style={styles.mh10}>
						Advert title *
					</TextField>

					<HTMaterialTextInput
						style={styles.mh10}
						placeholder="Enter advert title"
						hasError={advertTitleValidate}
						validationMessage="Please enter valid advert title"
						onChangeText={(advertTitle) => {
							setAdvertTitle(advertTitle);
							setAdvertTitleValidate(false);
						}}
						value={advertTitle}
					/>

					<Divider xxMedium />

					<View style={styles.rowStyleWithToogle}>
						<View style={styles.toggleButtonGroupStyle(toggleButtonValidate)}>
							<TextField
								xThin
								letterSpacing={-0.07}
								lineHeight={18}
								fontFamily={GlobalTheme.fontRegular}
								color={GlobalTheme.black}>
								Advertise for hire *
							</TextField>

							<Switch
								useNativeDriver
								value={advertiseToHire}
								onValueChange={(value) => {
									setAdvertiseToHire(value);
									setToggleButtonValidate(false);
									setAdvertCategory('');
									setAdvertCategorySelectedId('');
									setClearCategoryPickerDefaultValue(true);
									setAdvertSubCategory('');
									setClearSubCategoryPickerDefaultValue(true);
								}}
								activeText={''}
								inActiveText={''}
								circleSize={25}
								barHeight={30}
								circleBorderWidth={0}
								backgroundActive={GlobalTheme.primaryColor}
								backgroundInactive={'#F2F2F2'}
								circleActiveColor={GlobalTheme.white}
								circleInActiveColor={GlobalTheme.white}
								innerCircleStyle={{
									alignItems: 'center',
									justifyContent: 'center',
								}}
								renderActiveText={false}
								renderInActiveText={false}
								switchLeftPx={2.5}
								switchRightPx={2.5}
							/>
						</View>

						<View style={styles.toggleButtonGroupStyle(toggleButtonValidate)}>
							<TextField
								xThin
								letterSpacing={-0.07}
								lineHeight={18}
								fontFamily={GlobalTheme.fontRegular}
								color={GlobalTheme.black}>
								Advertise for sale *
							</TextField>

							<View style={styles.toggleButtonGroupInnerWrapperStyle}>
								<Switch
									useNativeDriver
									value={advertiseToSale}
									onValueChange={(value) => {
										setAdvertiseToSale(value);
										setPostAdvertPhotos([]);
										setToggleButtonValidate(false);
										setAdvertCategory('');
										setAdvertCategorySelectedId('');
										setClearCategoryPickerDefaultValue(true);
										setAdvertSubCategory('');
										setClearSubCategoryPickerDefaultValue(true);
										setPlusVAT(false);
									}}
									activeText={''}
									inActiveText={''}
									circleSize={25}
									barHeight={30}
									circleBorderWidth={0}
									backgroundActive={GlobalTheme.primaryColor}
									backgroundInactive={'#F2F2F2'}
									circleActiveColor={GlobalTheme.white}
									circleInActiveColor={GlobalTheme.white}
									innerCircleStyle={{
										alignItems: 'center',
										justifyContent: 'center',
									}}
									renderActiveText={false}
									renderInActiveText={false}
									switchLeftPx={2.5}
									switchRightPx={2.5}
								/>

								{/* <TextField
									xThin
									letterSpacing={-0.07}
									lineHeight={18}
									fontFamily={GlobalTheme.fontRegular}
									color={GlobalTheme.primaryColor}
									style={styles.ml14}>
									Charges apply
								</TextField> */}
							</View>
						</View>
					</View>

					<Divider xxMedium />

					<ImageCard
						img={postAdvertPhotos.length > 0 ? postAdvertPhotos[0] : ''}
						// hireMainImage={
						// 	postAdvertPhotos.length > 0 ? postAdvertPhotos[0] : ''
						// }
						// saleMainImage={
						// 	modalScreenMainImage.length > 0 ? modalScreenMainImage[0] : ''
						// }
						hasError={postAdvertPhotosValidate}
						totalNumberImages={
							postAdvertPhotos.length > 0 && modalScreenPhotos.length < 1
								? postAdvertPhotos.length
								: modalScreenPhotos.length
						}
						onPress={photosModalHandler}
					/>

					{postAdvertPhotosErrorMessage != '' ? (
						<TextField
							xThin
							fontFamily={GlobalTheme.fontRegular}
							color={GlobalTheme.validationColor}
							style={styles.mh10}>
							{postAdvertPhotosErrorMessage}
						</TextField>
					) : null}

					{postAdvertMainImageErrorMessage != '' ? (
						<TextField
							xThin
							fontFamily={GlobalTheme.fontRegular}
							color={GlobalTheme.validationColor}
							style={styles.mh10}>
							{postAdvertMainImageErrorMessage}
						</TextField>
					) : null}

					<Divider />

					<TextField
						xThin
						letterSpacing={-0.07}
						lineHeight={18}
						fontFamily={GlobalTheme.fontRegular}
						color={GlobalTheme.black}
						style={styles.mh10}>
						Advert category *
					</TextField>

					<HTMaterialPicker
						placeholder="Machinery & tools"
						style={styles.mh10}
						hasError={advertCategoryValidate}
						validationMessage="Please select advert category"
						clearCategoryPickerError={clearCategoryPickerError}
						pickerResetData={clearCategoryPickerDefaultValue}
						onValueChange={(advertCategoryValue, advertCategorySelectedId) => {
							setAdvertCategory(advertCategoryValue);
							setAdvertCategorySelectedId(advertCategoryValue);
							setAdvertCategoryValidate(false);
							setClearCategoryPickerDefaultValue(false);
						}}
						value={advertCategory}
						// data={categoriesPickerList.length > 0 ? categoriesPickerList : []}
						data={
							advertiseToHire && advertiseToSale
								? categoriesForBothPickerList.length > 0
									? categoriesForBothPickerList
									: []
								: advertiseToHire && !advertiseToSale
								? categoriesHirePickerList.length > 0
									? categoriesHirePickerList
									: []
								: !advertiseToHire && advertiseToSale
								? categoriesSalePickerList.length > 0
									? categoriesSalePickerList
									: []
								: categoriesPickerList.length > 0
								? categoriesPickerList
								: []
						}
					/>

					<Divider />

					<TextField
						xThin
						letterSpacing={-0.07}
						lineHeight={18}
						fontFamily={GlobalTheme.fontRegular}
						color={GlobalTheme.black}
						style={styles.mh10}>
						Sub category *
					</TextField>

					<HTMaterialPicker
						placeholder="Choose item sub category"
						style={styles.mh10}
						hasError={advertSubCategoryValidate}
						clearSubCategoryPickerError={clearSubCategoryPickerError}
						pickerResetData={clearSubCategoryPickerDefaultValue}
						validationMessage="Please select advert sub category"
						onValueChange={(
							advertSubCategoryValue,
							advertSubCategorySelectedId,
						) => {
							setAdvertSubCategory(advertSubCategoryValue.toString());
							setAdvertSubCategoryValidate(false);
							setClearSubCategoryPickerDefaultValue(false);
						}}
						value={advertSubCategory}
						data={
							subCategoriesPickerList.length > 0 ? subCategoriesPickerList : []
						}
					/>

					<Divider />

					<TextField
						xThin
						letterSpacing={-0.07}
						lineHeight={18}
						fontFamily={GlobalTheme.fontRegular}
						color={GlobalTheme.black}
						style={styles.mh10}>
						Make *
					</TextField>

					<HTMaterialTextInput
						style={styles.mh10}
						placeholder="E.g JCB"
						returnKeyType="next"
						hasError={makeValidate}
						validationMessage="Please enter valid make"
						onChangeText={(make) => {
							setMake(make);
							setMakeValidate(false);
						}}
						value={make}
						onSubmitEditing={(event) => modelRef.current.focus()}
						blurOnSubmit={false}
					/>

					<Divider />

					<TextField
						xThin
						letterSpacing={-0.07}
						lineHeight={18}
						fontFamily={GlobalTheme.fontRegular}
						color={GlobalTheme.black}
						style={styles.mh10}>
						Model *
					</TextField>

					<HTMaterialTextInput
						style={styles.mh10}
						placeholder="E.g 8008 CTS"
						returnKeyType="next"
						inputRef={modelRef}
						hasError={modelValidate}
						validationMessage="Please enter valid model"
						onChangeText={(model) => {
							setModel(model);
							setModelValidate(false);
						}}
						value={model}
						onSubmitEditing={(event) => descriptionRef.current.focus()}
						blurOnSubmit={false}
					/>

					<Divider />

					<View style={styles.flxStartRow}>
						<TextField
							xThin
							letterSpacing={-0.07}
							lineHeight={18}
							fontFamily={GlobalTheme.fontRegular}
							color={GlobalTheme.black}
							style={styles.ml10}>
							Description
						</TextField>

						<TextField
							xThin
							letterSpacing={-0.07}
							lineHeight={18}
							fontFamily={GlobalTheme.fontRegular}
							color={GlobalTheme.textColor}>
							(optional)
						</TextField>
					</View>

					<HTMaterialTextInput
						// multiline
						// textAlignVertical
						style={styles.mh10}
						placeholder="Describe the condition and key features of your item for hire"
						returnKeyType="done"
						inputRef={descriptionRef}
						// hasError={descriptionValidate}
						// validationMessage="Please enter valid description"
						onChangeText={(description) => {
							setDescription(description);
							// setDescriptionValidate(false);
						}}
						value={description}
						onSubmitEditing={(event) => console.log('post advert 1 finally!!')}
					/>

					<Divider />

					<View style={styles.flxStartRow}>
						<TextField
							xThin
							letterSpacing={-0.07}
							lineHeight={18}
							fontFamily={GlobalTheme.fontRegular}
							color={GlobalTheme.black}
							style={styles.ml10}>
							Age (YOM)
						</TextField>

						<TextField
							xThin
							letterSpacing={-0.07}
							lineHeight={18}
							fontFamily={GlobalTheme.fontRegular}
							color={GlobalTheme.textColor}>
							(optional)
						</TextField>
					</View>

					{/* <HTMaterialTextInput
						style={styles.mh10}
						placeholder="E.g 12"
						hasError={ageValidate}
						validationMessage="Please enter valid (in number) age"
						onChangeText={(age) => {
							ageHandler(age);
						}}
						value={age}
					/> */}

					<HTMaterialPicker
						placeholder="E.g 12"
						style={styles.mh10}
						hasError={ageValidate}
						validationMessage="Please select an age"
						// clearItemLocationPickerError={clearItemLocationPickerError}
						onValueChange={(pickerSelectedValue, pickerSelectedId) => {
							setAge(pickerSelectedValue);
							setAgeValidate(false);
						}}
						value={age}
						data={constantYears}
					/>

					<Divider />

					<View style={styles.hirePriceWrapperStyle}>
						<View style={styles.hirePriceWrapperInnerStyle}>
							<View style={styles.flxStartRow}>
								<TextField
									xThin
									letterSpacing={-0.07}
									lineHeight={18}
									fontFamily={GlobalTheme.fontRegular}
									color={GlobalTheme.black}>
									Mileage
								</TextField>

								<TextField
									xThin
									letterSpacing={-0.07}
									lineHeight={18}
									fontFamily={GlobalTheme.fontRegular}
									color={GlobalTheme.textColor}>
									(optional)
								</TextField>
							</View>

							<HTMaterialTextInput
								// editable={!advertiseToHire && advertiseToSale ? true : false}
								placeholder="E.g 9500"
								returnKeyType="next"
								// hasError={mileageValidate}
								// validationMessage={'Please enter valid mileage'}
								onChangeText={(mileage) => {
									setMileage(mileage);
									// setMileageValidate(false);
								}}
								value={mileage}
								onSubmitEditing={(event) => hoursUsedRef.current.focus()}
								blurOnSubmit={false}
							/>
						</View>

						<View style={styles.hirePriceWrapperInnerStyle}>
							<View style={styles.flxStartRow}>
								<TextField
									xThin
									letterSpacing={-0.07}
									lineHeight={18}
									fontFamily={GlobalTheme.fontRegular}
									color={GlobalTheme.black}>
									Hours used
								</TextField>

								<TextField
									xThin
									letterSpacing={-0.07}
									lineHeight={18}
									fontFamily={GlobalTheme.fontRegular}
									color={GlobalTheme.textColor}>
									(optional)
								</TextField>
							</View>

							<HTMaterialTextInput
								// editable={!advertiseToHire && advertiseToSale ? true : false}
								placeholder="E.g 300"
								returnKeyType="next"
								inputRef={hoursUsedRef}
								// hasError={hoursUsedValidate}
								// validationMessage={'Please enter valid hours used'}
								onChangeText={(hoursUsed) => {
									setHoursUsed(hoursUsed);
									// setHoursUsedValidate(false);
								}}
								value={hoursUsed}
								onSubmitEditing={(event) => lengthRef.current.focus()}
								blurOnSubmit={false}
							/>
						</View>
					</View>

					<Divider />

					<View style={styles.flxStartRow}>
						<TextField
							xThin
							letterSpacing={-0.07}
							lineHeight={18}
							fontFamily={GlobalTheme.fontRegular}
							color={GlobalTheme.black}
							style={styles.ml10}>
							Dimensions (in CM)
						</TextField>

						<TextField
							xThin
							letterSpacing={-0.07}
							lineHeight={18}
							fontFamily={GlobalTheme.fontRegular}
							color={GlobalTheme.textColor}>
							(optional)
						</TextField>
					</View>

					<View style={styles.dimensionsWrapper}>
						<HTMaterialTextInput
							style={styles.dimensionsWrapperInnerSectionStyle}
							placeholder="L"
							returnKeyType="next"
							inputRef={lengthRef}
							// hasError={lengthValidate}
							// validationMessage={'Please enter valid L'}
							// validationMessage={
							// 	lengthErrorMessage != ''
							// 		? lengthErrorMessage
							// 		: 'Please enter valid L'
							// }
							onChangeText={(length) => {
								setLength(length);
								// setLengthValidate(false);
								// setLengthErrorMessage('');
							}}
							value={length}
							onSubmitEditing={(event) => widthRef.current.focus()}
							blurOnSubmit={false}
						/>

						<HTMaterialTextInput
							style={styles.dimensionsWrapperInnerSectionStyle}
							placeholder="W"
							returnKeyType="next"
							inputRef={widthRef}
							// hasError={widthValidate}
							// validationMessage={'Please enter valid W'}
							// validationMessage={
							// 	widthErrorMessage != ''
							// 		? widthErrorMessage
							// 		: 'Please enter valid W'
							// }
							onChangeText={(width) => {
								setWidth(width);
								// setWidthValidate(false);
								// setWidthErrorMessage('');
							}}
							value={width}
							onSubmitEditing={(event) => depthRef.current.focus()}
							blurOnSubmit={false}
						/>

						<HTMaterialTextInput
							style={styles.dimensionsWrapperInnerSectionStyle}
							placeholder="D"
							returnKeyType="done"
							inputRef={depthRef}
							// hasError={depthValidate}
							// validationMessage={'Please enter valid D'}
							// validationMessage={
							// 	depthErrorMessage != ''
							// 		? depthErrorMessage
							// 		: 'Please enter valid D'
							// }
							onChangeText={(depth) => {
								setDepth(depth);
								// setDepthValidate(false);
								// setDepthErrorMessage('');
							}}
							value={depth}
							onSubmitEditing={(event) =>
								console.log('post advert 2 finally!!')
							}
						/>
					</View>

					<Divider />

					<TextField
						xThin
						letterSpacing={-0.07}
						lineHeight={18}
						fontFamily={GlobalTheme.fontRegular}
						color={GlobalTheme.black}
						style={styles.mh10}>
						Item Location *
					</TextField>

					<Divider small />

					<View style={styles.checkBoxesRowStyle}>
						<View style={styles.checkBoxStyle}>
							<TouchableWithoutFeedback
								onPress={() => {
									setPostAdvertSavedAddress(true);
									setPostAdvertManualAddress(false);
								}}>
								<View style={styles.checkboxWrapper}>
									<View style={styles.checkboxWidthStyle}>
										<ShadowView style={styles.checkbox}>
											{postAdvertSavedAddress ? (
												<View style={styles.selectedStyle} />
											) : null}
										</ShadowView>
									</View>

									<View style={styles.textStyle}>
										<TextField
											xThin
											letterSpacing={-0.07}
											isRLH
											lineHeight={1.8}
											color={GlobalTheme.black}
											fontFamily={GlobalTheme.fontSF}
											style={styles.textFieldMarginLeftStyle}>
											Saved Address
										</TextField>
									</View>
								</View>
							</TouchableWithoutFeedback>
						</View>

						<View style={styles.checkBoxStyle}>
							<TouchableWithoutFeedback
								onPress={() => {
									setPostAdvertSavedAddress(false);
									setPostAdvertManualAddress(true);
								}}>
								<View style={[props.style, styles.checkboxWrapper]}>
									<View style={styles.checkboxWidthStyle}>
										<ShadowView style={styles.checkbox}>
											{postAdvertManualAddress ? (
												<View style={styles.selectedStyle} />
											) : null}
										</ShadowView>
									</View>

									<View style={styles.textStyle}>
										<TextField
											xThin
											letterSpacing={-0.07}
											isRLH
											lineHeight={1.8}
											color={GlobalTheme.black}
											fontFamily={GlobalTheme.fontSF}
											style={styles.textFieldMarginLeftStyle}>
											Manual Address
										</TextField>
									</View>
								</View>
							</TouchableWithoutFeedback>
						</View>
					</View>

					<Divider />

					{postAdvertSavedAddress ? (
						<HTMaterialPicker
							placeholder="Primary address (EX2 8FF)"
							style={styles.mh10}
							hasError={itemLocationValidate}
							validationMessage="Please select item location"
							clearItemLocationPickerError={clearItemLocationPickerError}
							onValueChange={(pickerSelectedValue, pickerSelectedId) => {
								setItemLocation(pickerSelectedValue);
								setItemLocationValidate(false);
							}}
							value={itemLocation}
							data={addressPickerList.length > 0 ? addressPickerList : []}
						/>
					) : null}

					{postAdvertManualAddress ? (
						// <HTMaterialTextInput
						// 	placeholder="Item location"
						// 	hasError={manualAddressItemLocationValidate}
						// 	validationMessage={'Please enter valid item location'}
						// 	onChangeText={(manualAddressItemLocation) => {
						// 		setManualAddressItemLocation(manualAddressItemLocation);
						// 		setManualAddressItemLocationValidate(false);
						// 		// setManualAddressItemLocationErrorMessage('');
						// 	}}
						// 	value={manualAddressItemLocation}
						// 	style={styles.mh10}
						// />

						<>
							<Divider small />

							<View style={styles.textInputRowStyle}>
								<View style={styles.textInputStyle}>
									<HTMaterialTextInput
										placeholder="Post code"
										iconName="location-searching"
										iconLibrary="MaterialIcons"
										value={manualAddressItemLocation}
										hasError={manualAddressItemLocationValidate}
										// validationMessage={'Please enter valid item location'}
										locationPermissionStatus={
											tradingAccountLocationPermissionHandler
										}
										onChangeText={(manualAddressItemLocation) => {
											setManualAddressItemLocation(manualAddressItemLocation);
											setManualAddressItemLocationValidate(false);
											setTypedPostcode(true);
										}}
									/>
								</View>

								<View style={styles.textInputForPickerStyle}>
									<HTMaterialPicker
										placeholder="Select address"
										hasError={addressFromPostcodeValidate}
										validationMessage="Please select address"
										enabled={
											manualAddressItemLocation != '' &&
											addressPickerListFromPostcode.length > 0
												? false
												: true
										}
										pickerDefaultValue={addressFromPostcode}
										onValueChange={(
											addressFromPostcodeValue,
											addressFromPostcodeSelectedId,
										) => {
											setAddressFromPostcode(addressFromPostcodeValue);
											setAddressFromPostcodeValidate(false);
										}}
										value={addressFromPostcode}
										data={
											addressPickerListFromPostcode.length > 0
												? addressPickerListFromPostcode
												: []
										}
									/>
								</View>
							</View>
						</>
					) : null}

					<Divider />

					<View style={styles.deliveryWrapper}>
						<View style={styles.deliveryWrapperInnerSection}>
							<TextField
								xThin
								letterSpacing={-0.07}
								lineHeight={18}
								fontFamily={GlobalTheme.fontRegular}
								color={GlobalTheme.black}>
								Collection available *
							</TextField>

							<HTMaterialPicker
								placeholder="Select"
								// hasError={collectionAvailableValidate}
								// validationMessage="Please select collection available"
								// clearCollectionAvailablePickerError={
								// 	clearCollectionAvailablePickerError
								// }
								pickerDefaultValue={YesNo[0].label}
								onValueChange={(pickerSelectedValue, pickerSelectedId) => {
									setCollectionAvailable(pickerSelectedValue);
									// setCollectionAvailableValidate(false);
								}}
								value={collectionAvailable}
								data={YesNo}
							/>
						</View>

						<View style={styles.deliveryWrapperInnerSection}>
							<TextField
								xThin
								letterSpacing={-0.07}
								lineHeight={18}
								fontFamily={GlobalTheme.fontRegular}
								color={GlobalTheme.black}>
								Delivery available *
							</TextField>

							<HTMaterialPicker
								placeholder="Select"
								hasError={deliveryAvailableValidate}
								validationMessage="Please select delivery available"
								clearDeliveryAvailablePickerError={
									clearDeliveryAvailablePickerError
								}
								onValueChange={(pickerSelectedValue, pickerSelectedId) => {
									postcodeHandler();
									setDeliveryAvailable(pickerSelectedValue);
									setDeliveryAvailableValidate(false);
								}}
								value={deliveryAvailable}
								data={YesNo}
							/>
						</View>
					</View>

					<Divider />

					<TextField
						xThin
						letterSpacing={-0.07}
						lineHeight={18}
						fontFamily={GlobalTheme.fontRegular}
						color={GlobalTheme.black}
						style={styles.mh10}>
						Delivery distance *
					</TextField>

					<HTMaterialPicker
						enabled={deliveryAvailable === '0' ? true : false}
						style={styles.deliveryDistanceStyle}
						placeholder="Select"
						// pickerDefaultValue="Unlimited"
						hasError={deliveryDistanceValidate}
						validationMessage="Please select delivery distance"
						clearDeliveryDistancePickerError={clearDeliveryDistancePickerError}
						onValueChange={(
							deliveryDistanceValue,
							deliveryDistanceSelectedId,
						) => {
							setDeliveryDistance(deliveryDistanceValue);
							setDeliveryDistanceValidate(false);
						}}
						value={deliveryDistance}
						data={Distance}
					/>

					<Divider />

					<TextField
						xThin
						letterSpacing={-0.07}
						lineHeight={18}
						fontFamily={GlobalTheme.fontRegular}
						color={GlobalTheme.black}
						style={styles.mh10}>
						Delivery charge (per mile) *
					</TextField>

					<HTMaterialTextInput
						editable={deliveryAvailable === '0' ? true : false}
						style={styles.deliveryChargeStyle}
						placeholder="E.g 2.50"
						position="left"
						iconName="pound"
						iconLibrary="Foundation"
						returnKeyType="next"
						hasError={deliveryChargeValidate}
						validationMessage={
							deliveryChargeErrorMessage != ''
								? deliveryChargeErrorMessage
								: 'Please enter valid delivery charge'
						}
						onChangeText={(deliveryCharge) => {
							setDeliveryCharge(deliveryCharge);
							setDeliveryChargeValidate(false);
							setDeliveryChargeErrorMessage('');
						}}
						value={deliveryCharge}
						onSubmitEditing={
							(event) => values[0].perDayPriceRef.current.focus()

							// advertiseToHire
							// 	? hirePriceRef.current.focus()
							// 	: weightRef.current.focus()
						}
						blurOnSubmit={false}
					/>

					<Divider />

					<View
						style={{
							width: '95%',
							alignSelf: 'center',
							// borderWidth: 1
						}}>
						<TextField
							justify
							xThin
							letterSpacing={-0.07}
							lineHeight={18}
							fontFamily={GlobalTheme.fontRegular}
							color={GlobalTheme.black}>
							Please enter rates for hire periods. Customers will only be
							permitted to hire for valid combinations of days based on these
							rates. Any or all rates can be included as long as there is at
							least one entry. *
						</TextField>

						{/* <Divider /> */}

						{/* <View
							style={{
								flexDirection: 'row',
								justifyContent: 'flex-start',
								alignItems: 'center',
								alignSelf: 'center',
							}}>
							<TextField
								isRLH
								lineHeight={2.0}
								fontFamily={GlobalTheme.fontRegular}
								color={GlobalTheme.black}
								style={{width: '50%'}}>
								Days
							</TextField>

							<TextField
								isRLH
								lineHeight={2.0}
								fontFamily={GlobalTheme.fontRegular}
								color={GlobalTheme.black}
								style={{width: '50%'}}>
								Price
							</TextField>
						</View> */}

						{/* <Divider /> */}

						{tabularPerDayPrice}

						{perDayPriceValidate != '' && (
							<>
								<Divider />

								<TextField
									small
									isRLH
									lineHeight={1.8}
									letterSpacing={-0.07}
									fontFamily={GlobalTheme.fontRegular}
									color={GlobalTheme.validationColor}>
									{perDayPriceValidate}
								</TextField>
							</>
						)}

						{perDayWiseValidateText != '' && (
							<>
								<Divider />

								<TextField
									small
									isRLH
									lineHeight={1.8}
									letterSpacing={-0.07}
									fontFamily={GlobalTheme.fontRegular}
									color={GlobalTheme.validationColor}>
									{perDayWiseValidateText}
								</TextField>
							</>
						)}

						{/* <View style={styles.hirePriceWrapperStyle}>
						 <View style={styles.hirePriceWrapperInnerStyle}>
							<TextField
								xThin
								letterSpacing={-0.07}
								lineHeight={18}
								fontFamily={GlobalTheme.fontRegular}
								color={GlobalTheme.black}>
								Hire price (per day) *
							</TextField>

							<HTMaterialTextInput
								editable={!advertiseToHire && advertiseToSale ? true : false}
								placeholder="E.g 80"
								position="left"
								iconName="pound"
								iconLibrary="Foundation"
								returnKeyType="next"
								inputRef={hirePriceRef}
								hasError={perDayValidate}
								validationMessage={
									perDayErrorMessage != ''
										? perDayErrorMessage
										: 'Please enter valid per day'
								}
								onChangeText={(perDay) => {
									setPerDay(perDay);
									setPerDayValidate(false);
									setPerDayErrorMessage('');
								}}
								value={perDay}
								onSubmitEditing={(event) => hirePriceWeeklyRef.current.focus()}
								blurOnSubmit={false}
							/>
						</View>

						<View style={styles.hirePriceWrapperInnerRightStyle}>
							<TextField
								xThin
								letterSpacing={-0.07}
								lineHeight={18}
								fontFamily={GlobalTheme.fontRegular}
								color={GlobalTheme.black}>
								Hire price (per week (7 days)) *
							</TextField>

							<HTMaterialTextInput
								editable={!advertiseToHire && advertiseToSale ? true : false}
								placeholder="E.g 240"
								position="left"
								iconName="pound"
								iconLibrary="Foundation"
								returnKeyType="next"
								inputRef={hirePriceWeeklyRef}
								hasError={perWeekValidate}
								validationMessage={
									perWeekErrorMessage != ''
										? perWeekErrorMessage
										: 'Please enter valid per week'
								}
								onChangeText={(perWeek) => {
									setPerWeek(perWeek);
									setPerWeekValidate(false);
									setPerWeekErrorMessage('');
								}}
								value={perWeek}
								onSubmitEditing={(event) => weightRef.current.focus()}
								blurOnSubmit={false}
							/>
						</View>
					</View> */}
					</View>

					<Divider />

					<View style={styles.flxStartRow}>
						<TextField
							xThin
							letterSpacing={-0.07}
							lineHeight={18}
							fontFamily={GlobalTheme.fontRegular}
							color={GlobalTheme.black}
							style={styles.ml10}>
							Weight (KG/TONNES)
						</TextField>

						<TextField
							xThin
							letterSpacing={-0.07}
							lineHeight={18}
							fontFamily={GlobalTheme.fontRegular}
							color={GlobalTheme.textColor}>
							(optional)
						</TextField>
					</View>

					<HTMaterialTextInput
						style={styles.deliveryChargeStyle}
						placeholder="E.g 10"
						returnKeyType="next"
						inputRef={weightRef}
						// hasError={weightValidate}
						// validationMessage={
						// 	weightErrorMessage != ''
						// 		? weightErrorMessage
						// 		: 'Please enter valid weight'
						// }
						onChangeText={(weight) => {
							setWeight(weight);
							// setWeightValidate(false);
							// setWeightErrorMessage('');
						}}
						value={weight}
						onSubmitEditing={(event) => productCodeRef.current.focus()}
						blurOnSubmit={false}
					/>

					<Divider />

					<View style={styles.hirePriceWrapperStyle}>
						<View style={styles.hirePriceWrapperInnerStyle}>
							<View style={styles.flxStartRow}>
								<TextField
									xThin
									letterSpacing={-0.07}
									lineHeight={18}
									fontFamily={GlobalTheme.fontRegular}
									color={GlobalTheme.black}>
									Product code
								</TextField>

								<TextField
									xThin
									letterSpacing={-0.07}
									lineHeight={18}
									fontFamily={GlobalTheme.fontRegular}
									color={GlobalTheme.textColor}>
									(optional)
								</TextField>
							</View>

							<HTMaterialTextInput
								placeholder="E.g CEX56"
								returnKeyType="next"
								inputRef={productCodeRef}
								hasError={productCodeValidate}
								validationMessage={
									productCodeErrorMessage != ''
										? productCodeErrorMessage
										: 'Please enter valid code'
								}
								onChangeText={(productCode) => {
									setProductCode(productCode);
									setProductCodeValidate(false);
									setProductCodeErrorMessage('');
								}}
								value={productCode}
								onSubmitEditing={(event) => eanRef.current.focus()}
								blurOnSubmit={false}
							/>
						</View>

						<View style={styles.hirePriceWrapperInnerStyle}>
							<View style={styles.flxStartRow}>
								<TextField
									xThin
									letterSpacing={-0.07}
									lineHeight={18}
									fontFamily={GlobalTheme.fontRegular}
									color={GlobalTheme.black}>
									EAN
								</TextField>

								<TextField
									xThin
									letterSpacing={-0.07}
									lineHeight={18}
									fontFamily={GlobalTheme.fontRegular}
									color={GlobalTheme.textColor}>
									(optional)
								</TextField>
							</View>

							<HTMaterialTextInput
								placeholder="E.g 12654"
								returnKeyType={advertiseToSale ? 'next' : 'done'}
								inputRef={eanRef}
								hasError={eanValidate}
								validationMessage={
									eanErrorMessage != ''
										? eanErrorMessage
										: 'Please enter valid ean'
								}
								onChangeText={(ean) => {
									setEAN(ean);
									setEANValidate(false);
									setEANErrorMessage('');
								}}
								value={ean}
								onSubmitEditing={(event) =>
									advertiseToSale
										? salePriceRef.current.focus()
										: console.log('post advert 3 finally!!')
								}
								blurOnSubmit={advertiseToSale ? false : true}
							/>
						</View>
					</View>

					<Divider />

					<View style={styles.saleAndOffersWrapperStyle}>
						<View style={styles.saleAndOffersWrapperInnerStyle}>
							<TextField
								xThin
								letterSpacing={-0.07}
								lineHeight={18}
								fontFamily={GlobalTheme.fontRegular}
								color={GlobalTheme.black}>
								For sale price *
							</TextField>

							<HTMaterialTextInput
								editable={!advertiseToSale ? true : false}
								placeholder="E.g 20000"
								position="left"
								iconName="pound"
								iconLibrary="Foundation"
								returnKeyType="done"
								inputRef={salePriceRef}
								hasError={forSaleValidate}
								validationMessage={
									forSaleErrorMessage != ''
										? forSaleErrorMessage
										: 'Please enter valid sale price'
								}
								onChangeText={(forSale) => {
									setForSale(forSale);
									setForSaleValidate(false);
									setForSaleErrorMessage('');
								}}
								value={forSale}
								onSubmitEditing={(event) =>
									console.log('post advert 4 finally!!')
								}
							/>
						</View>

						<View style={styles.saleAndOffersWrapperInnerStyle}>
							{advertiseToSale ? (
								<>
									<Divider />

									<TouchableWithoutFeedback
										onPress={() => {
											setPlusVAT(!plusVAT);
										}}>
										<View style={styles.checkboxWrapper}>
											<View style={styles.checkboxWidthStyle}>
												<ShadowView style={styles.checkbox}>
													{plusVAT ? (
														<View style={styles.selectedStyle} />
													) : null}
												</ShadowView>
											</View>

											<View style={styles.textStyle}>
												<TextField
													xThin
													letterSpacing={-0.07}
													isRLH
													lineHeight={1.8}
													color={GlobalTheme.black}
													fontFamily={GlobalTheme.fontSF}
													style={styles.textFieldMarginLeftStyle}>
													Plus VAT
												</TextField>
											</View>
										</View>
									</TouchableWithoutFeedback>
								</>
							) : null}
						</View>
					</View>

					<Divider />

					<TextField
						xThin
						letterSpacing={-0.07}
						lineHeight={18}
						fontFamily={GlobalTheme.fontRegular}
						color={GlobalTheme.black}
						style={styles.mh10}>
						Offers accepted *
					</TextField>

					<HTMaterialPicker
						enabled={!advertiseToSale ? true : false}
						placeholder="Select"
						style={styles.mh10}
						hasError={offersAcceptedValidate}
						validationMessage="Please select valid offer"
						clearOffersAcceptedPickerError={clearOffersAcceptedPickerError}
						onValueChange={(offersAcceptedValue, offersAcceptedSelectedId) => {
							setOffersAccepted(offersAcceptedValue);
							setOffersAcceptedValidate(false);
						}}
						value={offersAccepted}
						data={YesNo}
					/>

					<Divider />

					<TextField
						thin
						isRLH
						lineHeight={1.8}
						letterSpacing={-0.07}
						fontFamily={GlobalTheme.fontRegular}
						color={GlobalTheme.textColor}
						style={styles.mh10}>
						To mark unavailable dates in your calendar for this item, please
						edit the advert once it has been created.
					</TextField>

					<Divider />

					<View style={styles.termsOfUseWrapperStyle}>
						<OnlyCheckBox
							onPress={(val) => setCheckBox(val)}
							style={styles.onlyCheckBoxWrapperStyle}
						/>

						<TextField
							xThin
							isRLH
							lineHeight={1.8}
							letterSpacing={-0.09}
							color={GlobalTheme.black}
							fontFamily={GlobalTheme.fontRegular}
							style={styles.linkTextStyle}>
							{!advertiseToHire && !advertiseToSale ? (
								<>
									{`I have read & agree to the`}
									<ParsedLinkText
										onPress={postAdvertHireTermsAndConditionHandler}
										color={GlobalTheme.primaryColor}
										style={styles.linkTopStyle}>
										{` `}Hire terms & conditions{` `}
									</ParsedLinkText>
									{`and`}
									<ParsedLinkText
										onPress={postAdvertBuyTermsAndConditionHandler}
										color={GlobalTheme.primaryColor}
										style={styles.linkTopStyle}>
										{` `}Sale terms & conditions
									</ParsedLinkText>
									{`.`}
								</>
							) : (
								<>
									{`I have read & agree to the`}
									{advertiseToHire ? (
										<ParsedLinkText
											onPress={postAdvertHireTermsAndConditionHandler}
											color={GlobalTheme.primaryColor}
											style={styles.linkTopStyle}>
											{` `}Hire terms & conditions{` `}
										</ParsedLinkText>
									) : null}

									{advertiseToHire && advertiseToSale ? `and` : null}

									{advertiseToSale ? (
										<ParsedLinkText
											onPress={postAdvertBuyTermsAndConditionHandler}
											color={GlobalTheme.primaryColor}
											style={styles.linkTopStyle}>
											{` `}Sale terms & conditions
										</ParsedLinkText>
									) : null}

									{`.`}
								</>
							)}
						</TextField>
					</View>

					<Divider xxMedium />

					<TextField
						thin
						letterSpacing={-0.07}
						isRLH
						lineHeight={1.8}
						fontFamily={GlobalTheme.fontRegular}
						color={GlobalTheme.textColor}
						style={styles.continuingAgreementStyle}>
						By placing this advert on Hire That you agree to our Terms of
						Conditions of advertising through our app
					</TextField>

					<Divider xLarge />

					<Button
						style={styles.mh10}
						title="CREATE ADVERT"
						disabled={!checkBox ? true : false}
						blackButton={checkBox ? true : false}
						onPress={createAdvertHandler}
					/>

					<AddPhotosModal
						screen="PostAdvert"
						navigation={props.navigation}
						showPhotoModal={photosScreenModal}
						// advertiseToSale={!advertiseToSale}
						postAdvertPhotos={
							postAdvertPhotos.length > 1 ? postAdvertPhotos : []
						}
						postAdvertPhotosCallback={handlePhotosCallback}
						postAdvertMainImageCallback={handleMainImageCallback}
						postAdvertPhotosCancelCallback={handlePhotosCancelCallback}
					/>

					<Divider xxxHuge />
					<Divider xxxHuge />
					{/* </ScrollView> */}
				</KeyboardAwareScrollView>
			</>
		</GenericView>
	);
};

const styles = StyleSheet.create({
	mainView: {
		flex: 1,
		// borderWidth: 1,
		// borderColor: 'green',
	},
	mh10: {
		marginHorizontal: 10,
	},
	ml10: {
		marginLeft: 10,
	},
	flxStartRow: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	rowStyleWithToogle: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		marginHorizontal: 10,
		// borderWidth: 1,
	},
	toggleButtonGroupStyle: (hasError = false) => ({
		width: '47.5%',
		borderWidth: hasError ? 1 : null,
		borderColor: hasError ? GlobalTheme.validationColor : null,
	}),
	toggleButtonGroupInnerWrapperStyle: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	ml14: {
		marginLeft: 14,
	},
	dimensionsWrapper: {
		width: '95%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginHorizontal: 10,
		// borderWidth: 1,
	},
	dimensionsWrapperInnerSectionStyle: {
		width: '30%',
		// borderWidth: 1,
	},
	checkBoxesRowStyle: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginHorizontal: 10,
		// borderWidth: 1,
		// borderColor: 'magenta',
	},
	checkBoxStyle: {
		width: '45%',
		// borderWidth: 1,
		// borderColor: 'green',
	},
	checkboxWrapper: {
		flex: 1,
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderColor: GlobalTheme.validationColor,
		// borderWidth: 1,
		// borderColor: 'blue',
	},
	checkboxWidthStyle: {
		width: '20%',
		// borderWidth: 1,
		// borderColor: 'magenta',
	},
	checkbox: {
		// width: 28,
		// height: 28,
		width: hp('3.6%'),
		height: hp('3.6%'),
		borderWidth: 0.1,
		borderColor: 'transparent',
		shadowOpacity: 0.28,
		shadowColor: GlobalTheme.black,
		shadowRadius: GlobalTheme.shadowRadius,
		borderRadius: GlobalTheme.viewRadius,
		backgroundColor: GlobalTheme.white,
		shadowOffset: {width: 0, height: 6},
	},
	selectedStyle: {
		// width: 22,
		// height: 22,
		width: hp('2.8%'),
		height: hp('2.8%'),
		// marginTop: 3,
		marginTop: hp('0.4%'),
		alignSelf: 'center',
		borderRadius: GlobalTheme.viewRadius,
		backgroundColor: GlobalTheme.primaryColor,
	},
	textStyle: {
		width: '80%',
		// borderWidth: 1,
		// borderColor: 'red',
	},
	textFieldMarginLeftStyle: {
		marginLeft: 10,
	},
	deliveryWrapper: {
		width: '95%',
		marginHorizontal: 10,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		// borderWidth: 1,
		// borderColor: 'blue',
	},
	deliveryWrapperInnerSection: {
		width: '45%',
		// borderWidth: 1,
	},
	deliveryChargeStyle: {
		width: '43%',
		marginLeft: 10,
		// borderWidth: 1,
	},
	deliveryDistanceStyle: {
		// width: '43%',
		marginHorizontal: 10,
		// borderWidth: 1,
	},
	hirePriceWrapperStyle: {
		width: '95%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginHorizontal: 10,
		// borderWidth: 1,
	},
	hirePriceWrapperInnerStyle: {
		width: '45%',
		// borderWidth: 1,
	},
	hirePriceWrapperInnerRightStyle: {
		width: '45%',
		bottom: hp('0.9%'),
		// borderWidth: 1,
	},
	saleAndOffersWrapperStyle: {
		width: '95%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginHorizontal: 10,
		// borderWidth: 1,
	},
	saleAndOffersWrapperInnerStyle: {
		width: '45%',
		// borderWidth: 1,
	},
	termsOfUseWrapperStyle: {
		width: wp('95%'),
		marginHorizontal: 10,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		// borderWidth: 1,
	},
	onlyCheckBoxWrapperStyle: {
		width: wp('20%'),
	},
	linkTextStyle: {
		width: wp('80%'),
		// borderWidth: 1,
	},
	linkTopStyle: {
		top: hp('0.3%'),
		// borderWidth: 1,
	},
	continuingAgreementStyle: {
		width: wp('80%'),
		marginHorizontal: 10,
		alignSelf: 'flex-end',
		// borderWidth: 1,
	},
	textInputRowStyle: {
		width: '95%',
		marginHorizontal: 10,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		// borderWidth: 1,
	},
	textInputStyle: {
		width: '45%',
		// borderWidth: 1,
	},
	textInputForPickerStyle: {
		width: '45%',
		position: 'absolute',
		top: 0,
		right: 0,
		// borderWidth: 1,
	},
});

export {PostAdvert};
