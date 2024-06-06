import session from 'express-session';
import RedisStore from 'connect-redis';
import RedisClient from './RedisClient';

class SessionStore {
	private store;

	constructor() {
		const redisClient = RedisClient.getInstance().getClient();
		this.store = new RedisStore({ client: redisClient });
	}

	public getSessionMiddleware() {
		return session({
			store: this.store,
			secret: process.env.SESSION_SECRET!,
			resave: false,
			saveUninitialized: false,
			cookie: {
				secure: false, // set to true if using https
				maxAge: 1000 * 60 * 60 * 24, // 1 day
			},
		});
	}
}

export default SessionStore;
