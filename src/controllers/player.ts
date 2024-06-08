import { NextFunction, Request, Response } from 'express';
import { PlayerFactory, UtilsFactory } from '../services/factories';

const factory = PlayerFactory();
const _utilsService = UtilsFactory();

export const createPlayer = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const response = await factory.create(req.body);
	return res.status(response.code).json(response);
};

export const getAllPlayers = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const pagination = _utilsService.extractPaginationFromQuery(req.query);
	const response = await factory.getAll(req.params.teamId, pagination);
	return res.status(response.code).json(response);
};

export const getOnePlayer = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const response = await factory.getOne(req.params.teamId, req.params.playerId);
	return res.status(response.code).json(response);
};

export const editPlayer = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const response = await factory.edit(
		req.params.teamId,
		req.params.playerId,
		req.body
	);
	return res.status(response.code).json(response);
};

export const deletePlayer = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const response = await factory.delete(req.params.teamId, req.params.playerId);
	return res.status(response.code).json(response);
};
