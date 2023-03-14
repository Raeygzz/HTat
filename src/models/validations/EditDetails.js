import * as yup from 'yup';

import {RegExp} from '../../utils';

const emailPattern = (value) => RegExp.EmailPattern.test(value);
export const EmailSchema = yup.object().shape({
	email: yup.string().test('Email Pattern', emailPattern),
});

export const FirstNameSchema = yup.object().shape({
	firstName: yup.string().required(),
});

export const LastNameSchema = yup.object().shape({
	lastName: yup.string().required(),
});
