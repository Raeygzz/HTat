import React, {useState, useEffect} from 'react';
import {
	View,
	Image,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
} from 'react-native';

import {useFocusEffect} from '@react-navigation/native';

import {GlobalTheme} from '../components/theme';
import {HireFilters} from './modals/HireFilters';
import {AllHiringCard} from '../components/allHiring/AllHiringCard';
import {GenericView, Header, Divider, TextField} from '../components/common';
import {
	changeTwoDatesToFormattedDate,
	findNumberOfDaysFromTwoDates,
	closeToBottom,
} from '../utils';

import {useSelector, useDispatch} from 'react-redux';
import {headerTitle} from '../store/actions/Header';
import {
	hiringListApi,
	hiringByIdApi,
	presentHireFilterScreenModal,
} from '../store/actions/Hire';
import {
	calendarUnavailableDateListApi,
	resetOnlyCalendarFromStore,
} from '../store/actions/Adverts';

const AllHiring = (props) => {
	const hiringList = useSelector((state) => state.hire.hiringList);
	const hiringTotalItem = useSelector((state) => state.hire.hiringMeta.total);
	const hiringCurrentPage = useSelector(
		(state) => state.hire.hiringMeta.current_page,
	);
	const hiringLastPage = useSelector(
		(state) => state.hire.hiringMeta.last_page,
	);
	const hireFilter = useSelector(
		(state) => state.hire.presentHireFilterScreenModal,
	);

	const [displayHiringList, setDisplayHiringList] = useState([]);
	const [runAllHiringPagination, setRunAllHiringPagination] = useState(false);

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
			dispatch(hiringListApi(1));
		}, []),
	);

	useEffect(() => {
		if (runAllHiringPagination) {
			setRunAllHiringPagination(false);
			dispatch(hiringListApi(hiringCurrentPage + 1));
		}
	}, [runAllHiringPagination]);

	useEffect(() => {
		if (hiringList.length > 0) {
			setDisplayHiringList(hiringList);
		}
	}, [hiringList]);

	const hireFilterHandler = () => {
		dispatch(presentHireFilterScreenModal());
	};

	const hiringByIdHandler = (item) => {
		dispatch(resetOnlyCalendarFromStore());
		dispatch(hiringByIdApi(item, props.navigation));
		dispatch(calendarUnavailableDateListApi(item.item.id));
	};

	const filterTypeHandler = (val) => {
		// console.warn('val ==> ', val);

		if (val === '2') {
			let ascendingSort = hiringList.sort(
				(a, b) => parseFloat(a.total_price) - parseFloat(b.total_price),
			);

			// console.log('ascendingSort ==> ', ascendingSort);
			setDisplayHiringList(ascendingSort);
			//
		} else if (val === '3') {
			let descendingSort = hiringList.sort(
				(a, b) => parseFloat(b.total_price) - parseFloat(a.total_price),
			);

			// console.log('descendingSort ==> ', descendingSort);
			setDisplayHiringList(descendingSort);
			//
		} else if (val === '4') {
			let alphabeticalSort = hiringList.sort(function (a, b) {
				let firstItem = a.item.name.toLowerCase();
				let secondItem = b.item.name.toLowerCase();

				if (firstItem < secondItem) return -1;
				if (firstItem > secondItem) return 1;
				return 0;
			});

			// console.log('alphabeticalSort ==> ', alphabeticalSort);
			setDisplayHiringList(alphabeticalSort);
		}
	};

	const allHirings =
		displayHiringList.length > 0
			? displayHiringList.map((item, id) => (
					<AllHiringCard
						key={id}
						onPress={hiringByIdHandler.bind(this, item)}
						image={item.item.main_image}
						productName={item.item.name}
						days={findNumberOfDaysFromTwoDates(item.start_date, item.end_date)}
						date={changeTwoDatesToFormattedDate(item.start_date, item.end_date)}
						providedBy={item.item.provided_by}
					/>
			  ))
			: null;
	return (
		<GenericView isBackgroundColor>
			<>
				<Header isBackArrow title="Back" />
				<ScrollView
					style={styles.mainView}
					onScroll={({nativeEvent}) => {
						if (
							closeToBottom(nativeEvent) &&
							hiringCurrentPage < hiringLastPage
						) {
							// console.log('hiringCurrentPage ==> ', hiringCurrentPage);
							// console.log('hiringLastPage ==> ', hiringLastPage);
							setRunAllHiringPagination(true);
						}
					}}>
					{/* <Divider xxMedium /> */}

					<Divider xxxHuge />

					<TextField
						title
						letterSpacing={-0.32}
						lineHeight={26}
						fontFamily={GlobalTheme.fontBlack}
						color={GlobalTheme.primaryColor}
						style={styles.ph10}>
						HIRING
					</TextField>

					<Divider xxMedium />

					<View style={styles.itemsAndFiltersRowStyle}>
						<TextField
							small
							letterSpacing={-0.22}
							lineHeight={20}
							fontFamily={GlobalTheme.fontRegular}
							color={GlobalTheme.black}>
							{hiringTotalItem > 9 ? hiringTotalItem : '0' + hiringTotalItem}{' '}
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

					{allHirings}

					{/* <AllHiringOutCard
						// onPress={() => props.navigation.navigate('ViewAdvert')}
						image={require('../assets/image/1.jpg')}
						productName="2013 Hitachi ZX27-3 mini digger"
						date="7th - 8th Sept"
						days="2 days"
						name="Trevor Jones"
						delivery="Delivery"
						ff="EX2 8FF"
					/> */}

					<HireFilters
						navigation={props.navigation}
						show={hireFilter}
						filterType={filterTypeHandler}
					/>
				</ScrollView>
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

export {AllHiring};
