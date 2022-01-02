// @ts-nocheck

import bcrypt from 'bcryptjs';
import { User } from '../db/models/user.model';
import * as jwt from 'jsonwebtoken';
import config from '../config/config';

const hashPassword = async (unhashedPassword: string): Promise<string> => {
  return await bcrypt.hash(unhashedPassword, await bcrypt.genSalt(12));
};

const validPassword = async (candidate: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(candidate, hash);
};

const issueJWT = (user: User) => {
  const expiresIn = '4h';
  const payload = {
    sub: user.id,
    iat: Date.now(),
    expiresIn: expiresIn
  };
  const signedToken = jwt.sign(payload, config?.jwt?.secret, { expiresIn: expiresIn });
  return {
    token: signedToken,
    expiresIn: expiresIn
  };
};

const authHelper = {
  hashPassword,
  validPassword,
  issueJWT
};

export default authHelper;
