import React, {useState, useEffect} from 'react';
import {ScrollView, StyleSheet} from 'react-native';

import {showMessage} from 'react-native-flash-message';
import {useFocusEffect} from '@react-navigation/native';
import {
	heightPercentageToDP as hp,
	widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {GlobalTheme} from '../components/theme';
import {MyAdvertCard} from '../components/myAdverts/MyAdvertCard';
import {GenericView, Header, Divider, TextField} from '../components/common';
import {
	formatToSentenceDateWithsufix,
	getObjectLength,
	closeToBottom,
} from '../utils/Utils';

import {useSelector, useDispatch} from 'react-redux';
import {headerTitle} from '../store/actions/Header';
import {
	advertListApi,
	advertByIdApi,
	calendarUnavailableDateListApi,
	advertDeleteSuccess,
	advertDeletingObject,
	resetOnlyCalendarFromStore,
} from '../store/actions/Adverts';

const AllAdverts = (props) => {
	const advertList = useSelector((state) => state.adverts.advertList);
	const lastPage = useSelector((state) => state.adverts.advertMeta.last_page);
	const advertTotalItem = useSelector(
		(state) => state.adverts.advertMeta.total,
	);
	const currentPage = useSelector(
		(state) => state.adverts.advertMeta.current_page,
	);
	const singleAdvert = useSelector((state) => state.adverts.singleAdvert);
	const deleteAdvertSuccess = useSelector(
		(state) => state.adverts.deleteAdvertSuccess,
	);
	const deletingAdvertObject = useSelector(
		(state) => state.adverts.deletingAdvertObject,
	);

	const [runAllAdvertPagination, setRunAllAdvertPagination] = useState(false);

	const dispatch = useDispatch();

	useFocusEffect(
		React.useCallback(() => {
			let headerConfig = {
				isBackArrow: true,
				leftTitle: 'Back',
				isRightContent: true,
				rightTitle: 'Post Advert',
				navParam: 'PostAdvert',
			};

			dispatch(headerTitle(headerConfig));
			dispatch(advertListApi(1));
		}, []),
	);

	useEffect(() => {
		if (runAllAdvertPagination) {
			setRunAllAdvertPagination(false);
			dispatch(advertListApi(currentPage + 1));
		}
	}, [runAllAdvertPagination]);

	useEffect(() => {
		if (deleteAdvertSuccess && getObjectLength(deletingAdvertObject) != 0) {
			if (deletingAdvertObject.is_for_sale === 1) {
				showMessage({
					message: 'Weekly sales charge will be stopped for this item',
					floating: true,
					position: {
						top: hp('15%'),
					},
					type: 'default',
					backgroundColor: GlobalTheme.textColor,
					color: GlobalTheme.white,
				});
			}

			dispatch(advertDeletingObject({}));
			dispatch(advertDeleteSuccess(false));
		}
	}, [deleteAdvertSuccess, deletingAdvertObject]);

	const singleAdvertHandler = (item) => {
		dispatch(resetOnlyCalendarFromStore());
		dispatch(advertByIdApi(item.id, props.navigation, 'AllAdverts'));
		dispatch(calendarUnavailableDateListApi(item.id));
	};

	const myAdvertList =
		advertList.length > 0
			? advertList.map((item, id) => (
					<MyAdvertCard
						key={id}
						onPress={singleAdvertHandler.bind(this, item)}
						image={item.main_image}
						name={item.name}
						date={formatToSentenceDateWithsufix(item.created_at)}
						pd={`£${item?.least_price !== null ? item?.least_price : '_'}`}
						// pw={`£${item?.most_price !== null ? item?.most_price : '_'}`}
						// pd={`£${item.per_day_price !== null ? item.per_day_price : '_'}`}
						// pw={`£${item.per_week_price !== null ? item.per_week_price : '_'}`}
						sale={item.is_for_sale}
						pause={item.pause === 0 ? false : true}
					/>
			  ))
			: null;

	const totalAdvertList =
		advertTotalItem > 9 ? advertTotalItem : '0' + advertTotalItem;
	return (
		<GenericView isBackgroundColor>
			<>
				<Header
					// isBackArrow
					// title="Back"
					// isHeaderRightContent
					// rightTitle="Post Advert"
					// navParam="PostAdvert"
					screenName={props.route.name}
				/>
				<ScrollView
					style={styles.mainView}
					onScroll={({nativeEvent}) => {
						if (closeToBottom(nativeEvent) && currentPage < lastPage) {
							setRunAllAdvertPagination(true);
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
						MY ADVERTS
					</TextField>

					<Divider xxMedium />

					<TextField
						small
						letterSpacing={-0.22}
						lineHeight={20}
						fontFamily={GlobalTheme.fontRegular}
						color={GlobalTheme.black}
						style={styles.ph10}>
						{totalAdvertList} items
					</TextField>

					<Divider xxMedium />

					{advertList.length > 0 ? (
						myAdvertList
					) : (
						<TextField
							center
							title
							lineHeight={26}
							fontFamily={GlobalTheme.fontRegular}
							color={GlobalTheme.black}>
							No Data Found
						</TextField>
					)}

					{/* <MyAdvertCard
						onPress={() => props.navigation.navigate('ViewAdvert')}
						image={require('../assets/image/1.jpg')}
						name="2013 Hitachi ZX27-3 mini digger"
						date="September 14th"
						pd="£80"
						pw="£360"
						sale="Yes"
					/>

					<MyAdvertCard
						onPress={() => props.navigation.navigate('ViewAdvert')}
						image={require('../assets/image/3.jpeg')}
						name="Kubota KH007 micro excavator"
						date="September 14th"
						pd="£80"
						pw="£360"
						sale="Yes"
					/>

					<MyAdvertCard
						onPress={() => props.navigation.navigate('ViewAdvert')}
						image={require('../assets/image/4.jpg')}
						name="JCB 8026 Compact Excavator"
						date="September 14th"
						pd="£80"
						pw="£360"
						sale="Yes"
					/>

					<MyAdvertCard
						onPress={() => props.navigation.navigate('ViewAdvert')}
						image={require('../assets/image/1.jpg')}
						name="2013 Hitachi ZX27-3 mini digger"
						date="September 14th"
						pd="£80"
						pw="£360"
						sale="Yes"
					/>

					<MyAdvertCard
						onPress={() => props.navigation.navigate('ViewAdvert')}
						image={require('../assets/image/3.jpeg')}
						name="Kubota KH007 micro excavator"
						date="September 14th"
						pd="£80"
						pw="£360"
						sale="Yes"
					/>

					<MyAdvertCard
						onPress={() => props.navigation.navigate('ViewAdvert')}
						image={require('../assets/image/4.jpg')}
						name="JCB 8026 Compact Excavator"
						date="September 14th"
						pd="£80"
						pw="£360"
						sale="Yes"
					/> */}
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
});

export {AllAdverts};
