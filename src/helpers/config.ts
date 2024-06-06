const redisPassword = process.env.REDIS_PASSWORD;
const redisHost = process.env.REDIS_HOST;
const redisPort = process.env.REDIS_PORT;

if (!redisPassword || !redisHost || !redisPort) {
	throw 'MISSING REDIS CONFIG IN ENV';
}

export const config = {
	DATABASE_URL: process.env.DATABASE_URL || '',
	SESSION_SECRET: process.env.SESSION_SECRET,
	REDIS_PASSWORD: redisPassword,
	REDIS_HOST: redisHost,
	REDIS_PORT: redisPort,
	JWT_SECRET: process.env.JWT_SECRET || '',
	nodeEnv: process.env.NODE_ENV || 'development',
	EXPIRATION_TIME: Number(process.env.EXPIRATION_TIME) || 20,
	DEFAULT_PAGE: 1,
	DEFAULT_LIMIT: 10,
};
