import { NextFunction, Request, Response } from 'express';

const isAuthorize =
	(...roles: string[]) =>
	(_: Request, res: Response, next: NextFunction) => {
		if (!roles.includes(res.locals.user.accountType)) {
			return next(new Error('Not allowed'));
		}

		return next();
	};

export default isAuthorize;
