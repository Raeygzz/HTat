import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';

import ShadowView from 'react-native-simple-shadow-view';
import analytics from '@react-native-firebase/analytics';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

import {TextField} from '../../components/common';
import {GlobalTheme} from '../../components/theme';
import {AddAddressModal} from '../../screens/modals';

import {useSelector, useDispatch} from 'react-redux';
import {presentAddressScreenModal} from '../../store/actions/Profile';

const AddressList = (props) => {
	const addressScreenModal = useSelector(
		(state) => state.profile.presentAddressScreenModal,
	);

	const [addressId, setAddressId] = useState('');

	const dispatch = useDispatch();

	const addressCardHandler = (item) => {
		if (item?.name) {
			if (item.name !== '') {
				setAddressId(item.id);
			}
		} else {
			analytics().logEvent('add_address_start');
			setAddressId('');
		}

		dispatch(presentAddressScreenModal());
	};

	const addressesList =
		props.addresses.length > 0 ? (
			props.addresses.map((item, index) => {
				return (
					<View key={item.id} style={styles.addAddressWrapperStyle}>
						<ShadowView style={styles.addressShadowViewStyle}>
							{item?.name ? (
								<TouchableOpacity
									style={styles.flx1}
									onPress={addressCardHandler.bind(this, item)}>
									<View style={styles.textFieldRowStyle}>
										<TextField
											xThin
											letterSpacing={-0.07}
											// lineHeight={18}
											isRLH
											lineHeight={1.8}
											numberOfLines={1}
											fontFamily={GlobalTheme.fontBold}
											color={GlobalTheme.black}
											style={styles.primaryAddressTextStyle}>
											{item.name}
										</TextField>
										<TextField
											xThin
											letterSpacing={-0.19}
											// lineHeight={20}
											isRLH
											lineHeight={1.8}
											fontFamily={GlobalTheme.fontRegular}
											color={GlobalTheme.primaryColor}
											style={styles.primaryTextStyle}>
											{item.is_primary === 1 ? 'Primary' : ''}
										</TextField>
									</View>

									<TextField
										xThin
										letterSpacing={-0.07}
										// lineHeight={18}
										isRLH
										lineHeight={1.8}
										numberOfLines={1}
										fontFamily={GlobalTheme.fontRegular}
										color={GlobalTheme.black}>
										{item.address_line_1}
									</TextField>
									<TextField
										xThin
										letterSpacing={-0.07}
										// lineHeight={18}
										isRLH
										lineHeight={1.8}
										numberOfLines={1}
										fontFamily={GlobalTheme.fontRegular}
										color={GlobalTheme.black}>
										{item.address_line_2}
									</TextField>
									<TextField
										xThin
										letterSpacing={-0.07}
										// lineHeight={18}
										isRLH
										lineHeight={1.8}
										numberOfLines={1}
										fontFamily={GlobalTheme.fontRegular}
										color={GlobalTheme.black}>
										{item.address_line_3}
									</TextField>
									<TextField
										xThin
										letterSpacing={-0.07}
										// lineHeight={18}
										isRLH
										lineHeight={1.8}
										fontFamily={GlobalTheme.fontRegular}
										color={GlobalTheme.black}>
										{item.post_code}
									</TextField>
								</TouchableOpacity>
							) : (
								<TouchableOpacity
									style={styles.addAddressStyle}
									onPress={addressCardHandler.bind(this, item)}>
									<AntDesign
										name="pluscircle"
										size={20}
										color={GlobalTheme.primaryColor}
									/>
									<TextField
										xThin
										letterSpacing={-0.07}
										// lineHeight={18}
										isRLH
										lineHeight={1.8}
										fontFamily={GlobalTheme.fontRegular}
										color={GlobalTheme.textColor}>
										Add address
									</TextField>
								</TouchableOpacity>
							)}
						</ShadowView>
					</View>
				);
			})
		) : (
			<View style={styles.addAddressWrapperStyle}>
				<ShadowView style={styles.addressShadowViewStyle}>
					<TouchableOpacity
						style={styles.addAddressStyle}
						onPress={addressCardHandler.bind(this, {id: null, name: ''})}>
						<AntDesign
							name="pluscircle"
							size={20}
							color={GlobalTheme.primaryColor}
						/>
						<TextField
							xThin
							letterSpacing={-0.07}
							// lineHeight={18}
							isRLH
							lineHeight={1.8}
							fontFamily={GlobalTheme.fontRegular}
							color={GlobalTheme.textColor}>
							Add address
						</TextField>
					</TouchableOpacity>
				</ShadowView>
			</View>
		);

	return (
		<View style={styles.addressListWrapperStyle}>
			{addressesList}

			<AddAddressModal
				showAddressModal={addressScreenModal}
				addressId={addressId}
				navigation={props.navigation}
				addressListLength={props.addresses.length}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	addAddressWrapperStyle: {
		width: '48%',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		// borderWidth: 1,
	},
	addressShadowViewStyle: {
		width: '100%',
		// height: 105,
		height: hp('13.5%'),
		padding: hp(1.0),
		marginBottom: hp(1.5),
		shadowRadius: GlobalTheme.shadowRadius,
		shadowColor: GlobalTheme.black,
		shadowOpacity: 0.28,
		borderWidth: 0.1,
		borderColor: 'transparent',
		backgroundColor: GlobalTheme.white,
		borderRadius: GlobalTheme.viewRadius,
		shadowOffset: {width: 0, height: 0},
	},
	flx1: {
		flex: 1,
		// borderWidth: 1
	},
	textFieldRowStyle: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		// borderWidth: 1,
	},
	primaryTextStyle: {
		width: '33%',
		// borderWidth: 1,
	},
	primaryAddressTextStyle: {
		width: '67%',
		// borderWidth: 1,
	},
	addAddressStyle: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		// borderWidth: 1,
	},
	addressListWrapperStyle: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexWrap: 'wrap',
		padding: hp(1.0),
		// borderWidth: 1,
	},
});

export {AddressList};
