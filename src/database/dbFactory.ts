// dbFactory.ts
import { MongooseDatabase } from './mongooseDb';
import { DatabaseInterface, IDBConfig } from '../types/db';
import { config } from '../helpers/config';

export function createDatabase(config: IDBConfig): DatabaseInterface {
	switch (config.type) {
		case 'mongodb':
			if (!config.uri || !config.options) {
				throw new Error('Missing MongoDB configuration');
			}
			return new MongooseDatabase(config.uri, config.options);

		default:
			throw new Error('Unsupported database type');
	}
}

export function dbFactory() {
	const dbConfig: IDBConfig = {
		type: 'mongodb',
		uri: config.DATABASE_URL,
		options: {},
	};
	const db = createDatabase(dbConfig);
	return db;
}
