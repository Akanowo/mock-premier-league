import { Logger } from 'winston';
import RedisClient from './RedisClient';
import { errorData } from '../helpers/utils';

class CacheService {
	private client;
	private loggerService: Logger;

	constructor(loggerService: Logger) {
		this.client = RedisClient.getInstance().getClient();
		this.loggerService = loggerService;
	}

	public async getCachedData<T>(key: string): Promise<T | null> {
		try {
			const data = await this.client.get(key);
			return data ? JSON.parse(data) : null;
		} catch (err) {
			this.loggerService.error(errorData(err, 'getCachedData'));
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
			this.loggerService.error(errorData(err, 'setCachedData'));
		}
	}
}

export default CacheService;
