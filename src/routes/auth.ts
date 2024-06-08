import { Router } from 'express';
import joiMiddleware from '../middlewares/joiMiddleware';
import { loginValidator, signupValidator } from '../validators';
import { loginController, signupController } from '../controllers';

const authRouter = Router({ mergeParams: true });

authRouter.post('/signup', joiMiddleware(signupValidator), signupController);
authRouter.post('/login', joiMiddleware(loginValidator), loginController);

export default authRouter;
