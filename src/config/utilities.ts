import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import { SessionStoreFactory } from '../services/factories';
import logRequest from '../middlewares/logRequest';
import apiRouter from '../routes';
import errorHandler from '../middlewares/errorHandler';
import notFoundHandler from '../middlewares/notFoundHandler';
import { StatusCodes } from 'http-status-codes';
import tooManyRequestsHandler from '../middlewares/tooManyRequestsHandler';

function bootstrapAppUtilities(app: Application) {
	const sessionStore = SessionStoreFactory();

	app.use(sessionStore.getSessionMiddleware());

	app.use(cors());

	app.use(express.json());
	app.use(express.urlencoded({ extended: false }));

	// configure rate limiter
	const limiter = rateLimit({
		windowMs: 60 * 1000,
		limit: 50,
		standardHeaders: 'draft-7',
		legacyHeaders: false,
		statusCode: StatusCodes.TOO_MANY_REQUESTS,
		handler: tooManyRequestsHandler,
	});

	app.use(limiter);

	// HANDLE ROUTING
	app.use('/api/v1', logRequest, apiRouter);

	app.use('**', notFoundHandler);

	app.use(errorHandler);
}

export default bootstrapAppUtilities;
