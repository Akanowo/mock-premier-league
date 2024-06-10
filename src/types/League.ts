import { Document, Types } from 'mongoose';
import { ILogDeps } from './Log';
import { DBTimeLogs, IDefaultDeps, IPaging } from './generic';
import Team from '../services/classes/Team';

export interface ITeam extends DBTimeLogs {
	name: string;
	stadium: IStadium;
	coach: string;
	yearFounded: number;
	logo: string;
	startingPosition: number;
	position: number;
}

export interface IStadium {
	name: string;
	city: string;
	capacity: number;
	location: {
		longitude: number;
		latitude: number;
	};
}

export interface ITeamStats {
	away: ITeamStatsBreakdown;
	home: ITeamStatsBreakdown;
	overall: ITeamStatsBreakdown;
	team: Types.ObjectId | ITeam;
}

export interface ITeamStatsBreakdown {
	drawn: number;
	goalsAgainst: number;
	goalDifference: number;
	goalsFor: number;
	lost: number;
	played: number;
	points: number;
	won: number;
}

export interface IPlayerName {
	first: string;
	last: string;
	display: string;
}

export interface IPlayerBirthDetails {
	date: Date;
	place: string;
	age: number;
}

export interface IPlayerInfo {
	loan: boolean;
	position: string;
	positionInfo: string;
	shirtNumber: number;
}

export interface IPlayer extends DBTimeLogs {
	name: IPlayerName;
	birthDetails: IPlayerBirthDetails;
	position: string;
	nationality: string;
	heightInCM: number;
	currentTeam: Types.ObjectId | ITeam;
	info: IPlayerInfo;
}

export type FixtureStatusTypes =
	| 'pending'
	| 'ongoing'
	| 'concluded'
	| 'postponed';

export enum FixtureOutcomeEnum {
	home = 'H',
	away = 'A',
	drawn = 'D',
}

export type FixtureVenue = Omit<IStadium, 'capacity' | 'location'>;

export interface IFixture extends DBTimeLogs {
	homeTeam: Types.ObjectId | ITeam;
	awayTeam: Types.ObjectId | ITeam;
	gameweek: number;
	date: Date;
	venue: FixtureVenue;
	status: FixtureStatusTypes;
	teamsDetails: Partial<ITeam>[];
	attendance?: number;
	clock?: IFixtureClock;
	outcome?: FixtureOutcomeEnum;
	goals?: IFixtureGoal[];
}

export interface IFixtureGoal {
	player: Types.ObjectId | IPlayer;
	team: Types.ObjectId | ITeam;
	time: IFixtureClock;
	assist?: Types.ObjectId | IPlayer;
}

export interface IFixtureClock {
	minutes: number;
	seconds: number;
	label: string;
}

export interface ITeamDeps extends ILogDeps, IDefaultDeps {}
export interface IFixtureDeps extends ILogDeps, IDefaultDeps {
	_teamService: Team;
}
export interface IPlayerDeps extends ILogDeps, IDefaultDeps {
	_teamService: Team;
}

export interface ITeamDocument extends Document, ITeam {}
export interface IFixtureDocument extends Document, IFixture {}
export interface IPlayerDocument extends Document, IPlayer {}

export interface IGetFixtureQuery extends IPaging {
	status?: FixtureStatusTypes;
}
