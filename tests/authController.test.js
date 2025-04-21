// authController.test.js
const request = require('supertest');
const app = require('../app'); // Assuming your Express app is in app.js
const User = require('../models/user');
const { connectDB, disconnectDB } = require('../config/db'); // Your DB connection utility

describe('Auth Controller Tests', () => {
  beforeAll(async () => {
    await connectDB(); // Connect to DB before all tests
  });

  afterAll(async () => {
    await disconnectDB(); // Disconnect from DB after all tests
  });

  describe('POST /admin/login', () => {
    it('should return 200 for valid admin credentials', async () => {
      const response = await request(app)
        .post('/api/auth/admin/login')
        .send({ email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('should return 401 for invalid admin credentials', async () => {
      const response = await request(app)
        .post('/api/auth/admin/login')
        .send({ email: 'wrongemail@admin.com', password: 'wrongpassword' });
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid admin credentials');
    });
  });

  describe('POST /student/login', () => {
    it('should return 200 for valid student login', async () => {
      // Assume you have a test student created in your database
      const student = await User.findOne({ role: 'student' });

      const response = await request(app)
        .post('/api/auth/student/login')
        .send({ email: student.email, password: 'studentpassword' });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('should return 400 for invalid email format', async () => {
      const response = await request(app)
        .post('/api/auth/student/login')
        .send({ email: 'invalidemail', password: 'password' });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid email format');
    });
  });
});
