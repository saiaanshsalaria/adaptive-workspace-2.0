process.env.NODE_ENV = 'test';
const test = require('node:test');
const assert = require('node:assert/strict');
const Document = require('../src/models/Document');
const Task = require('../src/models/Task');
const Project = require('../src/models/Project');
const { chunkText, retrieve } = require('../src/ai/retrieval');
const { chat } = require('../src/ai/chatService');

function stubFind(model, rows) {
  const original = model.find;
  model.find = () => ({ select: () => ({ lean: async () => rows }) });
  return () => { model.find = original; };
}

test('retrieval chunks text and ranks matching workspace context', async () => {
  assert.equal(chunkText('one two three', 7, 2).length, 3);
  const restore = [
    stubFind(Document, [{ _id: 'doc-1', filename: 'plan.txt', extractedText: 'The launch plan contains the release date.' }]),
    stubFind(Task, [{ _id: 'task-1', title: 'Review release plan', description: 'Check the launch date', status: 'todo', priority: 'high' }]),
    stubFind(Project, [])
  ];
  try {
    const sources = await retrieve('user-1', 'launch date');
    assert.equal(sources[0].type, 'document');
    assert.match(sources[0].snippet, /launch plan/);
  } finally { restore.forEach((restoreModel) => restoreModel()); }
});

test('chat always returns the contract shape and reports unavailable context', async () => {
  const restore = [stubFind(Document, []), stubFind(Task, []), stubFind(Project, [])];
  try {
    const result = await chat('anything', 'user-1');
    assert.deepEqual(Object.keys(result), ['message', 'sources', 'suggestions', 'actions']);
    assert.equal(result.sources.length, 0);
    assert.match(result.message, /unavailable/i);
    assert.deepEqual(result.actions, []);
  } finally { restore.forEach((restoreModel) => restoreModel()); }
});
