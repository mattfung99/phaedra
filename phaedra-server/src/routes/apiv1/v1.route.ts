import { Router } from 'express';
// import userPublicRoutes from './userPublic.route';
// import userPrivateRoutes from './userPrivate.route';
import authenticationRoutes from './auth.route';
import imageRoutes from './image.route';
import passport from 'passport';

const authRouter: Router = Router();
authRouter.use('/api/v1/auth', authenticationRoutes);

const publicRouter: Router = Router();
// publicRouter.use('/api/v1/user', userPublicRoutes);

const privateRouter: Router = Router();
privateRouter.use(passport.authenticate('authAll', { session: false }));
privateRouter.use('/api/v1/image', imageRoutes);
// privateRouter.use('/api/v1/user', userPrivateRoutes);

const initializeRouter: Router = Router();
initializeRouter.use(authRouter);
initializeRouter.use(publicRouter);
initializeRouter.use(privateRouter);

export default initializeRouter;
