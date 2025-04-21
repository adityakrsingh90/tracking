const request = require('supertest');
const app = require('../app');  // Aapka Express app
const User = require('../models/user');  // User model

describe('POST /api/student/register', () => {
  it('should register a new student', async () => {
    const response = await request(app)
      .post('/api/student/register')
      .send({
        name: 'Jane Doe',
        email: 'janedoe@example.com',
        password: 'password123',
        role: 'student'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'Student registered successfully');
  });

  it('should return 400 if email already exists', async () => {
    const testUser = new User({
      name: 'John Smith',
      email: 'janedoe@example.com',
      password: 'password123'
    });
    await testUser.save();

    const response = await request(app)
      .post('/api/student/register')
      .send({
        name: 'Jane Doe',
        email: 'janedoe@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Email already in use');
  });
});
