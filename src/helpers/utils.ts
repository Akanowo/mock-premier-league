import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from './config';
import { IPaging, JWTData } from '../types/generic';
import { ILog, LogLevelEnum } from '../types/Log';

class Utils {
	static opts = {
		timestamps: true,
	};

	public ResultFunction<T>(
		success: boolean,
		message: string,
		code: number,
		returnStatus: string,
		data: T
	) {
		return {
			success,
			message,
			code,
			returnStatus,
			data,
		};
	}

	public async createHash(value: string) {
		const hash = await bcrypt.hash(value, 10);
		return hash;
	}

	public async verifyHash(hashString: string, originalValue: string) {
		return await bcrypt.compare(originalValue, hashString);
	}

	public pagination(total: number, page: number, limit: number) {
		const startIndex = (page - 1) * limit;
		const endIndex = page * limit;

		// Pagination result
		const paginationData = {
			skip: startIndex,
			limit: endIndex,
			totalRecords: total,
			pageTotal: Math.ceil(total / limit),
			next: {},
			prev: {},
		};

		if (endIndex < total) {
			paginationData.next = {
				page: page + 1,
				limit,
			};
		}

		if (startIndex > 0) {
			paginationData.prev = {
				page: page - 1,
				limit,
			};
		}

		return paginationData;
	}

	public extractPaginationFromQuery(query: any) {
		const page = parseInt(query.page as string) || config.DEFAULT_PAGE;
		const limit = parseInt(query.limit as string) || config.DEFAULT_LIMIT;
		const input: IPaging = { ...query, page, limit };

		return input;
	}

	public errorData(error: any, service: string) {
		console.log(error);
		const errorLog: ILog = {
			level: LogLevelEnum.ERROR,
			message: error.message || 'An error occured',
			service,
			stack: error.stack,
		};
		return errorLog;
	}
}

export default Utils;

// export const ResultFunction = <T>(
// 	success: boolean,
// 	message: string,
// 	code: number,
// 	returnStatus: string,
// 	data: T
// ) => {
// 	return {
// 		success,
// 		message,
// 		code,
// 		returnStatus,
// 		data,
// 	};
// };

// export const opts = {
// 	timestamps: true,
// };

// export async function createHash(value: string) {
// 	const hash = await bcrypt.hash(value, 10);
// 	return hash;
// }

// export async function verifyHash(hashString: string, originalValue: string) {
// 	return await bcrypt.compare(originalValue, hashString);
// }

// // export const processNumber = (phoneNumber: string) => {
// // 	//if phone number is an empty string or null or undefined, return empty string
// // 	if (!phoneNumber) {
// // 		return '';
// // 	}
// // 	let firstDigit = phoneNumber.charAt(0);
// // 	if (firstDigit == '0') {
// // 		let formatted = phoneNumber.replace('0', '234').replace(/\s/g, '');
// // 		phoneNumber = formatted;
// // 	}
// // 	//if first digit is +, remove it
// // 	if (firstDigit == '+') {
// // 		let formatted = phoneNumber.replace('+', '').replace(/\s/g, '');
// // 		phoneNumber = formatted;
// // 	}
// // 	//Remove space from Phone Number
// // 	phoneNumber = phoneNumber.replace(/\s/g, '');
// // 	return phoneNumber;
// // };

// export function pagination(total: number, page: number, limit: number) {
// 	const startIndex = (page - 1) * limit;
// 	const endIndex = page * limit;

// 	// Pagination result
// 	const paginationData = {
// 		skip: startIndex,
// 		limit: endIndex,
// 		totalRecords: total,
// 		pageTotal: Math.ceil(total / limit),
// 		next: {},
// 		prev: {},
// 	};

// 	if (endIndex < total) {
// 		paginationData.next = {
// 			page: page + 1,
// 			limit,
// 		};
// 	}

// 	if (startIndex > 0) {
// 		paginationData.prev = {
// 			page: page - 1,
// 			limit,
// 		};
// 	}

// 	return paginationData;
// }

// export const extractPaginationFromQuery = (query: any) => {
// 	const page = parseInt(query.page as string) || config.DEFAULT_PAGE;
// 	const limit = parseInt(query.limit as string) || config.DEFAULT_LIMIT;
// 	const input: IPaging = { ...query, page, limit };

// 	return input;
// };

// export function errorData(error: any, service: string) {
// 	console.log(error);
// 	const errorLog: ILog = {
// 		level: LogLevelEnum.ERROR,
// 		message: error.message || 'An error occured',
// 		service,
// 		stack: error.stack,
// 	};
// 	return errorLog;
// }
