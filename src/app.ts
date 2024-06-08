import express from 'express';
import { LoggerFactory } from './services/factories';
import { dbFactory } from './database/dbFactory';
import chalk from 'chalk';
import bootstrapAppUtilities from './config/utilities';
import { config } from './helpers/config';

const app = express();
const PORT = config.PORT;

bootstrapAppUtilities(app);

const logger = LoggerFactory().logger;

app.listen(PORT, async () => {
	await dbFactory().connect();
	logger.info(chalk.blue(`Listening on ${PORT}`));
});
