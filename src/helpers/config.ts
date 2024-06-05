export const config = {
	DATABASE_URL: process.env.DATABASE_URL || '',
	JWT_HASH: process.env.JWT_HASH || '',
	nodeEnv: process.env.NODE_ENV || 'development',
	EXPIRATION_TIME: Number(process.env.EXPIRATION_TIME) || 20,
	DEFAULT_PAGE: 1,
	DEFAULT_LIMIT: 10,
};
