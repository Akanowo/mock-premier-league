import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { SessionStoreFactory } from '../services/factories';
import logRequest from '../middlewares/logRequest';
import apiRouter from '../routes';
import errorHandler from '../middlewares/errorHandler';
import notFoundHandler from '../middlewares/notFoundHandler';

function bootstrapAppUtilities(app: Application) {
	const sessionStore = SessionStoreFactory();

	app.use(sessionStore.getSessionMiddleware());

	app.use(cors());

	app.use(express.json());
	app.use(express.urlencoded({ extended: false }));

	// HANDLE ROUTING
	app.use('/api/v1', logRequest, apiRouter);

	app.use('**', notFoundHandler);

	app.use(errorHandler);
}

export default bootstrapAppUtilities;
