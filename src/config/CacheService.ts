import { Logger } from 'winston';
import RedisClient from './RedisClient';
import Utils from '../helpers/utils';

class CacheService {
	private client;
	private loggerService: Logger;
	private _utilsService: Utils;

	constructor(loggerService: Logger, utilsService: Utils) {
		this.client = RedisClient.getInstance().getClient();
		this.loggerService = loggerService;
		this._utilsService = utilsService;
	}

	public async getCachedData<T>(key: string): Promise<T | null> {
		try {
			const data = await this.client.get(key);
			return data ? JSON.parse(data) : null;
		} catch (err) {
			this.loggerService.error(
				this._utilsService.errorData(err, 'getCachedData')
			);
			return null;
		}
	}

	public async setCachedData(
		key: string,
		value: any,
		ttl: number = 3600
	): Promise<void> {
		try {
			await this.client.set(key, JSON.stringify(value), {
				EX: ttl,
			});
		} catch (err) {
			this.loggerService.error(
				this._utilsService.errorData(err, 'setCachedData')
			);
		}
	}
}

export default CacheService;
