import http from 'http';
import { Application } from 'express';
import config from 'config/config';
import { createServer, enableErrorHandling, enableLogging, enableRoutes, sendFirstRequest } from '../../server';
import { UserCredentials } from 'db/models/user.model';

const ADMIN: UserCredentials = {
  username: 'admin1',
  password: 'password123'
};

const FAIL: UserCredentials = {
  username: 'admin1',
  password: 'dsjfklsdjfklds'
};

export const Accounts = {
  ADMIN,
  FAIL
};

export const setupApp = () => {
  const testApp = createServer();
  sendFirstRequest(testApp);
  enableLogging(testApp, 'Test Server');
  enableRoutes(testApp);
  enableErrorHandling(testApp);
  return testApp;
};

export const setupHttpServer = (testApp: Application) => {
  const httpServer = http.createServer(testApp);
  httpServer.listen(config.server?.testPort);
  return httpServer;
};

export const attemptAuthentication = (agent: any, done: Mocha.Done, userCredentials: UserCredentials = ADMIN) => {
  agent
    .post('/api/v1/auth/login')
    .set('content-type', 'application/json')
    .send(userCredentials)
    .then((res: any) => {
      done();
    })
    .catch((err: any) => {
      done(err);
    });
};
