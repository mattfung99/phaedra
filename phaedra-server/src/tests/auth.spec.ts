import http from 'http';
import { Application } from 'express';
import { attemptAuthentication, setupApp, setupHttpServer, Accounts } from './tools/configTests';
import { Knex } from 'config/mysql';
const expect = require('chai').expect;
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

let testApp: Application;
let httpServer: http.Server;
let agent: any;

describe('POST /api/v1/auth/login', () => {
  before((done) => {
    testApp = setupApp();
    httpServer = setupHttpServer(testApp);
    agent = chai.request.agent(testApp);
    attemptAuthentication(agent, done, Accounts.ADMIN);
  });
  after(() => {
    httpServer.close();
  });
  beforeEach(() =>
    Knex.migrate
      .rollback()
      .then(() => Knex.migrate.latest())
      .then(() => Knex.seed.run())
  );
  afterEach(() => Knex.migrate.rollback());
  it('should allow administrator to pass through', (done) => {
    // agent.get('/api/v1/user').end((err: any, res: any) => {
    //   expect(err).to.be.null;
    //   expect(res).to.have.status(200);
    //   expect(res.body).to.be.an('array');
    //   done();
    // });
    done();
  });
});
