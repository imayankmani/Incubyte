const request = require('supertest');
const app = require('../app');
const User = require('../models/User');

describe('Auth Endpoints', () => {

  beforeAll(async () => {
    // Clean only once before all auth tests
    await User.deleteMany({ email: { $regex: '@authtests\.com$' } });
  }, 10000);

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser1',
          email: 'testuser1@authtests.com',
          password: 'password123',
          role: 'user'
        });
      
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
    });

    it('should not register user with existing email', async () => {
      // First registration
      const firstRes = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'duplicate1',
          email: 'duplicate@authtests.com',
          password: 'password123'
        });
      
      expect(firstRes.statusCode).toBe(201);

      // Try to register with same email
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'duplicate2',
          email: 'duplicate@authtests.com',
          password: 'password456'
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login existing user', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          username: 'loginuser',
          email: 'loginuser@authtests.com',
          password: 'password123'
        });

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'loginuser@authtests.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
    });
  });
});