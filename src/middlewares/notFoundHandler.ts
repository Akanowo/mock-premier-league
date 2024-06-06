import { Request, Response, NextFunction } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { UtilsFactory } from '../services/factories';

const _utilsService = UtilsFactory();

const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
	const data = _utilsService.ResultFunction(
		false,
		ReasonPhrases.NOT_FOUND,
		StatusCodes.NOT_FOUND,
		ReasonPhrases.NOT_FOUND,
		null
	);
	return res.status(data.code).json(data);
};

export default notFoundHandler;
