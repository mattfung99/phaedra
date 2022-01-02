import { Router } from 'express';
// import userPublicRoutes from './userPublic.route';
// import userPrivateRoutes from './userPrivate.route';
import authenticationRoutes from './auth.route';
import passport from 'passport';

const authRouter = Router();
authRouter.use('/api/v1/auth', authenticationRoutes);

const publicRouter = Router();
// publicRouter.use('/api/v1/user', userPublicRoutes);

const privateRouter = Router();
// Uncomment the follow line to restrict routes
privateRouter.use(passport.authenticate('authAll', { session: false }));
// privateRouter.use('/api/v1/user', userPrivateRoutes);

const initializeRouter = Router();
initializeRouter.use(authRouter);
initializeRouter.use(publicRouter);
initializeRouter.use(privateRouter);

export default initializeRouter;
