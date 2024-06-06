import chalk from 'chalk';
import { RedisClientType, createClient } from 'redis';

// RedisClient.ts
import { config } from '../helpers/config';

class RedisClient {
	private static instance: RedisClient;
	private client: RedisClientType;

	constructor() {
		this.client = createClient({
			password: config.REDIS_PASSWORD,
			socket: {
				host: config.REDIS_HOST,
				port: +config.REDIS_PORT,
			},
		});

		this.client.on('error', (err) => {
			console.error(chalk.red('Redis error:', err));
		});

		this.client.on('connect', () => {
			console.log(chalk.green('Connected to Redis'));
		});

		this.client.connect().catch(console.error);
	}

	public static getInstance(): RedisClient {
		if (!RedisClient.instance) {
			RedisClient.instance = new RedisClient();
		}
		return RedisClient.instance;
	}

	public getClient(): RedisClientType {
		return this.client;
	}
}

export default RedisClient;
