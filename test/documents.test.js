process.env.NODE_ENV = 'test';
const test = require('node:test');
const assert = require('node:assert/strict');
const { getFileType, extractText } = require('../src/utils/documentExtraction');

test('document type validation accepts supported extension and MIME pairs', () => {
  assert.equal(getFileType('notes.txt', 'text/plain'), 'txt');
  assert.equal(getFileType('readme.md', 'text/markdown'), 'md');
  assert.equal(getFileType('report.pdf', 'application/pdf'), 'pdf');
  assert.equal(getFileType('report.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'), 'docx');
  assert.equal(getFileType('notes.pdf', 'text/plain'), null);
  assert.equal(getFileType('script.exe', 'application/octet-stream'), null);
});

test('plain text and markdown extraction uses the in-memory buffer', async () => {
  const buffer = Buffer.from('# In memory\\nDocument text');
  assert.equal(await extractText('md', buffer), buffer.toString('utf8'));
  assert.equal(await extractText('txt', buffer), buffer.toString('utf8'));
});
