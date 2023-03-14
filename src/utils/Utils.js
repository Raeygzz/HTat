import moment from 'moment';
import {Linking, PixelRatio} from 'react-native';

import {IOS, ANDROID} from '../helper';
import {GlobalTheme} from '../components/theme';

// import {GlobalTheme} from '../components/theme';
import {Month, MonthShortcut, twelveHourFormat} from '../constants/Constant';

// For calendar month and year i.e, Sep 2020
const calendarMonthyear = (mnthYr = '') => {
	// console.log('mnthYr ==> ', mnthYr);

	if (mnthYr !== '') {
		let year = mnthYr.year;
		let monthNum = mnthYr.month;

		const month = MonthShortcut[monthNum];

		return month + ' ' + year;
	} else {
		let year = new Date().getFullYear();
		let monthNum = new Date().getMonth();

		const month = MonthShortcut[monthNum];

		return month + ' ' + year;
	}
};

// seperate currency from price i.e, $250 then returns only 250
const seperateCurrencyFromPrice = (price) => {
	if (price != '') {
		let priceWithoutCurrency = price.split('£');

		if (priceWithoutCurrency.length > 1) {
			return priceWithoutCurrency[1];
		} else {
			return priceWithoutCurrency[0];
		}
	} else {
		return '';
	}
};

// Find number of days from two full date i.e, startDate 2021-01-27 & endDate 2021-01-27
const findNumberOfDaysFromTwoDates = (startDate, endDate) => {
	if (startDate != '' && endDate != '') {
		let start_date = new Date(startDate);
		let end_date = new Date(endDate);

		let timeDiff = end_date.getTime() - start_date.getTime();

		let numberOfDays = timeDiff / (1000 * 60 * 60 * 24);

		// console.log('numberOfDays ==> ', numberOfDays);

		return numberOfDays === 0 ? 1 : numberOfDays + 1;
	}
};

// card number last - 4 digit only display
const cardLastFourDigitDisplay = (cardNumber) => {
	let cardLengthWithoutLast4Digit = 8;
	let res = cardNumber;
	let starText = '';

	for (let i = 0; i < cardLengthWithoutLast4Digit; i++) {
		starText += '*';
	}

	let cardNumberWithStar = starText + res;
	let cardNumberFormat = cardNumberWithStar.match(/.{1,4}/g);

	// let res = cardNumber.substring(cardNumber.length - 4);
	// let starText = '';

	// for (let i = 0; i < cardNumber.length - 4; i++) {
	// 	starText += '*';
	// }

	// let cardNumberWithStar = starText + res;
	// let cardNumberFormat = cardNumberWithStar.match(/.{1,4}/g);

	return cardNumberFormat.join(' ');
};

// Change text size according to screen react native
const imageResizer = (size) => {
	const SCREEN_WIDTH = GlobalTheme.deviceWidth;
	const SCREEN_HEIGHT = GlobalTheme.deviceHeight;

	// based on iphone 5s's scale
	const scale = SCREEN_WIDTH / 320;
	const newSize = size * scale;

	// if (IOS) {
	return Math.round(PixelRatio.roundToNearestPixel(newSize));
	// } else {
	// 	return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
	// }
};

//Get Todays Date
const todayDate = () => {
	const date = moment().toString();
	const formattedDate = moment(date).format('YYYY-MM-DD');
	return formattedDate;
};

// time to string
const timeToString = (time) => {
	const date = new Date(time);
	return date.toISOString().split('T')[0];
};

const yesterdayDate = () => {
	const date = moment().toString();
	const formattedDate = moment(date).subtract(1, 'days').format('YYYY-MM-DD');
	return formattedDate;
};

//Format Date to YYYY-MM-DD
const formatDate = (date) => {
	if (date != null) {
		const formattedDate = moment(date).format('YYYY-MM-DD');
		return formattedDate;
	}
};

const generateIdFromFullDate = () => {
	let generatedId =
		new Date().getFullYear() +
		new Date().getMonth() +
		new Date().getDate() +
		new Date().getDay() +
		new Date().getHours() +
		new Date().getMinutes() +
		new Date().getSeconds();

	return generatedId;
};

//Format Today Date to YYYY-MM-DD without moment
const formatDateWithoutMoment = () => {
	let year = new Date().getFullYear();
	let month = new Date().getMonth() + 1;
	let date = new Date().getDate();

	month = month.toString().length < 2 ? '0' + month : month;
	date = date.toString().length < 2 ? '0' + date : date;

	return year + '-' + month + '-' + date;
};

//Format Time to HH-MM-SS
const formatTime = (time) => {
	if (time != null) {
		// console.log('time ==> ', time);

		// dateString *HAS* to be in this format "YYYY-MM-DD HH:MM:SS"
		let dateParam = time.split(/[\s-:]/);
		dateParam[1] = (parseInt(dateParam[1], 10) - 1).toString();

		let hour = new Date(...dateParam).getHours();
		let minute = new Date(...dateParam).getMinutes();
		let second = new Date(...dateParam).getSeconds();

		let hours = hour.toString().length < 2 ? '0' + hour : hour;
		let minutes = minute.toString().length < 2 ? '0' + minute : minute;
		let seconds = secound.toString().length < 2 ? '0' + second : second;

		let formatTime = hours + ':' + minutes + ':' + seconds;

		return formatTime;
	} else {
		return null;
	}
};

// format dates 2020-09-09 and 2020-09-13 to formated date i.e, 9th - 13th Sept
const changeTwoDatesToFormattedDate = (startDate, endDate) => {
	if (startDate != '' && endDate != '') {
		let start_date = startDate + ' ' + '00:00:00';
		let end_date = endDate + ' ' + '00:00:00';

		let startDateParam = start_date.split(/[\s-:]/);
		startDateParam[1] = (parseInt(startDateParam[1], 10) - 1).toString();

		let endDateParam = end_date.split(/[\s-:]/);
		endDateParam[1] = (parseInt(endDateParam[1], 10) - 1).toString();

		let startDateMonthNum = new Date(...startDateParam).getMonth();
		let monthSD = MonthShortcut[startDateMonthNum];

		let endDateMonthNum = new Date(...endDateParam).getMonth();
		let monthED = MonthShortcut[endDateMonthNum];

		let SDate = new Date(...startDateParam).getDate().toString();
		let EDate = new Date(...endDateParam).getDate().toString();

		// if (SDate === '1' || SDate === '01') {
		// 	SDate = SDate + 'st';
		// } else if (SDate === '2' || SDate === '02') {
		// 	SDate = SDate + 'nd';
		// } else if (SDate === '3' || SDate === '03') {
		// 	SDate = SDate + 'rd';
		// } else {
		// 	SDate = SDate + 'th';
		// }

		// if (EDate === '1' || EDate === '01') {
		// 	EDate = EDate + 'st';
		// } else if (EDate === '2' || EDate === '02') {
		// 	EDate = EDate + 'nd';
		// } else if (EDate === '3' || EDate === '03') {
		// 	EDate = EDate + 'rd';
		// } else {
		// 	EDate = EDate + 'th';
		// }

		// let formatedDate = SDate + ' - ' + EDate + ' ' + month;

		let formatedDate = `${SDate}${
			monthSD != monthED ? ' ' + monthSD : ''
		} - ${EDate} ${monthED}`;
		return formatedDate;
	}
};

// format date (2020-11-25 12:36:14) to sentence date i.e, September 14th
const formatToSentenceDateWithsufix = (sentenceDate) => {
	if (sentenceDate != '') {
		let dateParam = sentenceDate.split(/[\s-:]/);
		dateParam[1] = (parseInt(dateParam[1], 10) - 1).toString();

		let monthNum = new Date(...dateParam).getMonth();
		const month = Month[monthNum];

		let date = new Date(...dateParam).getDate().toString();

		if (date === '1' || date === '01') {
			date = date + 'st';
		} else if (date === '2' || date === '02') {
			date = date + 'nd';
		} else if (date === '3' || date === '03') {
			date = date + 'rd';
		} else {
			date = date + 'th';
		}

		return month + ' ' + date;
	}
};

// format date to sentence date i.e, 05 August, 2020
const formatToSentenceDate = (sentenceDate) => {
	if (sentenceDate != null) {
		// dateString *HAS* to be in this format "YYYY-MM-DD HH:MM:SS"
		let dateParam = sentenceDate.split(/[\s-:]/);
		dateParam[1] = (parseInt(dateParam[1], 10) - 1).toString();

		let dateYear = new Date(...dateParam).getFullYear();
		let monthNum = new Date(...dateParam).getMonth();
		let date = new Date(...dateParam).getDate();

		const dateNum = date.toString().length < 2 ? '0' + date : date;

		const month = Month[monthNum];

		const filteredDate = month + ' ' + dateNum + ', ' + dateYear;

		return filteredDate;
	}
};

const twelveHourFormatTime = (twelveHour) => {
	if (twelveHour != null) {
		// dateString *HAS* to be in this format "YYYY-MM-DD HH:MM:SS"
		let dateParam = twelveHour.split(/[\s-:]/);
		dateParam[1] = (parseInt(dateParam[1], 10) - 1).toString();

		let hour = new Date(...dateParam).getHours();
		let minute = new Date(...dateParam).getMinutes();

		const filteredTime = twelveHourFormat.filter((obj) => {
			if (hour == obj.id) {
				return obj.time;
			}
		});

		return (
			filteredTime[0].time.slice(0, 2) +
			':' +
			minute +
			' ' +
			filteredTime[0].time.slice(3, 5)
		);
	}
};

// get  current month
const getCurrentMonth = () => {
	let currentDate = new Date();
	let currentMonth = currentDate.getMonth() + 1;
	let formatedCurrentMonth =
		currentMonth.toString().length < 2 ? '0' + currentMonth : currentMonth;
	return formatedCurrentMonth;
};

//Make Call
const makeCall = (number) => {
	return Linking.openURL(`tel:${number}`);
};

//Get Current English Year
const getCurrentYear = () => {
	const currentYear = new Date().getFullYear();
	return currentYear;
};

//Get Years
const getYears = () => {
	let startingDate = 1985;

	const currentYear = new Date().getFullYear();

	const diffInYear = currentYear - startingDate;

	const yearsArr = [];

	for (let i = 0; i <= diffInYear; i++) {
		const newDate = (currentYear - i).toString();
		yearsArr.push({id: i.toString(), label: newDate, value: newDate});
	}

	let Years = Object.assign([], yearsArr);

	Years.unshift({id: '-1', label: '--Select--', value: ''});

	// console.log('Years ==> ', Years);

	return Years;
};

//Get number of weeks and remaining days from two dates. i.e, 2021-03-04 & 2021-03-19 becomes 2weeks, 1day
const weekDiffNRemainingDays = (sDate, eDate) => {
	let startDate = new Date(sDate);
	let endDate = new Date(eDate);

	let Difference_In_Time = endDate.getTime() - startDate.getTime();
	// console.log('Difference_In_Time ==> ', Difference_In_Time);

	// To calculate the no. of days between two dates
	let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24) + 1;
	// console.log('Difference_In_Days ==> ', Difference_In_Days);

	let diff = Difference_In_Days / 7;
	// console.log('diff ==> ', diff);

	let diffSplit = diff.toString().split('.')[0];
	// console.log('diffSplit ==> ', diffSplit);

	let numberOfRemainingDays = Difference_In_Days % 7;
	// console.log('numberOfRemainingDays ==> ', numberOfRemainingDays);

	return {
		numberOfWeeks: parseInt(diffSplit),
		numberOfDays: parseInt(numberOfRemainingDays),
	};
};

//Length of Object
const getObjectLength = (obj) => {
	if (obj != null && obj != '') {
		var count = Object.keys(obj).length;
		return parseInt(count);
	} else {
		return 0;
	}
};

//print all keys from json
const getObjectKeys = (data) => {
	const keyData = [];
	var filters = data;

	for (var i = 0; i < 1; i++) {
		var obj = filters[i];

		for (var key in obj) {
			keyData.push(key);
		}
	}
	return keyData;
};

// condition to make cancel hiring button(true or false)
const cancelHiringButton = (startDate) => {
	let currentDate = new Date().getTime();
	let hiringStartDate = new Date(startDate).getTime();

	let disableCancelHiringButton = hiringStartDate - currentDate;
	let disablCancelHiring = disableCancelHiringButton < 0 ? true : false;

	return disablCancelHiring;
};

//Capitalize First Letter
const firstLetterUppercase = (string) => {
	return string.charAt(0).toUpperCase() + string.slice(1);
};

const timeColonSeperator = (time, needed) => {
	if (time != null) {
		let spliter = time.split(':');

		if (needed === 'hh') {
			let hourSpliter = spliter[0];
			hourSpliter = hourSpliter.length < 2 ? '0' + hourSpliter : hourSpliter;
			// console.log('hourSpliter ==> ', hourSpliter);
			return hourSpliter;
		} else if (needed === 'mm') {
			let minuteSpliter = spliter[1];
			minuteSpliter =
				minuteSpliter.length < 2 ? '0' + minuteSpliter : minuteSpliter;
			// console.log('minuteSpliter ==> ', minuteSpliter);
			return minuteSpliter;
		} else if (needed === 'ss') {
			let secondSpliter = spliter[2];
			secondSpliter =
				secondSpliter.length < 2 ? '0' + secondSpliter : secondSpliter;
			// console.log('secondSpliter ==> ', secondSpliter);
			return secondSpliter;
		}
	} else {
		return null;
	}
};

const removeDuplicateElement = (itemArr) => {
	// console.log('itemArr ==> ', itemArr);
	const ids = itemArr.map((obj) => obj.id);
	const filteredArr = itemArr.filter(
		({id}, index) => !ids.includes(id, index + 1),
	);
	// console.log('filteredArr ==> ', filteredArr);
	return filteredArr;
};

// const getGridColor = (number) => {
//   let color =
//     number === 0
//       ? GlobalTheme.materialRed
//       : number === 1
//       ? GlobalTheme.materialBrown
//       : number === 2
//       ? GlobalTheme.materialGreen
//       : number === 3
//       ? GlobalTheme.materialOrange
//       : number === 4
//       ? GlobalTheme.materialBlue
//       : GlobalTheme.whiteColor;
//   return color;
// };

const closeToBottom = ({
	contentInset,
	layoutMeasurement,
	contentOffset,
	contentSize,
}) => {
	const paddingToBottom = 5;

	// console.log('contentInset ==> ', contentInset);
	// console.log('layoutMeasurement ==> ', layoutMeasurement);
	// console.log('contentOffset ==> ', contentOffset);
	// console.log('contentSize ==> ', contentSize);

	return (
		layoutMeasurement.height + contentOffset.y >=
		contentSize.height - paddingToBottom
	);
};

const maybeOpenURL = async (
	url,
	appName,
	appStoreId,
	appStoreLocale,
	playStoreId,
) => {
	Linking.openURL(url).catch((err) => {
		if (err.code === 'EUNSPECIFIED') {
			if (IOS) {
				// check if appStoreLocale is set
				const locale =
					typeof appStoreLocale === 'undefined' ? 'us' : appStoreLocale;

				Linking.openURL(
					`https://itunes.apple.com/${locale}/app/${appName}/id${appStoreId}`,
				);
			} else {
				Linking.openURL(
					`https://play.google.com/store/apps/details?id=${playStoreId}`,
				);
			}
		} else {
			throw new Error(`Could not open ${appName}. ${err.toString()}`);
		}
	});
};

const openInStore = async ({
	appName,
	appStoreId,
	appStoreLocale = 'us',
	playStoreId,
}) => {
	if (IOS) {
		Linking.openURL(
			`https://itunes.apple.com/${appStoreLocale}/app/${appName}/id${appStoreId}`,
		);
	} else {
		Linking.openURL(
			`https://play.google.com/store/apps/details?id=${playStoreId}`,
		);
	}
};

const convertToZoomData = (url) => {
	try {
		var newUrl = url;
		var id = url.match(/https:\/\/.*us\/j\/(\d+)/i)[1];
		var pwd = newUrl.replace(/https.*pwd=/, '');
		// const finalUrl = `zoomus://zoom.us/join?confno=${id}&pwd=${pwd}`;
		return {
			id: id,
			pwd: pwd,
		};
	} catch (e) {
		return url;
	}
};

const limitTitle = (string) => {
	const finalTitle = string.replace(/^(.{25}[^\s]*).*/, '$1');
	return finalTitle;
};

const convertToStringTime = (total) => {
	if (total >= 60) {
		if (total % 60 == 0) {
			const baseHour = parseInt(total / 60);
			if (baseHour == 1) {
				return baseHour + ' Hour';
			} else return baseHour + ' Hours';
		} else {
			const minutes = total % 60;
			const hours = (total - minutes) / 60;
			if (hours == 1) {
				return hours + ' Hour ' + minutes + ' Minutes';
			} else return hours + ' Hours ' + minutes + ' Minutes';
		}
	} else {
		return total + ' Minutes';
	}
};

export {
	calendarMonthyear,
	cardLastFourDigitDisplay,
	changeTwoDatesToFormattedDate,
	formatToSentenceDateWithsufix,
	weekDiffNRemainingDays,
	seperateCurrencyFromPrice,
	todayDate,
	imageResizer,
	generateIdFromFullDate,
	timeToString,
	findNumberOfDaysFromTwoDates,
	yesterdayDate,
	cancelHiringButton,
	formatDate,
	formatDateWithoutMoment,
	formatTime,
	formatToSentenceDate,
	twelveHourFormatTime,
	getCurrentMonth,
	makeCall,
	getCurrentYear,
	getYears,
	getObjectLength,
	getObjectKeys,
	firstLetterUppercase,
	timeColonSeperator,
	// getGridColor,
	removeDuplicateElement,
	closeToBottom,
	maybeOpenURL,
	openInStore,
	convertToZoomData,
	limitTitle,
	convertToStringTime,
};
