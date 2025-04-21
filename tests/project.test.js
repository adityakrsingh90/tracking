const request = require('supertest');
const app = require('../app');  // Aapka Express app
const Project = require('../models/project');  // Project model

describe('POST /api/project/create', () => {
  it('should create a new project', async () => {
    const response = await request(app)
      .post('/api/project/create')
      .send({
        title: 'New Project',
        technology: 'Node.js, Express',
        description: 'A new Node.js project',
        mentorId: '12345',  // Use a valid mentorId
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'Project created successfully');
  });

  it('should return 400 if fields are missing', async () => {
    const response = await request(app)
      .post('/api/project/create')
      .send({
        title: 'Incomplete Project',  // Missing required fields
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('All fields are required');
  });
});
