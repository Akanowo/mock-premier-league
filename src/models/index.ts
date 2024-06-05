import mongoose from 'mongoose';
import { ILog } from '../types/Log';
import { apiLogSchema, apiRequestSchema } from './schemas';
import {
	API_ERROR_COLLECTION_NAME,
	API_REQUEST_COLLECTION_NAME,
} from '../helpers/constants';

export const ApiErrorModel = mongoose.model<ILog>(
	API_ERROR_COLLECTION_NAME,
	apiLogSchema
);
export const ApiRequest = mongoose.model(
	API_REQUEST_COLLECTION_NAME,
	apiRequestSchema
);
