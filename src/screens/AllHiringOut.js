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

import {IOS} from '../helper';
import {GlobalTheme} from '../components/theme';
import {HireFilters} from './modals/HireFilters';
import {AllHiringOutCard} from '../components/allHiringOut/AllHiringOutCard';
import {
	GenericView,
	Header,
	Divider,
	TextField,
	NoData,
} from '../components/common';
import {
	changeTwoDatesToFormattedDate,
	findNumberOfDaysFromTwoDates,
	closeToBottom,
} from '../utils';

import {useSelector, useDispatch} from 'react-redux';
import {headerTitle} from '../store/actions/Header';
import {
	hiringOutListApi,
	presentHireFilterScreenModal,
} from '../store/actions/Hire';
import {
	advertByIdFromHiringOutApi,
	calendarUnavailableDateListApi,
	resetOnlyCalendarFromStore,
} from '../store/actions/Adverts';

const AllHiringOut = (props) => {
	const hiringOutList = useSelector((state) => state.hire.hiringOutList);
	const hiringOutTotalItem = useSelector(
		(state) => state.hire.hiringOutMeta.total,
	);
	const hiringOutCurrentPage = useSelector(
		(state) => state.hire.hiringOutMeta.current_page,
	);
	const hiringOutLastPage = useSelector(
		(state) => state.hire.hiringOutMeta.last_page,
	);
	const hireFilter = useSelector(
		(state) => state.hire.presentHireFilterScreenModal,
	);

	const [displayHiringOutList, setDisplayHiringOutList] = useState([]);

	const dispatch = useDispatch();

	useFocusEffect(
		React.useCallback(() => {
			let headerConfig = {
				isBackArrow: true,
				leftTitle: 'Back',
				isRightContent: false,
				rightTitle: '',
				navParam: '',
			};

			dispatch(headerTitle(headerConfig));
			dispatch(hiringOutListApi(1));
		}, []),
	);

	useEffect(() => {
		if (hiringOutList.length > 0) {
			setDisplayHiringOutList(hiringOutList);
		}
	}, [hiringOutList]);

	const hireFilterHandler = () => {
		dispatch(presentHireFilterScreenModal());
	};

	const filterTypeHandler = (val) => {
		// console.warn('val ==> ', val);

		if (val === '2') {
			let ascendingSort = hiringOutList.sort(
				(a, b) => parseFloat(a.total_price) - parseFloat(b.total_price),
			);

			// console.log('ascendingSort ==> ', ascendingSort);
			setDisplayHiringOutList(ascendingSort);
			//
		} else if (val === '3') {
			let descendingSort = hiringOutList.sort(
				(a, b) => parseFloat(b.total_price) - parseFloat(a.total_price),
			);

			// console.log('descendingSort ==> ', descendingSort);
			setDisplayHiringOutList(descendingSort);
			//
		} else if (val === '4') {
			let alphabeticalSort = hiringOutList.sort(function (a, b) {
				let firstItem = a.item.name.toLowerCase();
				let secondItem = b.item.name.toLowerCase();

				if (firstItem < secondItem) return -1;
				if (firstItem > secondItem) return 1;
				return 0;
			});

			// console.log('alphabeticalSort ==> ', alphabeticalSort);
			setDisplayHiringOutList(alphabeticalSort);
		}
	};

	const hiringOutByIdHandler = (item) => {
		dispatch(resetOnlyCalendarFromStore());
		dispatch(
			advertByIdFromHiringOutApi(item, props.navigation, 'AllHiringOut'),
		);
		dispatch(calendarUnavailableDateListApi(item.item.id));
	};

	// const allHiringOuts =
	// displayHiringOutList.length > 0
	// 	? displayHiringOutList.map((item, id) => (
	// 			<AllHiringOutCard
	// 				key={id}
	// 				onPress={hiringOutByIdHandler.bind(this, item)}
	// 				image={item.item.main_image}
	// 				productName={item.item.name}
	// 				date={changeTwoDatesToFormattedDate(item.start_date, item.end_date)}
	// 				days={findNumberOfDaysFromTwoDates(item.start_date, item.end_date)}
	// 				name={item.hiree.name}
	// 				delivery={
	// 					item.collection_type.charAt(0).toUpperCase() +
	// 					item.collection_type.slice(1)
	// 				}
	// 				ff={item.delivery.post_code}
	// 			/>
	// 	  ))
	// 	: null;

	const renderAllHiringOutCustomItem = ({item, index}) => {
		return (
			<AllHiringOutCard
				key={item.id}
				onPress={hiringOutByIdHandler.bind(this, item)}
				image={item.item.main_image}
				productName={item.item.name}
				date={changeTwoDatesToFormattedDate(item.start_date, item.end_date)}
				days={findNumberOfDaysFromTwoDates(item.start_date, item.end_date)}
				name={item.hiree.name}
				delivery={
					item.collection_type.charAt(0).toUpperCase() +
					item.collection_type.slice(1)
				}
				ff={item.delivery.post_code}
			/>
		);
	};

	const loadAllHiringOutMoreData = () => {
		if (
			// closeToBottom(nativeEvent) &&
			hiringOutCurrentPage < hiringOutLastPage
		) {
			// console.log('hiringOutCurrentPage ==> ', hiringOutCurrentPage);
			// console.log('hiringOutLastPage ==> ', hiringOutLastPage);
			dispatch(hiringOutListApi(hiringOutCurrentPage + 1));
		}
	};

	return (
		<GenericView isBackgroundColor>
			<>
				<Header isBackArrow title="Back" />
				<View style={styles.mainView}>
					{/* <ScrollView
					style={styles.mainView}
					onScroll={({nativeEvent}) => {
						if (
							closeToBottom(nativeEvent) &&
							hiringOutCurrentPage < hiringOutLastPage
						) {
							// console.log('hiringOutCurrentPage ==> ', hiringOutCurrentPage);
							// console.log('hiringOutLastPage ==> ', hiringOutLastPage);
							dispatch(hiringOutListApi(hiringOutCurrentPage + 1));
						}
					}}> */}

					{/* allHiringOuts */}
					<FlatList
						ListHeaderComponent={
							<>
								{/* <Divider xxMedium /> */}

								<Divider xxxHuge />

								<TextField
									title
									letterSpacing={-0.32}
									lineHeight={26}
									fontFamily={GlobalTheme.fontBlack}
									color={GlobalTheme.primaryColor}
									style={styles.ph10}>
									HIRING OUT
								</TextField>

								<Divider xxMedium />

								<View style={styles.itemsAndFiltersRowStyle}>
									<TextField
										small
										letterSpacing={-0.22}
										lineHeight={20}
										fontFamily={GlobalTheme.fontRegular}
										color={GlobalTheme.black}>
										{hiringOutTotalItem > 9
											? hiringOutTotalItem
											: '0' + hiringOutTotalItem}{' '}
										items
									</TextField>

									<TouchableOpacity
										style={styles.filtersRowStyle}
										onPress={hireFilterHandler}>
										<Image
											source={require('../assets/image/icon/filters.png')}
											style={styles.filtersImageStyle}
										/>

										<Divider horizontal small />

										<TextField
											small
											letterSpacing={-0.22}
											lineHeight={20}
											fontFamily={GlobalTheme.fontBold}
											color={GlobalTheme.primaryColor}>
											Filters
										</TextField>
									</TouchableOpacity>
								</View>

								<Divider xxMedium />
							</>
						}
						showsVerticalScrollIndicator={false}
						data={displayHiringOutList.length > 0 ? displayHiringOutList : []}
						renderItem={renderAllHiringOutCustomItem}
						keyExtractor={(item, index) => item.id.toString()}
						onEndReachedThreshold={IOS ? 0 : 0.5}
						onEndReached={loadAllHiringOutMoreData}
						ListEmptyComponent={<NoData title="No Data Found" />}
					/>

					<HireFilters
						navigation={props.navigation}
						show={hireFilter}
						filterType={filterTypeHandler}
					/>
					{/* </ScrollView> */}
				</View>
			</>
		</GenericView>
	);
};

const styles = StyleSheet.create({
	mainView: {
		flex: 1,
		// borderWidth: 1,
		// borderColor: 'red',
	},
	ph10: {
		paddingHorizontal: 10,
	},
	itemsAndFiltersRowStyle: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 10,
		// borderWidth: 1,
	},
	filtersRowStyle: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		// borderWidth: 1,
	},
	filtersImageStyle: {
		width: 28,
		height: 28,
		resizeMode: 'cover',
		// borderWidth: 1,
		// borderColor: 'magenta',
	},
});

export {AllHiringOut};
