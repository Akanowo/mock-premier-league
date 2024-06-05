import { Types } from 'mongoose';

export interface ITeam {
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

export interface IPlayer {
	name: {
		first: string;
		last: string;
		display: string;
	};
	birthDetails: {
		date: Date;
		place: string;
		age: string;
	};
	position: string;
	nationality: string;
	heightInCM: number;
	currentTeamId: Types.ObjectId | ITeam;
	info: {
		loan: boolean;
		position: string;
		positionInfo: string;
		shirtNumber: number;
	};
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

export interface IFixture {
	teams: Types.ObjectId[] | ITeam[];
	gameweek: number;
	attendance: number;
	venue: Omit<IStadium, 'capacity' | 'location'>;
	goals: IFixtureGoal[];
	clock: IFixtureClock;
	status: FixtureStatusTypes;
	outcome: FixtureOutcomeEnum;
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
