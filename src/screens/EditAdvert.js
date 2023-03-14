import React, {useState, useEffect, useRef} from 'react';
import {
	View,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	PermissionsAndroid,
	TouchableWithoutFeedback,
} from 'react-native';

import {Switch} from 'react-native-switch';
import Geocoder from 'react-native-geocoding';
import {Calendar} from 'react-native-calendars';
import Icon from 'react-native-vector-icons/Ionicons';
import {showMessage} from 'react-native-flash-message';
import ImagePicker from 'react-native-image-crop-picker';
import ShadowView from 'react-native-simple-shadow-view';
import Geolocation from 'react-native-geolocation-service';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
	heightPercentageToDP as hp,
	widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {IOS} from '../helper';
import {_ENV_CONFIG} from '../config';
import {GlobalTheme} from '../components/theme';
// import {findLatLong} from '../services/axios/Api';
import {findAddressFromPostcode} from '../services/axios/Api';
import {Arrow} from '../components/calendar/Arrow';
import {AddPhotosModal} from './modals/AddPhotosModal';
import {ImageCard} from '../components/postAdvert/ImageCard';
import {YesNo, Distance, MonthShortcut} from '../constants/Constant';
import {RegExp, getObjectLength, calendarMonthyear, getYears} from '../utils';
import {
	GenericView,
	Header,
	Button,
	Divider,
	TextField,
	OnlyCheckBox,
	HTMaterialPicker,
	HTMaterialTextInput,
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
import {calendarHeaderTitle} from '../store/actions/Hire';
import {subCategoriesApi} from '../store/actions/Categories';
import {clearTextInputReq} from '../store/actions/ClearTextInput';
import {presentLoader, hideLoader} from '../store/actions/Loader';
import {
	updateAdvertApi,
	presentPhotosScreenModal,
	removeAdvertErrorMessage,
	calendarDateDeleteByIdApi,
	calendarDatesMakingUnavailableApi,
} from '../store/actions/Adverts';

const EditAdvert = (props) => {
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
	const singleAdvert = useSelector((state) => state.adverts.singleAdvert);
	const addressPickerList = useSelector(
		(state) => state.profile.addressPickerList,
	);
	// const completedStripeOnboarding = useSelector(
	// 	(state) => state.auth.user.completed_stripe_onboarding,
	// );
	const hasPrimaryCard = useSelector(
		(state) => state.auth.user.has_primary_card,
	);
	const textInputClear = useSelector(
		(state) => state.clearTextInput.textInputClear,
	);
	const photosScreenModal = useSelector(
		(state) => state.adverts.presentPhotosScreenModal,
	);
	const main_image_error_message = useSelector(
		(state) => state.adverts.mainImageErrorMessage,
	);
	const sub_category_error_message = useSelector(
		(state) => state.adverts.subCategoryErrorMessage,
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
	const calendarUnavailableDates = useSelector(
		(state) => state.adverts.calendarUnavailableDateList,
	);
	const calendarHTitle = useSelector((state) => state.hire.calendarHeaderTitle);

	const [advertTitle, setAdvertTitle] = useState('');
	const [advertTitleValidate, setAdvertTitleValidate] = useState(false);

	const [advertiseToHire, setAdvertiseToHire] = useState(false);
	const [advertiseToSale, setAdvertiseToSale] = useState(false);
	const [toggleButtonValidate, setToggleButtonValidate] = useState(false);

	const [postAdvertMainImage, setPostAdvertMainImage] = useState([]);
	const [displayEditAdvertMainImage, setDisplayEditAdvertMainImage] = useState(
		'',
	);
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
	const [isSubCategorySetRunOnce, setIsSubCategorySetRunOnce] = useState(true);
	// const [clearAdvertSubCategory, setClearAdvertSubCategory] = useState(false);
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

	const [editAdvertSavedAddress, setEditAdvertSavedAddress] = useState(true);
	const [editAdvertManualAddress, setEditAdvertManualAddress] = useState(false);

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

	const [editAdvertLatitude, setEditAdvertLatitude] = useState('');
	const [editAdvertLongitude, setEditAdvertLongitude] = useState('');

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

	const [availability, setAvailability] = useState('1');

	const [forSale, setForSale] = useState('');
	const [forSaleValidate, setForSaleValidate] = useState(false);
	const [forSaleErrorMessage, setForSaleErrorMessage] = useState('');

	const [offersAccepted, setOffersAccepted] = useState('');
	const [offersAcceptedErrorMessage, setOffersAcceptedErrorMessage] = useState(
		'',
	);
	const [offersAcceptedValidate, setOffersAcceptedValidate] = useState(false);

	const [plusVAT, setPlusVAT] = useState(false);

	const [confirmDatesDisplay, setConfirmDatesDisplay] = useState({});
	const [replaceConfirmDatesDisplay, setReplaceConfirmDatesDisplay] = useState(
		{},
	);
	const [
		selectedDatesForMakingUnavailable,
		setSelectedDatesForMakingUnavailable,
	] = useState([]);
	const [
		selectedDatesIdsForMakingAvailable,
		setSelectedDatesIdsForMakingAvailable,
	] = useState([]);
	const [pressedArrow, setPressedArrow] = useState('');
	const [monthChangeValue, setMonthChangeValue] = useState('');

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
			leftTitle: 'Cancel',
			isRightContent: false,
			rightTitle: '',
			navParam: '',
		};

		dispatch(calendarHeaderTitle(''));
		dispatch(headerTitle(headerConfig));
	}, []);

	useEffect(() => {
		return () => {
			console.log('6');
			// setClearAdvertSubCategory(false);
			setIsSubCategorySetRunOnce(true);
		};
	}, []);

	useEffect(() => {
		if (calendarUnavailableDates.length > 0) {
			let readyForMarkedUnavailableDates = [];
			for (let i = 0; i < calendarUnavailableDates.length; i++) {
				if (calendarUnavailableDates[i].is_booking === 1) {
					readyForMarkedUnavailableDates.push({
						[calendarUnavailableDates[i].date]: {
							marked: true,
							dotColor: GlobalTheme.black,
							disableTouchEvent: true,
							disabled: true,
							activeOpacity: 0,
						},
					});
				} else {
					readyForMarkedUnavailableDates.push({
						[calendarUnavailableDates[i].date]: {
							selected: true,
							selectedColor: GlobalTheme.validationColor,
							selectedTextColor: GlobalTheme.white,
						},
					});
				}
			}
			readyForMarkedUnavailableDates = Object.assign(
				{},
				...readyForMarkedUnavailableDates,
			);
			// console.log(
			// 	'readyForMarkedUnavailableDates ==> ',
			// 	readyForMarkedUnavailableDates,
			// );

			setConfirmDatesDisplay(readyForMarkedUnavailableDates);
			setReplaceConfirmDatesDisplay(readyForMarkedUnavailableDates);
		}
	}, [calendarUnavailableDates]);

	useEffect(() => {
		if (advertiseToSale) {
			showMessage({
				// message: 'Weekly sales charge will be charged to on payment method',
				message:
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

			setPerDayValidate(false);
			setPerWeekValidate(false);
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

	const clearSubCategoryPickerDefaultValueHandler = () => {
		// console.log('I M HERE ==> clearSubCategoryPickerDefaultValueHandler');
		setClearSubCategoryPickerDefaultValue(true);
	};

	useEffect(() => {
		if (
			advertCategorySelectedId !== '' &&
			advertCategorySelectedId !== null &&
			advertCategorySelectedId !== '--Select--'
		) {
			console.log('0');
			dispatch(subCategoriesApi(advertCategorySelectedId));
		}
	}, [advertCategorySelectedId]);

	useEffect(() => {
		if (
			isSubCategorySetRunOnce &&
			subCategoriesPickerList.length > 0 &&
			getObjectLength(singleAdvert) != 0
		) {
			subCategoriesPickerList.filter((obj) => {
				if (obj.label === singleAdvert.sub_category) {
					setAdvertSubCategory(obj.id.toString());
				}
			});

			setIsSubCategorySetRunOnce(false);
		}
	}, [isSubCategorySetRunOnce, subCategoriesPickerList, singleAdvert]);

	// useEffect(() => {
	// 	if (advertSubCategory != '') {
	// 		console.log('5');
	// 		setClearAdvertSubCategory(true);
	// 	}
	// }, [advertSubCategory]);

	useEffect(() => {
		if (editAdvertSavedAddress && itemLocation != '') {
			postcodeHandler();
		}
	}, [editAdvertSavedAddress, itemLocation]);

	const postcodeHandler = () => {
		if (addressPickerList.length > 0) {
			addressPickerList.filter((item) => {
				// if (itemLocation != '') {
				if (itemLocation === item.value) {
					setPostcode(item.postcode);
					setEditAdvertLatitude(item.lat);
					setEditAdvertLongitude(item.lon);
				}
				// }
			});
		}
	};

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
		if (getObjectLength(singleAdvert) != 0 && categoriesPickerList.length > 0) {
			console.log('-00-');
			setAdvertTitle(singleAdvert.name);
			setAdvertiseToHire(singleAdvert.is_for_hire === 1 ? true : false);
			setAdvertiseToSale(singleAdvert.is_for_sale === 1 ? true : false);
			setDisplayEditAdvertMainImage(singleAdvert.main_image);
			// setAdvertCategory(singleAdvert.category);
			// setAdvertSubCategory(singleAdvert.sub_category);

			// categoriesPickerList.filter((obj) => {
			// 	if (obj.label === singleAdvert.category) {
			// 		setAdvertCategory(obj.id.toString());
			// 		setAdvertCategorySelectedId(obj.id.toString());
			// 	}
			// });

			if (singleAdvert.is_for_hire === 1 && singleAdvert.is_for_sale === 1) {
				categoriesForBothPickerList.filter((obj) => {
					if (obj.label === singleAdvert.category) {
						setAdvertCategory(obj.id.toString());
						setAdvertCategorySelectedId(obj.id.toString());
					}
				});
			}

			if (singleAdvert.is_for_hire === 1 && singleAdvert.is_for_sale === 0) {
				categoriesHirePickerList.filter((obj) => {
					if (obj.label === singleAdvert.category) {
						setAdvertCategory(obj.id.toString());
						setAdvertCategorySelectedId(obj.id.toString());
					}
				});
			}

			if (singleAdvert.is_for_hire === 0 && singleAdvert.is_for_sale === 1) {
				categoriesSalePickerList.filter((obj) => {
					if (obj.label === singleAdvert.category) {
						setAdvertCategory(obj.id.toString());
						setAdvertCategorySelectedId(obj.id.toString());
					}
				});
			}

			setMake(singleAdvert.make);
			setModel(singleAdvert.model);
			setDescription(
				singleAdvert.description != null ? singleAdvert.description : '',
			);
			setAge(singleAdvert.age != null ? singleAdvert.age.toString() : '');
			setMileage(
				singleAdvert.mileage != null ? singleAdvert.mileage.toString() : '',
			);
			setHoursUsed(
				singleAdvert.hours_used != null
					? singleAdvert.hours_used.toString()
					: '',
			);
			setLength(
				singleAdvert.length_mm != null ? singleAdvert.length_mm.toString() : '',
			);
			setWidth(
				singleAdvert.width_mm != null ? singleAdvert.width_mm.toString() : '',
			);
			setDepth(
				singleAdvert.height_mm != null ? singleAdvert.height_mm.toString() : '',
			);
			if (singleAdvert.is_manual_address === 1) {
				setEditAdvertSavedAddress(false);
				setEditAdvertManualAddress(true);
				setManualAddressItemLocation(singleAdvert.post_code);
				setAddressFromPostcode(singleAdvert.location);
			} else {
				setEditAdvertSavedAddress(true);
				setEditAdvertManualAddress(false);
				setItemLocation(singleAdvert.location);
			}
			setPostcode(singleAdvert.post_code);
			setEditAdvertLatitude(singleAdvert.latitude.toString());
			setEditAdvertLongitude(singleAdvert.longitude.toString());
			setCollectionAvailable(singleAdvert.is_for_collection.toString());
			setDeliveryAvailable(singleAdvert.is_for_delivery.toString());
			setDeliveryDistance(
				singleAdvert.delivery_distance != null
					? singleAdvert.delivery_distance.toString()
					: 'Unlimited',
			);
			setDeliveryCharge(
				singleAdvert.delivery_charge_mile != null
					? singleAdvert.delivery_charge_mile.toString()
					: '',
			);

			// setPerDay(
			// 	singleAdvert.per_day_price != null
			// 		? singleAdvert.per_day_price.toString()
			// 		: '',
			// );
			// setPerWeek(
			// 	singleAdvert.per_week_price != null
			// 		? singleAdvert.per_week_price.toString()
			// 		: '',
			// );

			values[0].perDayPrice =
				singleAdvert.price_day_1 != null
					? singleAdvert.price_day_1.toString()
					: '';
			values[1].perDayPrice =
				singleAdvert.price_day_2 != null
					? singleAdvert.price_day_2.toString()
					: '';
			values[2].perDayPrice =
				singleAdvert.price_day_3 != null
					? singleAdvert.price_day_3.toString()
					: '';
			values[3].perDayPrice =
				singleAdvert.price_day_4 != null
					? singleAdvert.price_day_4.toString()
					: '';
			values[4].perDayPrice =
				singleAdvert.price_day_5 != null
					? singleAdvert.price_day_5.toString()
					: '';
			values[5].perDayPrice =
				singleAdvert.price_day_6 != null
					? singleAdvert.price_day_6.toString()
					: '';
			values[6].perDayPrice =
				singleAdvert.price_day_7 != null
					? singleAdvert.price_day_7.toString()
					: '';

			setWeight(singleAdvert?.weight ? singleAdvert.weight.toString() : '');
			setProductCode(singleAdvert.product_code);
			setEAN(singleAdvert?.ean ? singleAdvert.ean.toString() : '');

			let plusVATCheckBoxSelected = singleAdvert.vat === 1 ? true : false;
			setPlusVAT(plusVATCheckBoxSelected);
			setForSale(
				singleAdvert.selling_price != null
					? singleAdvert.selling_price.toString()
					: null,
			);
			setOffersAccepted(singleAdvert.offers_accepted.toString());
		}
	}, [singleAdvert, categoriesPickerList]);

	const photosModalHandler = () => {
		dispatch(presentPhotosScreenModal());
	};

	const clearCalendarDatesHandler = () => {
		// let advertAvailableDates = Object.assign({}, replaceConfirmDatesDisplay);
		setConfirmDatesDisplay(replaceConfirmDatesDisplay);
		setSelectedDatesForMakingUnavailable([]);
		setSelectedDatesIdsForMakingAvailable([]);
	};

	const onMonthChangeHandler = (monthChange) => {
		// console.log('monthChange ==> ', monthChange);
		if (pressedArrow === 'left') {
			let yearLeft = monthChange.year;
			let monthNumLeft = monthChange.month - 1;
			let monthCharLeft = MonthShortcut[monthNumLeft];

			let calendarTitleLeft = monthCharLeft + ' ' + yearLeft;
			dispatch(calendarHeaderTitle(calendarTitleLeft));
		} else if (pressedArrow === 'right') {
			let yearRight = monthChange.year;
			let monthNumRight = monthChange.month - 1;
			let monthCharRight = MonthShortcut[monthNumRight];

			let calendarTitleRight = monthCharRight + ' ' + yearRight;
			dispatch(calendarHeaderTitle(calendarTitleRight));
		}
	};

	const readyForMarkedUnavailableDatesHandler = (day) => {
		// console.log('day ==> ', day);
		let markedUnavailable = true;
		let advertSelectedUnavailableDates = [];

		advertSelectedUnavailableDates.push(confirmDatesDisplay);

		for (const [key, value] of Object.entries(
			advertSelectedUnavailableDates[0],
		)) {
			if (key == day.dateString) {
				markedUnavailable = false;
				advertSelectedUnavailableDates.push({
					[day.dateString]: {
						selected: true,
						disableTouchEvent: true,
						selectedColor: GlobalTheme.white,
						selectedTextColor: GlobalTheme.black,
					},
				});

				advertSelectedUnavailableDates = Object.assign(
					{},
					...advertSelectedUnavailableDates,
				);

				setSelectedDatesIdsForMakingAvailable((prevArray) => [
					...prevArray,
					key,
				]);
				setConfirmDatesDisplay(advertSelectedUnavailableDates);
			}
		}

		if (markedUnavailable) {
			advertSelectedUnavailableDates.push({
				[day.dateString]: {
					selected: true,
					disableTouchEvent: true,
					selectedColor: GlobalTheme.validationColor,
					selectedTextColor: GlobalTheme.white,
				},
			});

			advertSelectedUnavailableDates = Object.assign(
				{},
				...advertSelectedUnavailableDates,
			);

			setSelectedDatesForMakingUnavailable((prevArray) => [
				...prevArray,
				day.dateString,
			]);
			setConfirmDatesDisplay(advertSelectedUnavailableDates);
		}

		// console.log(
		// 	'advertSelectedUnavailableDates ==> ',
		// 	advertSelectedUnavailableDates,
		// );
	};

	// console.log(
	// 	'selectedDatesForMakingUnavailable ==> ',
	// 	selectedDatesForMakingUnavailable,
	// );
	// console.log(
	// 	'selectedDatesIdsForMakingAvailable ==> ',
	// 	selectedDatesIdsForMakingAvailable,
	// );

	useEffect(() => {
		if (
			getObjectLength(singleAdvert) != 0 &&
			singleAdvert.is_manual_address === 0
		) {
			setManualAddressItemLocation('');
			setManualAddressItemLocationValidate(false);
		}

		if (
			getObjectLength(singleAdvert) != 0 &&
			singleAdvert.is_manual_address === 1
		) {
			setItemLocation('');
			setItemLocationValidate(false);
		}
	}, [singleAdvert]);

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
							// let primaryOutCode = res.data.result[0].outcode;
							// let primaryInCode = res.data.result[0].incode;

							// Geocoder.init(_ENV_CONFIG.GOOGLE_KEY);
							// Geocoder.from(
							// 	res.data.result[0].latitude,
							// 	res.data.result[0].longitude,
							// )
							// 	.then((json) => {
							// console.log('json ==> ', json.results);
							// setLatLongFetchedAddresses(json.results);

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

	const updateAdvertHandler = async () => {
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

			if (IOS && editAdvertSavedAddress) {
				validLocation = await LocationSchema.isValid({
					itemLocation: itemLocation,
				});
				validLocation
					? setItemLocationValidate(false)
					: setItemLocationValidate(true);
			}

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

		if (editAdvertManualAddress) {
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

		// if (advertiseToHire && completedStripeOnboarding != 1) {
		// 	let alertConfig = {
		// 		title: 'Wait!',
		// 		message:
		// 			'Please connect the stripe account to your Hire That account so we can protect you and your money.',
		// 		shouldRunFunction: true,
		// 		functionHandler: 'stripeConnectFillUpHandler',
		// 		shouldCallback: () => stripeConnectFillUpHandler(),
		// 	};

		// 	dispatch(presentAlert(alertConfig));
		// 	return;
		// }

		if (advertiseToSale && hasPrimaryCard != 1) {
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
			let obj = {
				_method: 'PUT',
				name: advertTitle,
				is_for_hire: advertiseToHire ? '1' : '0',
				is_for_sale: advertiseToSale ? '1' : '0',
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
				is_manual_address: editAdvertManualAddress ? 1 : 0,
				// location: editAdvertSavedAddress
				// 	? itemLocation != ''
				// 		? itemLocation
				// 		: addressPickerList[0].value
				// 	: manualAddressItemLocation,
				location: editAdvertSavedAddress
					? itemLocation != ''
						? itemLocation
						: addressPickerList[0].value
					: addressFromPostcode != ''
					? addressFromPostcode
					: addressPickerListFromPostcode.length > 0
					? addressPickerListFromPostcode[0].value
					: '',
				// post_code: postcode != '' ? postcode : addressPickerList[0].postcode,
				post_code: editAdvertSavedAddress
					? postcode != ''
						? postcode
						: addressPickerList[0].postcode
					: manualAddressItemLocation,
				latitude:
					editAdvertLatitude != ''
						? editAdvertLatitude
						: addressPickerList[0].lat,
				longitude:
					editAdvertLongitude != ''
						? editAdvertLongitude
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
				availability: availability,
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
			};

			if (
				advertiseToHire &&
				!advertiseToSale &&
				postAdvertMainImage.length > 0
			) {
				obj.main_image = postAdvertMainImage[0];

				// let rnFetchBlobApi = true;
				let advertId = props.route.params.advertId;

				console.log('editAdvert with main_image obj ==> ', obj);
				dispatch(
					updateAdvertApi(
						obj,
						advertId,
						props.navigation,
						// rnFetchBlobApi
					),
				);
			} else {
				// let rnFetchBlobApi = false;
				let advertId = props.route.params.advertId;

				console.log('editAdvert obj ==> ', obj);
				dispatch(
					updateAdvertApi(
						obj,
						advertId,
						props.navigation,
						// rnFetchBlobApi
					),
				);
			}

			if (selectedDatesForMakingUnavailable.length > 0) {
				let advertId = props.route.params.advertId;

				let obj = {
					dates: selectedDatesForMakingUnavailable,
				};

				dispatch(calendarDatesMakingUnavailableApi(advertId, obj));
			}

			if (selectedDatesIdsForMakingAvailable.length > 0) {
				let advertId = props.route.params.advertId;

				let obj = {
					dates: selectedDatesIdsForMakingAvailable,
				};

				dispatch(calendarDateDeleteByIdApi(advertId, obj));
			}
		}
	};

	// const stripeConnectFillUpHandler = () => {
	// 	props.navigation.navigate('WebView');
	// };

	useEffect(() => {
		if (sub_category_error_message != '') {
			setAdvertSubCategoryValidate(true);
			// setAdvertSubCategoryErrorMessage(sub_category_error_message);
			setAdvertSubCategoryErrorMessage('Please select the sub category again');
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
		sub_category_error_message,
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

	// console.log('advertSubCategory ==> ', advertSubCategory);
	// console.log('isSubCategorySetRunOnce ==> ', isSubCategorySetRunOnce);
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
						EDIT ADVERT
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
						validationMessage="Please enter advert title"
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
						img={displayEditAdvertMainImage}
						totalNumberImages={
							getObjectLength(singleAdvert) != 0
								? singleAdvert.photos.length > 9
									? singleAdvert.photos.length
									: '0' + singleAdvert.photos.length
								: null
						}
						onPress={photosModalHandler}
					/>

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
						pickerDefaultValue={singleAdvert.category}
						onValueChange={(advertCategoryValue, advertCategorySelectedId) => {
							setAdvertCategory(advertCategoryValue.toString());
							setAdvertCategorySelectedId(advertCategoryValue.toString());
							setAdvertCategoryValidate(false);
							setClearCategoryPickerDefaultValue(false);
							clearSubCategoryPickerDefaultValueHandler();
							setAdvertSubCategory('');
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
						validationMessage={
							advertSubCategoryErrorMessage != ''
								? advertSubCategoryErrorMessage
								: 'Please select advert sub category'
						}
						pickerResetData={clearSubCategoryPickerDefaultValue}
						pickerDefaultValue={singleAdvert.sub_category}
						onValueChange={(
							advertSubCategoryValue,
							advertSubCategorySelectedId,
						) => {
							setAdvertSubCategory(advertSubCategoryValue.toString());
							setAdvertSubCategoryValidate(false);
							setAdvertSubCategoryErrorMessage('');
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
						onSubmitEditing={(event) => console.log('edit advert 1 finally!!')}
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
							setAge(age);
							setAgeValidate(false);
						}}
						value={age}
					/> */}

					<HTMaterialPicker
						placeholder="E.g 12"
						style={styles.mh10}
						hasError={ageValidate}
						validationMessage="Please select an age"
						// clearItemLocationPickerError={clearItemLocationPickerError}
						pickerDefaultValue={
							singleAdvert.age !== null
								? singleAdvert.age.toString()
								: '--Select--'
						}
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
								console.log('edit advert 2 finally!!')
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
									setEditAdvertSavedAddress(true);
									setEditAdvertManualAddress(false);
								}}>
								<View style={styles.checkboxWrapper}>
									<View style={styles.checkboxWidthStyle}>
										<ShadowView style={styles.checkbox}>
											{editAdvertSavedAddress ? (
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
									setEditAdvertSavedAddress(false);
									setEditAdvertManualAddress(true);
								}}>
								<View style={[props.style, styles.checkboxWrapper]}>
									<View style={styles.checkboxWidthStyle}>
										<ShadowView style={styles.checkbox}>
											{editAdvertManualAddress ? (
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

					{editAdvertSavedAddress ? (
						<HTMaterialPicker
							placeholder="Primary address (EX2 8FF)"
							style={styles.mh10}
							hasError={itemLocationValidate}
							validationMessage="Please select item location"
							clearItemLocationPickerError={clearItemLocationPickerError}
							pickerDefaultValue={
								singleAdvert.is_manual_address === 0
									? singleAdvert.location
									: itemLocation != ''
									? itemLocation
									: '--Select--'
							}
							onValueChange={(pickerSelectedValue, pickerSelectedId) => {
								setItemLocation(pickerSelectedValue);
								setItemLocationValidate(false);
							}}
							value={itemLocation}
							data={addressPickerList.length > 0 ? addressPickerList : []}
						/>
					) : null}

					{editAdvertManualAddress ? (
						// <HTMaterialTextInput
						// 	placeholder="Item location"
						// 	hasError={manualAddressItemLocationValidate}
						// 	validationMessage={'Please enter valid item location'}
						// 	onChangeText={(manualAddressItemLocation) => {
						// 		setManualAddressItemLocation(manualAddressItemLocation);
						// 		setManualAddressItemLocationValidate(false);
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

					<Divider large />

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
								pickerDefaultValue={
									singleAdvert.is_for_collection === 1 ? 'Yes' : 'No'
								}
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
								pickerDefaultValue={
									singleAdvert.is_for_delivery === 1 ? 'Yes' : 'No'
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
						placeholder="Select"
						style={styles.deliveryDistanceStyle}
						hasError={deliveryDistanceValidate}
						validationMessage="Please select delivery distance"
						clearDeliveryDistancePickerError={clearDeliveryDistancePickerError}
						pickerDefaultValue={
							singleAdvert.delivery_distance != null
								? singleAdvert.delivery_distance.toString()
								: 'Unlimited'
						}
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
						// 		: 'Please enter valid (in weight) weight'
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

									<View style={styles.termsOfUseWrapperStyle}>
										<OnlyCheckBox
											screen="EditAdvert"
											onPress={(val) => setPlusVAT(val)}
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
											Plus VAT
										</TextField>
									</View>
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
						pickerDefaultValue={
							singleAdvert.offers_accepted === 1 ? 'Yes' : 'No'
						}
						onValueChange={(offersAcceptedValue, offersAcceptedSelectedId) => {
							setOffersAccepted(offersAcceptedValue);
							setOffersAcceptedValidate(false);
							setForSaleErrorMessage('');
						}}
						value={offersAccepted}
						data={YesNo}
					/>

					<Divider />

					<View style={styles.hireDatesAndClearDatesFlexRowStyle}>
						<View>
							<TextField
								xThin
								letterSpacing={-0.07}
								// lineHeight={18}
								isRLH
								lineHeight={1.8}
								fontFamily={GlobalTheme.fontRegular}
								color={GlobalTheme.black}>
								Availability calendar
							</TextField>

							<TextField
								xThin
								letterSpacing={-0.07}
								// lineHeight={18}
								isRLH
								lineHeight={1.8}
								fontFamily={GlobalTheme.fontRegular}
								color={GlobalTheme.textColor}>
								(Tap dates to make them unavailable or available)
							</TextField>
						</View>

						<TouchableOpacity
							onPress={clearCalendarDatesHandler}
							style={styles.clearDatesStyle}>
							<Icon
								name="refresh"
								size={hp(1.6)}
								style={{top: -2}}
								color={GlobalTheme.primaryColor}
							/>
							<TextField
								small
								letterSpacing={-0.09}
								// lineHeight={18}
								isRLH
								lineHeight={1.8}
								fontFamily={GlobalTheme.fontRegular}
								color={GlobalTheme.primaryColor}>
								Clear dates
							</TextField>
						</TouchableOpacity>
					</View>

					<Divider medium />

					<ShadowView style={styles.shadowCalendarViewStyle}>
						<TextField
							center
							huge
							fontFamily={GlobalTheme.fontBold}
							color={GlobalTheme.black}
							style={{
								position: 'absolute',
								top: hp('2.5%'),
								alignSelf: 'center',
								zIndex: 999,
								elevation: 999,
								// borderWidth: 1,
							}}>
							{calendarHTitle != '' ? calendarHTitle : calendarMonthyear()}
						</TextField>

						<View
							style={{
								top: hp('8.0%'),
								zIndex: 999,
								elevation: 999,
								marginHorizontal: hp('2.0%'),
								borderTopWidth: 0.5,
								borderColor: GlobalTheme.horizontalLineColor,
							}}
						/>

						<Calendar
							markedDates={confirmDatesDisplay}
							style={styles.calendarStyle}
							// Initially visible month. Default = Date()
							current={new Date()}
							// Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
							minDate={new Date()}
							// Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
							maxDate={''}
							// Handler which gets executed on day press. Default = undefined
							onDayPress={(day) => {
								readyForMarkedUnavailableDatesHandler(day);
							}}
							// Handler which gets executed on day long press. Default = undefined
							onDayLongPress={(day) => {
								// console.log('selected day', day);
							}}
							// Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
							monthFormat={'yyyy MM'}
							// Handler which gets executed when visible month changes in calendar. Default = undefined
							onMonthChange={(month) => {
								console.log('month changed', month);
								setMonthChangeValue(month);
								onMonthChangeHandler(month);
							}}
							// Hide month navigation arrows. Default = false
							hideArrows={false}
							// Replace default arrows with custom ones (direction can be 'left' or 'right')
							// renderArrow={(direction) => <Arrow />}
							renderArrow={(direction) => <Arrow direction={direction} />}
							// Do not show days of other months in month page. Default = false
							hideExtraDays={true}
							// If hideArrows=false and hideExtraDays=false do not switch month when tapping on greyed out
							// day from another month that is visible in calendar page. Default = false
							disableMonthChange={false}
							// If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
							firstDay={1}
							// Hide day names. Default = false
							hideDayNames={false}
							// Show week numbers to the left. Default = false
							showWeekNumbers={false}
							// Handler which gets executed when press arrow icon left. It receive a callback can go back month
							onPressArrowLeft={(subtractMonth) => {
								setPressedArrow('left');
								subtractMonth();
							}}
							// Handler which gets executed when press arrow icon right. It receive a callback can go next month
							onPressArrowRight={(addMonth) => {
								setPressedArrow('right');
								addMonth();
							}}
							// Disable left arrow. Default = false
							disableArrowLeft={false}
							// Disable right arrow. Default = false
							disableArrowRight={false}
							// Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates
							disableAllTouchEventsForDisabledDays={true}
							// Replace default month and year title with custom one. the function receive a date as parameter.
							renderHeader={() => {
								/*Return JSX*/
								return null;
							}}
							// Enable the option to swipe between months. Default = false
							enableSwipeMonths={false}
						/>
					</ShadowView>

					<Divider />

					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'space-around',
							alignItems: 'center',
						}}>
						<View
							style={{
								flexDirection: 'row',
								justifyContent: 'flex-start',
								alignItems: 'center',
							}}>
							<View
								style={{
									height: hp('1.0%'),
									width: hp('1.0%'),
									borderRadius: 50,
									backgroundColor: GlobalTheme.black,
								}}
							/>

							<Divider horizontal small />

							<TextField
								xThin
								letterSpacing={-0.07}
								isRLH
								lineHeight={1.8}
								fontFamily={GlobalTheme.fontRegular}
								color={GlobalTheme.textColor}>
								Bookings
							</TextField>
						</View>
						<View
							style={{
								flexDirection: 'row',
								justifyContent: 'flex-start',
								alignItems: 'center',
							}}>
							<View
								style={{
									height: hp('1.4%'),
									width: hp('1.4%'),
									borderRadius: 50,
									backgroundColor: GlobalTheme.validationColor,
								}}
							/>

							<Divider horizontal small />

							<TextField
								xThin
								letterSpacing={-0.07}
								isRLH
								lineHeight={1.8}
								fontFamily={GlobalTheme.fontRegular}
								color={GlobalTheme.textColor}>
								Marked unavailable
							</TextField>
						</View>
					</View>

					<Divider large />

					<Button
						style={styles.mh10}
						title="SAVE CHANGES"
						blackButton
						onPress={updateAdvertHandler}
					/>

					<AddPhotosModal
						screen="EditAdvert"
						advertId={props.route.params.advertId}
						navigation={props.navigation}
						showPhotoModal={photosScreenModal}
						mainImage={singleAdvert.main_image}
						photos={singleAdvert.photos}
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
	hireDatesAndClearDatesFlexRowStyle: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginHorizontal: 10,
		// borderWidth: 1,
	},
	shadowCalendarViewStyle: {
		width: '94%',
		// height: 360,
		height: hp('54.0%'),
		shadowRadius: GlobalTheme.shadowRadius,
		shadowColor: GlobalTheme.black,
		shadowOpacity: 0.28,
		borderWidth: 0.1,
		alignSelf: 'center',
		borderColor: 'transparent',
		backgroundColor: GlobalTheme.white,
		borderRadius: GlobalTheme.viewRadius,
		shadowOffset: {width: 0, height: 6},
	},
	calendarStyle: {
		borderRadius: GlobalTheme.viewRadius,
	},
	clearDatesStyle: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		position: 'absolute',
		right: 0,
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

export {EditAdvert};
