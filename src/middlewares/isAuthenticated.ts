// jwtMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import {
	CacheServiceFactory,
	LoggerFactory,
	UtilsFactory,
} from '../services/factories';
import { config } from '../helpers/config';
import { JWTData } from '../types/generic';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

const _cacheService = CacheServiceFactory();
const _loggerService = LoggerFactory().logger;
const _utilsService = UtilsFactory();

const isAuthenticated = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const token = req.headers.authorization?.split(' ')[1];

	if (!token) {
		return res
			.status(401)
			.json({ message: 'Access token is missing or invalid' });
	}

	try {
		const decoded = jwt.verify(token, config.JWT_SECRET) as JWTData;
		const session = await _cacheService.getCachedData(`sess:${decoded.id}`);

		if (!session) {
			return res.status(401).json({ message: 'Session is invalid or expired' });
		}

		res.locals.user = session;
		next();
	} catch (error) {
		_loggerService.error(_utilsService.errorData(error, 'isAuthenticated'));
		const response = _utilsService.ResultFunction(
			false,
			ReasonPhrases.UNAUTHORIZED,
			StatusCodes.UNAUTHORIZED,
			ReasonPhrases.UNAUTHORIZED,
			null
		);
		return res.status(response.code).json(response);
	}
};

export default isAuthenticated;
