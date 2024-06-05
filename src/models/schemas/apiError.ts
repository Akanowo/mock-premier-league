import mongoose from 'mongoose';
import { ILog } from '../../types/Log';
import { opts } from '../../helpers/utils';
import {
	STRING_AND_OPTIONAL,
	STRING_AND_REQUIRED,
} from '../../helpers/constants';

const apiLogSchema = new mongoose.Schema<ILog>(
	{
		level: { ...STRING_AND_REQUIRED, enum: ['info', 'error'] },
		message: STRING_AND_REQUIRED,
		service: STRING_AND_REQUIRED,
		stack: STRING_AND_OPTIONAL,
	},
	opts
);

export { apiLogSchema };
