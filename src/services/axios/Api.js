import axios from 'axios';

import {_ENV_CONFIG} from '../../config';

// import RNFetchBlob from 'rn-fetch-blob';
// import Store from '../../store/Store';
// const baseURL = `https://app.hirethat.com`;

export const login = (body) => {
	const options = {
		url: `/api/user/login`,
		data: body,
		method: 'post',
	};

	return axios(options);
};

export const registerEmail = (body) => {
	const options = {
		url: `/api/user`,
		data: body,
		method: 'post',
	};

	return axios(options);
};

export const userDetailGET = (param) => {
	const options = {
		url: `/api/user/${param.userId}`,
		data: null,
		method: 'get',
	};

	return axios(options);
};

export const userDetailPUT = (param, body) => {
	const options = {
		url: `/api/user/${param}`,
		data: body,
		method: 'post',
	};

	return axios(options);
};

export const searchItemHire = (searchItemHirePageNumber, body) => {
	const options = {
		url: `/api/v3/item/search/hire?page=${searchItemHirePageNumber}`,
		data: body,
		method: 'post',
	};

	return axios(options);
};

export const searchItemBuy = (searchItemBuyPageNumber, body) => {
	const options = {
		url: `/api/v2/item/search/buy?page=${searchItemBuyPageNumber}`,
		data: body,
		method: 'post',
	};

	return axios(options);
};

export const categories = () => {
	const options = {
		url: `/api/category`,
		data: null,
		method: 'get',
	};

	return axios(options);
};

export const subCategories = (categoryId) => {
	const options = {
		url: `/api/category/${categoryId}/sub-category`,
		data: null,
		method: 'get',
	};

	return axios(options);
};

export const filterSearchItemHire = (filterSearchItemHirePageNumber, body) => {
	const options = {
		url: `/api/v3/item/search/filter?page=${filterSearchItemHirePageNumber}`,
		data: body,
		method: 'post',
	};

	return axios(options);
};

export const filterSearchItemBuy = (filterSearchItemBuyPageNumber, body) => {
	const options = {
		url: `/api/item/search/filter/buy?page=${filterSearchItemBuyPageNumber}`,
		data: body,
		method: 'post',
	};

	return axios(options);
};

// export const createAdvert = (body) => {
// 	const options = {
// 		url: `/api/item`,
// 		data: body,
// 		method: 'post',
// 		headers: {
// 			'Content-Type': 'multipart/form-data; ',
// 		},
// 	};

// 	return axios(options);
// };

export const createAdvert = (body) => {
	// console.log('createAdvert body ==> ', body);

	const options = {
		url: `/api/v2/item`,
		data: body,
		method: 'post',
	};

	return axios(options);
};

// export const createAdvert = (body) => {
// 	// console.log('createAdvert-single body ==> ', body);
// 	const accessToken = Store.getState().auth.accessToken;

// 	if (!body.isAdvertiseToSale) {
// 		return RNFetchBlob.fetch(
// 			'POST',
// 			baseURL + '/api/item',
// 			{
// 				Authorization: `Bearer ${accessToken}`,
// 				otherHeader: 'foo',
// 				Accept: 'application/json',
// 				'Content-Type': 'multipart/form-data',
// 			},
// 			[
// 				{
// 					name: 'photos[]',
// 					filename: 'image0',
// 					type: body.photos[0].mime,
// 					data: RNFetchBlob.wrap(body.photos[0].path),
// 				},
// 				{
// 					name: 'main_image',
// 					filename: 'advert-image',
// 					type: body.main_image.mime,
// 					data: RNFetchBlob.wrap(body.main_image.path),
// 				},
// 				{name: 'name', data: body.name},
// 				{name: 'is_for_hire', data: body.is_for_hire},
// 				{name: 'is_for_sale', data: body.is_for_sale},
// 				{name: 'category_id', data: body.category_id},
// 				{name: 'sub_category_id', data: body.sub_category_id},
// 				{name: 'make', data: body.make},
// 				{name: 'model', data: body.model},
// 				{name: 'description', data: body.description},
// 				{name: 'length_mm', data: body.length_mm},
// 				{name: 'width_mm', data: body.width_mm},
// 				{name: 'height_mm', data: body.height_mm},
// 				{name: 'location', data: body.location},
// 				{name: 'is_for_delivery', data: body.is_for_delivery},
// 				{
// 					name: 'delivery_distance',
// 					data: body.delivery_distance,
// 				},
// 				{
// 					name: 'delivery_charge_mile',
// 					data: body.delivery_charge_mile,
// 				},
// 				{name: 'per_day_price', data: body.per_day_price},
// 				{name: 'per_week_price', data: body.per_week_price},
// 				{name: 'post_code', data: body.post_code},
// 				{name: 'selling_price', data: body.selling_price},
// 				{name: 'offers_accepted', data: body.offers_accepted},
// 			],
// 		);
// 	} else if (body.isAdvertiseToSale) {
// 		// console.log('createAdvert-multiple body ==> ', body);

// 		return RNFetchBlob.fetch(
// 			'POST',
// 			baseURL + '/api/item',
// 			{
// 				Authorization: `Bearer ${accessToken}`,
// 				otherHeader: 'foo',
// 				Accept: 'application/json',
// 				'Content-Type': 'multipart/form-data',
// 			},
// 			[
// 				{
// 					name: body?.photos[0]?.mime ? 'photos[]' : null,
// 					filename: body?.photos[0]?.mime ? 'image0.png' : null,
// 					type: body?.photos[0]?.mime ? 'image/png' : null,
// 					data: body?.photos[0]?.path
// 						? RNFetchBlob.wrap(body.photos[0].path)
// 						: null,
// 				},
// 				{
// 					name: body?.photos[1]?.mime ? 'photos[]' : null,
// 					filename: body?.photos[1]?.mime ? 'image1.png' : null,
// 					type: body?.photos[1]?.mime ? 'image/png' : null,
// 					data: body?.photos[1]?.path
// 						? RNFetchBlob.wrap(body.photos[1].path)
// 						: null,
// 				},
// 				{
// 					name: body?.photos[2]?.mime ? 'photos[]' : null,
// 					filename: body?.photos[2]?.mime ? 'image2.png' : null,
// 					type: body?.photos[2]?.mime ? 'image/png' : null,
// 					data: body?.photos[2]?.path
// 						? RNFetchBlob.wrap(body.photos[2].path)
// 						: null,
// 				},
// 				{
// 					name: body?.photos[3]?.mime ? 'photos[]' : null,
// 					filename: body?.photos[3]?.mime ? 'image3.png' : null,
// 					type: body?.photos[3]?.mime ? 'image/png' : null,
// 					data: body?.photos[3]?.path
// 						? RNFetchBlob.wrap(body.photos[3].path)
// 						: null,
// 				},
// 				{
// 					name: body?.photos[4]?.mime ? 'photos[]' : null,
// 					filename: body?.photos[4]?.mime ? 'image4.png' : null,
// 					type: body?.photos[4]?.mime ? 'image/png' : null,
// 					data: body?.photos[4]?.path
// 						? RNFetchBlob.wrap(body.photos[4].path)
// 						: null,
// 				},
// 				{
// 					name: body?.photos[5]?.mime ? 'photos[]' : null,
// 					filename: body?.photos[5]?.mime ? 'image5.png' : null,
// 					type: body?.photos[5]?.mime ? 'image/png' : null,
// 					data: body?.photos[5]?.path
// 						? RNFetchBlob.wrap(body.photos[5].path)
// 						: null,
// 				},
// 				{
// 					name: body?.photos[6]?.mime ? 'photos[]' : null,
// 					filename: body?.photos[6]?.mime ? 'image6.png' : null,
// 					type: body?.photos[6]?.mime ? 'image/png' : null,
// 					data: body?.photos[6]?.path
// 						? RNFetchBlob.wrap(body.photos[6].path)
// 						: null,
// 				},
// 				{
// 					name: body?.photos[7]?.mime ? 'photos[]' : null,
// 					filename: body?.photos[7]?.mime ? 'image7.png' : null,
// 					type: body?.photos[7]?.mime ? 'image/png' : null,
// 					data: body?.photos[7]?.path
// 						? RNFetchBlob.wrap(body.photos[7].path)
// 						: null,
// 				},
// 				{
// 					name: body?.photos[8]?.mime ? 'photos[]' : null,
// 					filename: body?.photos[8]?.mime ? 'image8.png' : null,
// 					type: body?.photos[8]?.mime ? 'image/png' : null,
// 					data: body?.photos[8]?.path
// 						? RNFetchBlob.wrap(body.photos[8].path)
// 						: null,
// 				},
// 				{
// 					name: body?.photos[9]?.mime ? 'photos[]' : null,
// 					filename: body?.photos[9]?.mime ? 'image9.png' : null,
// 					type: body?.photos[9]?.mime ? 'image/png' : null,
// 					data: body?.photos[9]?.path
// 						? RNFetchBlob.wrap(body.photos[9].path)
// 						: null,
// 				},
// 				{
// 					name: 'main_image',
// 					filename: 'advert-image',
// 					type: body.main_image.mime,
// 					data: RNFetchBlob.wrap(body.main_image.path),
// 				},
// 				{name: 'name', data: body.name},
// 				{name: 'is_for_hire', data: body.is_for_hire},
// 				{name: 'is_for_sale', data: body.is_for_sale},
// 				{name: 'category_id', data: body.category_id},
// 				{name: 'sub_category_id', data: body.sub_category_id},
// 				{name: 'make', data: body.make},
// 				{name: 'model', data: body.model},
// 				{name: 'description', data: body.description},
// 				{name: 'length_mm', data: body.length_mm},
// 				{name: 'width_mm', data: body.width_mm},
// 				{name: 'height_mm', data: body.height_mm},
// 				{name: 'location', data: body.location},
// 				{name: 'is_for_delivery', data: body.is_for_delivery},
// 				{
// 					name: 'delivery_distance',
// 					data: body.delivery_distance,
// 				},
// 				{
// 					name: 'delivery_charge_mile',
// 					data: body.delivery_charge_mile,
// 				},
// 				{name: 'per_day_price', data: body.per_day_price},
// 				{name: 'per_week_price', data: body.per_week_price},
// 				{name: 'post_code', data: body.post_code},
// 				{name: 'selling_price', data: body.selling_price},
// 				{name: 'offers_accepted', data: body.offers_accepted},
// 			],
// 		);
// 	}
// };

export const updateAdvert = (body, advertId) => {
	// console.log('updateAdvert body ==> ', body, advertId);

	const options = {
		url: `/api/v2/item/${advertId}`,
		data: body,
		method: 'post',
	};

	return axios(options);
};

// export const updateAdvert = (body, advertId, rnFetchBlobApi) => {
// 	// console.log('body ==> ', body, advertId, rnFetchBlobApi);
// 	if (rnFetchBlobApi) {
// 		const accessToken = Store.getState().auth.accessToken;

// 		return RNFetchBlob.fetch(
// 			'POST',
// 			baseURL + `/api/item/${advertId}`,
// 			{
// 				Authorization: `Bearer ${accessToken}`,
// 				otherHeader: 'foo',
// 				Accept: 'application/json',
// 				'Content-Type': 'multipart/form-data',
// 			},
// 			[
// 				{
// 					name: body?.main_image[0]?.mime ? 'main_image[]' : null,
// 					filename: body?.main_image[0]?.mime ? 'mainImage0.png' : null,
// 					type: body?.main_image[0]?.mime ? 'image/png' : null,
// 					data: body?.main_image[0]?.path
// 						? RNFetchBlob.wrap(body.main_image[0].path)
// 						: null,
// 				},
// 				{name: '_method', data: body._method},
// 				{name: 'name', data: body.name},
// 				{name: 'is_for_hire', data: body.is_for_hire},
// 				{name: 'is_for_sale', data: body.is_for_sale},
// 				{name: 'category_id', data: body.category_id},
// 				{name: 'sub_category_id', data: body.sub_category_id},
// 				{name: 'make', data: body.make},
// 				{name: 'model', data: body.model},
// 				{name: 'description', data: body.description},
// 				{name: 'length_mm', data: body.length_mm},
// 				{name: 'width_mm', data: body.width_mm},
// 				{name: 'height_mm', data: body.height_mm},
// 				{name: 'location', data: body.location},
// 				{name: 'is_for_delivery', data: body.is_for_delivery},
// 				{
// 					name: 'delivery_distance',
// 					data: body.delivery_distance,
// 				},
// 				{
// 					name: 'delivery_charge_mile',
// 					data: body.delivery_charge_mile,
// 				},
// 				{name: 'per_day_price', data: body.per_day_price},
// 				{name: 'per_week_price', data: body.per_week_price},
// 				{name: 'post_code', data: body.post_code},
// 				{name: 'availability', data: body.availability},
// 				{name: 'selling_price', data: body.selling_price},
// 				{name: 'offers_accepted', data: body.offers_accepted},
// 			],
// 		);
// 	} else {
// 		const options = {
// 			url: `/api/item/${advertId}`,
// 			data: body,
// 			method: 'post',
// 		};

// 		return axios(options);
// 	}
// };

export const storePhotos = (body, advertId) => {
	// console.log('storePhotos body ==> ', body);

	const options = {
		url: `/api/item/${advertId}/photos`,
		data: body,
		method: 'post',
	};

	return axios(options);
};

// export const storePhotos = (body, advertId) => {
// 	console.log('storePhotos body ==> ', body);
// 	const accessToken = Store.getState().auth.accessToken;

// 	return RNFetchBlob.fetch(
// 		'POST',
// 		baseURL + `/api/item/${advertId}/photos`,
// 		{
// 			Authorization: `Bearer ${accessToken}`,
// 			otherHeader: 'foo',
// 			Accept: 'application/json',
// 			'Content-Type': 'multipart/form-data',
// 		},
// 		[
// 			{
// 				name: body?.photos[0]?.mime ? 'photos[]' : null,
// 				filename: body?.photos[0]?.mime ? 'image0.png' : null,
// 				type: body?.photos[0]?.mime ? 'image/png' : null,
// 				data: body?.photos[0]?.path
// 					? RNFetchBlob.wrap(body.photos[0].path)
// 					: null,
// 			},
// 			{
// 				name: body?.photos[1]?.mime ? 'photos[]' : null,
// 				filename: body?.photos[1]?.mime ? 'image1.png' : null,
// 				type: body?.photos[1]?.mime ? 'image/png' : null,
// 				data: body?.photos[1]?.path
// 					? RNFetchBlob.wrap(body.photos[1].path)
// 					: null,
// 			},
// 			{
// 				name: body?.photos[2]?.mime ? 'photos[]' : null,
// 				filename: body?.photos[2]?.mime ? 'image2.png' : null,
// 				type: body?.photos[2]?.mime ? 'image/png' : null,
// 				data: body?.photos[2]?.path
// 					? RNFetchBlob.wrap(body.photos[2].path)
// 					: null,
// 			},
// 			{
// 				name: body?.photos[3]?.mime ? 'photos[]' : null,
// 				filename: body?.photos[3]?.mime ? 'image3.png' : null,
// 				type: body?.photos[3]?.mime ? 'image/png' : null,
// 				data: body?.photos[3]?.path
// 					? RNFetchBlob.wrap(body.photos[3].path)
// 					: null,
// 			},
// 			{
// 				name: body?.photos[4]?.mime ? 'photos[]' : null,
// 				filename: body?.photos[4]?.mime ? 'image4.png' : null,
// 				type: body?.photos[4]?.mime ? 'image/png' : null,
// 				data: body?.photos[4]?.path
// 					? RNFetchBlob.wrap(body.photos[4].path)
// 					: null,
// 			},
// 			{
// 				name: body?.photos[5]?.mime ? 'photos[]' : null,
// 				filename: body?.photos[5]?.mime ? 'image5.png' : null,
// 				type: body?.photos[5]?.mime ? 'image/png' : null,
// 				data: body?.photos[5]?.path
// 					? RNFetchBlob.wrap(body.photos[5].path)
// 					: null,
// 			},
// 			{
// 				name: body?.photos[6]?.mime ? 'photos[]' : null,
// 				filename: body?.photos[6]?.mime ? 'image6.png' : null,
// 				type: body?.photos[6]?.mime ? 'image/png' : null,
// 				data: body?.photos[6]?.path
// 					? RNFetchBlob.wrap(body.photos[6].path)
// 					: null,
// 			},
// 			{
// 				name: body?.photos[7]?.mime ? 'photos[]' : null,
// 				filename: body?.photos[7]?.mime ? 'image7.png' : null,
// 				type: body?.photos[7]?.mime ? 'image/png' : null,
// 				data: body?.photos[7]?.path
// 					? RNFetchBlob.wrap(body.photos[7].path)
// 					: null,
// 			},
// 			{
// 				name: body?.photos[8]?.mime ? 'photos[]' : null,
// 				filename: body?.photos[8]?.mime ? 'image8.png' : null,
// 				type: body?.photos[8]?.mime ? 'image/png' : null,
// 				data: body?.photos[8]?.path
// 					? RNFetchBlob.wrap(body.photos[8].path)
// 					: null,
// 			},
// 			{
// 				name: body?.photos[9]?.mime ? 'photos[]' : null,
// 				filename: body?.photos[9]?.mime ? 'image9.png' : null,
// 				type: body?.photos[9]?.mime ? 'image/png' : null,
// 				data: body?.photos[9]?.path
// 					? RNFetchBlob.wrap(body.photos[9].path)
// 					: null,
// 			},
// 		],
// 	);
// };

export const deletePhotoById = (advertId, photoId) => {
	const options = {
		url: `/api/item/${advertId}/photo/${photoId}`,
		data: null,
		method: 'delete',
	};

	return axios(options);
};

export const advertList = (pageNumber) => {
	const options = {
		url: `/api/item?page=${pageNumber}`,
		data: null,
		method: 'get',
	};

	return axios(options);
};

export const advertById = (advertId) => {
	const options = {
		url: `/api/item/${advertId}`,
		data: null,
		method: 'get',
	};

	return axios(options);
};

export const deleteAdvertById = (advertId) => {
	const options = {
		url: `/api/item/${advertId}`,
		data: null,
		method: 'delete',
	};

	return axios(options);
};

export const createAddress = (body) => {
	const options = {
		url: `/api/user/address`,
		data: body,
		method: 'post',
	};

	return axios(options);
};

export const updateAddress = (body, addressId) => {
	const options = {
		url: `/api/user/address/${addressId}`,
		data: body,
		method: 'post',
	};

	return axios(options);
};

export const addressList = () => {
	const options = {
		url: `/api/user/address`,
		data: null,
		method: 'get',
	};

	return axios(options);
};

export const addressById = (addressId) => {
	const options = {
		url: `/api/user/address/${addressId}`,
		data: null,
		method: 'get',
	};

	return axios(options);
};

export const deleteAddressById = (addressId) => {
	const options = {
		url: `/api/user/address/${addressId}`,
		data: null,
		method: 'delete',
	};

	return axios(options);
};

export const calendarDatesMakingUnavailable = (advertId, dates) => {
	const options = {
		url: `/api/item/${advertId}/calender`,
		data: dates,
		method: 'post',
	};

	return axios(options);
};

export const calendarUnavailableDateList = (advertId) => {
	const options = {
		url: `/api/item/${advertId}/calender`,
		data: null,
		method: 'get',
	};

	return axios(options);
};

export const itemHire = (body) => {
	const options = {
		url: `/api/v2/item-hire`,
		data: body,
		method: 'post',
	};

	return axios(options);
};

export const userAccountDelete = (userId) => {
	const options = {
		url: `/api/user/${userId}`,
		data: null,
		method: 'delete',
	};

	return axios(options);
};

export const userBusinessProfile = (method, body = null) => {
	const options = {
		url: `/api/user/business-profile`,
		data: body,
		method: method,
	};

	return axios(options);
};

export const pauseResumeAdvert = (advertId, advertStatus) => {
	const options = {
		url: `/api/item/${advertId}/${advertStatus}`,
		data: null,
		method: 'post',
	};

	return axios(options);
};

export const appleRegistration = (body) => {
	const options = {
		url: `/api/user/login/apple`,
		data: body,
		method: 'post',
	};

	return axios(options);
};

export const facebookRegistration = (body) => {
	const options = {
		url: `/api/user/login/facebook`,
		data: body,
		method: 'post',
	};

	return axios(options);
};

// export const findDistance = (latitude1, longitude1, latitude2, longitude2) => {
// 	const options = {
// 		url: `/api/find-distance?latitude1=${latitude1}&longitude1=${longitude1}&latitude2=${latitude2}&longitude2=${longitude2}`,
// 		data: null,
// 		method: 'get',
// 	};

// 	return axios(options);
// };

export const findDistance = (latitude1, longitude1, latitude2, longitude2) => {
	const options = {
		url: `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${latitude1},${longitude1}&destinations=${latitude2},${longitude2}&region=GB&mode=driving&language=en&sensor=false&units=imperial&key=${_ENV_CONFIG.GOOGLE_KEY}`,
		data: null,
		method: 'get',
	};

	return axios(options);
};

export const hiringList = (hiringPageNumber) => {
	const options = {
		url: `/api/item-hiring?page=${hiringPageNumber}`,
		data: null,
		method: 'get',
	};

	return axios(options);
};

export const hiringOutList = (hiringOutPageNumber) => {
	const options = {
		url: `/api/item-hiring-out?page=${hiringOutPageNumber}`,
		data: null,
		method: 'get',
	};

	return axios(options);
};

export const forgotPassword = (body) => {
	const options = {
		url: `/api/forgot-password/email`,
		data: body,
		method: 'post',
	};

	return axios(options);
};

export const hiringById = (hiringId) => {
	const options = {
		url: `/api/item-hiring/${hiringId}`,
		data: null,
		method: 'get',
	};

	return axios(options);
};

export const calendarDateDeleteById = (advertId, dates) => {
	const options = {
		url: `/api/item/${advertId}/calender/delete`,
		data: dates,
		method: 'post',
	};

	return axios(options);
};

// export const findLatLong = (postcode) => {
// 	const options = {
// 		url: _ENV_CONFIG.POSTCODES_LAT_LONG_API + postcode,
// 		data: null,
// 		method: 'get',
// 	};

// 	return axios(options);
// };

export const findAddressFromPostcode = (postcode) => {
	const options = {
		url: `${_ENV_CONFIG.POSTCODES_TO_ADDRESS}${postcode}?api-key=${_ENV_CONFIG.GET_ADDRESS_API_KEY}`,
		// url: `${_ENV_CONFIG.POSTCODES_TO_ADDRESS}${postcode}?expand=true&api-key=${_ENV_CONFIG.GET_ADDRESS_API_KEY}`,
		data: null,
		method: 'get',
	};

	return axios(options);
};

export const stripeConnectGet = () => {
	const options = {
		url: `/api/redirect-stripe-connnect`,
		data: null,
		method: 'get',
	};

	return axios(options);
};

export const addCard = () => {
	const options = {
		url: `/api/save-card`,
		data: null,
		method: 'get',
	};

	return axios(options);
};

export const listUserCards = () => {
	const options = {
		url: `/api/list-cards`,
		data: null,
		method: 'get',
	};

	return axios(options);
};

export const defaultCard = (cardID) => {
	const options = {
		url: `/api/make-card-default/${cardID}`,
		data: null,
		method: 'post',
	};

	return axios(options);
};

export const deleteCard = (cardID) => {
	const options = {
		url: `/api/delete-card/${cardID}`,
		data: null,
		method: 'delete',
	};

	return axios(options);
};

export const hireItemPayment = (body) => {
	const options = {
		url: `/api/pay-item-hire`,
		data: body,
		method: 'post',
	};

	return axios(options);
};

export const buyItem = (body) => {
	const options = {
		url: `/api/item-buy`,
		data: body,
		method: 'post',
	};

	return axios(options);
};

export const buyItemPayment = (body) => {
	const options = {
		url: `/api/pay-item-buy`,
		data: body,
		method: 'post',
	};

	return axios(options);
};

export const sendEmail = (body) => {
	const options = {
		url: `/api/enquire-to-buy`,
		data: body,
		method: 'post',
	};

	return axios(options);
};

export const cancelHiring = (hiringId) => {
	const options = {
		url: `/api/cancel-item-hire/${hiringId}`,
		data: null,
		method: 'post',
	};

	return axios(options);
};

export const nearMeHire = (nearMeHirePageNumber, body) => {
	const options = {
		url: `/api/v3/item/search/nearme/hire?page=${nearMeHirePageNumber}`,
		data: body,
		method: 'post',
	};

	return axios(options);
};

export const nearMeBuy = (nearMeBuyPageNumber, body) => {
	const options = {
		url: `/api/v2/item/search/nearme/buy?page=${nearMeBuyPageNumber}`,
		data: body,
		method: 'post',
	};

	return axios(options);
};

export const stripeBalance = () => {
	const options = {
		url: `/api/user/stripe/balance`,
		data: null,
		method: 'get',
	};

	return axios(options);
};

export const dayToPrice = (body) => {
	const options = {
		url: `/api/v2/item-hire/price`,
		data: body,
		method: 'post',
	};

	return axios(options);
};

// export const forceUpdate = () => {
// 	const options = {
// 		url: `/api/force-update`,
// 		data: null,
// 		method: 'get',
// 	};

// 	return axios(options);
// };
