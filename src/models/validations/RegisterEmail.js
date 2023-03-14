import * as yup from 'yup';

import {RegExp} from '../../utils';

export const FullNameSchema = yup.object().shape({
	fullName: yup.string().required(),
});

const emailPattern = (value) => RegExp.EmailPattern.test(value);
export const EmailSchema = yup.object().shape({
	email: yup.string().test('Email Pattern', emailPattern),
});

const passwordPattern = (value) => RegExp.PasswordPattern.test(value);
export const PasswordSchema = yup.object().shape({
	password: yup.string().test('Password Pattern', passwordPattern),
});

export const ConfirmPasswordSchema = yup.object().shape({
	confirmPassword: yup
		.string()
		.test('Confirm Password Pattern', passwordPattern),
});
