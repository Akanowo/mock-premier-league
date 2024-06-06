import { Schema } from 'mongoose';
import Utils from '../../helpers/utils';
import { IUser } from '../../types/User';
import { STRING_AND_REQUIRED } from '../../helpers/constants';

const opts = Utils.opts;

const userSchema = new Schema<IUser>(
	{
		name: {
			first: STRING_AND_REQUIRED,
			last: STRING_AND_REQUIRED,
			full: STRING_AND_REQUIRED,
		},
		email: STRING_AND_REQUIRED,
		password: STRING_AND_REQUIRED,
		accountType: { ...STRING_AND_REQUIRED, enum: ['admin', 'user'] },
	},
	opts
);

export { userSchema };
