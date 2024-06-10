import { FixtureModel, TeamModel, TeamStatModel } from '../../models';
import { IFixture, ITeamStats } from '../../types/League';

async function seedTeamStats() {
	try {
		const teamStats: ITeamStats[] = [];

		const teams = await TeamModel.find();

		console.log(teams);

		for (let i = 0; i < teams.length; i++) {
			const team = teams[i];

			teamStats.push({
				away: {
					drawn: 0,
					goalDifference: 0,
					goalsAgainst: 0,
					goalsFor: 0,
					lost: 0,
					played: 0,
					points: 0,
					won: 0,
				},
				home: {
					drawn: 0,
					goalDifference: 0,
					goalsAgainst: 0,
					goalsFor: 0,
					lost: 0,
					played: 0,
					points: 0,
					won: 0,
				},
				overall: {
					drawn: 0,
					goalDifference: 0,
					goalsAgainst: 0,
					goalsFor: 0,
					lost: 0,
					played: 0,
					points: 0,
					won: 0,
				},
				team: team._id,
			});
		}

		await TeamStatModel.insertMany(teamStats);
	} catch (error) {
		console.log('error seeding fixtures: ', error);
	}
}

export default seedTeamStats;
