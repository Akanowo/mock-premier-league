import CacheService from '../../config/CacheService';
import SessionStore from '../../config/SessionStore';
import { dbFactory } from '../../database/dbFactory';
import Utils from '../../helpers/utils';
import { IAuthDeps } from '../../types/Auth';
import { ITeamDeps } from '../../types/League';
import Logger from '../Logger';
import Auth from '../classes/Auth';
import Team from '../classes/Team';

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

const AuthFactory = () => {
	const deps: IAuthDeps = {
		db: dbFactory(),
		_cacheService: CacheServiceFactory(),
		_loggerService: LoggerFactory().logger,
		_utilsService: UtilsFactory(),
	};

	return new Auth(deps);
};

const TeamFactory = () => {
	const deps: ITeamDeps = {
		db: dbFactory(),
		_cacheService: CacheServiceFactory(),
		_loggerService: LoggerFactory().logger,
		_utilsService: UtilsFactory(),
	};

	return new Team(deps);
};

export {
	LoggerFactory,
	SessionStoreFactory,
	CacheServiceFactory,
	UtilsFactory,
	AuthFactory,
	TeamFactory,
};
