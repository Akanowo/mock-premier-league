import { Schema } from 'mongoose';
import { IStadium, ITeam } from '../../types/League';
import {
	NUMBER_AND_OPTIONAL,
	NUMBER_AND_REQUIRED,
	STRING_AND_REQUIRED,
} from '../../helpers/constants';
import { opts } from '../../helpers/utils';

const stadiumSchema = new Schema<IStadium>(
	{
		name: STRING_AND_REQUIRED,
		city: STRING_AND_REQUIRED,
		capacity: NUMBER_AND_REQUIRED,
		location: {
			latitude: NUMBER_AND_OPTIONAL,
			longitude: NUMBER_AND_OPTIONAL,
		},
	},
	{ _id: false }
);

const teamSchema = new Schema<ITeam>(
	{
		name: STRING_AND_REQUIRED,
		coach: STRING_AND_REQUIRED,
		yearFounded: NUMBER_AND_REQUIRED,
		logo: STRING_AND_REQUIRED,
		position: NUMBER_AND_REQUIRED,
		startingPosition: NUMBER_AND_REQUIRED,
		stadium: stadiumSchema,
	},
	opts
);

teamSchema.index({ name: 1 });
teamSchema.index({ coach: 1 });
teamSchema.index({ 'stadium.name': 1 });

export { teamSchema };
