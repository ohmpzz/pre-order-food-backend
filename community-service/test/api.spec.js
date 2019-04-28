import request from 'supertest';
import app from '../src/index';

let id = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJVNDY5OTYxZGUyMGYzMzI5ZmI3YTMzOTg4YWRiNjFiNGMiLCJzdWIiOiJVNDY5OTYxZGUyMGYzMzI5ZmI3YTMzOTg4YWRiNjFiNGMiLCJuYW1lIjoiLk9obSIsInBpY3R1cmUiOiJodHRwczovL3Byb2ZpbGUubGluZS1zY2RuLm5ldC8waDQtc3RmYllNYXdKT0RVRkZKa2NVVlhKSVpXODVJMjFLTmo0blpqa0ZaVEJrUEg1WGRtOGhaMklPWVRNemFDOVNlemdnWW1oWlBXQTMiLCJleHBpcmVzX2luIjoyNTkyMDAwLCJyb2xlcyI6eyJ1c2VyIjp0cnVlfSwiaWF0IjoxNTUwNjk2MDM4LCJleHAiOjIxNTU0OTYwMzgsImF1ZCI6InByZS1vcmRlciBmb29kIiwiaXNzIjoiZm9vZC5vaG1waXJvbXJhay5jb20ifQ.SUKW0Ark9ps8w5H1vyuTSkrshEr6Wh2YRux_Im081FE`;

const adminToken = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im9obS5waXJvbXJha0BnbWFpbC5jb20iLCJyb2xlcyI6eyJhZG1pbiI6dHJ1ZX0sInN1YiI6IjVjNmFlYzEzZGU3OTI0M2U5YzFkZWM0NiIsImlhdCI6MTU1MDUxMTk3OCwiZXhwIjoyMTU1MzExOTc4LCJhdWQiOiJwcmUtb3JkZXIgZm9vZCIsImlzcyI6ImFkbWluLWZvb2Qub2htcGlyb21yYWsuY29tIn0.fP8alVdlAk2Pk7dYFoQ9gGR7gBfCgv2mVAm-NRxFEZk`;
const userToken = '';

const mock = {
  title: 'Test 0123456',
  description: 'test 01',
  pictureUrl: 'fadfs',
  members: {
    asd123: 'test',
  },
  updateBy_name: 'test 01',
  updateBy_id: 'test 01',
};

describe('Route /', () => {
  it('should return 200 OK', done => {
    request(app)
      .get('/communities')
      .expect(200, done);
  });

  it('should return 201', done => {
    request(app)
      .post('/communities')
      .set('Authorization', adminToken)
      .type('form')
      .send(mock)
      .expect(201, (err, res) => {
        if (err) throw err;
        console.log(err);
        console.log(res.body);
        id = res.body._id;
        done();
      });
  });
});

const member = {
  userId: 'U469961de20f3329fb7a33988adb61b4c',
  name: 'Test 012345',
};

describe('ROUTE /:groupId/members', () => {
  it('should return 200 with POST', done => {
    request(app)
      .post(`/communities/${id}/members`)
      .set('Authorization', adminToken)
      .type('form')
      .send(member)
      .expect(200, (err, res) => {
        if (err) throw err;
        console.log(res.body);
        done();
      });
  });

  it('should return 200 with PUT', done => {
    request(app)
      .put(`/communities//${id}/members`)
      .set('Authorization', adminToken)
      .type('form')
      .send({ ...member })
      .expect(200, (err, res) => {
        if (err) throw err;
        console.log(res.body);
        done();
      });
  });
});

describe('ROUTE /:id', () => {
  it('should return 200 with GET', done => {
    request(app)
      .get(`/communities/${id}`)
      .expect(200, (err, res) => {
        if (err) throw err;
        console.log(res.body);
        done();
      });
  });

  it('should return 200 with PUT', done => {
    request(app)
      .put(`/communities/${id}`)
      .set('Authorization', adminToken)
      .type('form')
      .send({ ...mock, title: 'change title' })
      .expect(200, (err, res) => {
        if (err) throw err;
        console.log(res.body);
        done();
      });
  });

  it('should return 200 with DELETE', done => {
    request(app)
      .delete(`/communities/${id}`)
      .set('Authorization', adminToken)
      .expect(200, (err, res) => {
        if (err) throw err;
        console.log(res.body);
        done();
      });
  });
});
