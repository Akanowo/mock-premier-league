import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { USER_COLLECTION } from '../../helpers/constants';
import { IAuth, IAuthDeps, ILogin, ISignup } from '../../types/Auth';
import { IUser, IUserDocument } from '../../types/User';
import { ResultObject } from '../../types/generic';

class Auth implements IAuth {
	private deps: IAuthDeps;

	constructor(deps: IAuthDeps) {
		this.deps = deps;
	}

	public async signup(
		input: ISignup,
		fromAdmin?: boolean
	): Promise<ResultObject<any>> {
		const { db, _utilsService, _loggerService } = this.deps;

		try {
			// check if the user exists
			const userExists = await db.findOne<IUser>(USER_COLLECTION, {
				email: input.email,
			});

			if (userExists)
				return _utilsService.ResultFunction(
					false,
					'An account with that email exists',
					StatusCodes.BAD_REQUEST,
					ReasonPhrases.BAD_REQUEST,
					null
				);

			const newUserPayload: IUser = {
				name: {
					first: input.firstName,
					last: input.lastName,
					full: `${input.firstName} ${input.lastName}`,
				},
				email: input.email,
				password: await _utilsService.createHash(input.password),
				accountType: fromAdmin ? 'admin' : 'user',
			};

			const user = await db.create<IUserDocument>(
				USER_COLLECTION,
				newUserPayload
			);

			//TODO: add login functionality

			return _utilsService.ResultFunction(
				true,
				'user created successfylly',
				StatusCodes.CREATED,
				ReasonPhrases.CREATED,
				_utilsService.formatUserObj(user)
			);
		} catch (error) {
			_loggerService.error(_utilsService.errorData(error, 'signup'));
			return _utilsService.ResultFunction(
				false,
				'something went wrong',
				StatusCodes.UNPROCESSABLE_ENTITY,
				ReasonPhrases.UNPROCESSABLE_ENTITY,
				null
			);
		}
	}

	public async login(
		input: ILogin,
		fromAdmin?: boolean
	): Promise<ResultObject<any>> {
		const { db, _loggerService, _utilsService, _cacheService } = this.deps;
		const errorMessage = 'invalid username or password';
		try {
			let query = {
				email: input.email,
				accountType: fromAdmin ? 'admin' : 'user',
			};
			// find user
			const user: IUserDocument | null = await db.findOne(
				USER_COLLECTION,
				query
			);

			if (!user)
				return _utilsService.ResultFunction(
					false,
					errorMessage,
					StatusCodes.UNAUTHORIZED,
					ReasonPhrases.UNAUTHORIZED,
					null
				);

			// verify password
			if (!(await _utilsService.verifyHash(user.password, input.password)))
				return _utilsService.ResultFunction(
					false,
					errorMessage,
					StatusCodes.UNAUTHORIZED,
					ReasonPhrases.UNAUTHORIZED,
					null
				);

			const userObj = _utilsService.formatUserObj(user);

			// generate access token
			const token = _utilsService.generateAccessToken({ id: user._id });

			// store user in session
			await _cacheService.setCachedData(`sess:${user._id}`, userObj);

			// send response
			return _utilsService.ResultFunction(
				true,
				'login Successful',
				StatusCodes.OK,
				ReasonPhrases.OK,
				{ token, profile: userObj }
			);
		} catch (error) {
			_loggerService.error(_utilsService.errorData(error, 'login'));
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

export default Auth;
