import React, {useState, useEffect} from 'react';
import {View, Modal, StyleSheet, TouchableOpacity} from 'react-native';

import {Picker} from '@react-native-community/picker';
import Icon from 'react-native-vector-icons/Ionicons';
import ShadowView from 'react-native-simple-shadow-view';
import {
	heightPercentageToDP as hp,
	widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {Button} from './Button';
import {IOS} from '../../helper';
import {Divider} from './Divider';
import {TextField} from './TextField';
import {GlobalTheme} from '../theme/GlobalTheme';

import {
	// useSelector,
	useDispatch,
} from 'react-redux';
// import {clearSearchLandingPickerValue} from '../../store/actions/SearchLanding';

const HTPicker = (props) => {
	// const clearSLPickerValue = useSelector(
	// 	(state) => state.searchLanding.clearSearchLandingPickerValue,
	// );

	// const [selectedValue, setSelectedValue] = useState('');
	const [selectedValue, setSelectedValue] = useState('--Select--');
	const [displaySelectedValue, setDisplaySelectedValue] = useState(
		'--Select--',
	);
	const [displayPicker, setDisplayPicker] = useState(false);

	const dispatch = useDispatch();

	const {
		enabled,
		data,
		value,
		onValueChange,
		hasError,
		labelName,
		valueName,
		style,
		defaultValue = '',
		pickerResetData = false,
		validationMessage = null,
	} = props;

	// const items = data.map((item, id) => (
	// 	<Picker.Item
	// 		color={GlobalTheme.black}
	// 		key={id}
	// 		label={item.label}
	// 		value={item.value}
	// 	/>
	// ));

	// useEffect(() => {
	// 	if (IOS && clearSLPickerValue) {
	// 		if (defaultValue != '') {
	// 			setDisplaySelectedValue(defaultValue);
	// 			data.filter((obj) => {
	// 				if (defaultValue == obj.label) {
	// 					setSelectedValue(obj.value);
	// 					props.onValueChange(obj.value, '0');
	// 				}
	// 			});
	// 		}

	// 		dispatch(clearSearchLandingPickerValue(false));
	// 	}
	// }, [clearSLPickerValue]);

	useEffect(() => {
		if (IOS) {
			if (defaultValue != '') {
				setDisplaySelectedValue(defaultValue);
				data.filter((obj) => {
					if (defaultValue == obj.label) {
						setSelectedValue(obj.value);
						props.onValueChange(obj.value, '0');
					}
				});
			}
		}
	}, [defaultValue]);

	const cancelHandler = () => {
		setDisplayPicker(false);
	};

	useEffect(() => {
		if (IOS) {
			if (defaultValue == '' && data.length > 0) {
				// console.log('defaultValue ==  && data.length > 0');
				setDisplaySelectedValue('--Select--');
				setSelectedValue('');
			}
		}
	}, [data, defaultValue]);

	useEffect(() => {
		if (IOS) {
			if (pickerResetData && data.length > 0) {
				setDisplaySelectedValue('--Select--');
				setSelectedValue('');
			}
		}
	}, [pickerResetData, data]);

	// useEffect(() => {
	// 	if (displaySelectedValue != '') {
	// 		if (props.validationMessage === 'Please select advert category') {
	// 			props.clearCategoryPickerError();
	// 		}
	// 	}

	// 	if (props.validationMessage === 'Please select advert sub category') {
	// 		props.clearSubCategoryPickerError();
	// 	}

	// 	if (props.validationMessage === 'Please select item location') {
	// 		props.clearItemLocationPickerError();
	// 	}

	// 	if (props.validationMessage === 'Please select delivery available') {
	// 		props.clearDeliveryAvailablePickerError();
	// 	}

	// 	if (props.validationMessage === 'Please select delivery distance') {
	// 		props.clearDeliveryDistancePickerError();
	// 	}

	// 	if (props.validationMessage === 'Please select offers accepted') {
	// 		props.clearOffersAcceptedPickerError();
	// 	}
	// }, [displaySelectedValue]);

	const confirmHandler = (val) => {
		// console.log('val ==> ', val);

		if (val != '') {
			data.filter((obj) => {
				if (obj.value == val) {
					setDisplaySelectedValue(obj.label);
				}
			});
		} else {
			if (data.length > 0) {
				setDisplaySelectedValue(data[0].label);
				setSelectedValue(data[0].value);
				props.onValueChange(data[0].value, '0');
			}
		}
		setDisplayPicker(false);
	};

	return IOS ? (
		<ShadowView style={styles.iosPickerShadowViewStyle(hasError, enabled)}>
			<TouchableOpacity
				disabled={enabled ? true : false}
				activeOpacity={1}
				onPress={() => setDisplayPicker(true)}>
				<Divider small />

				<TextField
					small
					letterSpacing={-0.07}
					fontFamily={GlobalTheme.fontRegular}
					color={GlobalTheme.black}>
					{displaySelectedValue}
				</TextField>

				<Icon
					name="chevron-down-circle-outline"
					size={hp('1.8%')}
					color={GlobalTheme.primaryColor}
					style={styles.iconIOSStyle(enabled)}
				/>

				<Modal
					animationType="slide-in"
					transparent={true}
					visible={displayPicker}
					style={styles.iosModalView}>
					<View style={styles.iosModalPickerView}>
						<Picker
							// selectedValue={value}
							// onValueChange={onValueChange}
							selectedValue={selectedValue}
							onValueChange={(itemValue, itemPosition) => {
								// console.log('ff ==> ', itemValue, itemPosition);
								setSelectedValue(itemValue);
								props.onValueChange(itemValue, itemPosition);
							}}
							style={styles.iosPickerStyle}>
							{data.map((item) => {
								return (
									<Picker.Item
										key={item.id}
										label={item[labelName ? labelName : 'label']}
										value={item[valueName ? valueName : 'value']}
										color={GlobalTheme.white}
									/>
								);
							})}
						</Picker>

						<View style={styles.iosPickerButtonGroup}>
							<View style={styles.iosPickerButton}>
								<Button title="Cancel" blackButton onPress={cancelHandler} />
							</View>

							<View style={styles.iosPickerButton}>
								<Button
									title="Confirm"
									primaryButton
									onPress={confirmHandler.bind(this, value)}
								/>
							</View>
						</View>
					</View>
				</Modal>
			</TouchableOpacity>
		</ShadowView>
	) : (
		<ShadowView style={styles.shadowViewStyle(hasError, enabled)}>
			{/* <Picker
				selectedValue={selectedValue}
				style={styles.pickerStyle}
				onValueChange={(itemValue, itemPosition) => {
					setSelectedValue(itemValue);
					onValueChange(itemValue, itemPosition);
				}}>
				{items}
			</Picker> */}

			<Picker
				enabled={enabled ? false : true}
				selectedValue={value}
				style={styles.pickerStyle(enabled)}
				onValueChange={onValueChange}>
				{data.map((item) => {
					return (
						<Picker.Item
							key={item.id}
							label={item[labelName ? labelName : 'label']}
							value={item[valueName ? valueName : 'value']}
							color={GlobalTheme.black}
						/>
					);
				})}
			</Picker>

			<Icon
				name="chevron-down-circle-outline"
				size={hp('1.8%')}
				color={GlobalTheme.primaryColor}
				style={styles.iconStyle}
			/>
		</ShadowView>
	);
};

const styles = StyleSheet.create({
	shadowViewStyle: (hasError = false, enabled = false) => ({
		width: '100%',
		// height: 40,
		height: hp('5.2%'),
		shadowColor: GlobalTheme.black,
		shadowRadius: hasError ? null : GlobalTheme.shadowRadius,
		shadowOpacity: 0.28,
		paddingLeft: 15,
		borderWidth: hasError ? 1.5 : 0.1,
		borderRadius: GlobalTheme.viewRadius,
		alignSelf: 'center',
		justifyContent: 'center',
		borderColor: hasError ? GlobalTheme.validationColor : 'transparent',
		backgroundColor: enabled ? GlobalTheme.textColor : GlobalTheme.white,
		shadowOffset: {width: 0, height: 0},
	}),
	pickerStyle: (enabled = false) => ({
		width: '100%',
		// height: 34,
		// width: wp('90%'),
		height: hp('4.4%'),
		color: GlobalTheme.black,
		backgroundColor: enabled ? GlobalTheme.textColor : GlobalTheme.white,
	}),
	iconStyle: {
		position: 'absolute',
		right: 10,
	},
	iosPickerShadowViewStyle: (hasError = false, enabled = false) => ({
		width: '100%',
		height: hp('5.2%'),
		shadowColor: GlobalTheme.black,
		shadowRadius: hasError ? null : GlobalTheme.shadowRadius,
		shadowOpacity: 0.28,
		paddingLeft: 15,
		borderWidth: hasError ? 1.5 : 0.1,
		borderRadius: GlobalTheme.viewRadius,
		alignSelf: 'center',
		justifyContent: 'center',
		borderColor: hasError ? GlobalTheme.validationColor : 'transparent',
		backgroundColor: enabled ? GlobalTheme.textColor : GlobalTheme.white,
		shadowOffset: {width: 0, height: 0},
	}),
	iosModalView: {
		flex: 1,
		// borderWidth: 1,
		// borderColor: 'red',
	},
	iconIOSStyle: (enabled = false) => ({
		position: 'absolute',
		top: hp('0.4%'),
		right: hp('0.5%'),
		backgroundColor: enabled ? GlobalTheme.textColor : GlobalTheme.white,
		// borderWidth: 1,
	}),
	iosModalPickerView: {
		position: 'absolute',
		bottom: 0,
		width: '90%',
		height: '50%',
		alignSelf: 'center',
		// backgroundColor: GlobalTheme.textColor,
		backgroundColor: 'rgba(0,0,0,0.75)',
	},
	iosPickerStyle: {
		flex: 1,
		justifyContent: 'center',
		// borderWidth: 1,
		// borderColor: 'red'
	},
	iosPickerButtonGroup: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		position: 'absolute',
		bottom: 0,
		padding: 20,
		// borderWidth: 1
	},
	iosPickerButton: {
		width: '45%',
		// borderWidth: 1
	},
	iosPickerErrorText: {
		marginHorizontal: 10,
	},
});

export {HTPicker};
