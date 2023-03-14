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
import {HireCard} from '../components/hire/HireCard';
import {TextField, Divider, NoData} from '../components/common';
import {SearchResultHireFilters, SearchItemSortModal} from './modals';
import {
	closeToBottom,
	getObjectLength,
	firstLetterUppercase,
	removeDuplicateElement,
} from '../utils';

import {useSelector, useDispatch} from 'react-redux';
import {hireItemByIdApi, resetOnlyHireBuyStore} from '../store/actions/Hire';
import {
	calendarUnavailableDateListApi,
	resetOnlyCalendarFromStore,
} from '../store/actions/Adverts';
import {
	nearMeHireApi,
	searchItemHireApi,
	filterSearchItemHireApi,
	materialTopTabFocusedScreen,
	presentSearchItemSortScreenModal,
	presentFilterHireSearchItemScreenModal,
} from '../store/actions/SearchLanding';

const Hire = (props) => {
	const filterSearchItemScreenModal = useSelector(
		(state) => state.searchLanding.presentFilterHireSearchItemScreenModal,
	);
	const searchItemSortScreenModal = useSelector(
		(state) => state.searchLanding.presentSearchItemSortScreenModal,
	);
	const hireSearchItem = useSelector(
		(state) => state.searchLanding.isHireSearchItem,
	);
	const hireSearchTotalItem = useSelector(
		(state) => state.searchLanding.hireMeta.total,
	);
	const hireSearchItemCurrentPage = useSelector(
		(state) => state.searchLanding.hireMeta.current_page,
	);
	const hireSearchItemLastPage = useSelector(
		(state) => state.searchLanding.hireMeta.last_page,
	);
	const filterSearchHireData = useSelector(
		(state) => state.searchLanding.filterSearchHireData,
	);
	const filterSearchHireApiPaginationEnabled = useSelector(
		(state) => state.searchLanding.filterSearchHireApiPaginationEnabled,
	);
	const nearMeHireApiPaginationEnabled = useSelector(
		(state) => state.searchLanding.nearMeHireApiPaginationEnabled,
	);
	const showFilterNSort = useSelector(
		(state) => state.searchLanding.showFilterNSort,
	);

	const [selectedSearch, setSelectedSearch] = useState('');
	const [postcode, setPostcode] = useState('');
	const [latitude, setLatitude] = useState('');
	const [longitude, setLongitude] = useState('');
	const [miles, setMiles] = useState('');
	const [filterSearchHireDataBody, setFilterSearchHireDataBody] = useState({});
	const [nextHireDataFromApi, setNextHireDataFromApi] = useState(false);

	const dispatch = useDispatch();

	useFocusEffect(
		React.useCallback(() => {
			// console.log('==hire top tab pressed==');
			analytics().logEvent('hire_top_tab_pressed');

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
		dispatch(presentFilterHireSearchItemScreenModal());
	};

	const sortHandler = () => {
		dispatch(presentSearchItemSortScreenModal());
	};

	useEffect(() => {
		if (getObjectLength(filterSearchHireData) != 0) {
			setFilterSearchHireDataBody(filterSearchHireData);
		}
	}, [filterSearchHireData]);

	const selectedHireItemHandler = (item) => {
		dispatch(resetOnlyHireBuyStore());
		dispatch(resetOnlyCalendarFromStore());
		dispatch(hireItemByIdApi(item.id, props.navigation));
		dispatch(calendarUnavailableDateListApi(item.id));
		props.navigation.navigate('HireItemDetail', {
			hireItemId: item.id,
			distance: item.distance,
		});
	};

	// const searchResults =
	// 	hireSearchItem.length > 0
	// 		? hireSearchItem.map((item, index) => {
	// 				return (
	// 					<HireCard
	// 						key={item.id}
	// 						onPress={selectedHireItemHandler.bind(this, item)}
	// 						image={item.main_image}
	// 						name={item.name}
	// 						price={item.per_day_price}
	// 						buyingPrice={item.selling_price}
	// 						distance={`${item.distance} miles`}
	// 					/>
	// 				);
	// 		  })
	// 		: null;

	const renderHireCustomItem = ({item, index}) => {
		return (
			<HireCard
				key={item.id}
				onPress={selectedHireItemHandler.bind(this, item)}
				image={item.main_image}
				name={item.name}
				price={item.least_price}
				// price={item.per_day_price}
				buyingPrice={item.selling_price}
				distance={`${item.distance} miles`}
			/>
		);
	};

	const loadHireMoreData = () => {
		if (
			// closeToBottom(nativeEvent) &&
			hireSearchItemCurrentPage < hireSearchItemLastPage
		) {
			// console.log('hireSearchItemCurrentPage ==> ', hireSearchItemCurrentPage)
			// console.log('hireSearchItemLastPage ==> ', hireSearchItemLastPage);
			setNextHireDataFromApi(true);
		}
	};

	useEffect(() => {
		if (nextHireDataFromApi) {
			setNextHireDataFromApi(false);
			if (nearMeHireApiPaginationEnabled) {
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
					nearMeHireApi(hireSearchItemCurrentPage + 1, obj, props.navigation),
				);
				//
			} else if (filterSearchHireApiPaginationEnabled) {
				// dispatch(
				// 	filterSearchItemApi(
				// 		hireSearchItemCurrentPage + 1,
				// 		filterSearchHireDataBody,
				// 	),
				// );

				dispatch(
					filterSearchItemHireApi(
						hireSearchItemCurrentPage + 1,
						filterSearchHireDataBody,
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

				dispatch(searchItemHireApi(hireSearchItemCurrentPage + 1, obj));
			}
		}
	}, [nextHireDataFromApi]);

	const totalSearchItem =
		hireSearchTotalItem > 9 ? hireSearchTotalItem : '0' + hireSearchTotalItem;

	return (
		<View style={styles.mainView}>
			<Divider />

			<View style={styles.resultsAndFiltersStyle}>
				<TextField
					small
					center
					// lineHeight={20}
					isRLH
					lineHeight={2.0}
					fontFamily={GlobalTheme.fontRegular}
					color={GlobalTheme.black}>
					{totalSearchItem} results found
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
								// lineHeight={20}
								isRLH
								lineHeight={2.0}
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
								// lineHeight={20}
								isRLH
								lineHeight={2.0}
								fontFamily={GlobalTheme.fontBold}
								color={GlobalTheme.primaryColor}>
								{getObjectLength(filterSearchHireData) != 0 &&
								filterSearchHireData.sort_by != null
									? firstLetterUppercase(`${filterSearchHireData.sort_by} Sort`)
									: 'Sort'}
							</TextField>
						</TouchableOpacity>
					</View>
				)}
			</View>

			<Divider xxMedium />

			{/* searchResults */}
			<FlatList
				// ListHeaderComponent={
				// 	<>
				// 		<Divider />

				// 		<View style={styles.resultsAndFiltersStyle}>
				// 			<TextField
				// 				small
				// 				center
				// 				// lineHeight={20}
				// 				isRLH
				// 				lineHeight={2.0}
				// 				fontFamily={GlobalTheme.fontRegular}
				// 				color={GlobalTheme.black}>
				// 				{totalSearchItem} results found
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
				// 						// lineHeight={20}
				// 						isRLH
				// 						lineHeight={2.0}
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
				// 						// lineHeight={20}
				// 						isRLH
				// 						lineHeight={2.0}
				// 						fontFamily={GlobalTheme.fontBold}
				// 						color={GlobalTheme.primaryColor}>
				// 						{getObjectLength(filterSearchHireData) != 0 &&
				// 						filterSearchHireData.sort_by != null
				// 							? firstLetterUppercase(
				// 									`${filterSearchHireData.sort_by} Sort`,
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
					hireSearchItem.length > 0
						? removeDuplicateElement(hireSearchItem)
						: []
				}
				renderItem={renderHireCustomItem}
				keyExtractor={(item, index) => item.id.toString()}
				onEndReachedThreshold={IOS ? 0 : 0.5}
				onEndReached={loadHireMoreData}
				ListEmptyComponent={<NoData title="No Data Found" />}
			/>

			<SearchResultHireFilters
				navigation={props.navigation}
				showSearchResultHireFilters={filterSearchItemScreenModal}
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
		// borderWidth: 1,
		// borderColor: 'red',
	},
});

export {Hire};
