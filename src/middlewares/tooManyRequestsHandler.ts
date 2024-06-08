import { Request, Response, NextFunction } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { UtilsFactory } from '../services/factories';

const _utilsService = UtilsFactory();

const tooManyRequestsHandler = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const data = _utilsService.ResultFunction(
		false,
		ReasonPhrases.TOO_MANY_REQUESTS,
		StatusCodes.TOO_MANY_REQUESTS,
		ReasonPhrases.TOO_MANY_REQUESTS,
		null
	);
	return res.status(data.code).json(data);
};

export default tooManyRequestsHandler;
