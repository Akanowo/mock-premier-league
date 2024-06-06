import { Router } from 'express';
import joiMiddleware from '../middlewares/joiMiddleware';
import { pagingValidator } from '../validators';
import { getAllTeams } from '../controllers';
import isAuthenticated from '../middlewares/isAuthenticated';

const teamRouter = Router();

teamRouter.get(
	'/',
	isAuthenticated,
	joiMiddleware(pagingValidator, 'query'),
	getAllTeams
);

export default teamRouter;
