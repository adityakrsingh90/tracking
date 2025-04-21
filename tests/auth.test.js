const request = require('supertest');
const app = require('../app'); 
const User = require('../models/user');  // User model

describe('POST /api/auth/login', () => {
  it('should login a user with valid credentials', async () => {
    // Create a test user
    const testUser = new User({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password123',
      role: 'student'  // or 'mentor' based on your test case
    });
    await testUser.save();

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'johndoe@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should return 400 for invalid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'invaliduser@example.com',
        password: 'wrongpassword'
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid email or password');
  });
});
