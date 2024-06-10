import { FilterQuery } from 'mongoose';
import { TEAM_COLLECTION } from '../../helpers/constants';
import { ITeam, ITeamDeps, ITeamDocument } from '../../types/League';
import { IPaging, IPagingQuery } from '../../types/generic';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

class Team {
	private deps: ITeamDeps;

	constructor(deps: ITeamDeps) {
		this.deps = deps;
	}

	public async getAll(input: IPaging) {
		const { db, _loggerService, _utilsService, _cacheService } = this.deps;
		const cacheKey = `teams:page:${input.page}:limit:${input.limit}:search:${
			input.search ?? ''
		}`;
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

			let query: FilterQuery<ITeam> = {};

			console.log(input);

			if (input.search) {
				// search the course title as a regex regardless of case sensitivity
				query.name = {
					$regex: input.search,
					$options: 'i',
				};
			}

			const total = await db.count(TEAM_COLLECTION, query);

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

			const teams: ITeamDocument[] = await db.paginate(
				TEAM_COLLECTION,
				query,
				paginationQuery
			);

			const responseData = { pagination: paginationData, data: teams };

			// store response data in cache
			_cacheService.setCachedData(cacheKey, responseData);

			return _utilsService.ResultFunction(
				true,
				'resource fetched successfully',
				StatusCodes.OK,
				ReasonPhrases.OK,
				responseData
			);
		} catch (error) {
			_loggerService.error(_utilsService.errorData(error, 'getAllTeams'));
			return _utilsService.ResultFunction(
				false,
				'something went wrong',
				StatusCodes.UNPROCESSABLE_ENTITY,
				ReasonPhrases.UNPROCESSABLE_ENTITY,
				null
			);
		}
	}

	public async getOne(teamId: string) {
		const { db, _utilsService, _loggerService } = this.deps;
		try {
			const team: ITeamDocument | null = await db.findOne(
				TEAM_COLLECTION,
				{ _id: teamId },
				{ populate: 'players' }
			);

			if (!team)
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
				team
			);
		} catch (error) {
			_loggerService.error(_utilsService.errorData(error, 'getOneTeam'));
			return _utilsService.ResultFunction(
				false,
				'something went wrong',
				StatusCodes.UNPROCESSABLE_ENTITY,
				ReasonPhrases.UNPROCESSABLE_ENTITY,
				null
			);
		}
	}

	public async create(input: ITeam) {
		const { db, _utilsService, _loggerService } = this.deps;
		try {
			const query: FilterQuery<ITeam> = {
				name: {
					$regex: input.name,
					$options: 'i',
				},
			};
			const teamExists = await db.findOne(TEAM_COLLECTION, query);

			if (teamExists)
				return _utilsService.ResultFunction(
					false,
					'team exists',
					StatusCodes.BAD_REQUEST,
					ReasonPhrases.BAD_REQUEST,
					null
				);

			const newTeam = await db.create(TEAM_COLLECTION, input);
			return _utilsService.ResultFunction(
				true,
				'team created',
				StatusCodes.CREATED,
				ReasonPhrases.CREATED,
				newTeam
			);
		} catch (error) {
			_loggerService.error(_utilsService.errorData(error, 'createTeam'));
			return _utilsService.ResultFunction(
				false,
				'something went wrong',
				StatusCodes.UNPROCESSABLE_ENTITY,
				ReasonPhrases.UNPROCESSABLE_ENTITY,
				null
			);
		}
	}

	public async edit(teamId: string, input: Partial<ITeam>) {
		const { db, _utilsService, _loggerService } = this.deps;
		try {
			const query: FilterQuery<ITeam> = {
				_id: teamId,
			};

			// find team
			const team = await this.getOne(teamId);
			if (!team.success) return team;

			const updateObj = _utilsService.flattenObject(input);

			const update: ITeamDocument = await db.updateOne(
				TEAM_COLLECTION,
				query,
				updateObj,
				{ new: true }
			);

			return _utilsService.ResultFunction(
				true,
				'team updated',
				StatusCodes.OK,
				ReasonPhrases.OK,
				update
			);
		} catch (error) {
			_loggerService.error(_utilsService.errorData(error, 'updateTeam'));
			return _utilsService.ResultFunction(
				false,
				'something went wrong',
				StatusCodes.UNPROCESSABLE_ENTITY,
				ReasonPhrases.UNPROCESSABLE_ENTITY,
				null
			);
		}
	}

	public async delete(teamId: string) {
		const { db, _utilsService, _loggerService } = this.deps;
		try {
			const query: FilterQuery<ITeam> = {
				_id: teamId,
			};

			// find team
			const team = await this.getOne(teamId);
			if (!team.success) return team;

			await db.delete(TEAM_COLLECTION, query);

			return _utilsService.ResultFunction(
				true,
				'team deleted',
				StatusCodes.OK,
				ReasonPhrases.OK,
				null
			);
		} catch (error) {
			_loggerService.error(_utilsService.errorData(error, 'deleteTeam'));
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

export default Team;
