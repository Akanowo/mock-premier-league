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
		const { db, _loggerService, _utilsService } = this.deps;
		try {
			let query: FilterQuery<ITeam> = {};

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

			return _utilsService.ResultFunction(
				true,
				'resource fetched successfully',
				StatusCodes.OK,
				ReasonPhrases.OK,
				{ pagination: paginationData, data: teams }
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

	public async getOne() {}

	public async create() {}

	public async edit() {}

	public async delete() {}
}

export default Team;
