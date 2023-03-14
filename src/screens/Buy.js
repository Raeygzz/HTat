import React, {useState, useEffect} from 'react';
import {
	View,
	Image,
	FlatList,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
} from 'react-native';

import {useFocusEffect} from '@react-navigation/native';
import analytics from '@react-native-firebase/analytics';
import AsyncStorage from '@react-native-community/async-storage';
import {
	heightPercentageToDP as hp,
	widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {IOS} from '../helper';
import {GlobalTheme} from '../components/theme';
import {BuyCard} from '../components/buy/BuyCard';
import {TextField, Divider, NoData} from '../components/common';
import {SearchResultBuyFilters, SearchItemSortModal} from './modals';
import {
	closeToBottom,
	getObjectLength,
	firstLetterUppercase,
	removeDuplicateElement,
} from '../utils';

import {useSelector, useDispatch} from 'react-redux';
import {hireItemByIdApi} from '../store/actions/Hire';
import {resetOnlyHireBuyStore} from '../store/actions/Buy';
import {
	nearMeBuyApi,
	searchItemBuyApi,
	filterSearchItemBuyApi,
	materialTopTabFocusedScreen,
	presentSearchItemSortScreenModal,
	presentFilterBuySearchItemScreenModal,
} from '../store/actions/SearchLanding';

const Buy = (props) => {
	const filterSearchItemScreenModalFromBuy = useSelector(
		(state) => state.searchLanding.presentFilterBuySearchItemScreenModal,
	);
	const searchItemSortScreenModal = useSelector(
		(state) => state.searchLanding.presentSearchItemSortScreenModal,
	);
	const saleSearchItem = useSelector(
		(state) => state.searchLanding.isSaleSearchItem,
	);
	const saleSearchTotalItem = useSelector(
		(state) => state.searchLanding.saleMeta.total,
	);
	const saleSearchItemCurrentPage = useSelector(
		(state) => state.searchLanding.saleMeta.current_page,
	);
	const saleSearchItemLastPage = useSelector(
		(state) => state.searchLanding.saleMeta.last_page,
	);
	const filterSearchBuyData = useSelector(
		(state) => state.searchLanding.filterSearchBuyData,
	);
	const filterSearchSaleApiPaginationEnabled = useSelector(
		(state) => state.searchLanding.filterSearchSaleApiPaginationEnabled,
	);
	const nearMeBuyApiPaginationEnabled = useSelector(
		(state) => state.searchLanding.nearMeBuyApiPaginationEnabled,
	);
	const showFilterNSort = useSelector(
		(state) => state.searchLanding.showFilterNSort,
	);

	const [selectedSearch, setSelectedSearch] = useState('');
	const [postcode, setPostcode] = useState('');
	const [latitude, setLatitude] = useState('');
	const [longitude, setLongitude] = useState('');
	const [miles, setMiles] = useState('');
	const [filterSearchBuyDataBody, setFilterSearchBuyDataBody] = useState({});
	const [nextBuyDataFromApi, setNextBuyDataFromApi] = useState(false);

	const dispatch = useDispatch();

	useFocusEffect(
		React.useCallback(() => {
			// console.log('==buy top tab pressed==');
			analytics().logEvent('buy_top_tab_pressed');

			dispatch(materialTopTabFocusedScreen(props.route.name));

			async function fetchSearchDataFromAsyncStorage() {
				try {
					const searchData = await AsyncStorage.getItem('searchData');
					if (searchData !== '' && searchData !== null) {
						const parsedSearchData = JSON.parse(searchData);
						setSelectedSearch(parsedSearchData.keyword);
						setPostcode(parsedSearchData.post_code);
						setLatitude(parsedSearchData.latitude);
						setLongitude(parsedSearchData.longitude);
						setMiles(parsedSearchData.distance);
					}
				} catch (e) {
					console.log('Error ==> ', e);
				}
			}

			fetchSearchDataFromAsyncStorage();
		}, []),
	);

	const searchFilterHandler = () => {
		dispatch(presentFilterBuySearchItemScreenModal());
	};

	const sortHandler = () => {
		dispatch(presentSearchItemSortScreenModal());
	};

	useEffect(() => {
		if (getObjectLength(filterSearchBuyData) != 0) {
			setFilterSearchBuyDataBody(filterSearchBuyData);
		}
	}, [filterSearchBuyData]);

	const selelctedBuyCardHandler = (item) => {
		dispatch(resetOnlyHireBuyStore());
		dispatch(hireItemByIdApi(item.id, props.navigation));
		props.navigation.navigate('BuyItemDetail', {
			distance: item.distance,
		});
	};

	// const buySearchResults =
	// 	saleSearchItem.length > 0
	// 		? saleSearchItem.map((item, index) => {
	// 				return (
	// 					<BuyCard
	// 						key={item.id}
	// 						onPress={selelctedBuyCardHandler.bind(this, item)}
	// 						image={item.main_image}
	// 						name={item.name}
	// 						price={item.per_day_price}
	// 						buyingPrice={item.selling_price}
	// 						distance={`${item.distance} miles`}
	// 					/>
	// 				);
	// 		  })
	// 		: null;

	const renderBuyCustomItem = ({item, index}) => {
		return (
			<BuyCard
				key={item.id}
				onPress={selelctedBuyCardHandler.bind(this, item)}
				image={item.main_image}
				name={item.name}
				price={item.least_price}
				// price={item.per_day_price}
				buyingPrice={item.selling_price}
				distance={`${item.distance} miles`}
			/>
		);
	};

	const loadBuyMoreData = () => {
		if (
			// closeToBottom(nativeEvent) &&
			saleSearchItemCurrentPage < saleSearchItemLastPage
		) {
			// console.log('saleSearchItemCurrentPage ==> ', saleSearchItemCurrentPage)
			// console.log('saleSearchItemLastPage ==> ', saleSearchItemLastPage);
			setNextBuyDataFromApi(true);
		}
	};

	useEffect(() => {
		if (nextBuyDataFromApi) {
			setNextBuyDataFromApi(false);
			if (nearMeBuyApiPaginationEnabled) {
				let obj = {
					// latitude: 50.695874,
					// longitude: -3.537021,
					// latitude: 50.70038,
					// longitude: -3.4822,
					latitude: latitude,
					longitude: longitude,
				};

				// console.log('obj ==> ', obj);

				dispatch(
					nearMeBuyApi(saleSearchItemCurrentPage + 1, obj, props.navigation),
				);
				//
			} else if (filterSearchSaleApiPaginationEnabled) {
				// dispatch(
				// 	filterSearchItemApi(
				// 		saleSearchItemCurrentPage + 1,
				// 		filterSearchBuyDataBody,
				// 	),
				// );
				dispatch(
					filterSearchItemBuyApi(
						saleSearchItemCurrentPage + 1,
						filterSearchBuyDataBody,
					),
				);
			} else {
				let obj = {
					keyword: selectedSearch,
					post_code: postcode,
					latitude: latitude,
					longitude: longitude,
					distance: miles,
				};

				dispatch(searchItemBuyApi(saleSearchItemCurrentPage + 1, obj));
			}
		}
	}, [nextBuyDataFromApi]);

	const totalSaleSearchItem =
		saleSearchTotalItem > 9 ? saleSearchTotalItem : '0' + saleSearchTotalItem;
	return (
		<View style={styles.mainView}>
			<Divider />

			<View style={styles.resultsAndFiltersStyle}>
				<TextField
					small
					center
					lineHeight={20}
					fontFamily={GlobalTheme.fontRegular}
					color={GlobalTheme.black}>
					{totalSaleSearchItem} results found
				</TextField>

				{showFilterNSort && (
					<View style={styles.filterNSortWrapper}>
						<TouchableOpacity
							style={styles.filtersStyle}
							onPress={searchFilterHandler}>
							<Image
								source={require('../assets/image/icon/filters.png')}
								resizeMode="contain"
								style={styles.imageStyle}
							/>

							<TextField
								small
								center
								lineHeight={20}
								fontFamily={GlobalTheme.fontBold}
								color={GlobalTheme.primaryColor}>
								Filters
							</TextField>
						</TouchableOpacity>

						<Divider horizontal />

						<TouchableOpacity style={styles.filtersStyle} onPress={sortHandler}>
							<Image
								source={require('../assets/image/icon/sort.png')}
								resizeMode="contain"
								style={styles.imageStyle}
							/>

							<TextField
								small
								center
								lineHeight={20}
								fontFamily={GlobalTheme.fontBold}
								color={GlobalTheme.primaryColor}>
								{getObjectLength(filterSearchBuyData) != 0 &&
								filterSearchBuyData.sort_by != null
									? firstLetterUppercase(`${filterSearchBuyData.sort_by} Sort`)
									: 'Sort'}
							</TextField>
						</TouchableOpacity>
					</View>
				)}
			</View>

			<Divider xxMedium />

			{/* buySearchResults */}
			<FlatList
				// ListHeaderComponent={
				// 	<>
				// 		<Divider />

				// 		<View style={styles.resultsAndFiltersStyle}>
				// 			<TextField
				// 				small
				// 				center
				// 				lineHeight={20}
				// 				fontFamily={GlobalTheme.fontRegular}
				// 				color={GlobalTheme.black}>
				// 				{totalSaleSearchItem} results found
				// 			</TextField>

				// 			<View style={styles.filterNSortWrapper}>
				// 				<TouchableOpacity
				// 					style={styles.filtersStyle}
				// 					onPress={searchFilterHandler}>
				// 					<Image
				// 						source={require('../assets/image/icon/filters.png')}
				// 						resizeMode="contain"
				// 						style={styles.imageStyle}
				// 					/>

				// 					<TextField
				// 						small
				// 						center
				// 						lineHeight={20}
				// 						fontFamily={GlobalTheme.fontBold}
				// 						color={GlobalTheme.primaryColor}>
				// 						Filters
				// 					</TextField>
				// 				</TouchableOpacity>

				// 				<Divider horizontal />

				// 				<TouchableOpacity
				// 					style={styles.filtersStyle}
				// 					onPress={sortHandler}>
				// 					<Image
				// 						source={require('../assets/image/icon/sort.png')}
				// 						resizeMode="contain"
				// 						style={styles.imageStyle}
				// 					/>

				// 					<TextField
				// 						small
				// 						center
				// 						lineHeight={20}
				// 						fontFamily={GlobalTheme.fontBold}
				// 						color={GlobalTheme.primaryColor}>
				// 						{getObjectLength(filterSearchBuyData) != 0 &&
				// 						filterSearchBuyData.sort_by != null
				// 							? firstLetterUppercase(
				// 									`${filterSearchBuyData.sort_by} Sort`,
				// 							  )
				// 							: 'Sort'}
				// 					</TextField>
				// 				</TouchableOpacity>
				// 			</View>
				// 		</View>

				// 		<Divider xxMedium />
				// 	</>
				// }
				showsVerticalScrollIndicator={false}
				data={
					saleSearchItem.length > 0
						? removeDuplicateElement(saleSearchItem)
						: []
				}
				renderItem={renderBuyCustomItem}
				keyExtractor={(item, index) => item.id.toString()}
				onEndReachedThreshold={IOS ? 0 : 0.5}
				onEndReached={loadBuyMoreData}
				ListEmptyComponent={<NoData title="No Data Found" />}
			/>

			<SearchResultBuyFilters
				navigation={props.navigation}
				showSearchResultBuyFilters={filterSearchItemScreenModalFromBuy}
			/>

			<SearchItemSortModal
				navigation={props.navigation}
				sortModalShow={searchItemSortScreenModal}
			/>

			{/* <Divider /> */}
			{/* </ScrollView> */}
		</View>
	);
};

const styles = StyleSheet.create({
	mainView: {
		flex: 1,
		backgroundColor: GlobalTheme.white,
		// borderWidth: 1,
	},
	resultsAndFiltersStyle: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingLeft: 10,
		paddingRight: 12,
		// borderWidth: 1,
	},
	filterNSortWrapper: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		// borderWidth: 1,
	},
	filtersStyle: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		// borderWidth: 1,
	},
	imageStyle: {
		width: hp('3.1%'),
		height: hp('3.1%'),
		// resizeMode: 'center',
	},
});

export {Buy};
