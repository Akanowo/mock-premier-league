import Joi from 'joi';
import { ILogin, ISignup } from '../types/Auth';

export const loginValidator = Joi.object<ILogin>({
	email: Joi.string().email().required(),
	password: Joi.string().required(),
});

export const signupValidator = Joi.object<ISignup>({
	firstName: Joi.string().required(),
	lastName: Joi.string().required(),
	email: Joi.string().email().required(),
	password: Joi.string().required(),
});
