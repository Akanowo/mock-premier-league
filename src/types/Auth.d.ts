import { ILogDeps } from './Log';
import { IDefaultDeps, ReturnFunction, ReturnObject } from './generic';

export interface ISignup {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
}

export interface ILogin {
	email: string;
	password: string;
}

export interface IAuth {
	signup: (input: ISignup, fromAdmin?: boolean) => Promise<ReturnObject<any>>;
	login: (input: ILogin, fromAdmin?: boolean) => Promise<ReturnObject<any>>;
}

export interface IAuthDeps extends ILogDeps, IDefaultDeps {}

export interface ICreateTokenPayload {
	userId: Types.ObjectId;
}
