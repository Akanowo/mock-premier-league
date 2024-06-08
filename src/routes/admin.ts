import { Router } from 'express';
import authRouter from './auth';

const adminRouter = Router();

adminRouter.use('/auth', authRouter);

export default adminRouter;
