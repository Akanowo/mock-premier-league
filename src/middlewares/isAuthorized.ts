import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { UtilsFactory } from '../services/factories';

const _utilsService = UtilsFactory();

const isAuthorized =
	(...roles: ('admin' | 'user')[]) =>
	(_: Request, res: Response, next: NextFunction) => {
		if (!roles.includes(res.locals.user.accountType)) {
			const response = _utilsService.ResultFunction(
				false,
				ReasonPhrases.FORBIDDEN,
				StatusCodes.FORBIDDEN,
				ReasonPhrases.FORBIDDEN,
				null
			);
			return res.status(response.code).json(response);
		}

		return next();
	};

export default isAuthorized;
