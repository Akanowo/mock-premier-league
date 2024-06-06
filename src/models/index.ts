import mongoose, { Model } from 'mongoose';
import { ILog } from '../types/Log';
import {
	apiLogSchema,
	apiRequestSchema,
	fixtureSchema,
	playerSchema,
	teamSchema,
	teamStatSchema,
	userSchema,
} from './schemas';
import {
	API_ERROR_COLLECTION_NAME,
	API_REQUEST_COLLECTION_NAME,
	FIXTURE_COLLECTION,
	PLAYER_COLLECTION,
	TEAM_COLLECTION,
	TEAM_STATS_COLLECTION,
	USER_COLLECTION,
} from '../helpers/constants';
import { IUser } from '../types/User';
import { IFixture, IPlayer, ITeam, ITeamStats } from '../types/League';

export const ApiErrorModel = mongoose.model<ILog>(
	API_ERROR_COLLECTION_NAME,
	apiLogSchema
);
export const ApiRequest = mongoose.model(
	API_REQUEST_COLLECTION_NAME,
	apiRequestSchema
);

export const UserModel = mongoose.model<IUser>(USER_COLLECTION, userSchema);
export const TeamModel = mongoose.model<ITeam>(TEAM_COLLECTION, teamSchema);
export const FixtureModel = mongoose.model<IFixture>(
	FIXTURE_COLLECTION,
	fixtureSchema
);
export const PlayerModel = mongoose.model<IPlayer>(
	PLAYER_COLLECTION,
	playerSchema
);
export const TeamStatModel = mongoose.model<ITeamStats>(
	TEAM_STATS_COLLECTION,
	teamStatSchema
);

export const ModelMap: Record<string, Model<any>> = {
	[USER_COLLECTION]: UserModel,
	[FIXTURE_COLLECTION]: FixtureModel,
	[PLAYER_COLLECTION]: PlayerModel,
	[TEAM_COLLECTION]: TeamModel,
	[TEAM_STATS_COLLECTION]: TeamStatModel,
};
