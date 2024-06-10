import { Router } from 'express';
import joiMiddleware from '../middlewares/joiMiddleware';
import {
	createTeamValidator,
	editTeamValidator,
	objectIdValidator,
	pagingValidator,
} from '../validators';
import {
	createTeam,
	deleteTeam,
	editTeam,
	getAllTeams,
	getOneTeam,
} from '../controllers';
import isAuthenticated from '../middlewares/isAuthenticated';
import isAuthorized from '../middlewares/isAuthorized';
import playerRouter from './player';

const teamRouter = Router();

teamRouter
	.route('/')
	.get(joiMiddleware(pagingValidator, 'query'), getAllTeams)
	.post(
		isAuthenticated,
		isAuthorized('admin'),
		joiMiddleware(createTeamValidator),
		createTeam
	);

teamRouter
	.route('/:id')
	.get(isAuthenticated, joiMiddleware(objectIdValidator, 'params'), getOneTeam)
	.put(
		isAuthenticated,
		isAuthorized('admin'),
		joiMiddleware(objectIdValidator, 'params'),
		joiMiddleware(editTeamValidator),
		editTeam
	)
	.delete(
		isAuthenticated,
		isAuthorized('admin'),
		joiMiddleware(objectIdValidator, 'params'),
		deleteTeam
	);

teamRouter.use('/:teamId/players', playerRouter);

export default teamRouter;
