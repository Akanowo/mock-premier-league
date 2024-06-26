import { NextFunction, Request, Response } from 'express';
import { TeamFactory, UtilsFactory } from '../services/factories';

const factory = TeamFactory();
const _utilsService = UtilsFactory();

export const createTeam = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const response = await factory.create(req.body);
	return res.status(response.code).json(response);
};

export const getAllTeams = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const pagination = _utilsService.extractPaginationFromQuery(req.query);
	const response = await factory.getAll(pagination);
	return res.status(response.code).json(response);
};

export const getOneTeam = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const response = await factory.getOne(req.params.id);
	return res.status(response.code).json(response);
};

export const editTeam = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const response = await factory.edit(req.params.id, req.body);
	return res.status(response.code).json(response);
};

export const deleteTeam = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const response = await factory.delete(req.params.id);
	return res.status(response.code).json(response);
};
