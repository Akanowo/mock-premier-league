import { NextFunction, Request, Response } from 'express';
import { FixtureFactory, UtilsFactory } from '../services/factories';

const factory = FixtureFactory();
const _utilsService = UtilsFactory();

export const getAllFixtures = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const pagination = _utilsService.extractPaginationFromQuery(req.query);
	const response = await factory.getAll(pagination);
	return res.status(response.code).json(response);
};

export const getOneFixture = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const response = await factory.getOne(req.params.id);
	return res.status(response.code).json(response);
};

export const createFixture = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const response = await factory.create(req.body);
	return res.status(response.code).json(response);
};

export const editFixture = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const response = await factory.edit(req.params.id, req.body);
	return res.status(response.code).json(response);
};

export const deleteFixture = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const response = await factory.delete(req.params.id);
	return res.status(response.code).json(response);
};
