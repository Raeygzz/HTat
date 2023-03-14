import React, {useState, useEffect} from 'react';
import {
	View,
	Image,
	Modal,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	ActivityIndicator,
} from 'react-native';

// import {useFocusEffect} from '@react-navigation/native';
import ShadowView from 'react-native-simple-shadow-view';
import AsyncStorage from '@react-native-community/async-storage';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

import {GlobalTheme} from '../../components/theme';
import {TextField, Divider, Button} from '../../components/common';
import {getObjectLength, seperateCurrencyFromPrice} from '../../utils';

import {useDispatch, useSelector} from 'react-redux';
import {
	filterSearchItemHireApi,
	filterSearchItemBuyApi,
	hideSearchItemSortScreenModal,
} from '../../store/actions/SearchLanding';

const SearchItemSortModal = (props) => {
	const topTabFocusedScreen = useSelector(
		(state) => state.searchLanding.materialTopTabFocusedScreen,
	);
	const modalLoader = useSelector(
		(state) => state.modalLoader.presentModalLoader,
	);
	const filterSearchHireData = useSelector(
		(state) => state.searchLanding.filterSearchHireData,
	);
	const filterSearchBuyData = useSelector(
		(state) => state.searchLanding.filterSearchBuyData,
	);

	const [keyword, setKeyword] = useState('');
	const [postcode, setPostcode] = useState('');
	const [latitude, setLatitude] = useState('');
	const [longitude, setLongitude] = useState('');
	const [distance, setDistance] = useState('');
	const [category, setCategory] = useState('');
	const [subCategory, setSubCategory] = useState('');
	const [minPrice, setMinPrice] = useState('');
	const [maxPrice, setMaxPrice] = useState('');
	const [sorting, setSorting] = useState('');

	const [distanceSortSelected, setDistanceSortSelected] = useState(false);
	const [priceSortSelected, setPriceSortSelected] = useState(false);

	const dispatch = useDispatch();

	// useFocusEffect(
	// 	React.useCallback(() => {
	// 		if (props.sortModalShow) {
	// 			if (getObjectLength(filterSearchData) != 0) {
	// 				setKeyword(filterSearchData.keyword);
	// 				setPostcode(filterSearchData.post_code);
	// 				setDistance(filterSearchData.distance);
	// 				setCategory(filterSearchData.category_id);
	// 				setSubCategory(filterSearchData.sub_category_id);
	// 				setMinPrice(filterSearchData.min_price);
	// 				setMaxPrice(filterSearchData.max_price);
	// 			} else {
	// 				async function fetchSearchDataFromAsyncStorage() {
	// 					try {
	// 						const searchData = await AsyncStorage.getItem('searchData');
	// 						// console.log('searchData ==> ', searchData);
	// 						if (searchData !== '') {
	// 							const parsedSearchData = JSON.parse(searchData);
	// 							// console.log('parsedSearchData ==> ', parsedSearchData);
	// 							setKeyword(parsedSearchData.keyword);
	// 							setPostcode(parsedSearchData.post_code);
	// 							setDistance(parsedSearchData.distance);
	// 							setCategory(null);
	// 							setSubCategory(null);
	// 							setMinPrice('');
	// 							setMaxPrice('');
	// 						}
	// 					} catch (e) {
	// 						console.log('Error ==> ', e);
	// 					}
	// 				}

	// 				fetchSearchDataFromAsyncStorage();
	// 			}

	// 			setDistanceSortSelected(false);
	// 			setPriceSortSelected(false);
	// 		}
	// 	}, [props.sortModalShow]),
	// );

	useEffect(() => {
		if (props.sortModalShow) {
			if (
				topTabFocusedScreen === 'Hire' &&
				getObjectLength(filterSearchHireData) != 0
			) {
				setKeyword(filterSearchHireData.keyword);
				setPostcode(filterSearchHireData.post_code);
				setLatitude(filterSearchHireData.latitude);
				setLongitude(filterSearchHireData.longitude);
				setDistance(filterSearchHireData.distance);
				setCategory(filterSearchHireData.category_id);
				setSubCategory(filterSearchHireData.sub_category_id);
				setMinPrice(filterSearchHireData.min_price);
				setMaxPrice(filterSearchHireData.max_price);
				//
			} else if (
				topTabFocusedScreen === 'Buy' &&
				getObjectLength(filterSearchBuyData) != 0
			) {
				setKeyword(filterSearchBuyData.keyword);
				setPostcode(filterSearchBuyData.post_code);
				setLatitude(filterSearchBuyData.latitude);
				setLongitude(filterSearchBuyData.longitude);
				setDistance(filterSearchBuyData.distance);
				setCategory(filterSearchBuyData.category_id);
				setSubCategory(filterSearchBuyData.sub_category_id);
				setMinPrice(filterSearchBuyData.min_price);
				setMaxPrice(filterSearchBuyData.max_price);
				//
			} else {
				async function fetchSearchDataFromAsyncStorage() {
					try {
						const searchData = await AsyncStorage.getItem('searchData');
						// console.log('searchData ==> ', searchData);
						if (searchData !== '') {
							const parsedSearchData = JSON.parse(searchData);
							// console.log('parsedSearchData ==> ', parsedSearchData);
							setKeyword(parsedSearchData.keyword);
							setPostcode(parsedSearchData.post_code);
							setLatitude(parsedSearchData.latitude);
							setLongitude(parsedSearchData.longitude);
							setDistance(parsedSearchData.distance);
							setCategory(null);
							setSubCategory(null);
							setMinPrice('');
							setMaxPrice('');
						}
					} catch (e) {
						console.log('Error ==> ', e);
					}
				}

				fetchSearchDataFromAsyncStorage();
			}

			setDistanceSortSelected(false);
			setPriceSortSelected(false);
		}
	}, [props.sortModalShow]);

	// console.log('keyword ==> ', keyword);
	// console.log('postcode ==> ', postcode);
	// console.log('distance ==> ', distance);
	// console.log('category ==> ', category);
	// console.log('subCategory ==> ', subCategory);
	// console.log('minPrice ==> ', minPrice);
	// console.log('maxPrice ==> ', maxPrice);
	// console.log('sorting ==> ', sorting);

	const modalCancelHandler = () => {
		dispatch(hideSearchItemSortScreenModal());
	};

	const sortResultHandler = (sortVal) => {
		if (sortVal != '' && sortVal === 'distance') {
			setDistanceSortSelected(true);
			setPriceSortSelected(false);
			setSorting(sortVal);
		}

		if (sortVal != '' && sortVal === 'price') {
			setDistanceSortSelected(false);
			setPriceSortSelected(true);
			setSorting(sortVal);
		}
	};

	const updateSortHandler = () => {
		if (distanceSortSelected || priceSortSelected) {
			let sortObj = {
				keyword: keyword,
				// post_code: postcode,
				latitude: latitude,
				longitude: longitude,
				distance: distance != null ? parseInt(distance) : null,
				category_id: category,
				sub_category_id: subCategory,
				min_price: seperateCurrencyFromPrice(minPrice),
				max_price: seperateCurrencyFromPrice(maxPrice),
				sort_by: sorting,
			};

			if (topTabFocusedScreen === 'Hire') {
				dispatch(filterSearchItemHireApi(1, sortObj, true));
			}

			if (topTabFocusedScreen === 'Buy') {
				dispatch(filterSearchItemBuyApi(1, sortObj, true));
			}
		}
	};

	return (
		<Modal
			statusBarTranslucent
			animationType="fade"
			transparent={true}
			visible={props.sortModalShow}>
			<ShadowView style={styles.modal}>
				<View style={styles.shadowViewStyle}>
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
							Sort results
						</TextField>
					</View>

					<ScrollView
						showsVerticalScrollIndicator={false}
						contentContainerStyle={styles.ph12}>
						<Divider xxLarge />

						<View style={styles.horizontalLineStyle} />

						<TouchableOpacity
							style={styles.sortingTextWrapperStyle}
							onPress={sortResultHandler.bind(this, 'distance')}>
							<TextField
								small
								isRLH
								lineHeight={4.4}
								fontFamily={GlobalTheme.fontMedium}
								color={GlobalTheme.black}>
								By distance (nearest first)
							</TextField>

							{distanceSortSelected ? (
								<Image
									source={require('../../assets/image/icon/tick.png')}
									style={styles.tickIconStyle}
								/>
							) : null}
						</TouchableOpacity>

						<View style={styles.horizontalLineStyle} />

						<TouchableOpacity
							style={styles.sortingTextWrapperStyle}
							onPress={sortResultHandler.bind(this, 'price')}>
							<TextField
								small
								isRLH
								lineHeight={4.4}
								fontFamily={GlobalTheme.fontMedium}
								color={GlobalTheme.black}>
								{`${
									topTabFocusedScreen === 'Hire' ? 'Hire' : 'Sale'
								} price (lowest first)`}
							</TextField>

							{priceSortSelected ? (
								<Image
									source={require('../../assets/image/icon/tick.png')}
									style={styles.tickIconStyle}
								/>
							) : null}
						</TouchableOpacity>

						<Divider
							borderTopWidth={0.5}
							color={GlobalTheme.horizontalLineColor}
						/>

						<Divider xLarge />

						<Button
							title="UPDATE RESULTS"
							blackButton
							onPress={updateSortHandler}
						/>

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
			</ShadowView>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modal: {
		flex: 1,
	},
	shadowViewStyle: {
		width: '94%',
		height: '36%',
		shadowRadius: GlobalTheme.shadowRadius,
		shadowColor: GlobalTheme.black,
		shadowOpacity: 0.28,
		borderWidth: 0.1,
		position: 'absolute',
		bottom: 0,
		alignSelf: 'center',
		backgroundColor: GlobalTheme.white,
		borderRadius: GlobalTheme.viewRadius,
		shadowOffset: {width: 0, height: 6},
		// elevation: 44,
	},
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
	ph12: {
		paddingHorizontal: 12,
	},
	horizontalLineStyle: {
		borderTopWidth: 0.4,
		color: GlobalTheme.horizontalLineColor,
	},
	sortingTextWrapperStyle: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	tickIconStyle: {
		width: hp('1.8%'),
		height: hp('1.8%'),
		// borderWidth: 1
	},
	searchFilterLoaderModalStyle: {
		width: '94%',
		height: '36%',
		justifyContent: 'center',
		backgroundColor: 'rgba(0,0,0,0.04)',
		borderRadius: GlobalTheme.viewRadius,
		position: 'absolute',
		bottom: 0,
		alignSelf: 'center',
		// borderWidth: 1,
	},
});

export {SearchItemSortModal};
