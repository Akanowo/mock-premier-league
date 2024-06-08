import Joi from 'joi';
import { IStadium, ITeam } from '../types/League';

export const createTeamValidator = Joi.object<ITeam>({
	name: Joi.string().required().min(3).max(50),
	coach: Joi.string().required().min(3).max(50),
	logo: Joi.string().uri().required(),
	yearFounded: Joi.number().required(),
	position: Joi.number(),
	startingPosition: Joi.number(),
	stadium: Joi.object<IStadium>({
		name: Joi.string().required().min(3).max(100),
		capacity: Joi.number().required(),
		city: Joi.string().required().max(50),
		location: Joi.object({
			longitude: Joi.number().required(),
			latitude: Joi.number().required(),
		}),
	}),
});

export const editTeamValidator = Joi.object<Partial<ITeam>>({
	name: Joi.string().min(3).max(50),
	coach: Joi.string().min(3).max(50),
	logo: Joi.string().uri(),
	yearFounded: Joi.number(),
	position: Joi.number(),
	startingPosition: Joi.number(),
	stadium: Joi.object<IStadium>({
		name: Joi.string().min(3).max(100),
		capacity: Joi.number(),
		city: Joi.string().max(50),
		location: Joi.object({
			longitude: Joi.number(),
			latitude: Joi.number(),
		}),
	}),
});
