import request from 'supertest';
import app from '../src/app.js';

describe('API Core and Validation Logic', () => {

  describe('Health Checks', () => {
    it('GET / should return 200 welcome message', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('Auth Routes (Zod Validation)', () => {
    it('POST /api/auth/register should fail when password is < 6 characters', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Tester',
        email: 'test@example.com',
        password: '123'
      });
      // Should trigger 400 from Zod middleware
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('errors');
      expect(res.body.message).toEqual('Validation failed');
    });

    it('POST /api/auth/register should fail when email is invalid format', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Tester',
        email: 'invalid-email',
        password: 'password123'
      });
      expect(res.statusCode).toEqual(400);
    });

    it('POST /api/auth/login should fail without required fields', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'test@test.com'
        // Missing password
      });
      expect(res.statusCode).toEqual(400);
    });
  });

});
