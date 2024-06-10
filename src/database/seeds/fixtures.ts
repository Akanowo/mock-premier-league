import { FixtureModel, TeamModel } from '../../models';
import { IFixture } from '../../types/League';

async function seedFixtures() {
	try {
		const fixtures: IFixture[] = [];

		const teams = await TeamModel.find();

		console.log(teams);

		for (let i = 0; i < teams.length; i++) {
			const homeTeam = teams[i];

			if (!homeTeam) continue;

			for (let j = 0; j < teams.length; j++) {
				const awayTeam = teams[j];
				if (String(homeTeam._id) === String(awayTeam._id)) continue;

				fixtures.push({
					homeTeam: homeTeam._id,
					awayTeam: awayTeam._id,
					gameweek: i,
					status: 'pending',
					venue: {
						city: homeTeam.stadium.city,
						name: homeTeam.stadium.name,
					},
					teamsDetails: [
						{
							name: homeTeam.name,
						},
						{
							name: awayTeam.name,
						},
					],
					date: new Date('2024-08-12'),
					attendance: 0,
					clock: {
						label: '',
						minutes: 0,
						seconds: 0,
					},
					goals: [],
				});
			}
		}

		await FixtureModel.insertMany(fixtures);
	} catch (error) {
		console.log('error seeding fixtures: ', error);
	}
}

export default seedFixtures;
