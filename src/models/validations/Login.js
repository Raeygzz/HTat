import * as yup from 'yup';

import {RegExp} from '../../utils';

const emailPattern = (value) => RegExp.EmailPattern.test(value);
export const EmailSchema = yup.object().shape({
	email: yup.string().required().test('Email Pattern', emailPattern),
});

export const PasswordSchema = yup.object().shape({
	password: yup.string().required(),
});
