const Task = require('../models/Task');
const Project = require('../models/Project');

async function ensureProject(userId, projectId) {
  const project = await Project.findOne({ _id: projectId, userId });
  if (!project) { const error = new Error('Project not found'); error.statusCode = 404; throw error; }
}
async function list(userId, filters) { return Task.find({ userId, ...filters }).sort({ createdAt: -1 }); }
async function get(userId, id) { return Task.findOne({ _id: id, userId }); }
async function create(userId, data) {
  if (data.projectId) await ensureProject(userId, data.projectId);
  return Task.create({ ...data, userId });
}
async function update(userId, id, data) {
  if (data.projectId) await ensureProject(userId, data.projectId);
  return Task.findOneAndUpdate({ _id: id, userId }, data, { new: true, runValidators: true });
}
async function remove(userId, id) { return Task.findOneAndDelete({ _id: id, userId }); }

module.exports = { list, get, create, update, remove };
