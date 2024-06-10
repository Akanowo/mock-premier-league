import Joi from 'joi';
import { objectIdValidator, pagingValidator } from './generic';
import { FixtureVenue, IFixture } from '../types/League';

const fixturesFilters = Joi.object({
	status: Joi.string().valid('pending', 'concluded', 'ongoing', 'postponed'),
});

export const getFixturesQueryValidator =
	pagingValidator.concat(fixturesFilters);

export const createFixtureValidator = Joi.object<IFixture>({
	homeTeam: objectIdValidator,
	awayTeam: objectIdValidator.not(Joi.ref('homeTeam')),
	gameweek: Joi.number().required(),
	date: Joi.date().required(),
	status: Joi.string()
		.valid('pending', 'concluded', 'postponed', 'ongoing')
		.required(),
	venue: Joi.object<FixtureVenue>({
		name: Joi.string().required(),
		city: Joi.string().required(),
	}),
});

export const editFixtureValidator = Joi.object<IFixture>({
	homeTeam: objectIdValidator,
	awayTeam: objectIdValidator,
	attendance: Joi.number(),
	gameweek: Joi.number(),
	date: Joi.date(),
	status: Joi.string().valid('pending', 'concluded', 'postponed', 'ongoing'),
	venue: Joi.object<FixtureVenue>({
		name: Joi.string(),
		city: Joi.string(),
	}),
});
