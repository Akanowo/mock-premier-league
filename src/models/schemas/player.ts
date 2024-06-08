import { Schema } from 'mongoose';
import { IPlayer } from '../../types/League';
import {
	BOOLEAN_AND_REQUIRED,
	DATE_AND_REQUIRED,
	NUMBER_AND_REQUIRED,
	OBJECTID_AND_REQUIRED,
	STRING_AND_REQUIRED,
} from '../../helpers/constants';
import Utils from '../../helpers/utils';

const opts = Utils.opts;

const playerNameObj = new Schema(
	{
		first: STRING_AND_REQUIRED,
		last: STRING_AND_REQUIRED,
		display: STRING_AND_REQUIRED,
	},
	{ _id: false }
);

const teamInfoObj = new Schema(
	{
		loan: BOOLEAN_AND_REQUIRED,
		position: STRING_AND_REQUIRED,
		positionInfo: STRING_AND_REQUIRED,
		shirtNumber: NUMBER_AND_REQUIRED,
	},
	{ _id: false }
);

const playerSchema = new Schema<IPlayer>(
	{
		name: playerNameObj,
		birthDetails: {
			date: DATE_AND_REQUIRED,
			place: STRING_AND_REQUIRED,
			age: NUMBER_AND_REQUIRED,
		},
		nationality: STRING_AND_REQUIRED,
		heightInCM: NUMBER_AND_REQUIRED,
		position: STRING_AND_REQUIRED,
		currentTeam: { ...OBJECTID_AND_REQUIRED, ref: 'Team' },
		info: teamInfoObj,
	},
	opts
);

playerSchema.pre('save', function (next) {
	const first = this.get('name.first');
	const last = this.get('name.last');
	this.set('name.display', `${first} ${last}`);
	next();
});

export { playerSchema };
