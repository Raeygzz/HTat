import React, {useState, useEffect} from 'react';
import {
	View,
	Image,
	Modal,
	ScrollView,
	StyleSheet,
	ActivityIndicator,
} from 'react-native';

import {useFocusEffect} from '@react-navigation/native';
import ShadowView from 'react-native-simple-shadow-view';
import {useKeyboard} from '@react-native-community/hooks';
import AsyncStorage from '@react-native-community/async-storage';

import {IOS} from '../../helper';
import {GlobalTheme} from '../../components/theme';
import {Distance} from '../../constants/Constant';
import {getObjectLength, seperateCurrencyFromPrice} from '../../utils';
import {
	SelectedSearchSchema,
	PostcodeSchema,
	MilesSchema,
	CategorySchema,
	SubCategorySchema,
} from '../../models/validations/SearchLanding';
import {
	TextField,
	HTTextInput,
	Divider,
	Button,
	FilterSearchHTPicker,
} from '../../components/common';

import {useSelector, useDispatch} from 'react-redux';
import {clearTextInputReq} from '../../store/actions/ClearTextInput';
import {categoriesApi, subCategoriesApi} from '../../store/actions/Categories';
import {
	hideFilterHireSearchItemScreenModal,
	filterSearchItemHireApi,
	searchItemHireApi,
	resetFilterSearchData,
} from '../../store/actions/SearchLanding';

const SearchResultHireFilters = (props) => {
	// const topTabFocusedScreen = useSelector(
	// 	(state) => state.searchLanding.materialTopTabFocusedScreen,
	// );
	const filterSearchCategoriesPickerList = useSelector(
		(state) => state.categories.filterSearchCategoriesPickerList,
	);
	const filterSearchSubCategoriesPickerList = useSelector(
		(state) => state.categories.filterSearchSubCategoriesPickerList,
	);
	const textInputClear = useSelector(
		(state) => state.clearTextInput.textInputClear,
	);
	const modalLoader = useSelector(
		(state) => state.modalLoader.presentModalLoader,
	);
	const filterSearchHireData = useSelector(
		(state) => state.searchLanding.filterSearchHireData,
	);

	const dispatch = useDispatch();

	const [selectedSearch, setSelectedSearch] = useState('');
	const [selectedSearchValidate, setSelectedSearchValidate] = useState(false);

	const [postcode, setPostcode] = useState('');
	const [postcodeValidate, setPostcodeValidate] = useState(false);

	const [latitude, setLatitude] = useState('');
	const [longitude, setLongitude] = useState('');

	const [miles, setMiles] = useState('');
	const [milesValidate, setMilesValidate] = useState(false);

	const [category, setCategory] = useState('');
	const [categoryValidate, setCategoryValidate] = useState(false);

	const [subCategory, setSubCategory] = useState('');
	const [subCategoryValidate, setSubCategoryValidate] = useState(false);

	const [min, setMin] = useState('');
	const [minValidate, setMinValidate] = useState(false);

	const [max, setMax] = useState('');
	const [maxValidate, setMaxValidate] = useState(false);

	const [resetPickerValue, setResetPickerValue] = useState(false);
	const [
		asyncStorageSearchDataMiles,
		setAsyncStorageSearchDataMiles,
	] = useState({});

	const keyboard = useKeyboard();
	const keyboardHeight = keyboard.keyboardHeight;
	const isKeyboardShowing = keyboard.keyboardShown;

	useFocusEffect(
		React.useCallback(() => {
			if (props.showSearchResultHireFilters) {
				if (IOS) {
					setTimeout(() => {
						dispatch(categoriesApi(true));
						// dispatch(subCategoriesApi('1', true));
					}, 300);
				} else {
					dispatch(categoriesApi(true));
					dispatch(subCategoriesApi('1', true));
				}
			}
		}, [props.showSearchResultHireFilters]),
	);

	useEffect(() => {
		if (props.showSearchResultHireFilters) {
			async function fetchSearchDataFromAsyncStorage() {
				try {
					const searchData = await AsyncStorage.getItem('searchData');
					// console.log('searchData ==> ', searchData);
					if (searchData !== '') {
						const parsedSearchData = JSON.parse(searchData);
						// console.log('parsedSearchData ==> ', parsedSearchData);
						setAsyncStorageSearchDataMiles(parsedSearchData);
						setSelectedSearch(parsedSearchData.keyword);
						setPostcode(parsedSearchData.post_code);
						setLatitude(parsedSearchData.latitude);
						setLongitude(parsedSearchData.longitude);
						if (getObjectLength(filterSearchHireData) === 0) {
							setMiles(
								parsedSearchData.distance === null
									? 'Unlimited'
									: parsedSearchData.distance.toString(),
							);
						}
						setSelectedSearchValidate(false);
						setPostcodeValidate(false);
						setMilesValidate(false);
					}
				} catch (e) {
					console.log('Error ==> ', e);
				}
			}

			setResetPickerValue(false);
			fetchSearchDataFromAsyncStorage();
		}
	}, [props.showSearchResultHireFilters]);

	// console.log('setSelectedSearch ==> ', selectedSearch);
	// console.log('setPostcode ==> ', postcode);
	// console.log('setMiles ==> ', miles);

	useEffect(() => {
		if (
			getObjectLength(filterSearchHireData) != 0 &&
			filterSearchCategoriesPickerList.length > 0
		) {
			setMiles(
				filterSearchHireData.distance === null
					? 'Unlimited'
					: filterSearchHireData.distance.toString(),
			);

			if (filterSearchHireData.category_id != null) {
				setCategory(filterSearchHireData.category_id);
			}

			setMin(filterSearchHireData.min_price);
			setMax(filterSearchHireData.max_price);
		}
	}, [filterSearchHireData, filterSearchCategoriesPickerList]);

	useEffect(() => {
		if (filterSearchSubCategoriesPickerList.length > 0) {
			if (filterSearchHireData.sub_category_id != null) {
				setSubCategory(filterSearchHireData.sub_category_id);
			}
		}
	}, [filterSearchSubCategoriesPickerList]);

	useEffect(() => {
		if (
			props.showSearchResultHireFilters &&
			category !== '' &&
			category !== '--Select--' &&
			category !== null
		) {
			dispatch(subCategoriesApi(category, true));
		}
	}, [props.showSearchResultHireFilters, category]);

	const modalCancelHandler = () => {
		dispatch(hideFilterHireSearchItemScreenModal());
	};

	const updateSearchHandler = async () => {
		const validSelectedSearch = await SelectedSearchSchema.isValid({
			selectedSearch: selectedSearch,
		});
		validSelectedSearch
			? setSelectedSearchValidate(false)
			: setSelectedSearchValidate(true);

		// const validPostcode = await PostcodeSchema.isValid({postcode: postcode});
		// validPostcode ? setPostcodeValidate(false) : setPostcodeValidate(true);

		if (postcode.length < 6 || postcode.length > 8) {
			setPostcodeValidate(true);
		}

		const validMiles = await MilesSchema.isValid({miles: miles});
		validMiles ? setMilesValidate(false) : setMilesValidate(true);

		// const validCategory = await CategorySchema.isValid({category: category});
		// validCategory ? setCategoryValidate(false) : setCategoryValidate(true);

		// const validSubCategory = await SubCategorySchema.isValid({
		// 	subCategory: subCategory,
		// });
		// validSubCategory
		// 	? setSubCategoryValidate(false)
		// 	: setSubCategoryValidate(true);

		if (
			validSelectedSearch &&
			// validPostcode &&
			postcode.length >= 6 &&
			postcode.length < 9 &&
			validMiles
			// && validCategory &&
			// validSubCategory
		) {
			let obj = {
				keyword: selectedSearch,
				category_id:
					category != '' && category != '--Select--' ? category : null,
				sub_category_id:
					subCategory !== '' && subCategory !== '--Select--'
						? subCategory
						: null,
				// post_code: postcode,
				latitude: latitude,
				longitude: longitude,
				distance: miles === 'Unlimited' ? null : parseInt(miles),
				min_price: seperateCurrencyFromPrice(min),
				max_price: seperateCurrencyFromPrice(max),
				sort_by: null,
			};

			dispatch(filterSearchItemHireApi(1, obj, true));
		}
	};

	useEffect(() => {
		if (textInputClear) {
			// setSelectedSearch('');
			// setPostcode('');
			// setMiles('');
			setCategory('');
			setSubCategory('');
			setMin('');
			setMax('');

			console.log('== 3 ==');
			dispatch(clearTextInputReq(false));
		}
	}, [textInputClear]);

	const resetSearchHandler = () => {
		// setSelectedSearch('');
		// setPostcode('');
		// setMiles('');
		if (IOS) {
			setCategory('');
			setSubCategory('');
			setResetPickerValue(true);
		} else {
			setCategory(filterSearchCategoriesPickerList[0].value);
			setSubCategory(filterSearchSubCategoriesPickerList[0].value);
		}
		setMin('');
		setMax('');
		dispatch(resetFilterSearchData());

		let obj = {
			keyword: selectedSearch,
			post_code: postcode,
			latitude: latitude,
			longitude: longitude,
			distance:
				asyncStorageSearchDataMiles.distance != null
					? parseInt(asyncStorageSearchDataMiles.distance)
					: null,
		};

		dispatch(searchItemHireApi(1, obj, '', true));
	};

	return (
		<Modal
			statusBarTranslucent
			animationType="fade"
			transparent={true}
			visible={props.showSearchResultHireFilters}>
			<View style={styles.modal}>
				<View style={styles.shadowViewStyle(isKeyboardShowing, keyboardHeight)}>
					<View style={styles.headerStyle}>
						<TextField
							regular
							letterSpacing={-0.1}
							// lineHeight={18}
							isRLH
							lineHeight={2.1}
							fontFamily={GlobalTheme.fontRegular}
							color={GlobalTheme.white}
							style={styles.textCloseStyle}
							onPress={modalCancelHandler}>
							Close
						</TextField>

						<TextField
							regular
							letterSpacing={-0.1}
							// lineHeight={18}
							isRLH
							lineHeight={2.1}
							fontFamily={GlobalTheme.fontBold}
							color={GlobalTheme.white}
							style={styles.textFilterSearchStyle}>
							Filter Search
						</TextField>
					</View>

					<ScrollView
						showsVerticalScrollIndicator={false}
						contentContainerStyle={styles.ph44}>
						<Divider xLarge />

						<HTTextInput
							editable
							placeholder="Enter a term, example 'digger'"
							iconName="search"
							value={selectedSearch}
							hasError={selectedSearchValidate}
							onChangeText={(selectedSearch) => {
								setSelectedSearch(selectedSearch);
								setSelectedSearchValidate(false);
							}}
						/>

						<Divider xxxMedium />

						<View style={styles.twoInputsStyle}>
							<HTTextInput
								editable
								// textInputWidth={140}
								textInputWidth={'55%'}
								placeholder="Postcode"
								iconName="location-searching"
								iconLibrary="MaterialIcons"
								value={postcode}
								hasError={postcodeValidate}
								onChangeText={(postcode) => {
									setPostcode(postcode);
									setPostcodeValidate(false);
								}}
							/>

							<View style={styles.distancePickerWidth}>
								<FilterSearchHTPicker
									placeholder="Select distance"
									hasError={milesValidate}
									defaultValue={miles}
									// pickerResetData={resetPickerValue}
									onValueChange={(milesValue, milesSelectedId) => {
										// console.log('milesValue ==> ', milesValue, milesSelectedId);
										setMiles(milesValue);
										setMilesValidate(false);
									}}
									value={miles}
									data={Distance.length > 0 ? Distance : []}
								/>
							</View>
						</View>

						<Divider />

						<TextField
							regular
							// lineHeight={23}
							isRLH
							lineHeight={2.3}
							fontFamily={GlobalTheme.fontBold}
							color={GlobalTheme.black}>
							CATEGORY
						</TextField>

						<Divider medium />

						<FilterSearchHTPicker
							placeholder="Select a category"
							hasError={categoryValidate}
							defaultValue={
								category != '' && category != null ? category : '--Select--'
							}
							pickerResetData={resetPickerValue}
							onValueChange={(pickerSelectedValue, pickerSelectedId) => {
								setCategory(pickerSelectedValue.toString());
								setCategoryValidate(false);
							}}
							value={category}
							data={
								filterSearchCategoriesPickerList.length > 0
									? filterSearchCategoriesPickerList
									: []
							}
						/>

						<Divider />

						<FilterSearchHTPicker
							placeholder="Select a sub category"
							hasError={subCategoryValidate}
							defaultValue={
								subCategory != '' && subCategory != null
									? subCategory
									: '--Select--'
							}
							pickerResetData={resetPickerValue}
							onValueChange={(pickerSelectedValue, pickerSelectedId) => {
								setSubCategory(pickerSelectedValue.toString());
								setSubCategoryValidate(false);
							}}
							value={subCategory}
							data={
								filterSearchSubCategoriesPickerList.length > 0
									? filterSearchSubCategoriesPickerList
									: []
							}
						/>

						<Divider />

						<View style={styles.textPriceRangeStyle}>
							<TextField
								regular
								// lineHeight={23}
								isRLH
								lineHeight={2.3}
								fontFamily={GlobalTheme.fontBold}
								color={GlobalTheme.black}>
								PRICE RANGE
							</TextField>

							<Divider horizontal medium />

							<TextField
								xThin
								letterSpacing={-0.07}
								// lineHeight={18}
								isRLH
								lineHeight={1.8}
								fontFamily={GlobalTheme.fontRegular}
								color={GlobalTheme.textColor}>
								per day
							</TextField>
						</View>

						<Divider medium />

						<View style={styles.twoSmallInputStyle}>
							<HTTextInput
								// textInputWidth={107}
								textInputWidth={'42%'}
								placeholder="No min"
								position="left"
								iconName="pound"
								iconLibrary="Foundation"
								value={min}
								// hasError={minValidate}
								onChangeText={(min) => {
									setMin(min);
									// setMinValidate(false);
								}}
							/>

							<TextField
								regular
								letterSpacing={-0.1}
								// lineHeight={18}
								isRLH
								lineHeight={1.8}
								fontFamily={GlobalTheme.fontBold}
								color={GlobalTheme.black}>
								to
							</TextField>

							<HTTextInput
								// textInputWidth={107}
								textInputWidth={'42%'}
								placeholder="No max"
								position="left"
								iconName="pound"
								iconLibrary="Foundation"
								value={max}
								// hasError={maxValidate}
								onChangeText={(max) => {
									setMax(max);
									// setMaxValidate(false);
								}}
							/>
						</View>

						<Divider xLarge />

						<Button
							title="UPDATE SEARCH"
							blackButton
							onPress={updateSearchHandler}
						/>

						<Divider xLarge />

						<View style={styles.resetSearchWrapperStyle}>
							<Image
								source={require('../../assets/image/icon/reset.png')}
								resizeMode="contain"
								style={styles.resetImageStyle}
							/>

							<Divider horizontal small />

							<TextField
								regular
								letterSpacing={-0.1}
								// lineHeight={18}
								isRLH
								lineHeight={2.1}
								fontFamily={GlobalTheme.fontRegular}
								color={GlobalTheme.primaryColor}
								onPress={resetSearchHandler}>
								Reset search
							</TextField>
						</View>

						<Divider xxLarge />
					</ScrollView>
				</View>

				<Modal animationType="fade" transparent={true} visible={modalLoader}>
					<View style={styles.searchFilterLoaderModalStyle}>
						<ActivityIndicator
							animating={true}
							size="large"
							color={GlobalTheme.black}
						/>
					</View>
				</Modal>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modal: {
		flex: 1,
		// borderWidth: 1,
		// borderColor: 'green',
		// backgroundColor: 'rgba(0,0,0,0.25)',
	},
	shadowViewStyle: (isKeyboardShowing, keyboardHeight) => ({
		width: '90%',
		height: '66%',
		shadowRadius: GlobalTheme.shadowRadius,
		shadowColor: GlobalTheme.black,
		shadowOpacity: 0.28,
		borderWidth: 0.1,
		position: 'absolute',
		bottom: !isKeyboardShowing ? 0 : keyboardHeight,
		alignSelf: 'center',
		backgroundColor: GlobalTheme.white,
		borderRadius: GlobalTheme.viewRadius,
		shadowOffset: {width: 0, height: 6},
		elevation: 44,
		// borderWidth: 1,
		// borderColor: 'blue',
	}),
	headerStyle: {
		width: '100%',
		height: 49,
		backgroundColor: GlobalTheme.primaryColor,
		borderTopLeftRadius: GlobalTheme.viewRadius,
		borderTopRightRadius: GlobalTheme.viewRadius,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	textCloseStyle: {
		width: '40%',
		paddingLeft: 20,
		// borderWidth: 1,
		// borderColor: '#fff',
	},
	textFilterSearchStyle: {
		width: '60%',
		// borderWidth: 1,
	},
	ph44: {
		paddingHorizontal: 44,
	},
	twoInputsStyle: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		// borderWidth: 1,
	},
	distancePickerWidth: {
		width: '40%',
	},
	textPriceRangeStyle: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	twoSmallInputStyle: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	resetSearchWrapperStyle: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	resetImageStyle: {
		width: 17,
		height: 19,
	},
	searchFilterLoaderModalStyle: {
		width: '90%',
		height: '66%',
		justifyContent: 'center',
		backgroundColor: 'rgba(0,0,0,0.04)',
		borderRadius: GlobalTheme.viewRadius,
		position: 'absolute',
		bottom: 0,
		alignSelf: 'center',
		// borderWidth: 1,
	},
});

export {SearchResultHireFilters};
