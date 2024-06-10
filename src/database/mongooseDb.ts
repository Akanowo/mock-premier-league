// mongooseDatabase.ts
import mongoose, {
	FilterQuery,
	Model,
	ModifyResult,
	Query,
	QueryOptions,
	Schema,
	UpdateWriteOpResult,
} from 'mongoose';
import { DatabaseInterface } from '../types/db';
import chalk from 'chalk';
import { ModelMap } from '../models';
import { Document } from 'mongoose';
import { IPagingQuery } from '../types/generic';

export class MongooseDatabase implements DatabaseInterface {
	private uri: string;
	private options: mongoose.ConnectOptions;

	constructor(uri: string, options: mongoose.ConnectOptions) {
		this.uri = uri;
		this.options = options;
	}

	async connect(): Promise<void> {
		try {
			await mongoose.connect(this.uri, this.options);
			console.log(chalk.green('db connected'));
		} catch (error) {
			console.log(chalk.red('error connecting to db: ', error));
		}
	}

	async disconnect(): Promise<void> {
		await mongoose.disconnect();
	}

	private getModel<T extends Document>(collection: string): Model<T> {
		return ModelMap[collection];
	}

	async create<T extends Document>(
		collection: string,
		data: any,
		options: QueryOptions<T> = {}
	): Promise<T> {
		const Model = this.getModel<T>(collection);
		return Model.create(data);
	}

	async count<T extends Document>(
		collection: string,
		query: any,
		options: QueryOptions<T> = {}
	): Promise<number> {
		const Model = this.getModel<T>(collection);
		return Model.countDocuments(query);
	}

	async findOne<T extends Document>(
		collection: string,
		query: any,
		options: QueryOptions<T> = {}
	): Promise<Query<any, T>> {
		const Model = this.getModel<T>(collection);
		return Model.findOne(query, null, options).exec();
	}

	async lean<T extends Document>(
		collection: string,
		query: any,
		options: QueryOptions<T> = {}
	): Promise<Query<any, T>> {
		const Model = this.getModel<T>(collection);
		return Model.findOne(query, null, options).lean().exec();
	}

	async find<T extends Document>(
		collection: string,
		query: any,
		options?: QueryOptions<T>
	): Promise<Query<any, T>> {
		const Model = this.getModel<T>(collection);
		return Model.find<T>(query, null, options).exec();
	}

	async updateOne<T extends Document>(
		collection: string,
		query: any,
		data: any,
		options?: QueryOptions<T>
	): Promise<any> {
		const Model = this.getModel<T>(collection);
		return Model.findOneAndUpdate(query, data, options).exec();
	}

	async updateMany<T extends Document>(
		collection: string,
		query: any,
		data: any
	): Promise<UpdateWriteOpResult> {
		const Model = this.getModel<T>(collection);
		return Model.updateMany(query, data).exec();
	}

	async delete<T extends Document>(
		collection: string,
		query: any
	): Promise<any> {
		const Model = this.getModel<T>(collection);
		return Model.deleteMany(query).exec();
	}

	async paginate<T extends Document>(
		collection: string,
		query: FilterQuery<T>,
		paginationDetails: IPagingQuery
	) {
		const Model = this.getModel<T>(collection);
		return Model.find(query)
			.sort(paginationDetails.sort)
			.skip(paginationDetails.skip)
			.limit(paginationDetails.limit)
			.populate(paginationDetails.populate)
			.lean()
			.exec();
	}
}
