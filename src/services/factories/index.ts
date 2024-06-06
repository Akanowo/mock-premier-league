import CacheService from '../../config/CacheService';
import SessionStore from '../../config/SessionStore';
import Logger from '../Logger';

const LoggerFactory = () => {
	return new Logger();
};

const SessionStoreFactory = () => {
	return new SessionStore();
};

const CacheServiceFactory = () => {
	return new CacheService(LoggerFactory().logger);
};

export { LoggerFactory, SessionStoreFactory, CacheServiceFactory };
