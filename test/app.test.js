process.env.NODE_ENV = 'test';
const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../src/app');

test('health endpoint returns standard success shape', async () => {
  const response = await request(app).get('/health');
  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.data.status, 'ok');
});

test('protected project endpoint requires authentication', async () => {
  const response = await request(app).get('/api/projects');
  assert.equal(response.status, 401);
  assert.equal(response.body.success, false);
  assert.equal(response.body.error.code, 'AUTH_REQUIRED');
});

test('auth profile and logout endpoints require authentication', async () => {
  const [profile, logout] = await Promise.all([
    request(app).get('/api/auth/me'),
    request(app).post('/api/auth/logout')
  ]);
  assert.equal(profile.status, 401);
  assert.equal(profile.body.error.code, 'AUTH_REQUIRED');
  assert.equal(logout.status, 401);
  assert.equal(logout.body.error.code, 'AUTH_REQUIRED');
});

test('invalid auth payload uses contract error shape', async () => {
  const response = await request(app).post('/api/auth/login').send({ email: 'not-an-email', password: '' });
  assert.equal(response.status, 400);
  assert.equal(response.body.success, false);
  assert.equal(response.body.error.code, 'VALIDATION_ERROR');
  assert.equal(response.body.message, undefined);
});
