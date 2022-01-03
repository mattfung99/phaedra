import request from 'supertest';
import http from 'http';
import config from 'config/config';
import { createServer, sendFirstRequest } from '../server';
import { Application } from 'express';
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

// Test 1: Create a non-working server
describe('GET /api/v1/', () => {
  let testApp: Application;
  before(() => {
    testApp = createServer();
  });
  it('should unsuccessfully instantiate server', (done) => {
    request(testApp).get('/').expect(404, done);
  });
});

// Test 2: Create a working server
describe('GET /api/v1/', () => {
  let testApp: Application;
  let httpServer: http.Server;
  before(() => {
    testApp = createServer();
    sendFirstRequest(testApp);
    httpServer = http.createServer(testApp);
    httpServer.listen(config.server?.testPort);
  });
  after(() => {
    httpServer.close();
  });
  it('should successfully instantiate server', (done) => {
    request(httpServer).get('/').expect(200, done);
  });
});
