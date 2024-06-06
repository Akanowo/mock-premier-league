import { NextFunction, Request, Response } from 'express';
import { AuthFactory } from '../services/factories';

const factory = AuthFactory();

export const loginController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const response = await factory.login(req.body);
	return res.status(response.code).json(response);
};

export const signupController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const response = await factory.signup(req.body);
	return res.status(response.code).json(response);
};
