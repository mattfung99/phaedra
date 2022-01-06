import express from 'express';
import authenticationController from '../../../controllers/apiv1/auth.controller';
import passport from 'passport';

const router = express.Router();

router.post('/login', authenticationController.login);
router.get('/logout', passport.authenticate('authAll', { session: false }), authenticationController.logout);
router.get('/authenticate', passport.authenticate('authAll', { session: false }), authenticationController.authenticate);

export default router;
