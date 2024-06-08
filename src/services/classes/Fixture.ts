import { FilterQuery } from 'mongoose';
import { FIXTURE_COLLECTION } from '../../helpers/constants';
import {
	IFixture,
	IFixtureDeps,
	IFixtureDocument,
	IGetFixtureQuery,
	ITeamDocument,
} from '../../types/League';
import { IPaging, IPagingQuery, ResultObject } from '../../types/generic';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

class Fixture {
	private deps: IFixtureDeps;

	constructor(deps: IFixtureDeps) {
		this.deps = deps;
	}

	public async getAll(input: IGetFixtureQuery) {
		const { db, _loggerService, _utilsService, _cacheService } = this.deps;
		const { page, limit } = input;
		const cacheKey = `fixtures:page:${page}:limit:${limit}`;
		try {
			// check if the data is already in cache and return from there instead
			const cacheData = await _cacheService.getCachedData(cacheKey);
			if (cacheData) {
				return _utilsService.ResultFunction(
					true,
					'resource fetched successfully',
					StatusCodes.OK,
					ReasonPhrases.OK,
					cacheData
				);
			}

			let query: FilterQuery<IFixture> = {};

			// build search query
			if (input.search) {
				query['$or'] = [
					{
						'teamDetails.name': {
							$regex: input.search,
							$options: 'i',
						},
					},
					{
						'venue.name': {
							$regex: input.search,
							$options: 'i',
						},
					},
					{
						'venue.city': {
							$regex: input.search,
							$options: 'i',
						},
					},
				];
			}

			// filter by fixture status
			if (input.status) {
				query.status = input.status;
			}

			const total = await db.count(FIXTURE_COLLECTION, query);

			const { skip, limit, ...paginationData } = _utilsService.pagination(
				total,
				input.page,
				input.limit
			);

			const paginationQuery: IPagingQuery = {
				skip,
				limit,
				populate: [],
				sort: '-createdAt',
			};

			const fixtures: IFixtureDocument[] = await db.paginate(
				FIXTURE_COLLECTION,
				query,
				paginationQuery
			);

			const responseData = {
				pagination: paginationData,
				data: fixtures.map((fixture) => ({
					...fixture.toObject(),
					link: _utilsService.generateLink(fixture),
				})),
			};

			// store repsonse data in cache
			_cacheService.setCachedData(cacheKey, responseData);

			return _utilsService.ResultFunction(
				true,
				'resource fetched successfully',
				StatusCodes.OK,
				ReasonPhrases.OK,
				responseData
			);
		} catch (error) {
			_loggerService.error(_utilsService.errorData(error, 'getAllFixtures'));
			return _utilsService.ResultFunction(
				false,
				'something went wrong',
				StatusCodes.UNPROCESSABLE_ENTITY,
				ReasonPhrases.UNPROCESSABLE_ENTITY,
				null
			);
		}
	}

	public async getOne(fixtureId: string) {
		const { db, _utilsService, _loggerService } = this.deps;
		try {
			const fixture: IFixtureDocument | null = await db.findOne(
				FIXTURE_COLLECTION,
				{ _id: fixtureId }
			);

			if (!fixture)
				return _utilsService.ResultFunction(
					false,
					ReasonPhrases.NOT_FOUND,
					StatusCodes.NOT_FOUND,
					ReasonPhrases.NOT_FOUND,
					null
				);

			return _utilsService.ResultFunction(
				true,
				'resource fetched',
				StatusCodes.OK,
				ReasonPhrases.OK,
				fixture
			);
		} catch (error) {
			_loggerService.error(_utilsService.errorData(error, 'getOneFixture'));
			return _utilsService.ResultFunction(
				false,
				'something went wrong',
				StatusCodes.UNPROCESSABLE_ENTITY,
				ReasonPhrases.UNPROCESSABLE_ENTITY,
				null
			);
		}
	}

	public async create(input: IFixture) {
		const { db, _utilsService, _loggerService, _teamService } = this.deps;
		try {
			const query: FilterQuery<IFixture> = {
				homeTeam: input.homeTeam,
				awayTeam: input.awayTeam,
			};
			const fixtureExists = await db.findOne(FIXTURE_COLLECTION, query);

			if (fixtureExists)
				return _utilsService.ResultFunction(
					false,
					'fixture exists',
					StatusCodes.BAD_REQUEST,
					ReasonPhrases.BAD_REQUEST,
					null
				);

			// validate home and away teans are actual teams
			let homeTeam: ResultObject<ITeamDocument | null> | ITeamDocument =
				await _teamService.getOne(String(input.homeTeam));
			if (!homeTeam.success) {
				homeTeam.message = 'home team not found';
				return homeTeam;
			}
			let awayTeam: ResultObject<ITeamDocument | null> | ITeamDocument =
				await _teamService.getOne(String(input.awayTeam));
			if (!awayTeam.success) {
				awayTeam.message = 'away team not found';
				return awayTeam;
			}

			homeTeam = homeTeam.data as ITeamDocument;
			awayTeam = awayTeam.data as ITeamDocument;

			input.teamsDetails = [{ name: homeTeam.name }, { name: awayTeam.name }];

			const newFixture = await db.create(FIXTURE_COLLECTION, {
				...input,
				clock: {},
			});
			return _utilsService.ResultFunction(
				true,
				'fixture created',
				StatusCodes.CREATED,
				ReasonPhrases.CREATED,
				newFixture
			);
		} catch (error) {
			_loggerService.error(_utilsService.errorData(error, 'createFixture'));
			return _utilsService.ResultFunction(
				false,
				'something went wrong',
				StatusCodes.UNPROCESSABLE_ENTITY,
				ReasonPhrases.UNPROCESSABLE_ENTITY,
				null
			);
		}
	}

	public async edit(fixtureId: string, input: Partial<IFixture>) {
		const { db, _utilsService, _loggerService } = this.deps;
		try {
			const query: FilterQuery<IFixture> = {
				_id: fixtureId,
			};

			// find fixture
			const fixture = await this.getOne(fixtureId);
			if (!fixture.success) return fixture;

			const updateObj = _utilsService.flattenObject(input);

			const update: IFixtureDocument = await db.updateOne(
				FIXTURE_COLLECTION,
				query,
				updateObj,
				{ new: true }
			);

			return _utilsService.ResultFunction(
				true,
				'fixture updated',
				StatusCodes.OK,
				ReasonPhrases.OK,
				update
			);
		} catch (error) {
			_loggerService.error(_utilsService.errorData(error, 'updateFixture'));
			return _utilsService.ResultFunction(
				false,
				'something went wrong',
				StatusCodes.UNPROCESSABLE_ENTITY,
				ReasonPhrases.UNPROCESSABLE_ENTITY,
				null
			);
		}
	}

	public async delete(fixtureId: string) {
		const { db, _utilsService, _loggerService } = this.deps;
		try {
			const query: FilterQuery<IFixture> = {
				_id: fixtureId,
			};

			// find fixture
			const fixture = await this.getOne(fixtureId);
			if (!fixture.success) return fixture;

			await db.delete(FIXTURE_COLLECTION, query);

			return _utilsService.ResultFunction(
				true,
				'fixture deleted',
				StatusCodes.OK,
				ReasonPhrases.OK,
				null
			);
		} catch (error) {
			_loggerService.error(_utilsService.errorData(error, 'deleteFixture'));
			return _utilsService.ResultFunction(
				false,
				'something went wrong',
				StatusCodes.UNPROCESSABLE_ENTITY,
				ReasonPhrases.UNPROCESSABLE_ENTITY,
				null
			);
		}
	}
}

export default Fixture;
