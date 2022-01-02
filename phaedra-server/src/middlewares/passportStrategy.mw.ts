import passport from 'passport';
import PassportJWT from 'passport-jwt';
import config from '../config/config';
import logging from '../config/logging';
import { Request } from 'express';
import userAuth from '../controllers/apiv1/templates/getUser.controller';
import { User } from 'db/models/user.model';

const NAMESPACE = 'PASSPORT JW MW';

const cookieExtractor = (req: Request) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['jwt'];
  }
  logging.info(NAMESPACE, `EXTRACTED COOKIE: ${token}`);
  return token;
};

const jwtOptions = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: config?.jwt?.secret
};

const strategyAll = new PassportJWT.Strategy(jwtOptions, async (payload, done) => {
  logging.info(NAMESPACE, `JWT VERIFICATION: INCOMING PAYLOAD ${payload}`);
  const id = payload.sub;
  try {
    const user: User = await userAuth.findUser('user.id', id);
    if (!user) {
      return done(null, false);
    } else {
      user.uuid && delete user.uuid;
      user.password && delete user.password;
      return done(null, user);
    }
  } catch (error) {
    done(error, false);
  }
});

passport.use('authAll', strategyAll);
