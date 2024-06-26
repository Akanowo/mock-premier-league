import { NextFunction, Request, Response } from 'express';
import { Schema } from 'joi';

const joiMiddleware =
	(schema: Schema, obj: 'body' | 'params' | 'query' = 'body') =>
	(req: Request, _: Response, next: NextFunction) => {
		try {
			const { error } = schema.validate(req[obj]);
			if (error) {
				return next(error);
			}
			return next();
		} catch (error) {
			console.log(error);
			return next(error);
		}
	};

export default joiMiddleware;
