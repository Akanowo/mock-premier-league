import { JwtPayload } from 'jsonwebtoken';
import {
	OK_STATUS,
	NOT_OK_STATUS,
	UNAUTHORIZED_STATUS,
	BAD_REQUEST_STATUS,
	INVALID_TOKEN_STATUS,
	NOT_FOUND_STATUS,
} from '../helpers/constants';
import { DatabaseInterface } from './db';
import Utils from '../helpers/utils';
import CacheService from '../config/CacheService';

export enum ReturnStatus {
	OK = OK_STATUS,
	NOT_OK = NOT_OK_STATUS,
	UNAUTHORIZED = UNAUTHORIZED_STATUS,
	BAD_REQUEST = BAD_REQUEST_STATUS,
	INVALID_TOKEN = INVALID_TOKEN_STATUS,
	NOT_FOUND = NOT_FOUND_STATUS,
}

export type ReturnFunction<T> = (
	success: boolean,
	message: string,
	returnStatus: string,
	data: T
) => {};

export type ResultObject<T> = {
	success: boolean;
	message: string;
	code: number;
	returnStatus: string;
	data: T;
};

export interface DBTimeLogs {
	createdAt?: Date;
	updatedAt?: Date;
}

export type envT = 'development' | 'production' | 'test';

export interface JWTData extends JwtPayload {
	id: string;
}

export interface IPaging {
	page: number;
	limit: number;
	search?: string;
}

export interface IPagingQuery {
	skip: number;
	limit: number;
	populate: string[];
	sort: string;
}

export interface IDefaultDeps {
	db: DatabaseInterface;
	_utilsService: Utils;
	_cacheService: CacheService;
}
