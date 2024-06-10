import Fixture from '../../services/classes/Fixture';
import { IFixtureDeps } from '../../types/League';

let fixture: Fixture;
let mockDeps: jest.Mocked<IFixtureDeps>;
let mockDb: any;
let mockLoggerService: any;
let mockUtilsService: any;
let mockCacheService: any;
let mockPaginationData: any;
let mockTeamService: any;

mockDb = {
	count: jest.fn(),
	find: jest.fn(),
	findOne: jest.fn(),
	updateOne: jest.fn(),
	delete: jest.fn(),
	paginate: jest.fn(),
	create: jest.fn(),
};
mockLoggerService = {
	error: jest.fn(),
};
mockUtilsService = {
	ResultFunction: jest.fn(
		(success, message, statusCode, reasonPhrase, data) => ({
			success,
			message,
			statusCode,
			reasonPhrase,
			data,
		})
	),
	pagination: jest.fn(),
	flattenObject: jest.fn(),
	errorData: jest.fn(),
	generateLink: jest.fn(),
	formatUserObj: jest.fn(),
	generateAccessToken: jest.fn(),
	verifyHash: jest.fn(),
};
mockCacheService = {
	getCachedData: jest.fn(),
	setCachedData: jest.fn(),
};
// mockDeps = {
//  db: mockDb,
//  _loggerService: mockLoggerService,
//  _utilsService: mockUtilsService,
//  _cacheService: mockCacheService,
// } as jest.Mocked<IFixtureDeps>;

mockPaginationData = {
	totalRecords: 1,
	pageTotal: 1,
	next: {},
	prev: {},
};

mockTeamService = {
	getOne: jest.fn(),
};

export {
	mockDeps,
	mockDb,
	mockLoggerService,
	mockUtilsService,
	mockCacheService,
	mockPaginationData,
	mockTeamService,
};
