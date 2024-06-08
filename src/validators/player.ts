import Joi from 'joi';
import {
	IPlayer,
	IPlayerBirthDetails,
	IPlayerInfo,
	IPlayerName,
} from '../types/League';
import { objectIdValidator } from './generic';

export const createPlayerValidator = Joi.object<IPlayer>({
	name: Joi.object<IPlayerName>({
		first: Joi.string().max(50).required(),
		last: Joi.string().max(50).required(),
		display: Joi.string().max(100).required(),
	}),
	birthDetails: Joi.object<IPlayerBirthDetails>({
		date: Joi.date().required(),
		place: Joi.string().max(100).required(),
		age: Joi.number().required(),
	}),
	position: Joi.string().required(),
	nationality: Joi.string().max(100).required(),
	heightInCM: Joi.number().required(),
	currentTeam: objectIdValidator,
	info: Joi.object<IPlayerInfo>({
		loan: Joi.boolean().required(),
		position: Joi.string().required(),
		positionInfo: Joi.string().required(),
		shirtNumber: Joi.number().required(),
	}),
});

export const editPlayerValidator = Joi.object<IPlayer>({
	name: Joi.object<IPlayerName>({
		first: Joi.string().max(50),
		last: Joi.string().max(50),
		display: Joi.string().max(100),
	}),
	birthDetails: Joi.object<IPlayerBirthDetails>({
		date: Joi.date(),
		place: Joi.string().max(100),
		age: Joi.number(),
	}),
	position: Joi.string(),
	nationality: Joi.string().max(100),
	heightInCM: Joi.number(),
	currentTeam: objectIdValidator,
	info: Joi.object<IPlayerInfo>({
		loan: Joi.boolean(),
		position: Joi.string(),
		positionInfo: Joi.string(),
		shirtNumber: Joi.number(),
	}),
});
