import express from 'express';
import { LoggerFactory } from './services/factories';
import { dbFactory } from './database/dbFactory';
import chalk from 'chalk';
import bootstrapAppUtilities from './config/utilities';

const app = express();
const PORT = process.env.PORT || 8080;

bootstrapAppUtilities(app);

const logger = LoggerFactory().logger;

app.listen(PORT, async () => {
	await dbFactory().connect();
	logger.info(chalk.blue(`Listening on ${PORT}`));
});
