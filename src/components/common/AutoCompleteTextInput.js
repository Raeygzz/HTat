import React, {useState, useEffect} from 'react';
import {
	View,
	TextInput,
	FlatList,
	StyleSheet,
	TouchableOpacity,
} from 'react-native';

import Icon from 'react-native-vector-icons/AntDesign';
import ShadowView from 'react-native-simple-shadow-view';
import {
	heightPercentageToDP as hp,
	widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {Divider} from './Divider';
import {TextField} from './TextField';
import {GlobalTheme} from '../theme/GlobalTheme';

import {useSelector, useDispatch} from 'react-redux';
import {clearTextInputReq} from '../../store/actions/ClearTextInput';

const AutoCompleteTextInput = (props) => {
	const {inputRef = null, blurOnSubmit = true, onSubmitEditing = null} = props;

	const textInputClear = useSelector(
		(state) => state.clearTextInput.textInputClear,
	);

	const [selectedText, setSelectedText] = useState('');

	const dispatch = useDispatch();

	const selectedItemHandler = (item) => {
		setSelectedText(item.label);
		props.onChangeText(item.label);
		props.closeFlatList();
	};

	const renderItem = ({item}) => (
		<>
			<TouchableOpacity
				style={styles.textFieldStyle}
				onPress={selectedItemHandler.bind(this, item)}>
				<TextField
					regular
					lineHeight={26}
					fontFamily={GlobalTheme.fontMedium}
					color={GlobalTheme.black}>
					{item.label}
				</TextField>
			</TouchableOpacity>

			<View style={styles.borderBottomLineStyle} />
		</>
	);

	useEffect(() => {
		if (textInputClear) {
			setSelectedText('');

			console.log('== 1 ==');
			dispatch(clearTextInputReq(false));
		}
	}, [textInputClear]);

	return (
		<>
			<ShadowView style={styles.shadowViewStyle}>
				<TextInput
					style={styles.textInputStyle}
					autoCorrect={false}
					autoCapitalize="none"
					placeholder={props.placeholder ? props.placeholder : ''}
					keyboardType={props.KeyboardType ? props.KeyboardType : 'default'}
					returnKeyType={props.returnKeyType ? props.returnKeyType : 'done'}
					ref={inputRef}
					autoFocus={props.autoFocus ? true : false}
					selectionColor={GlobalTheme.black}
					placeholderTextColor={GlobalTheme.placeholderColor}
					blurOnSubmit={blurOnSubmit}
					onSubmitEditing={onSubmitEditing}
					editable={props.editable ? false : true}
					value={selectedText}
					onChangeText={(selectedText) => {
						setSelectedText(selectedText);
						props.onChangeText(selectedText);
					}}
				/>

				<Icon
					name={props.hasError ? 'exclamationcircle' : 'search1'}
					size={hp('2.0%')}
					color={
						props.hasError
							? GlobalTheme.validationColor
							: GlobalTheme.primaryColor
					}
					style={styles.iconStyle}
				/>
			</ShadowView>

			{props.showFlatList ? (
				<ShadowView style={styles.flatListViewStyle}>
					<FlatList
						ListHeaderComponent={<Divider large />}
						ListFooterComponent={<Divider medium />}
						showsVerticalScrollIndicator={false}
						data={props.data}
						renderItem={renderItem}
						keyExtractor={(item) => item.id}
					/>
				</ShadowView>
			) : null}
		</>
	);
};

const styles = StyleSheet.create({
	textFieldStyle: {
		marginVertical: 1,
		paddingLeft: 15,
	},
	borderBottomLineStyle: {
		marginHorizontal: 15,
		color: GlobalTheme.horizontalLineColor,
		borderTopWidth: 0.5,
	},
	shadowViewStyle: {
		width: '100%',
		// height: 40,
		height: hp('5.2%'),
		shadowRadius: GlobalTheme.shadowRadius,
		shadowColor: GlobalTheme.black,
		shadowOpacity: 0.28,
		borderWidth: 0.1,
		zIndex: 999,
		borderRadius: GlobalTheme.viewRadius,
		alignSelf: 'center',
		justifyContent: 'center',
		borderColor: 'transparent',
		backgroundColor: GlobalTheme.white,
		shadowOffset: {width: 0, height: 0},
	},
	textInputStyle: {
		width: '100%',
		// height: 40,
		paddingVertical: 0,
		height: hp('5.2%'),
		fontSize: hp('2.0%'),
		// lineHeight: 20,
		lineHeight: hp('2.0%'),
		borderRadius: 5,
		paddingLeft: 15,
		// borderWidth: 1,
		color: GlobalTheme.placeholderColor,
		backgroundColor: GlobalTheme.white,
		fontFamily: GlobalTheme.fontRegular,
	},
	iconStyle: {
		position: 'absolute',
		right: 10,
	},
	flatListViewStyle: {
		flex: 1,
		width: '100%',
		// height: 175,
		height: hp('17.5%'),
		shadowRadius: GlobalTheme.shadowRadius,
		shadowColor: GlobalTheme.black,
		shadowOpacity: 0.28,
		borderWidth: 0.1,
		borderBottomLeftRadius: GlobalTheme.viewRadius,
		borderBottomRightRadius: GlobalTheme.viewRadius,
		alignSelf: 'center',
		borderColor: 'transparent',
		backgroundColor: GlobalTheme.white,
		shadowOffset: {width: 0, height: 0},
		position: 'absolute',
		top: '49%',
		zIndex: 888,
	},
});

export {AutoCompleteTextInput};
