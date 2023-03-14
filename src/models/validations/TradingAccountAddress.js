import * as yup from 'yup';

export const TradingNameSchema = yup.object().shape({
	tradingName: yup.string().required(),
});

export const LabelSchema = yup.object().shape({
	manualLabelName: yup.string().required(),
});

export const Address1Schema = yup.object().shape({
	manualAddressLine1: yup.string().required(),
});

export const Address2Schema = yup.object().shape({
	manualAddressLine2: yup.string().required(),
});

export const CitySchema = yup.object().shape({
	manualCity: yup.string().required(),
});

export const CountrySchema = yup.object().shape({
	manualCountry: yup.string().required(),
});

export const PostcodeSchema = yup.object().shape({
	manualPostcode: yup.string().required(),
});

export const VATNumberSchema = yup.object().shape({
	vatNumber: yup.string().required(),
});
