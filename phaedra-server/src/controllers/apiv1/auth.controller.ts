import { Request, Response, NextFunction } from 'express';
import logging from '../../config/logging';
import authConfig from '../../utils/authHelper';
import userAuth from './templates/getUser.controller';
import { authUserNotFound, authInvalidCredentials, authServerError, returnLoginAuthenticationStatus, returnAuthenticationStatus } from 'utils/authMessages';

const NAMESPACE = 'Authentication Control';

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;
  try {
    const user: any = await userAuth.findUser('user.username', username);
    logging.info(NAMESPACE, 'RETRIEVED USER FROM DB', user);
    if (!user) {
      res.status(401).send(authUserNotFound);
      return;
    }
    if (user.password !== '') {
      const isValid: boolean = await authConfig.validPassword(password, user.password);
      if (isValid) {
        delete user.password;
        const tokenObject = authConfig.issueJWT(user);
        const cookieName = 'jwt';
        res.cookie(cookieName, tokenObject.token, { httpOnly: true, sameSite: true });
        res.status(200).send(returnLoginAuthenticationStatus(true, user, 'Successful Login'));
        return;
      }
    }
    return res.status(401).send(authInvalidCredentials);
  } catch (error: any) {
    logging.error(NAMESPACE, error.message, error);
    res.status(500).send(authServerError);
  }
};

const logout = (req: Request, res: Response, next: NextFunction) => {
  res.clearCookie('jwt');
  res.status(200).send(returnAuthenticationStatus(false, null, 'Successful Logout'));
};

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  res.status(200).send(returnAuthenticationStatus(true, req.user, 'Successful Authentication'));
};

export default { login, logout, authenticate };
