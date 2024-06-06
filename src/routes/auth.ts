import { Router } from 'express';

const authRouter = Router();

authRouter.post('/signup');
authRouter.post('/login');

export default authRouter;
