const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

const TYPES = {
  pdf: ['application/pdf'],
  docx: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  txt: ['text/plain'],
  md: ['text/markdown', 'text/x-markdown', 'text/plain']
};

function getFileType(filename, mimeType) {
  const extension = path.extname(filename).toLowerCase().slice(1);
  const fileType = extension === 'markdown' ? 'md' : extension;
  if (!TYPES[fileType] || !TYPES[fileType].includes(mimeType)) return null;
  return fileType;
}

async function extractText(fileType, buffer) {
  if (fileType === 'pdf') return (await pdfParse(buffer)).text;
  if (fileType === 'docx') return (await mammoth.extractRawText({ buffer })).value;
  return buffer.toString('utf8');
}

module.exports = { TYPES, getFileType, extractText };
