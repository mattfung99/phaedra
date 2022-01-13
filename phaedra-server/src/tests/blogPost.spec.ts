import http from 'http';
import { Application } from 'express';
import {
  blogPostNegativeOrNanInputError,
  blogPostDNEError,
  blogPostAdminNegativeOrNanInputError,
  blogPostAdminPublishNegativeOrNanInputError,
  blogPostAdminDraftNegativeOrNanInputError
} from 'utils/errorMessages';
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

// Test 1: Get all blog posts
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
        expect(item).to.have.deep.property('updated_at');
        expect(item).to.have.deep.property('preview');
        expect(item).to.have.deep.property('image_id');
        expect(item.id).to.deep.equal(ids[--id]);
        expect(item.title).to.deep.equal(titles[id]);
        expect(item.author).to.deep.equal(authors[id]);
        expect(item.preview).to.deep.equal(previews[id]);
        expect(item.image_id).to.deep.equal(ids[id] + 1);
      });
      done();
    });
  });
});

// Test 2: Get all admin blog posts
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
        expect(item).to.have.deep.property('updated_at');
        expect(item).to.have.deep.property('preview');
        expect(item).to.have.deep.property('is_draft');
      });
      done();
    });
  });
});

// Test 3: Get a blog post by id
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
  it('should return error code 404 for blog post that is a draft', (done) => {
    agent.get('/api/v1/blog-post/2').end((err: any, res: any) => {
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
      expect(res.body.content).to.deep.equal('{"blocks":[{"key":"12aaa","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}');
      expect(res.body.is_draft).to.deep.equal(0);
      expect(res.body.image_id).to.deep.equal(2);
      expect(res.body.user_id).to.deep.equal(user_ids[0]);
      done();
    });
  });
});

// Test 4: Get an admin blog post by id
describe('GET /api/v1/admin-blog-post/:id', () => {
  before((done) => {
    testApp = setupApp();
    httpServer = setupHttpServer(testApp);
    agent = chai.request.agent(testApp);
    attemptAuthentication(agent, done, Accounts.ADMIN);
  });
  after(() => {
    httpServer.close();
  });
  it('should return error code 400 for admin blog post id that is negative or NaN', (done) => {
    agent.get('/api/v1/admin-blog-post/-1').end((err: any, res: any) => {
      expect(err).to.be.null;
      expect(res).to.have.status(400);
      expect(res.text).to.deep.equal(JSON.stringify(blogPostAdminNegativeOrNanInputError));
      done();
    });
  });
  it('should return error code 400 for invalid URL', (done) => {
    agent.get('/api/v1/admin-blog-post/wow').end((err: any, res: any) => {
      expect(err).to.be.null;
      expect(res).to.have.status(400);
      expect(res.text).to.deep.equal(JSON.stringify(blogPostAdminNegativeOrNanInputError));
      done();
    });
  });
  it('should return error code 404 for admin blog post yet to be created', (done) => {
    agent.get('/api/v1/admin-blog-post/55').end((err: any, res: any) => {
      expect(err).to.be.null;
      expect(res).to.have.status(404);
      expect(res.text).to.deep.equal(JSON.stringify(blogPostDNEError));
      done();
    });
  });
  it('should get an admin blog post by id successfully', (done) => {
    agent.get('/api/v1/admin-blog-post/1').end((err: any, res: any) => {
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.deep.property('id');
      expect(res.body).to.have.deep.property('title');
      expect(res.body).to.have.deep.property('author');
      expect(res.body).to.have.deep.property('updated_at');
      expect(res.body).to.have.deep.property('image_caption');
      expect(res.body).to.have.deep.property('preview');
      expect(res.body).to.have.deep.property('content');
      expect(res.body).to.have.deep.property('is_draft');
      expect(res.body).to.have.deep.property('image_id');
      expect(res.body).to.have.deep.property('user_id');
      expect(res.body).to.have.deep.property('filename');
      expect(res.body.id).to.deep.equal(1);
      expect(res.body.title).to.deep.equal(titles[0]);
      expect(res.body.author).to.deep.equal(authors[0]);
      expect(res.body.image_caption).to.deep.equal(image_captions[0]);
      expect(res.body.preview).to.deep.equal(previews[0]);
      expect(res.body.content).to.deep.equal('{"blocks":[{"key":"12aaa","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}');
      expect(res.body.is_draft).to.deep.equal(0);
      expect(res.body.image_id).to.deep.equal(2);
      expect(res.body.user_id).to.deep.equal(user_ids[0]);
      expect(res.body.filename).to.deep.equal('1641190145997_statue1_angry.png');
      done();
    });
  });
});

// Test 5: Add a published blog post
describe('POST /api/v1/admin-blog-post/publish', () => {
  before((done) => {
    testApp = setupApp();
    httpServer = setupHttpServer(testApp);
    agent = chai.request.agent(testApp);
    attemptAuthentication(agent, done, Accounts.ADMIN);
  });
  after(() => {
    httpServer.close();
  });
  it('should add a published blog post by id unsuccessfully', (done) => {
    agent
      .post('/api/v1/admin-blog-post/publish')
      .set('content-type', 'application/json')
      .send({
        title: 'Test Post',
        image_caption: 'A very cool image',
        preview: 'This is a test post...',
        content: '',
        is_draft: 0,
        image_id: 1,
        user_id: ''
      })
      .end((err: any, res: any) => {
        expect(err).to.be.null;
        expect(res).to.have.status(422);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.deep.property('errors');
        done();
      });
  });
  it('should add a published blog post by id successfully', (done) => {
    agent
      .post('/api/v1/admin-blog-post/publish')
      .set('content-type', 'application/json')
      .send({
        title: 'Test Post',
        image_caption: 'A very cool image',
        preview: 'This is a test post...',
        content: '',
        is_draft: 0,
        image_id: 1,
        user_id: 1
      })
      .end((err: any, res: any) => {
        expect(err).to.be.null;
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.deep.property('id');
        expect(res.body).to.have.deep.property('title');
        expect(res.body).to.have.deep.property('author');
        expect(res.body).to.have.deep.property('updated_at');
        expect(res.body).to.have.deep.property('image_caption');
        expect(res.body).to.have.deep.property('preview');
        expect(res.body).to.have.deep.property('content');
        expect(res.body).to.have.deep.property('is_draft');
        expect(res.body).to.have.deep.property('image_id');
        expect(res.body).to.have.deep.property('user_id');
        expect(res.body.title).to.deep.equal('Test Post');
        expect(res.body.author).to.deep.equal('John Doe');
        expect(res.body.image_caption).to.deep.equal('A very cool image');
        expect(res.body.preview).to.deep.equal('This is a test post...');
        expect(res.body.content).to.deep.equal('');
        expect(res.body.is_draft).to.deep.equal(0);
        expect(res.body.image_id).to.deep.equal(1);
        expect(res.body.user_id).to.deep.equal(1);
        done();
      });
  });
});

// Test 6: Add a draft blog post
describe('POST /api/v1/admin-blog-post/draft', () => {
  before((done) => {
    testApp = setupApp();
    httpServer = setupHttpServer(testApp);
    agent = chai.request.agent(testApp);
    attemptAuthentication(agent, done, Accounts.ADMIN);
  });
  after(() => {
    httpServer.close();
  });
  it('should add a draft blog post by id unsuccessfully', (done) => {
    agent
      .post('/api/v1/admin-blog-post/draft')
      .set('content-type', 'application/json')
      .send({
        title: '',
        image_caption: '',
        preview: '',
        content: '',
        is_draft: 1,
        image_id: 1,
        user_id: ''
      })
      .end((err: any, res: any) => {
        expect(err).to.be.null;
        expect(res).to.have.status(422);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.deep.property('errors');
        done();
      });
  });
  it('should add a draft blog post by id successfully', (done) => {
    agent
      .post('/api/v1/admin-blog-post/draft')
      .set('content-type', 'application/json')
      .send({
        title: '',
        image_caption: '',
        preview: '',
        content: '',
        is_draft: 1,
        image_id: 1,
        user_id: 1
      })
      .end((err: any, res: any) => {
        expect(err).to.be.null;
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.deep.property('id');
        expect(res.body).to.have.deep.property('title');
        expect(res.body).to.have.deep.property('author');
        expect(res.body).to.have.deep.property('updated_at');
        expect(res.body).to.have.deep.property('image_caption');
        expect(res.body).to.have.deep.property('preview');
        expect(res.body).to.have.deep.property('content');
        expect(res.body).to.have.deep.property('is_draft');
        expect(res.body).to.have.deep.property('image_id');
        expect(res.body).to.have.deep.property('user_id');
        expect(res.body.title).to.deep.equal('');
        expect(res.body.author).to.deep.equal('John Doe');
        expect(res.body.image_caption).to.deep.equal('');
        expect(res.body.preview).to.deep.equal('');
        expect(res.body.content).to.deep.equal('');
        expect(res.body.is_draft).to.deep.equal(1);
        expect(res.body.image_id).to.deep.equal(1);
        expect(res.body.user_id).to.deep.equal(1);
        done();
      });
  });
});

// Test 7: Edit a published blog post by id
describe('PUT /api/v1/admin-blog-post/publish/:id', () => {
  before((done) => {
    testApp = setupApp();
    httpServer = setupHttpServer(testApp);
    agent = chai.request.agent(testApp);
    attemptAuthentication(agent, done, Accounts.ADMIN);
  });
  after(() => {
    httpServer.close();
  });
  it('should return error code 400 for blog post that is negative or NaN', (done) => {
    agent
      .put('/api/v1/admin-blog-post/publish/-1')
      .set('content-type', 'application/json')
      .send({
        title: 'Edited Test Post',
        image_caption: 'A very ugly image',
        preview: 'This is an EDITED test post...',
        content: '',
        is_draft: 0,
        image_id: 1,
        user_id: ''
      })
      .end((err: any, res: any) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        expect(res.text).to.deep.equal(JSON.stringify(blogPostAdminPublishNegativeOrNanInputError));
        done();
      });
  });
  it('should return error code 400 for invalid URL', (done) => {
    agent
      .put('/api/v1/admin-blog-post/publish/wow')
      .set('content-type', 'application/json')
      .send({
        title: 'Edited Test Post',
        image_caption: 'A very ugly image',
        preview: 'This is an EDITED test post...',
        content: '',
        is_draft: 0,
        image_id: 1,
        user_id: ''
      })
      .end((err: any, res: any) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        expect(res.text).to.deep.equal(JSON.stringify(blogPostAdminPublishNegativeOrNanInputError));
        done();
      });
  });
  it('should return error code 404 for blog post yet to be created', (done) => {
    agent
      .put('/api/v1/admin-blog-post/publish/55')
      .set('content-type', 'application/json')
      .send({
        title: 'Edited Test Post',
        image_caption: 'A very ugly image',
        preview: 'This is an EDITED test post...',
        content: '',
        is_draft: 0,
        image_id: 1,
        user_id: ''
      })
      .end((err: any, res: any) => {
        expect(err).to.be.null;
        expect(res).to.have.status(404);
        expect(res.text).to.deep.equal(JSON.stringify(blogPostDNEError));
        done();
      });
  });
  it('should edit a published blog post by id unsuccessfully', (done) => {
    agent
      .put('/api/v1/admin-blog-post/publish/1')
      .set('content-type', 'application/json')
      .send({
        title: 'Edited Test Post',
        image_caption: 'A very ugly image',
        preview: 'This is an EDITED test post...',
        content: '',
        is_draft: 0,
        image_id: 1,
        user_id: ''
      })
      .end((err: any, res: any) => {
        expect(err).to.be.null;
        expect(res).to.have.status(422);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.deep.property('errors');
        done();
      });
  });
  it('should edit a published blog post by id successfully', (done) => {
    agent
      .put('/api/v1/admin-blog-post/publish/1')
      .set('content-type', 'application/json')
      .send({
        title: 'Edited Test Post',
        image_caption: 'A very ugly image',
        preview: 'This is an EDITED test post...',
        content: '',
        is_draft: 0,
        image_id: 1,
        user_id: 1
      })
      .end((err: any, res: any) => {
        expect(err).to.be.null;
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.deep.property('id');
        expect(res.body).to.have.deep.property('title');
        expect(res.body).to.have.deep.property('author');
        expect(res.body).to.have.deep.property('updated_at');
        expect(res.body).to.have.deep.property('image_caption');
        expect(res.body).to.have.deep.property('preview');
        expect(res.body).to.have.deep.property('content');
        expect(res.body).to.have.deep.property('is_draft');
        expect(res.body).to.have.deep.property('image_id');
        expect(res.body).to.have.deep.property('user_id');
        expect(res.body.title).to.deep.equal('Edited Test Post');
        expect(res.body.author).to.deep.equal('John Doe');
        expect(res.body.image_caption).to.deep.equal('A very ugly image');
        expect(res.body.preview).to.deep.equal('This is an EDITED test post...');
        expect(res.body.content).to.deep.equal('');
        expect(res.body.is_draft).to.deep.equal(0);
        expect(res.body.image_id).to.deep.equal(1);
        expect(res.body.user_id).to.deep.equal(1);
        done();
      });
  });
});

// Test 8: Edit a draft blog post by id
describe('PUT /api/v1/admin-blog-post/draft/:id', () => {
  before((done) => {
    testApp = setupApp();
    httpServer = setupHttpServer(testApp);
    agent = chai.request.agent(testApp);
    attemptAuthentication(agent, done, Accounts.ADMIN);
  });
  after(() => {
    httpServer.close();
  });
  it('should return error code 400 for blog post that is negative or NaN', (done) => {
    agent
      .put('/api/v1/admin-blog-post/draft/-1')
      .set('content-type', 'application/json')
      .send({
        title: 'Now has a title',
        image_caption: 'Now has an image caption',
        preview: 'Now has a preview',
        content: '',
        is_draft: 0,
        image_id: 1,
        user_id: ''
      })
      .end((err: any, res: any) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        expect(res.text).to.deep.equal(JSON.stringify(blogPostAdminDraftNegativeOrNanInputError));
        done();
      });
  });
  it('should return error code 400 for invalid URL', (done) => {
    agent
      .put('/api/v1/admin-blog-post/draft/wow')
      .set('content-type', 'application/json')
      .send({
        title: 'Now has a title',
        image_caption: 'Now has an image caption',
        preview: 'Now has a preview',
        content: '',
        is_draft: 0,
        image_id: 1,
        user_id: ''
      })
      .end((err: any, res: any) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        expect(res.text).to.deep.equal(JSON.stringify(blogPostAdminDraftNegativeOrNanInputError));
        done();
      });
  });
  it('should return error code 404 for blog post yet to be created', (done) => {
    agent
      .put('/api/v1/admin-blog-post/draft/55')
      .set('content-type', 'application/json')
      .send({
        title: 'Now has a title',
        image_caption: 'Now has an image caption',
        preview: 'Now has a preview',
        content: '',
        is_draft: 0,
        image_id: 1,
        user_id: ''
      })
      .end((err: any, res: any) => {
        expect(err).to.be.null;
        expect(res).to.have.status(404);
        expect(res.text).to.deep.equal(JSON.stringify(blogPostDNEError));
        done();
      });
  });
  it('should edit a draft blog post by id unsuccessfully', (done) => {
    agent
      .put('/api/v1/admin-blog-post/draft/1')
      .set('content-type', 'application/json')
      .send({
        title: 'Now has a title',
        image_caption: 'Now has an image caption',
        preview: 'Now has a preview',
        content: '',
        is_draft: 0,
        image_id: 1,
        user_id: ''
      })
      .end((err: any, res: any) => {
        expect(err).to.be.null;
        expect(res).to.have.status(422);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.deep.property('errors');
        done();
      });
  });
  it('should edit a draft blog post by id successfully', (done) => {
    agent
      .put('/api/v1/admin-blog-post/draft/1')
      .set('content-type', 'application/json')
      .send({
        title: 'Now has a title',
        image_caption: 'Now has an image caption',
        preview: 'Now has a preview',
        content: '',
        is_draft: 0,
        image_id: 1,
        user_id: 1
      })
      .end((err: any, res: any) => {
        expect(err).to.be.null;
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.deep.property('id');
        expect(res.body).to.have.deep.property('title');
        expect(res.body).to.have.deep.property('author');
        expect(res.body).to.have.deep.property('updated_at');
        expect(res.body).to.have.deep.property('image_caption');
        expect(res.body).to.have.deep.property('preview');
        expect(res.body).to.have.deep.property('content');
        expect(res.body).to.have.deep.property('is_draft');
        expect(res.body).to.have.deep.property('image_id');
        expect(res.body).to.have.deep.property('user_id');
        expect(res.body.title).to.deep.equal('Now has a title');
        expect(res.body.author).to.deep.equal('John Doe');
        expect(res.body.image_caption).to.deep.equal('Now has an image caption');
        expect(res.body.preview).to.deep.equal('Now has a preview');
        expect(res.body.content).to.deep.equal('');
        expect(res.body.is_draft).to.deep.equal(0);
        expect(res.body.image_id).to.deep.equal(1);
        expect(res.body.user_id).to.deep.equal(1);
        done();
      });
  });
});

// Test 9: Remove a blog post by id
describe('DELETE /api/v1/admin-blog-post/:id', () => {
  before((done) => {
    testApp = setupApp();
    httpServer = setupHttpServer(testApp);
    agent = chai.request.agent(testApp);
    attemptAuthentication(agent, done, Accounts.ADMIN);
  });
  after(() => {
    httpServer.close();
  });
  it('should return error code 400 for blog post that is negative or NaN', (done) => {
    agent.delete('/api/v1/admin-blog-post/-1').end((err: any, res: any) => {
      expect(err).to.be.null;
      expect(res).to.have.status(400);
      expect(res.text).to.deep.equal(JSON.stringify(blogPostAdminNegativeOrNanInputError));
      done();
    });
  });
  it('should return error code 400 for invalid URL', (done) => {
    agent.delete('/api/v1/admin-blog-post/wow').end((err: any, res: any) => {
      expect(err).to.be.null;
      expect(res).to.have.status(400);
      expect(res.text).to.deep.equal(JSON.stringify(blogPostAdminNegativeOrNanInputError));
      done();
    });
  });
  it('should return error code 404 for blog post yet to be created', (done) => {
    agent.delete('/api/v1/admin-blog-post/55').end((err: any, res: any) => {
      expect(err).to.be.null;
      expect(res).to.have.status(404);
      expect(res.text).to.deep.equal(JSON.stringify(blogPostDNEError));
      done();
    });
  });
  it('should delete a blog post by id unsuccessfully', (done) => {
    agent
      .delete('/api/v1/admin-blog-post/3')
      .set('content-type', 'application/json')
      .send({
        FLAG_TESTING: ''
      })
      .end((err: any, res: any) => {
        expect(err).to.be.null;
        expect(res).to.have.status(422);
        done();
      });
  });
  it('should delete a blog post by id successfully', (done) => {
    agent
      .delete('/api/v1/admin-blog-post/3')
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
