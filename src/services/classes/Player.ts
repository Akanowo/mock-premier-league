import { FilterQuery } from 'mongoose';
import { PLAYER_COLLECTION } from '../../helpers/constants';
import { IPlayerDeps, IPlayer, IPlayerDocument } from '../../types/League';
import { IPaging, IPagingQuery } from '../../types/generic';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

class Player {
	private deps: IPlayerDeps;

	constructor(deps: IPlayerDeps) {
		this.deps = deps;
	}

	public async getAll(teamId: string, input: IPaging) {
		const { db, _loggerService, _utilsService } = this.deps;
		try {
			let query: FilterQuery<IPlayer> = { currentTeam: teamId };

			if (input.search) {
				query['$or'] = [
					{
						'name.first': {
							$regex: input.search,
							$options: 'i',
						},
					},
					{
						'name.last': {
							$regex: input.search,
							$options: 'i',
						},
					},
				];
			}

			const total = await db.count(PLAYER_COLLECTION, query);

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

			const teams: IPlayerDocument[] = await db.paginate(
				PLAYER_COLLECTION,
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
			_loggerService.error(_utilsService.errorData(error, 'getAllPlayers'));
			return _utilsService.ResultFunction(
				false,
				'something went wrong',
				StatusCodes.UNPROCESSABLE_ENTITY,
				ReasonPhrases.UNPROCESSABLE_ENTITY,
				null
			);
		}
	}

	public async getOne(teamId: string, playerId: string) {
		const { db, _utilsService, _loggerService } = this.deps;
		try {
			const query: FilterQuery<IPlayer> = {
				_id: playerId,
				currentTeam: teamId,
			};
			const player: IPlayerDocument | null = await db.findOne(
				PLAYER_COLLECTION,
				query
			);

			if (!player)
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
				player
			);
		} catch (error) {
			_loggerService.error(_utilsService.errorData(error, 'getOnePlayer'));
			return _utilsService.ResultFunction(
				false,
				'something went wrong',
				StatusCodes.UNPROCESSABLE_ENTITY,
				ReasonPhrases.UNPROCESSABLE_ENTITY,
				null
			);
		}
	}

	public async create(input: IPlayer) {
		const { db, _utilsService, _loggerService, _teamService } = this.deps;
		try {
			// validate team exists
			const team = await _teamService.getOne(String(input.currentTeam));
			if (!team.success) {
				team.message = 'team not found';
				return team;
			}

			const newPlayer = await db.create(PLAYER_COLLECTION, input);
			return _utilsService.ResultFunction(
				true,
				'player created',
				StatusCodes.CREATED,
				ReasonPhrases.CREATED,
				newPlayer
			);
		} catch (error) {
			_loggerService.error(_utilsService.errorData(error, 'createPlayer'));
			return _utilsService.ResultFunction(
				false,
				'something went wrong',
				StatusCodes.UNPROCESSABLE_ENTITY,
				ReasonPhrases.UNPROCESSABLE_ENTITY,
				null
			);
		}
	}

	public async edit(teamId: string, playerId: string, input: Partial<IPlayer>) {
		const { db, _utilsService, _loggerService } = this.deps;
		try {
			const query: FilterQuery<IPlayer> = {
				_id: playerId,
				currentTeam: teamId,
			};

			// find player
			const player = await this.getOne(teamId, playerId);
			if (!player.success) return player;

			const updateObj = _utilsService.flattenObject(input);

			const update: IPlayerDocument = await db.updateOne(
				PLAYER_COLLECTION,
				query,
				updateObj,
				{ new: true }
			);

			return _utilsService.ResultFunction(
				true,
				'player updated',
				StatusCodes.OK,
				ReasonPhrases.OK,
				update
			);
		} catch (error) {
			_loggerService.error(_utilsService.errorData(error, 'updatePlayer'));
			return _utilsService.ResultFunction(
				false,
				'something went wrong',
				StatusCodes.UNPROCESSABLE_ENTITY,
				ReasonPhrases.UNPROCESSABLE_ENTITY,
				null
			);
		}
	}

	public async delete(teamId: string, playerId: string) {
		const { db, _utilsService, _loggerService } = this.deps;
		try {
			const query: FilterQuery<IPlayer> = {
				currentTeam: teamId,
				_id: playerId,
			};

			// find player
			const player = await this.getOne(teamId, playerId);
			if (!player.success) return player;

			await db.delete(PLAYER_COLLECTION, query);

			return _utilsService.ResultFunction(
				true,
				'player deleted',
				StatusCodes.OK,
				ReasonPhrases.OK,
				null
			);
		} catch (error) {
			_loggerService.error(_utilsService.errorData(error, 'deletePlayer'));
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

export default Player;
