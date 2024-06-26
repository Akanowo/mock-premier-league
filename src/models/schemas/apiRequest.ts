import mongoose from 'mongoose';
import Utils from '../../helpers/utils';

const opts = Utils.opts;

const apiRequestSchema = new mongoose.Schema(
	{
		ip: {
			type: String,
			required: true,
		},
		url: {
			type: String,
			required: true,
		},
		headers: mongoose.Schema.Types.Mixed,
		body: mongoose.Schema.Types.Mixed,
		query: mongoose.Schema.Types.Mixed,
		params: mongoose.Schema.Types.Mixed,
	},
	opts
);

export { apiRequestSchema };
