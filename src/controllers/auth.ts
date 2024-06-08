import { NextFunction, Request, Response } from 'express';
import { AuthFactory } from '../services/factories';

const factory = AuthFactory();

export const loginController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const paths = req.originalUrl.split('/');
	const fromAdmin = paths.includes('admin');
	const response = await factory.login(req.body, fromAdmin);
	return res.status(response.code).json(response);
};

export const signupController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// check if the request came from the admin route
	const paths = req.originalUrl.split('/');
	const fromAdmin = paths.includes('admin');
	const response = await factory.signup(req.body, fromAdmin);
	return res.status(response.code).json(response);
};
