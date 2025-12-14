const request = require('supertest');
const app = require('../app');
const Sweet = require('../models/Sweet');
const User = require('../models/User');

describe('Sweet Endpoints', () => {
  let adminToken;
  let userToken;

  beforeAll(async () => {
    // Create admin user
    const adminRes = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin'
      });
    adminToken = adminRes.body.token;

    // Create regular user
    const userRes = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'user',
        email: 'user@example.com',
        password: 'user123'
      });
    userToken = userRes.body.token;
  });

  beforeEach(async () => {
    await Sweet.deleteMany({});
  });

  describe('POST /api/sweets', () => {
    it('should allow admin to create sweet', async () => {
      const res = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Chocolate Bar',
          category: 'Chocolate',
          price: 2.99,
          quantity: 100
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.name).toBe('Chocolate Bar');
    });

    it('should not allow regular user to create sweet', async () => {
      const res = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Candy',
          category: 'Candy',
          price: 1.99,
          quantity: 50
        });

      expect(res.statusCode).toBe(403);
    });
  });

  describe('GET /api/sweets', () => {
    it('should get all sweets', async () => {
      await Sweet.create({
        name: 'Gummy Bears',
        category: 'Gummy',
        price: 3.99,
        quantity: 75
      });

      const res = await request(app).get('/api/sweets');
      
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(1);
    });
  });

  describe('POST /api/sweets/:id/purchase', () => {
    it('should decrease quantity on purchase', async () => {
      const sweet = await Sweet.create({
        name: 'Lollipop',
        category: 'Lollipop',
        price: 0.99,
        quantity: 10
      });

      const res = await request(app)
        .post(`/api/sweets/${sweet._id}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 3 });

      expect(res.statusCode).toBe(200);
      expect(res.body.sweet.quantity).toBe(7);
    });

    it('should fail if insufficient quantity', async () => {
      const sweet = await Sweet.create({
        name: 'Rare Candy',
        category: 'Candy',
        price: 5.99,
        quantity: 2
      });

      const res = await request(app)
        .post(`/api/sweets/${sweet._id}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 5 });

      expect(res.statusCode).toBe(400);
    });
  });
});