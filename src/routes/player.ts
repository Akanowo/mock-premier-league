import { Router } from 'express';
import joiMiddleware from '../middlewares/joiMiddleware';
import {
	createPlayerValidator,
	editPlayerValidator,
	objectIdValidator,
	pagingValidator,
} from '../validators';
import {
	createPlayer,
	deletePlayer,
	editPlayer,
	getAllPlayers,
	getOnePlayer,
} from '../controllers';
import isAuthenticated from '../middlewares/isAuthenticated';
import isAuthorized from '../middlewares/isAuthorized';

const playerRouter = Router({ mergeParams: true });

playerRouter
	.route('/')
	.get(isAuthenticated, joiMiddleware(pagingValidator, 'query'), getAllPlayers)
	.post(
		isAuthenticated,
		isAuthorized('admin'),
		joiMiddleware(createPlayerValidator),
		createPlayer
	);

playerRouter
	.route('/:playerId')
	.get(
		isAuthenticated,
		joiMiddleware(objectIdValidator, 'params'),
		getOnePlayer
	)
	.put(
		isAuthenticated,
		isAuthorized('admin'),
		joiMiddleware(objectIdValidator, 'params'),
		joiMiddleware(editPlayerValidator),
		editPlayer
	)
	.delete(
		isAuthenticated,
		isAuthorized('admin'),
		joiMiddleware(objectIdValidator, 'params'),
		deletePlayer
	);

export default playerRouter;
