import bcrypt from 'bcryptjs';
import jwt, { JsonWebTokenError, JwtPayload } from 'jsonwebtoken';
import { config } from './config';
import { IPaging, JWTData, ResultObject } from '../types/generic';
import { ILog, LogLevelEnum } from '../types/Log';
import { IUserDocument } from '../types/User';

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
	): ResultObject<T> {
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

	public formatUserObj(user: IUserDocument) {
		return user.toObject({
			transform: function (doc, ret, options) {
				delete ret.password;
			},
		});
	}

	public generateAccessToken(payload: JWTData) {
		const token = jwt.sign(payload, config.JWT_SECRET, { expiresIn: '3d' });
		return token;
	}

	verifyAccessToken(token: string) {
		try {
			const verify = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
			return verify;
		} catch (error: any) {
			return error as JsonWebTokenError;
		}
	}

	flattenObject(
		obj: Record<string, any>,
		parent: string = '',
		res: Record<string, any> = {}
	) {
		for (let key in obj) {
			if (obj.hasOwnProperty(key)) {
				const propName = parent ? `${parent}.${key}` : key;
				if (
					typeof obj[key] === 'object' &&
					obj[key] !== null &&
					!Array.isArray(obj[key])
				) {
					this.flattenObject(obj[key], propName, res);
				} else {
					res[propName] = obj[key];
				}
			}
		}
		return res;
	}
}

export default Utils;
