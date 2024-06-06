import { NextFunction, Request, Response } from 'express';
import ip from 'ip';
import { ApiRequest } from '../models';
import { UtilsFactory } from '../services/factories';

const _utilsService = UtilsFactory();

async function logRequest(req: Request, res: Response, next: NextFunction) {
	const reqBody = { ...req.body };
	if (reqBody.password) {
		reqBody.password = await _utilsService.createHash(reqBody.password);
	}
	if (reqBody.confirmPassword) {
		reqBody.confirmPassword = await _utilsService.createHash(
			reqBody.confirmPassword
		);
	}
	await ApiRequest.create({
		ip: ip.address(),
		url: `${req.protocol}://${req.hostname}${req.originalUrl}`,
		headers: req.headers,
		body: reqBody,
		query: req.query,
		params: req.params,
	});
	next();
}

export default logRequest;
