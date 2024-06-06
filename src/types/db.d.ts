import { FilterQuery, Query, QueryOptions } from 'mongoose';
import {
	ConnectOptions,
	Document,
	ModifyResult,
	UpdateWriteOpResult,
} from 'mongoose';
import { IPagingQuery } from './generic';

export interface DatabaseInterface {
	connect(): Promise<void>;
	disconnect(): Promise<void>;
	create<T>(collection: string, data: any, options?: any): Promise<any>;
	count<T>(collection: string, query: any, options?: any): Promise<number>;
	findOne<T>(
		collection: string,
		query: any,
		options?: QueryOptions<T>
	): Promise<any>;
	find<T>(
		collection: string,
		query: any,
		options?: QueryOptions<T>
	): Promise<any>;
	updateOne<T>(
		collection: string,
		query: any,
		data: any,
		options?: QueryOptions<T>
	): Promise<any>;
	updateMany(
		collection: string,
		query: any,
		data: any,
		options?: QueryOptions<T>
	): Promise<any>;
	delete(
		collection: string,
		query: any,
		options?: QueryOptions<T>
	): Promise<any>;
	paginate<T>(
		collection: string,
		query: FilterQuery<T>,
		paginationDetails?: IPagingQuery
	): Promise<any>;
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
