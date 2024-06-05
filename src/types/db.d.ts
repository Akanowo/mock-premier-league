import {
	ConnectOptions,
	Document,
	ModifyResult,
	UpdateWriteOpResult,
} from 'mongoose';

export interface DatabaseInterface {
	connect(): Promise<void>;
	disconnect(): Promise<void>;
	create<T>(collection: string, data: any, options?: any): Promise<T>;
	findOne<T>(
		collection: string,
		query: any,
		options?: any
	): Promise<Document<T> | null>;
	find<T>(collection: string, query: any, options?: any): Promise<T[]>;
	updateOne<T>(
		collection: string,
		query: any,
		data: any,
		options?: any
	): Promise<ModifyResult<T>>;
	updateMany(
		collection: string,
		query: any,
		data: any,
		options?: any
	): Promise<UpdateWriteOpResult>;
	delete(collection: string, query: any, options?: any): Promise<any>;
}

export interface IDBConfig {
	type: 'mongodb';
	uri?: string;
	options?: ConnectOptions;
	host?: string;
	user?: string;
	password?: string;
	database?: string;
}
