import { JwtPayload } from 'jsonwebtoken';
import {
	OK_STATUS,
	NOT_OK_STATUS,
	UNAUTHORIZED_STATUS,
	BAD_REQUEST_STATUS,
	INVALID_TOKEN_STATUS,
	NOT_FOUND_STATUS,
} from '../helpers/constants';

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
	returnStatus: ReturnStatus,
	data: T
) => {};

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
