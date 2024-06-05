import { Schema } from 'mongoose';
import { IFixture, IFixtureClock, IFixtureGoal } from '../../types/League';
import {
	NUMBER_AND_OPTIONAL,
	NUMBER_AND_REQUIRED,
	OBJECTID_AND_OPTIONAL,
	OBJECTID_AND_REQUIRED,
	OBJECTID_ARRAY_AND_REQUIRED,
	STRING_AND_OPTIONAL,
	STRING_AND_REQUIRED,
} from '../../helpers/constants';
import { opts } from '../../helpers/utils';

const fixtureClockObj = new Schema<IFixtureClock>(
	{
		label: STRING_AND_REQUIRED,
		minutes: NUMBER_AND_REQUIRED,
		seconds: NUMBER_AND_REQUIRED,
	},
	{ _id: false }
);

const fixtureGoalSchema = new Schema<IFixtureGoal>(
	{
		assist: { ...OBJECTID_AND_OPTIONAL, ref: 'Player' },
		player: { ...OBJECTID_AND_REQUIRED, ref: 'Player' },
		team: { ...OBJECTID_AND_REQUIRED, ref: 'Team' },
		time: fixtureClockObj,
	},
	{ _id: false }
);

const fixtureSchema = new Schema<IFixture>(
	{
		attendance: NUMBER_AND_OPTIONAL,
		clock: fixtureClockObj,
		gameweek: NUMBER_AND_REQUIRED,
		status: {
			...STRING_AND_REQUIRED,
			enum: ['pending', 'ongoing', 'concluded', 'postponed'],
			default: 'pending',
		},
		outcome: {
			...STRING_AND_REQUIRED,
			enum: ['H', 'A', 'D'],
		},
		teams: { ...OBJECTID_ARRAY_AND_REQUIRED, ref: 'Team' },
		goals: fixtureGoalSchema,
		venue: {
			name: STRING_AND_REQUIRED,
			city: STRING_AND_REQUIRED,
		},
	},
	opts
);

export { fixtureSchema };
