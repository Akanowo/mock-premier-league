import CacheService from '../../config/CacheService';
import SessionStore from '../../config/SessionStore';
import Utils from '../../helpers/utils';
import Logger from '../Logger';

const LoggerFactory = () => {
	return new Logger();
};

const SessionStoreFactory = () => {
	return new SessionStore();
};

const UtilsFactory = () => {
	return new Utils();
};

const CacheServiceFactory = () => {
	return new CacheService(LoggerFactory().logger, UtilsFactory());
};

export {
	LoggerFactory,
	SessionStoreFactory,
	CacheServiceFactory,
	UtilsFactory,
};
