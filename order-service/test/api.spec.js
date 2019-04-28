import request from 'supertest';
import assert from 'assert';
import mongoose from 'mongoose';
import app from '../src/index';

describe('GET /', () => {
  it('should return 200 OK', () => {
    request(app)
      .get('/orders')
      .expect(200, (err, res) => {
        assert.equal(res.body.success, true);
      });
  });
});

describe('POST /', () => {
  it('should return 201 Created', () => {
    const mock = {
      _id: mongoose.Types.ObjectId(),
      name: 'test',
      email: 'test@test.com',
      phoneNumber: '08123456',
      userId: mongoose.Types.ObjectId(),
      address: 'abcd',
      groupId: mongoose.Types.ObjectId(),
    };
    request(app)
      .post('/orders')
      .expect(200, (err, res) => {
        assert.equal(res.body.success, true);
      });
  });
});
