import http from 'http';
import { Application } from 'express';
import { blogPostNegativeOrNanInputError, blogPostDNEError } from 'utils/errorMessages';
import { attemptAuthentication, setupApp, setupHttpServer, Accounts } from './tools/configTests';
const expect = require('chai').expect;
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

let testApp: Application;
let httpServer: http.Server;
let agent: any;

const ids = [1, 3];
const titles = ['First Post', 'Third Post'];
const authors = ['John Doe', 'Jane Doe'];
const image_captions = ['Blog photo of the first post here!', 'Blog photo of the third post here!'];
const previews = ['This is a preview of the first post', 'This is a preview of the third post'];
const user_ids = [1, 2];

// Test 1: GET all blog posts
describe('GET /api/v1/blog-post', () => {
  let id = 2;
  before((done) => {
    testApp = setupApp();
    httpServer = setupHttpServer(testApp);
    agent = chai.request.agent(testApp);
    attemptAuthentication(agent, done, Accounts.ADMIN);
  });
  after(() => {
    httpServer.close();
  });
  it('should successfully get all blog posts', (done) => {
    agent.get('/api/v1/blog-post').end((err: any, res: any) => {
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      res.body.forEach((item: any) => {
        expect(item).to.be.an('object');
        expect(item).to.have.deep.property('id');
        expect(item).to.have.deep.property('title');
        expect(item).to.have.deep.property('author');
        expect(item).to.have.deep.property('created_at');
        expect(item).to.have.deep.property('updated_at');
        expect(item).to.have.deep.property('image_caption');
        expect(item).to.have.deep.property('preview');
        expect(item).to.have.deep.property('image_id');
        expect(item.id).to.deep.equal(ids[--id]);
        expect(item.title).to.deep.equal(titles[id]);
        expect(item.author).to.deep.equal(authors[id]);
        expect(item.image_caption).to.deep.equal(image_captions[id]);
        expect(item.preview).to.deep.equal(previews[id]);
        expect(item.image_id).to.deep.equal(ids[id]);
      });
      done();
    });
  });
});

// Test 2: GET all admin blog posts
describe('GET /api/v1/admin-blog-post', () => {
  before((done) => {
    testApp = setupApp();
    httpServer = setupHttpServer(testApp);
    agent = chai.request.agent(testApp);
    attemptAuthentication(agent, done, Accounts.ADMIN);
  });
  after(() => {
    httpServer.close();
  });
  it('should successfully get all admin blog posts', (done) => {
    agent.get('/api/v1/admin-blog-post').end((err: any, res: any) => {
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      res.body.forEach((item: any) => {
        expect(item).to.be.an('object');
        expect(item).to.have.deep.property('id');
        expect(item).to.have.deep.property('title');
        expect(item).to.have.deep.property('author');
        expect(item).to.have.deep.property('created_at');
        expect(item).to.have.deep.property('updated_at');
        expect(item).to.have.deep.property('preview');
        expect(item).to.have.deep.property('is_draft');
      });
      done();
    });
  });
});

// Test 3: GET a blog post by id
describe('GET /api/v1/blog-post/:id', () => {
  before((done) => {
    testApp = setupApp();
    httpServer = setupHttpServer(testApp);
    agent = chai.request.agent(testApp);
    attemptAuthentication(agent, done, Accounts.ADMIN);
  });
  after(() => {
    httpServer.close();
  });
  it('should return error code 400 for blog post id that is negative or NaN', (done) => {
    agent.get('/api/v1/blog-post/-1').end((err: any, res: any) => {
      expect(err).to.be.null;
      expect(res).to.have.status(400);
      expect(res.text).to.deep.equal(JSON.stringify(blogPostNegativeOrNanInputError));
      done();
    });
  });
  it('should return error code 400 for invalid URL', (done) => {
    agent.get('/api/v1/blog-post/wow').end((err: any, res: any) => {
      expect(err).to.be.null;
      expect(res).to.have.status(400);
      expect(res.text).to.deep.equal(JSON.stringify(blogPostNegativeOrNanInputError));
      done();
    });
  });
  it('should return error code 404 for blog post yet to be created', (done) => {
    agent.get('/api/v1/blog-post/55').end((err: any, res: any) => {
      expect(err).to.be.null;
      expect(res).to.have.status(404);
      expect(res.text).to.deep.equal(JSON.stringify(blogPostDNEError));
      done();
    });
  });
  it('should get a blog post by id successfully', (done) => {
    agent.get('/api/v1/blog-post/1').end((err: any, res: any) => {
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.deep.property('id');
      expect(res.body).to.have.deep.property('title');
      expect(res.body).to.have.deep.property('author');
      expect(res.body).to.have.deep.property('created_at');
      expect(res.body).to.have.deep.property('updated_at');
      expect(res.body).to.have.deep.property('image_caption');
      expect(res.body).to.have.deep.property('preview');
      expect(res.body).to.have.deep.property('content');
      expect(res.body).to.have.deep.property('is_draft');
      expect(res.body).to.have.deep.property('image_id');
      expect(res.body).to.have.deep.property('user_id');
      expect(res.body.id).to.deep.equal(1);
      expect(res.body.title).to.deep.equal(titles[0]);
      expect(res.body.author).to.deep.equal(authors[0]);
      expect(res.body.image_caption).to.deep.equal(image_captions[0]);
      expect(res.body.preview).to.deep.equal(previews[0]);
      expect(res.body.content).to.deep.equal('');
      expect(res.body.is_draft).to.deep.equal(0);
      expect(res.body.image_id).to.deep.equal(1);
      expect(res.body.user_id).to.deep.equal(user_ids[0]);
      done();
    });
  });
});
