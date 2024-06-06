import { LogEntry, Logger } from 'winston';
import { DBTimeLogs } from './generic';
import { Document } from 'mongoose';

export enum LogLevelEnum {
	INFO = 'info',
	ERROR = 'error',
}

export interface ILog extends LogEntry {
	service: string;
	stack?: any;
}

export interface LogDocument extends DBTimeLogs, Document, ILog {}

export interface ILogDeps {
	_loggerService: Logger;
}
