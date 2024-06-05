import { Schema } from 'mongoose';
import { ITeamStats, ITeamStatsBreakdown } from '../../types/League';
import {
	NUMBER_AND_OPTIONAL,
	NUMBER_AND_REQUIRED,
	OBJECTID_AND_REQUIRED,
} from '../../helpers/constants';
import { opts } from '../../helpers/utils';

const teamStatsBreakdownSchema = new Schema<ITeamStatsBreakdown>(
	{
		drawn: NUMBER_AND_OPTIONAL,
		lost: NUMBER_AND_OPTIONAL,
		won: NUMBER_AND_OPTIONAL,
		goalDifference: NUMBER_AND_OPTIONAL,
		goalsAgainst: NUMBER_AND_OPTIONAL,
		goalsFor: NUMBER_AND_OPTIONAL,
		played: NUMBER_AND_OPTIONAL,
		points: NUMBER_AND_OPTIONAL,
	},
	{ _id: false }
);

const teamStatSchema = new Schema<ITeamStats>(
	{
		away: teamStatsBreakdownSchema,
		home: teamStatsBreakdownSchema,
		overall: teamStatsBreakdownSchema,
		team: { ...OBJECTID_AND_REQUIRED, ref: 'Team' },
	},
	opts
);

export { teamStatSchema };
