import * as yup from 'yup';

import {RegExp} from '../../utils';
export const SelectedSearchSchema = yup.object().shape({
	selectedSearch: yup.string().required(),
});

const digitsOnly = (value) => RegExp.DigitsOnly.test(value);
export const PostcodeSchema = yup.object().shape({
	postcode: yup.string().test('Digits only', digitsOnly),
});

export const MilesSchema = yup.object().shape({
	miles: yup.string().required(),
});

export const CategorySchema = yup.object().shape({
	category: yup.string().required(),
});

export const SubCategorySchema = yup.object().shape({
	subCategory: yup.string().required(),
});

export const LatitudeSchema = yup.object().shape({
	latitude: yup.string().required(),
});

export const LongitudeSchema = yup.object().shape({
	longitude: yup.string().required(),
});
