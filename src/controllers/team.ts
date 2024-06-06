import { NextFunction, Request, Response } from 'express';
import { TeamFactory, UtilsFactory } from '../services/factories';

const factory = TeamFactory();
const _utilsService = UtilsFactory();

export const getAllTeams = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const pagination = _utilsService.extractPaginationFromQuery(req.query);
	const response = await factory.getAll(pagination);
	return res.status(response.code).json(response);
};
