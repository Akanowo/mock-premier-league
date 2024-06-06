import express from 'express';
import { LoggerFactory } from './services/factories';
import { initDb } from './database/dbFactory';
import chalk from 'chalk';
import bootstrapAppUtilities from './config/utilities';

const app = express();
const PORT = process.env.PORT || 8080;

bootstrapAppUtilities(app);

const logger = LoggerFactory().logger;

app.listen(PORT, async () => {
	await initDb().connect();
	logger.info(chalk.blue(`Listening on ${PORT}`));
});
