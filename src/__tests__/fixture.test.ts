import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import Fixture from '../services/classes/Fixture'; // Adjust the path as necessary
import { IFixtureDeps, IGetFixtureQuery } from '../types/League'; // Adjust the path as necessary
import { FIXTURE_COLLECTION } from '../helpers/constants';
import {
	mockCacheService,
	mockDb,
	mockLoggerService,
	mockPaginationData,
	mockUtilsService,
} from './mock';

describe('Fixture', () => {
	let fixture: Fixture;
	let mockDeps: jest.Mocked<IFixtureDeps>;

	beforeEach(() => {
		mockDeps = {
			db: mockDb,
			_loggerService: mockLoggerService,
			_utilsService: mockUtilsService,
			_cacheService: mockCacheService,
		} as jest.Mocked<IFixtureDeps>;

		fixture = new Fixture(mockDeps);
	});

	describe('getAll', () => {
		it('should return cached data if available', async () => {
			const cacheData = [
				{
					pagination: {
						totalRecords: 1,
						pageTotal: 1,
						next: {},
						prev: {},
					},
					data: [
						{
							venue: {
								name: 'Old Trafford',
								city: 'London',
							},
							_id: '6663c459056e93a77f7de5be',
							attendance: 0,
							clock: {
								label: '',
								minutes: 0,
								seconds: 0,
							},
							gameweek: 1,
							status: 'pending',
							outcome: '',
							homeTeam: '66637f7324ed9515b68c6ce5',
							awayTeam: '6663af53d539e2bed1e1823c',
							teamsDetails: [
								{
									name: 'Manchester United',
								},
								{
									name: 'Manchester City',
								},
							],
							goals: [],
							createdAt: '2024-06-08T02:39:21.826Z',
							updatedAt: '2024-06-08T02:39:21.826Z',
							__v: 0,
							link: {
								rel: 'self',
								method: 'GET',
								href: 'http://localhost:8080/api/v1//fixtures/6663c459056e93a77f7de5be',
							},
						},
					],
				},
			];
			mockCacheService.getCachedData.mockResolvedValueOnce(cacheData);
			const input: IGetFixtureQuery = { page: 1, limit: 10 };

			const result = await fixture.getAll(input);

			expect(mockCacheService.getCachedData).toHaveBeenCalledWith(
				'fixtures:page:1:limit:10'
			);
			expect(result).toEqual(
				mockUtilsService.ResultFunction(
					true,
					'resource fetched successfully',
					StatusCodes.OK,
					ReasonPhrases.OK,
					cacheData
				)
			);
		});

		it('should fetch data from the database if not cached', async () => {
			mockCacheService.getCachedData.mockResolvedValueOnce(null);
			mockDb.count.mockResolvedValueOnce(1);
			mockUtilsService.pagination.mockReturnValueOnce({
				...mockPaginationData,
				skip: 0,
				limit: 10,
			});
			let dbData = [
				{
					venue: {
						name: 'Old Trafford',
						city: 'London',
					},
					_id: '6663c459056e93a77f7de5be',
					attendance: 0,
					clock: {
						label: '',
						minutes: 0,
						seconds: 0,
					},
					gameweek: 1,
					status: 'pending',
					outcome: '',
					homeTeam: '66637f7324ed9515b68c6ce5',
					awayTeam: '6663af53d539e2bed1e1823c',
					teamsDetails: [
						{
							name: 'Manchester United',
						},
						{
							name: 'Manchester City',
						},
					],
					goals: [],
					createdAt: '2024-06-08T02:39:21.826Z',
					updatedAt: '2024-06-08T02:39:21.826Z',
					__v: 0,
					link: {
						rel: 'self',
						method: 'GET',
						href: 'http://localhost:8080/api/v1//fixtures/6663c459056e93a77f7de5be',
					},
				},
			];
			mockDb.paginate.mockResolvedValueOnce(dbData);
			const input: IGetFixtureQuery = { page: 1, limit: 10 };

			const result = await fixture.getAll(input);

			expect(mockDb.count).toHaveBeenCalledWith('Fixture', {});
			expect(mockDb.paginate).toHaveBeenCalledWith(
				'Fixture',
				{},
				{ skip: 0, limit: 10, populate: [], sort: '-createdAt' }
			);

			mockCacheService.setCachedData.mockResolvedValueOnce(dbData);

			expect(result).toEqual(
				mockUtilsService.ResultFunction(
					true,
					'resource fetched successfully',
					StatusCodes.OK,
					ReasonPhrases.OK,
					{
						data: dbData.map((fixture) => ({
							...fixture,
							link: mockUtilsService.generateLink(fixture),
						})),
						pagination: mockPaginationData,
					}
				)
			);
		});
	});

	describe('edit', () => {
		it('should update fixture data', async () => {
			const fixtureId = '1';
			const input = { gameweek: 12 };
			const updatedFixture = { _id: fixtureId, gameweek: 12 };
			mockDb.findOne.mockResolvedValueOnce([{ _id: fixtureId, gameweek: 12 }]);
			mockUtilsService.flattenObject.mockReturnValueOnce(input);
			mockDb.updateOne.mockResolvedValueOnce(updatedFixture);

			const result = await fixture.edit(fixtureId, input);

			expect(mockDb.updateOne).toHaveBeenCalled();
			expect(result).toEqual(
				mockUtilsService.ResultFunction(
					true,
					'fixture updated',
					StatusCodes.OK,
					ReasonPhrases.OK,
					updatedFixture
				)
			);
		});

		it('should return an error if fixture is not found', async () => {
			const fixtureId = '1';
			const input = { gameweek: 12 };
			// const error = new Error('update error');
			// mockDb.updateOne.mockRejectedValueOnce(error);

			const result = await fixture.edit(fixtureId, input);

			expect(result).toEqual(
				mockUtilsService.ResultFunction(
					false,
					'Not Found',
					StatusCodes.NOT_FOUND,
					ReasonPhrases.NOT_FOUND,
					null
				)
			);
		});
	});

	describe('delete', () => {
		it('should delete fixture data', async () => {
			const fixtureId = '6663c459056e93a77f7de5be';
			mockDb.findOne.mockResolvedValueOnce([{ _id: fixtureId }]);

			const result = await fixture.delete(fixtureId);

			expect(mockDb.delete).toHaveBeenCalledWith(FIXTURE_COLLECTION, {
				_id: fixtureId,
			});
			expect(result).toEqual(
				mockUtilsService.ResultFunction(
					true,
					'fixture deleted',
					StatusCodes.OK,
					ReasonPhrases.OK,
					null
				)
			);
		});

		it('should return an error if delete fails', async () => {
			const fixtureId = '1';
			const error = new Error('delete error');
			mockDb.delete.mockRejectedValueOnce(error);

			const result = await fixture.delete(fixtureId);

			expect(result).toEqual(
				mockUtilsService.ResultFunction(
					false,
					'Not Found',
					StatusCodes.NOT_FOUND,
					ReasonPhrases.NOT_FOUND,
					null
				)
			);
		});
	});
});
