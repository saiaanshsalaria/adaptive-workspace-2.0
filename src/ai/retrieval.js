const Document = require('../models/Document');
const Task = require('../models/Task');
const Project = require('../models/Project');

const STOP_WORDS = new Set(['a', 'an', 'and', 'are', 'for', 'from', 'how', 'in', 'is', 'it', 'of', 'on', 'or', 'the', 'to', 'what', 'when', 'where', 'with']);

function tokenize(value) {
  return String(value || '').toLowerCase().match(/[a-z0-9]+/g)?.filter((token) => !STOP_WORDS.has(token)) || [];
}

function chunkText(text, size = 900, overlap = 120) {
  const value = String(text || '').trim();
  if (!value) return [];
  const chunks = [];
  for (let start = 0; start < value.length; start += size - overlap) {
    chunks.push(value.slice(start, start + size));
    if (start + size >= value.length) break;
  }
  return chunks;
}

function score(queryTokens, text) {
  const tokens = new Set(tokenize(text));
  return queryTokens.reduce((total, token) => total + (tokens.has(token) ? 1 : 0), 0);
}

async function retrieve(userId, query, limit = 8) {
  const [documents, tasks, projects] = await Promise.all([
    Document.find({ userId, processingStatus: 'completed', extractedText: { $exists: true, $ne: '' } }).select('filename extractedText').lean(),
    Task.find({ userId, status: { $in: ['todo', 'in_progress', 'blocked'] } }).select('title description status priority deadline projectId').lean(),
    Project.find({ userId, status: 'active' }).select('name description status priority deadline progress').lean()
  ]);
  const queryTokens = tokenize(query);
  const candidates = [];
  documents.forEach((document) => chunkText(document.extractedText).forEach((snippet, index) => {
    candidates.push({ type: 'document', id: String(document._id), title: document.filename, snippet, score: score(queryTokens, `${document.filename} ${snippet}`), chunk: index });
  }));
  tasks.forEach((task) => candidates.push({
    type: 'task', id: String(task._id), title: task.title,
    snippet: `${task.description || ''} Status: ${task.status}. Priority: ${task.priority}.`,
    score: score(queryTokens, `task pending ${task.title} ${task.description} ${task.status} ${task.priority}`)
  }));
  projects.forEach((project) => candidates.push({
    type: 'project', id: String(project._id), title: project.name,
    snippet: `${project.description || ''} Status: ${project.status}. Priority: ${project.priority}. Progress: ${project.progress}%.`,
    score: score(queryTokens, `project active ${project.name} ${project.description} ${project.status} ${project.priority}`)
  }));
  const matchingCandidates = candidates.filter((candidate) => candidate.score > 0);
  const rankedCandidates = matchingCandidates.length ? matchingCandidates : candidates;
  return rankedCandidates
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, limit);
}

module.exports = { tokenize, chunkText, retrieve };
