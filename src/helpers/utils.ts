import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from './config';
import { IPaging, JWTData } from '../types/generic';
import { ILog, LogLevelEnum } from '../types/Log';

export const ResultFunction = <T>(
	success: boolean,
	message: string,
	code: number,
	returnStatus: string,
	data: T
) => {
	return {
		success,
		message,
		code,
		returnStatus,
		data,
	};
};

export const opts = {
	timestamps: true,
};

export async function createHash(value: string) {
	const hash = await bcrypt.hash(value, 10);
	return hash;
}

export async function verifyHash(hashString: string, originalValue: string) {
	return await bcrypt.compare(originalValue, hashString);
}

// export function generateAccessToken(payload: JWTData) {
// 	const token = jwt.sign(payload, config.JWT_HASH, { expiresIn: '7d' });
// 	return token;
// }

// export function verifyAccessToken(token: string) {
// 	try {
// 		const payload = jwt.verify(token, config.JWT_HASH) as
// 			| string
// 			| ICreateTokenPayload;
// 	} catch (error) {
// 		console.log(error);
// 		return error;
// 	}
// }

// export const generateOTP = async (length: number = 6) => {
// 	const otp = voucherCodes.generate({
// 		length,
// 		count: 1,
// 		charset: '0123456789',
// 	});
// 	return otp[0];
// };

// export const otpChannel: any = {
// 	// "SMS": async function (args: otpChannelInput,type: OTPTypeEnum = OTPTypeEnum.SIGNUP) {
// 	// 	try {
// 	// 		const route: 'dnd' | 'non_dnd' | 'international' = 'dnd'
// 	// 		const payload = {
// 	// 				to: [args.phoneNumber],
// 	// 				message: `Hello ${args.firstName || ""}, Please find your Eazipay's OTP code below. ${args.otp}`,
// 	// 				sender_name: config.SENDCHAMP_SENDER,
// 	// 				route,
// 	// 		}
// 	// 		await sendSms(payload/*, args.reference*/)
// 	// 	} catch (error) {
// 	// 		console.error("otp channel:SMS", error)
// 	// 		return {
// 	// 			success: false,
// 	// 			message: "oops something went wrong, please try again or contact Support for assistance",
// 	// 			returnStatus: "NOT_OK"
// 	// 		};
// 	// 	}
// 	// },
// 	EMAIL: async function (args: otpChannelInput) {
// 		try {
// 			const HTMLPart = `<p>Your otp is: ${args.otp}</p>`;

// 			const To = [
// 				{
// 					Email: args.email,
// 					Name: args.firstName || '',
// 				},
// 			];

// 			const Subject = 'Forgot Password';
// 			// Send mail
// 			const resp = await new EmailService().sendEmail({
// 				input: {
// 					HTMLPart: HTMLPart,
// 					To,
// 					Subject,
// 					attachments: [],
// 				},
// 			});

// 			console.log('IN UTILS: ', resp);

// 			return resp;
// 		} catch (error) {
// 			console.error('otp channel:EMAIL', error);
// 			return {
// 				success: false,
// 				message:
// 					'oops something went wrong, please try again or contact Support for assistance',
// 				returnStatus: 'NOT_OK',
// 			};
// 		}
// 	},
// 	// "BOTH": async function (args: otpChannelInput,type: OTPTypeEnum = OTPTypeEnum.SIGNUP) {
// 	// 	try {
// 	// 		this["EMAIL"](args,type)
// 	// 		this["SMS"](args)
// 	// 	} catch (error) {
// 	// 		console.error("otp channel:BOTH", error);
// 	// 		return {
// 	// 			success: false,
// 	// 			message: "oops something went wrong, please try again or contact Support for assistance",
// 	// 			returnStatus: "NOT_OK"
// 	// 		}
// 	// 	}
// 	// }
// };

export const processNumber = (phoneNumber: string) => {
	//if phone number is an empty string or null or undefined, return empty string
	if (!phoneNumber) {
		return '';
	}
	let firstDigit = phoneNumber.charAt(0);
	if (firstDigit == '0') {
		let formatted = phoneNumber.replace('0', '234').replace(/\s/g, '');
		phoneNumber = formatted;
	}
	//if first digit is +, remove it
	if (firstDigit == '+') {
		let formatted = phoneNumber.replace('+', '').replace(/\s/g, '');
		phoneNumber = formatted;
	}
	//Remove space from Phone Number
	phoneNumber = phoneNumber.replace(/\s/g, '');
	return phoneNumber;
};

export function pagination(total: number, page: number, limit: number) {
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

export const extractPaginationFromQuery = (query: any) => {
	const page = parseInt(query.page as string) || config.DEFAULT_PAGE;
	const limit = parseInt(query.limit as string) || config.DEFAULT_LIMIT;
	const input: IPaging = { ...query, page, limit };

	return input;
};

export function errorData(error: any, service: string) {
	console.log(error);
	const errorLog: ILog = {
		level: LogLevelEnum.ERROR,
		message: error.message || 'An error occured',
		service,
		stack: error.stack,
	};
	return errorLog;
}
