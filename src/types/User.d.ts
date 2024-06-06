import { Document } from 'mongoose';
import { DBTimeLogs } from './generic';

export interface IUser {
	name: {
		first: string;
		last: string;
		full: string;
	};
	email: string;
	password: string;
	accountType: 'admin' | 'user';
}

export interface IUserDocument extends Document, DBTimeLogs, IUser {}
