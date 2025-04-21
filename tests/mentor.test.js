const request = require('supertest');
const app = require('../app');  // Aapka Express app
const User = require('../models/user');  // User model

describe('POST /api/mentor/register', () => {
  it('should register a new mentor', async () => {
    const response = await request(app)
      .post('/api/mentor/register')
      .send({
        name: 'Dr. Smith',
        email: 'drsmith@example.com',
        password: 'password123',
        role: 'mentor'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'Mentor registered successfully');
  });

  it('should return 400 if email already exists', async () => {
    const testUser = new User({
      name: 'John Doe',
      email: 'drsmith@example.com',
      password: 'password123'
    });
    await testUser.save();

    const response = await request(app)
      .post('/api/mentor/register')
      .send({
        name: 'Dr. Smith',
        email: 'drsmith@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Email already in use');
  });
});
