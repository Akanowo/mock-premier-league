import express, { Request, Response } from 'express';
import cors from 'cors';
import apiRouter from './routes';
import { ResultFunction } from './helpers/utils';
import { ReturnStatus } from './types/generic';
import errorHandler from './middlewares/errorHandler';
import logRequest from './middlewares/logRequest';
import { LoggerFactory } from './services/factories';
import { initDb } from './database/dbFactory';
import chalk from 'chalk';

const app = express();
const PORT = process.env.PORT || 8080;

const logger = LoggerFactory().logger;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/v1', logRequest, apiRouter);

app.use('**', (req: Request, res: Response) => {
	const data = ResultFunction(
		false,
		'NOT FOUND',
		404,
		ReturnStatus.NOT_FOUND,
		null
	);
	return res.status(data.code).json(data);
});

app.use(errorHandler);

app.listen(PORT, async () => {
	await initDb().connect();
	logger.info(chalk.blue(`Listening on ${PORT}`));
});
