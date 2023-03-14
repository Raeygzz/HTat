import React, {useState, useEffect} from 'react';
import {View, Modal, StyleSheet, TouchableOpacity} from 'react-native';

import {Picker} from '@react-native-community/picker';
import Icon from 'react-native-vector-icons/Ionicons';
import {
	heightPercentageToDP as hp,
	widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {Button} from './Button';
import {IOS} from '../../helper';
import {Divider} from './Divider';
import {TextField} from './TextField';
import {GlobalTheme} from '../theme/GlobalTheme';

const HTMaterialPicker = (props) => {
	const [selectedValue, setSelectedValue] = useState('--Select--');
	const [displaySelectedValue, setDisplaySelectedValue] = useState(
		'--Select--',
	);
	const [displayPicker, setDisplayPicker] = useState(false);

	const {
		enabled,
		data,
		value,
		onValueChange,
		hasError,
		labelName,
		valueName,
		style,
		pickerResetData = false,
		pickerDefaultValue = '',
		validationMessage = null,
	} = props;

	// console.log('materialPickerProps ==> ', props);

	const cancelHandler = () => {
		setDisplayPicker(false);
	};

	useEffect(() => {
		if (IOS) {
			if (pickerDefaultValue === '' && data.length > 0) {
				// console.log('pickerDefaultValue ==> ', pickerDefaultValue);
				setDisplaySelectedValue('--Select--');
				setSelectedValue('');
			}
		}
	}, [pickerDefaultValue, data]);

	useEffect(() => {
		if (IOS) {
			if (pickerResetData && data.length > 0) {
				// console.log('pickerResetData ==> ', pickerResetData);
				setDisplaySelectedValue('--Select--');
				setSelectedValue('');
			}
		}
	}, [pickerResetData, data]);

	useEffect(() => {
		if (IOS) {
			if (props.validationMessage === 'Please select advert category') {
				props.clearCategoryPickerError();
			}

			if (props.validationMessage === 'Please select advert sub category') {
				props.clearSubCategoryPickerError();
			}

			if (props.validationMessage === 'Please select item location') {
				props.clearItemLocationPickerError();
			}

			if (props.validationMessage === 'Please select collection available') {
				props.clearCollectionAvailablePickerError();
			}

			if (props.validationMessage === 'Please select delivery available') {
				props.clearDeliveryAvailablePickerError();
			}

			if (props.validationMessage === 'Please select delivery distance') {
				props.clearDeliveryDistancePickerError();
			}

			if (props.validationMessage === 'Please select offers accepted') {
				props.clearOffersAcceptedPickerError();
			}
		}
	}, [validationMessage]);

	useEffect(() => {
		if (IOS) {
			if (pickerDefaultValue != '') {
				setDisplaySelectedValue(pickerDefaultValue);
				data.filter((obj) => {
					if (pickerDefaultValue == obj.label) {
						setSelectedValue(obj.value);
						// props.onValueChange(obj.value, '0');
						props.onValueChange(obj.value, obj.id);
					}
				});
			}
		}
	}, [pickerDefaultValue]);

	const confirmHandler = (val) => {
		// console.log('val ==> ', val);
		// console.log('data ==> ', data);

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
		<TouchableOpacity
			disabled={enabled ? true : false}
			activeOpacity={1}
			onPress={() => setDisplayPicker(true)}>
			<>
				<View style={styles.iosPickerView(enabled)}>
					<Divider xxMedium />

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
				</View>

				{props.hasError ? (
					<TextField
						xThin
						letterSpacing={-0.07}
						lineHeight={18}
						fontFamily={GlobalTheme.fontRegular}
						color={GlobalTheme.validationColor}
						style={styles.iosPickerErrorText}>
						{validationMessage}
					</TextField>
				) : null}

				<Divider />
			</>
		</TouchableOpacity>
	) : (
		<View style={style}>
			<View style={styles.mainView(hasError, enabled)}>
				<Picker
					enabled={enabled ? false : true}
					selectedValue={value}
					style={styles.pickerStyle}
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
					style={styles.iconStyle(enabled)}
				/>
			</View>
			{props.hasError ? (
				<TextField
					xThin
					letterSpacing={-0.07}
					lineHeight={18}
					fontFamily={GlobalTheme.fontRegular}
					color={GlobalTheme.validationColor}>
					{validationMessage}
				</TextField>
			) : null}
		</View>
	);
};

const styles = StyleSheet.create({
	mainView: (hasError = false, enabled = false) => ({
		borderBottomWidth: hasError ? 1 : 0.5,
		borderColor: hasError
			? GlobalTheme.validationColor
			: GlobalTheme.horizontalLineColor,
		backgroundColor: enabled ? GlobalTheme.textColor : GlobalTheme.white,
		// borderWidth: 1,
	}),
	pickerStyle: {
		// width: '100%',
		// height: 34,
		width: wp('95%'),
		height: hp('4.4%'),
		color: GlobalTheme.black,
		// borderWidth: 1,
	},
	iconStyle: (enabled = false) => ({
		position: 'absolute',
		top: hp('1.2%'),
		right: hp('2.0%'),
		backgroundColor: enabled ? GlobalTheme.textColor : GlobalTheme.white,
	}),
	iosModalView: {
		flex: 1,
		// borderWidth: 1,
		// borderColor: 'red',
	},
	iosPickerView: (enabled = false) => ({
		marginHorizontal: 10,
		width: '95%',
		// height: 30,
		height: hp('4.4%'),
		borderBottomWidth: 0.5,
		borderColor: GlobalTheme.horizontalLineColor,
		backgroundColor: enabled ? GlobalTheme.textColor : GlobalTheme.white,
	}),
	iconIOSStyle: (enabled = false) => ({
		position: 'absolute',
		top: hp('1.3%'),
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

export {HTMaterialPicker};
