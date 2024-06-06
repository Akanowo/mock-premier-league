import { Router } from 'express';
import authRouter from './auth';
import teamRouter from './team';

const apiRouter = Router();

// routes definitions
apiRouter.use('/auth', authRouter);
apiRouter.use('/teams', teamRouter);

export default apiRouter;
