import React, {useState} from 'react';
import {View, Modal, ScrollView, StyleSheet} from 'react-native';

import {useFocusEffect} from '@react-navigation/native';
import ShadowView from 'react-native-simple-shadow-view';

import {GlobalTheme} from '../../components/theme';
import {HireFilter} from '../../constants/Constant';
import {TextField, Divider, Button, HTPicker} from '../../components/common';

import {useDispatch} from 'react-redux';
import {hideHireFilterScreenModal} from '../../store/actions/Hire';

const HireFilters = (props) => {
	const [filterType, setFilterType] = useState('');
	const [filterTypeValidate, setFilterTypeValidate] = useState(false);

	const dispatch = useDispatch();

	useFocusEffect(
		React.useCallback(() => {
			if (props.show) {
			}
		}, [props.show]),
	);

	const modalCancelHandler = () => {
		dispatch(hideHireFilterScreenModal());
	};

	const updateFilterHandler = () => {
		props.filterType(filterType);
		dispatch(hideHireFilterScreenModal());
	};

	return (
		<Modal
			statusBarTranslucent
			animationType="fade"
			transparent={true}
			visible={props.show}>
			<View style={styles.modal}>
				<View style={styles.shadowViewStyle}>
					<View style={styles.headerStyle}>
						<TextField
							regular
							letterSpacing={-0.1}
							lineHeight={18}
							fontFamily={GlobalTheme.fontRegular}
							color={GlobalTheme.white}
							style={styles.textCloseStyle}
							onPress={modalCancelHandler}>
							Close
						</TextField>

						<TextField
							regular
							letterSpacing={-0.1}
							lineHeight={18}
							fontFamily={GlobalTheme.fontBold}
							color={GlobalTheme.white}
							style={styles.textFilterSearchStyle}>
							Hire Filter Search
						</TextField>
					</View>

					<ScrollView
						showsVerticalScrollIndicator={false}
						contentContainerStyle={styles.ph44}>
						<Divider xxxHuge />

						<HTPicker
							placeholder="Select filter method"
							hasError={filterTypeValidate}
							onValueChange={(filterTypeValue, filterTypeSelectedId) => {
								setFilterType(filterTypeValue);
							}}
							value={filterType}
							data={HireFilter}
						/>

						<Divider xxxHuge />

						<Button
							title="UPDATE HIRE FILTER SEARCH"
							blackButton
							onPress={updateFilterHandler}
						/>

						<Divider xxxHuge />
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
		// backgroundColor: 'rgba(0,0,0,0.25)',
	},
	shadowViewStyle: {
		width: '90%',
		height: '45%',
		// shadowRadius: GlobalTheme.shadowRadius,
		// shadowColor: GlobalTheme.black,
		// shadowOpacity: 0.28,
		// borderWidth: 0.1,
		position: 'absolute',
		bottom: 0,
		alignSelf: 'center',
		// borderColor: 'transparent',
		backgroundColor: GlobalTheme.white,
		borderRadius: GlobalTheme.viewRadius,
		// shadowOffset: {width: 0, height: 6},
		elevation: 44,
		// borderWidth: 1,
		// borderColor: 'blue',
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
	ph44: {
		paddingHorizontal: 44,
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
});

export {HireFilters};
