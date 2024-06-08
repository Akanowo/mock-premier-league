import { Router } from 'express';
import authRouter from './auth';
import teamRouter from './team';
import fixtureRouter from './fixture';
import adminRouter from './admin';

const apiRouter = Router();

// routes definitions
apiRouter.use('/auth', authRouter);
apiRouter.use('/admin', adminRouter);
apiRouter.use('/teams', teamRouter);
apiRouter.use('/fixtures', fixtureRouter);

export default apiRouter;
