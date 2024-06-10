import { Router } from 'express';
import joiMiddleware from '../middlewares/joiMiddleware';
import {
	createFixtureValidator,
	editFixtureValidator,
	getFixturesQueryValidator,
	objectIdValidator,
	pagingValidator,
} from '../validators';
import {
	createFixture,
	deleteFixture,
	editFixture,
	getAllFixtures,
	getOneFixture,
} from '../controllers';
import isAuthenticated from '../middlewares/isAuthenticated';
import isAuthorized from '../middlewares/isAuthorized';

const fixtureRouter = Router();

fixtureRouter
	.route('/')
	.get(joiMiddleware(getFixturesQueryValidator, 'query'), getAllFixtures)
	.post(
		isAuthenticated,
		isAuthorized('admin'),
		joiMiddleware(createFixtureValidator),
		createFixture
	);

fixtureRouter
	.route('/:id')
	.get(
		isAuthenticated,
		joiMiddleware(objectIdValidator, 'params'),
		getOneFixture
	)
	.put(
		isAuthenticated,
		isAuthorized('admin'),
		joiMiddleware(objectIdValidator, 'params'),
		joiMiddleware(editFixtureValidator),
		editFixture
	)
	.delete(
		isAuthenticated,
		isAuthorized('admin'),
		joiMiddleware(objectIdValidator, 'params'),
		deleteFixture
	);

export default fixtureRouter;
