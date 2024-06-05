import winston, { LogCallback } from 'winston';
import Transport from 'winston-transport';
import { ILog } from '../types/Log';
import { ApiErrorModel } from '../models';

class DBTransport extends Transport {
	constructor(opts: Transport.TransportStreamOptions) {
		super(opts);
	}

	async log(info: ILog, callback: LogCallback) {
		setImmediate(() => {
			this.emit('logged', info);
		});

		// write log to db
		await ApiErrorModel.create(info);

		callback();
	}
}

class Logger {
	logger: winston.Logger;

	constructor() {
		const logger = winston.createLogger({
			format: winston.format.json(),
			// defaultMeta: { service: 'WnP-service' },
			transports: [
				//
				// - Write all logs with importance level of `error` or less to `error.log`
				// - Write all logs with importance level of `info` or less to `combined.log`
				//
				new DBTransport({ level: 'error' }),
				new winston.transports.File({ filename: 'error.log', level: 'error' }),
				new winston.transports.File({ filename: 'combined.log' }),
			],
		});

		//
		// If we're not in production then log to the `console` with the format:
		// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
		//
		if (process.env.NODE_ENV !== 'production') {
			logger.add(
				new winston.transports.Console({
					format: winston.format.simple(),
				})
			);
		}
		this.logger = logger;
	}
}

export default Logger;
