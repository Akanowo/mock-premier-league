import { Schema } from 'mongoose';
import {
	IFixture,
	IFixtureClock,
	IFixtureGoal,
	ITeam,
} from '../../types/League';
import {
	NUMBER_AND_OPTIONAL,
	NUMBER_AND_REQUIRED,
	OBJECTID_AND_OPTIONAL,
	OBJECTID_AND_REQUIRED,
	OBJECTID_ARRAY_AND_REQUIRED,
	STRING_AND_OPTIONAL,
	STRING_AND_REQUIRED,
} from '../../helpers/constants';
import Utils from '../../helpers/utils';

const opts = Utils.opts;

const fixtureClockObj = new Schema<IFixtureClock>(
	{
		label: STRING_AND_OPTIONAL,
		minutes: NUMBER_AND_OPTIONAL,
		seconds: NUMBER_AND_OPTIONAL,
	},
	{ _id: false }
);

const fixtureGoalSchema = new Schema<IFixtureGoal>(
	{
		assist: { ...OBJECTID_AND_OPTIONAL, ref: 'Player' },
		player: { ...OBJECTID_AND_OPTIONAL, ref: 'Player' },
		team: { ...OBJECTID_AND_OPTIONAL, ref: 'Team' },
		time: fixtureClockObj,
	},
	{ _id: false }
);

const teamDetailsObj = new Schema<ITeam>(
	{
		name: STRING_AND_REQUIRED,
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
			...STRING_AND_OPTIONAL,
			enum: ['H', 'A', 'D', ''],
			default: '',
		},
		homeTeam: { ...OBJECTID_AND_REQUIRED, ref: 'Team' },
		awayTeam: { ...OBJECTID_AND_REQUIRED, ref: 'Team' },
		teamsDetails: [teamDetailsObj],
		goals: [fixtureGoalSchema],
		venue: {
			name: STRING_AND_REQUIRED,
			city: STRING_AND_REQUIRED,
		},
	},
	opts
);

fixtureSchema.index({
	'venue.name': 'text',
	'venue.city': 'text',
	'teamsDetails.name': 'text',
});

export { fixtureSchema };
