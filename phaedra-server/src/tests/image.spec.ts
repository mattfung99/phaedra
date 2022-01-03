import http from 'http';
import { Application } from 'express';
import { imageNegativeOrNanInputError, imageDNEError, imageMimetypeError } from 'utils/errorMessages';
import { attemptAuthentication, setupApp, setupHttpServer, Accounts } from './tools/configTests';
const expect = require('chai').expect;
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

let testApp: Application;
let httpServer: http.Server;
let agent: any;

// Test 1: Add a photo
describe('POST /api/v1/image', () => {
  before((done) => {
    testApp = setupApp();
    httpServer = setupHttpServer(testApp);
    agent = chai.request.agent(testApp);
    attemptAuthentication(agent, done, Accounts.ADMIN);
  });
  after(() => {
    httpServer.close();
  });
  it('should create image unsuccessfully', (done) => {
    agent
      .post('/api/v1/image')
      .set('content-type', 'application/json')
      .send({
        message: ''
      })
      .end((err: any, res: any) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        expect(res.text).to.deep.equal(JSON.stringify(imageMimetypeError));
        done();
      });
  });
});

// Test 2: Get an image
describe('GET /api/v1/image/:id', () => {
  before((done) => {
    testApp = setupApp();
    httpServer = setupHttpServer(testApp);
    agent = chai.request.agent(testApp);
    attemptAuthentication(agent, done, Accounts.ADMIN);
  });
  after(() => {
    httpServer.close();
  });
  it('should return error code 400 for image id that is negative or NaN', (done) => {
    agent.get('/api/v1/image/-1').end((err: any, res: any) => {
      expect(err).to.be.null;
      expect(res).to.have.status(400);
      expect(res.text).to.deep.equal(JSON.stringify(imageNegativeOrNanInputError));
      done();
    });
  });
  it('should return error code 400 for invalid URL', (done) => {
    agent.get('/api/v1/image/wow').end((err: any, res: any) => {
      expect(err).to.be.null;
      expect(res).to.have.status(400);
      expect(res.text).to.deep.equal(JSON.stringify(imageNegativeOrNanInputError));
      done();
    });
  });
  it('should return error code 404 for image yet to be created', (done) => {
    agent.get('/api/v1/image/55').end((err: any, res: any) => {
      expect(err).to.be.null;
      expect(res).to.have.status(404);
      expect(res.text).to.deep.equal(JSON.stringify(imageDNEError));
      done();
    });
  });
  it('should get a image by id successfully', (done) => {
    agent.get('/api/v1/image/1').end((err: any, res: any) => {
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      done();
    });
  });
});

// Test 3: Remove an image
describe('DELETE /api/v1/image/:id', () => {
  before((done) => {
    testApp = setupApp();
    httpServer = setupHttpServer(testApp);
    agent = chai.request.agent(testApp);
    attemptAuthentication(agent, done, Accounts.ADMIN);
  });
  after(() => {
    httpServer.close();
  });
  it('should return error code 400 for image id that is negative or NaN', (done) => {
    agent.delete('/api/v1/image/-1').end((err: any, res: any) => {
      expect(err).to.be.null;
      expect(res).to.have.status(400);
      expect(res.text).to.deep.equal(JSON.stringify(imageNegativeOrNanInputError));
      done();
    });
  });
  it('should return error code 400 for invalid URL', (done) => {
    agent.delete('/api/v1/image/wow').end((err: any, res: any) => {
      expect(err).to.be.null;
      expect(res).to.have.status(400);
      expect(res.text).to.deep.equal(JSON.stringify(imageNegativeOrNanInputError));
      done();
    });
  });
  it('should return error code 404 for image yet to be created', (done) => {
    agent.delete('/api/v1/image/55').end((err: any, res: any) => {
      expect(err).to.be.null;
      expect(res).to.have.status(404);
      expect(res.text).to.deep.equal(JSON.stringify(imageDNEError));
      done();
    });
  });
  it('should delete a image by id successfully', (done) => {
    agent
      .delete('/api/v1/image/1')
      .set('content-type', 'application/json')
      .send({
        FLAG_TESTING: true
      })
      .end((err: any, res: any) => {
        expect(err).to.be.null;
        expect(res).to.have.status(204);
        done();
      });
  });
});
