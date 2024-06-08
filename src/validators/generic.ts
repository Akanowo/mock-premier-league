import Joi from 'joi';
import { IPaging } from '../types/generic';
import { Types, isValidObjectId } from 'mongoose';

export const pagingValidator = Joi.object<IPaging>({
	page: Joi.string(),
	limit: Joi.string(),
	search: Joi.string(),
});

export const objectIdValidator = Joi.custom((value, helper) => {
	if (typeof value === 'object' && Object.keys(value).length > 0) {
		for (const [key, val] of Object.entries(value)) {
			if (!isValidObjectId(val)) {
				return helper.error('any.invalid', {}, { path: [key] });
			}
		}
		return value;
	}

	if (!isValidObjectId(value)) {
		return helper.error('any.invalid');
	}
	return value;
});
