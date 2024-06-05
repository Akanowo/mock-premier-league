// mongooseDatabase.ts
import mongoose, {
	Model,
	ModifyResult,
	Schema,
	UpdateWriteOpResult,
} from 'mongoose';
import { DatabaseInterface } from '../types/db';
import chalk from 'chalk';

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

	private getModel<T>(collection: string): Model<any> {
		return mongoose.model<T>(collection, new Schema({}, { strict: false }));
	}

	async create<T>(
		collection: string,
		data: any,
		options: any = {}
	): Promise<T> {
		const Model = this.getModel(collection);
		return new Model(data).save(options);
	}

	async findOne<T>(
		collection: string,
		query: any,
		options: any = {}
	): Promise<any> {
		const Model = this.getModel<T>(collection);
		return Model.findOne<T>(query, null, options).exec();
	}

	async find<T>(collection: string, query: any, options?: any): Promise<T[]> {
		const Model = this.getModel<T>(collection);
		return Model.find<T>(query, null, options).exec();
	}

	async updateOne<T>(
		collection: string,
		query: any,
		data: any,
		options?: any
	): Promise<ModifyResult<T>> {
		const Model = this.getModel(collection);
		return Model.findOneAndUpdate(query, data, options).exec();
	}

	async updateMany(
		collection: string,
		query: any,
		data: any
	): Promise<UpdateWriteOpResult> {
		const Model = this.getModel(collection);
		return Model.updateMany(query, data).exec();
	}

	async delete(collection: string, query: any): Promise<any> {
		const Model = this.getModel(collection);
		return Model.deleteMany(query).exec();
	}
}
