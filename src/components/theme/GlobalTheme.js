import {Dimensions} from 'react-native';

const {height, width} = Dimensions.get('window');

const GlobalTheme = {
	// theme colors
	primaryColor: '#FF6100',
	// secondaryColor: '#FF6100',
	// lightSecondaryColor: '#FF6100',
	// thinSecondaryColor: '#FF6100',

	green: 'green',
	white: '#FFFFFF',
	black: '#010200',
	defaultBlack: '#000000',
	validationColor: '#FF1400',
	shadowColor: '#0000004D',
	textColor: '#999999',
	moneyColor: '#DB1201',
	buttonRedColor: '#E31A00',
	horizontalLineColor: '#707070',
	photoGridBackgroundColor: '#F2F2F2',
	placeholderColor: 'rgba(1, 2, 0, 0.5)',
	materialTabBackgroundColor: '#E2E2E2',
	textHyperLinkColor: '#1B95E0',
	// theme colors

	// typography
	fontSizeThin: 12,
	fontSizeLight: 14,
	fontSizeMedium: 15,
	fontSizeRegular: 16,
	fontSizeTitle: 17,
	fontSizeHuge: 24,

	fontThin: 'URWDIN-Thin',
	fontLight: 'URWDIN-Light',
	fontMedium: 'URWDIN-Medium',
	fontRegular: 'URWDIN-Regular',
	fontBold: 'URWDIN-Bold',
	fontBlack: 'URWDIN-Black',
	fontSF: 'SFProText-Regular',
	fontSemiBold: 'Metropolis-SemiBold',
	// typography

	//radius
	viewRadius: 6,
	shadowRadius: 6,

	//heights
	deviceHeight: height,
	deviceWidth: width,

	buttonHeight: 5.2,
	headerHeight: 9.8,
	headerIOSHeight: 11.2,
};

export {GlobalTheme};
