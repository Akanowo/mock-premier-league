import Joi from 'joi';
import { IPaging } from '../types/generic';
import { isValidObjectId } from 'mongoose';

export const pagingValidator = Joi.object<IPaging>({
	page: Joi.string(),
	limit: Joi.string(),
	search: Joi.string(),
});

export const objectIdValidator = Joi.custom((value, helper) => {
	if (!isValidObjectId(value)) {
		return helper.error('any.invalid');
	}
	return value;
});
